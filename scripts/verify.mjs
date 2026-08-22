// Drives the preview build with the installed Chrome and checks the acceptance criteria.
// Usage: npm run build && npm run verify
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { readFileSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const origin = 'http://localhost:4173';

const results = [];
const check = (name, ok, detail = '') => results.push({ name, ok, detail });

const preview = spawn('npm', ['run', 'preview', '--', '--port', '4173'], { stdio: ['ignore', 'pipe', 'inherit'] });
await new Promise((resolve) => {
	preview.stdout.on('data', (chunk) => String(chunk).includes('4173') && resolve());
});

const browser = await puppeteer.launch({ executablePath: chrome, headless: true });

/** Opens `/` in a fresh context and collects console errors, page errors and failed or third-party requests. */
async function visit({ width, height, theme }) {
	const context = await browser.createBrowserContext();
	const page = await context.newPage();
	const errors = [];
	const failed = [];
	const external = [];
	page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
	page.on('pageerror', (error) => errors.push(String(error)));
	page.on('requestfailed', (request) => failed.push(request.url()));
	page.on('request', (request) => !request.url().startsWith(origin) && external.push(request.url()));
	page.on('response', (response) => response.status() >= 400 && failed.push(`${response.status()} ${response.url()}`));
	await page.setViewport({ width, height });
	// rAF callbacks run after the render-blocking CSS is in and before the frame is painted.
	await page.evaluateOnNewDocument(() => {
		window.firstPaintBackground = new Promise((resolve) =>
			requestAnimationFrame(() => resolve(getComputedStyle(document.documentElement).backgroundColor))
		);
	});
	if (theme) {
		await page.evaluateOnNewDocument((value) => localStorage.setItem('kamico-theme', value), theme);
	}
	const response = await page.goto(origin, { waitUntil: 'networkidle0' });
	return { context, page, response, errors, failed, external };
}

// 3, 9 — a clean load at desktop size.
const desktop = await visit({ width: 1440, height: 900 });
check('3 / serves 200', desktop.response.status() === 200, String(desktop.response.status()));
check('3 no console errors', desktop.errors.length === 0, desktop.errors.join(' | '));
check('3 no failed requests', desktop.failed.length === 0, desktop.failed.join(' | '));
check('9 no third-party requests', desktop.external.length === 0, desktop.external.join(' | '));

// 7 — no horizontal scroll at desktop size.
const desktopFits = await desktop.page.evaluate(
	() => document.documentElement.scrollWidth <= window.innerWidth
);
check('7 no h-scroll at 1440x900', desktopFits);

// 6 — the toggle flips the theme and persists it.
const toggled = await desktop.page.evaluate(async () => {
	const before = document.documentElement.dataset.theme ?? 'dark';
	document.querySelector('button[aria-label="Toggle light or dark mode"]').click();
	await new Promise((resolve) => requestAnimationFrame(resolve));
	return { before, after: document.documentElement.dataset.theme, stored: localStorage.getItem('kamico-theme') };
});
check(
	'6 toggle flips and persists',
	toggled.before === 'dark' && toggled.after === 'light' && toggled.stored === 'light',
	JSON.stringify(toggled)
);

// 5, 10, 11 — assets referenced by the page all resolve from this origin.
const assets = await desktop.page.evaluate(() => ({
	icon: document.querySelector('link[rel="icon"]')?.href,
	ogImage: document.querySelector('meta[property="og:image"]')?.content,
	images: [...document.images].map((image) => image.src)
}));
const urls = [assets.icon, new URL(assets.ogImage, origin).href, ...assets.images];
const statuses = await Promise.all(urls.map(async (url) => [url, (await fetch(url)).status]));
check(
	'10 / 11 every asset 200',
	statuses.every(([, status]) => status === 200),
	statuses.filter(([, status]) => status !== 200).join(' | ')
);
await desktop.context.close();

// 6 — a reload with light stored paints light, never the dark background.
const light = await visit({ width: 1440, height: 900, theme: 'light' });
const firstPaint = await light.page.evaluate(() => window.firstPaintBackground);
check('6 light paints light', firstPaint === 'rgb(246, 245, 242)', firstPaint);
await light.context.close();

// 7 — no horizontal scroll on a phone.
const phone = await visit({ width: 390, height: 844 });
const phoneFits = await phone.page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
check('7 no h-scroll at 390x844', phoneFits);
check('3 no console errors (phone)', phone.errors.length === 0, phone.errors.join(' | '));
await phone.context.close();

// 8 — every grid is a single column at the mobile breakpoint.
const narrow = await visit({ width: 768, height: 900 });
const multiColumn = await narrow.page.evaluate(() =>
	[...document.querySelectorAll('*')]
		.filter((node) => getComputedStyle(node).display.includes('grid'))
		.map((node) => [node.className, getComputedStyle(node).gridTemplateColumns])
		.filter(([, columns]) => columns.split(' ').length > 1)
);
check('8 all grids single column at 768', multiColumn.length === 0, JSON.stringify(multiColumn));
await narrow.context.close();

await browser.close();
preview.kill();
await once(preview, 'exit');

// 4, 5, 12 — the prerendered HTML, read straight off disk.
const html = readFileSync('build/index.html', 'utf8');
const ids = ['top', 'games', 'numbers', 'studio', 'contact'];
check('4 section ids', ids.every((id) => html.includes(`id="${id}"`)));
const nav = html.match(/<nav[^>]*>[\s\S]*?<\/nav>/)[0].matchAll(/href="(#[a-z]+)"/g);
check(
	'4 nav hrefs',
	JSON.stringify([...nav].map((match) => match[1])) === '["#games","#studio","#numbers","#contact"]'
);
const cards = html.match(/class="card[^"]*" href="https:\/\/play\.google\.com[^"]*"/g) ?? [];
check('5 two game cards', cards.length === 2, cards.join(' | '));
check(
	'5 play store links',
	html.includes('https://play.google.com/store/apps/details?id=com.kamico.si3') &&
		html.includes('https://play.google.com/store/apps/details?id=com.kamico.salaryday')
);
check('5 three chips per card', (html.match(/class="chip /g) ?? []).length === 6);
check('12 prerendered, not a shell', html.includes('Games worth'));
check('10 title and description', /<title>[^<]+<\/title>/.test(html) && html.includes('name="description"'));

for (const { name, ok, detail } of results) {
	console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok || !detail ? '' : `  → ${detail}`}`);
}
process.exit(results.every((result) => result.ok) ? 0 : 1);
