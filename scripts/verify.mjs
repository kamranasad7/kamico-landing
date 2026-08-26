// Drives the preview build with the installed Chrome and checks the acceptance criteria.
// Usage: npm run build && npm run verify
import { execFileSync, spawn } from 'node:child_process';
import { once } from 'node:events';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
import { SITE_URL, SITEMAP_URL } from '../src/lib/site.ts';

const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const origin = 'http://localhost:4173';

const results = [];
const check = (name, ok, detail = '') => results.push({ name, ok, detail });

// The prerendered HTML, read straight off disk — what a crawler that never runs the app sees.
const html = readFileSync('build/index.html', 'utf8');

const preview = spawn('npm', ['run', 'preview', '--', '--port', '4173'], { stdio: ['ignore', 'pipe', 'inherit'] });
preview.stdout.pipe(process.stdout);
let exited = false;
preview.on('exit', () => (exited = true));

// Readiness is the server accepting a connection, not the port number turning up on stdout: npm
// echoes the command it is about to run (`> node scripts/preview.mjs --port 4173`) before the
// server has bound anything, so matching on "4173" returns while the socket is still closed and
// races the first request against the boot.
const ready = await (async () => {
	for (let attempt = 0; attempt < 300 && !exited; attempt++) {
		try {
			await fetch(origin);
			return true;
		} catch {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
	}
	return false;
})();
if (!ready) {
	preview.kill();
	console.error(`The preview server never started serving ${origin} — see its output above.`);
	process.exit(1);
}

// The preview server has to answer from disk rather than from a file listing cached at boot. The
// build's JS filenames are content-hashed, so a server that snapshots them serves 404s for every
// chunk after the next rebuild, and the page then renders its prerendered HTML while silently never
// hydrating — passing most of the checks below while being thoroughly broken. A file created after
// the server booted distinguishes the two: it is reachable only if lookups hit the filesystem.
// An unreachable server is a failed check, not a crashed run: throwing here would skip the
// preview.kill() at the end of this file and leave the server orphaned holding the port.
const probe = `__rebuild-probe-${process.pid}.txt`;
try {
	writeFileSync(`build/${probe}`, 'probe');
	const reached = await fetch(`${origin}/${probe}`).then(
		(response) => String(response.status),
		(error) => `unreachable: ${error.message}`
	);
	check('preview reflects the build after boot', reached === '200', reached);
} finally {
	rmSync(`build/${probe}`, { force: true });
}

const browser = await puppeteer.launch({ executablePath: chrome, headless: true });

/** Opens `/` in a fresh context and collects console errors, page errors, failed or third-party requests and images. */
async function visit({ width, height, theme }) {
	const context = await browser.createBrowserContext();
	const page = await context.newPage();
	const errors = [];
	const failed = [];
	const external = [];
	const images = [];
	page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
	page.on('pageerror', (error) => errors.push(String(error)));
	page.on('requestfailed', (request) => failed.push(request.url()));
	page.on('request', (request) => !request.url().startsWith(origin) && external.push(request.url()));
	page.on('response', (response) => response.status() >= 400 && failed.push(`${response.status()} ${response.url()}`));
	page.on('response', (response) => response.request().resourceType() === 'image' && images.push(response));
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
	return { context, page, response, errors, failed, external, images };
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
const urls = [assets.icon, new URL(assets.ogImage.replace(SITE_URL, origin), origin).href, ...assets.images];
const statuses = await Promise.all(urls.map(async (url) => [url, (await fetch(url)).status]));
check(
	'10 / 11 every asset 200',
	statuses.every(([, status]) => status === 200),
	statuses.filter(([, status]) => status !== 200).join(' | ')
);

// The crawler metadata, taken from the prerendered HTML rather than the hydrated DOM, and never
// resolved against the preview origin: a relative og:image has to fail here the way it fails on a card.
const meta = (property) => html.match(new RegExp(`<meta property="${property}" content="([^"]*)"`))?.[1];
const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
const ogImage = meta('og:image');
check('canonical is SITE_URL', canonical === SITE_URL, canonical);
check('og:url is SITE_URL', meta('og:url') === SITE_URL, meta('og:url'));
check('og:image is absolute', ogImage?.startsWith('https://') === true, ogImage);
const [width, height, alt] = ['og:image:width', 'og:image:height', 'og:image:alt'].map(meta);
const file = `build${new URL(ogImage, origin).pathname}`;
const card = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' });
check(
	'og:image dimensions match the file',
	card.includes(`pixelWidth: ${width}`) && card.includes(`pixelHeight: ${height}`) && Boolean(alt),
	`${width}x${height}, alt ${alt} — ${card.replace(/\s+/g, ' ')}`
);

// robots.txt and sitemap.xml ship in the build, are served by the preview, and hand crawlers SITE_URL.
const robots = await fetch(`${origin}/robots.txt`);
const robotsBody = readFileSync('build/robots.txt', 'utf8');
check(
	'robots.txt is served from the build',
	robots.status === 200 && (await robots.text()) === robotsBody,
	String(robots.status)
);
check(
	'robots.txt allows every crawler and links the sitemap',
	/^User-agent: \*$/m.test(robotsBody) &&
		/^Allow: \/$/m.test(robotsBody) &&
		!/^Disallow: \/$/m.test(robotsBody) &&
		robotsBody.includes(`Sitemap: ${SITEMAP_URL}`),
	robotsBody
);
const sitemap = await fetch(`${origin}/sitemap.xml`);
const sitemapBody = readFileSync('build/sitemap.xml', 'utf8');
check(
	'sitemap.xml is served from the build',
	sitemap.status === 200 && (await sitemap.text()) === sitemapBody,
	String(sitemap.status)
);
const locations = await desktop.page.evaluate((xml) => {
	const parsed = new DOMParser().parseFromString(xml, 'application/xml');
	return parsed.querySelector('parsererror') ? null : [...parsed.querySelectorAll('loc')].map((loc) => loc.textContent);
}, sitemapBody);
check(
	'sitemap.xml lists SITE_URL once',
	JSON.stringify(locations) === JSON.stringify([SITE_URL]),
	JSON.stringify(locations)
);

// The image weight of a first desktop load, the number the page is judged on.
const sizes = await Promise.all(
	desktop.images.map(async (image) => Number(image.headers()['content-length'] ?? (await image.buffer()).length))
);
const payload = sizes.reduce((total, size) => total + size, 0);
check('images under 900 KB', payload < 900 * 1024, `${Math.round(payload / 1024)} KB across ${sizes.length} images`);

// The fold needs layout, so the browser classifies the images and the prerendered <img> tags — same
// document order — carry the verdict: the LCP image eager and high priority, the rest lazy.
const tags = [...html.matchAll(/<img[^>]*>/g)].map((match) => match[0]);
const boxes = await desktop.page.evaluate(() =>
	[...document.images].map((image) => {
		const box = image.getBoundingClientRect();
		return { area: box.width * box.height, aboveFold: box.top < window.innerHeight && box.bottom > 0 };
	})
);
const rendered = boxes.map((box, index) => ({ ...box, tag: tags[index] }));
const [hero] = rendered.filter((image) => image.aboveFold).sort((first, second) => second.area - first.area);
check(
	'hero image is high priority and not lazy',
	hero.tag.includes('fetchpriority="high"') && !hero.tag.includes('loading="lazy"'),
	hero.tag
);
const eager = rendered.filter((image) => !image.aboveFold && !image.tag.includes('loading="lazy"'));
check('below-fold images are lazy', eager.length === 0, eager.map((image) => image.tag).join(' | '));

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

// 4, 5, 12 — the prerendered HTML.
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

// One JSON-LD graph, walked rather than string-matched: the studio plus both titles.
const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
check('one json-ld block', blocks.length === 1, String(blocks.length));
const graph = JSON.parse(blocks[0][1])['@graph'];
const nodes = (type) => graph.filter((node) => node['@type'] === type);
check(
	'json-ld studio',
	nodes('Organization').some((node) => node.name === 'KamiCo' && node.url === SITE_URL),
	JSON.stringify(nodes('Organization'))
);
const titles = nodes('VideoGame');
check(
	'json-ld both games named, linked and rated',
	titles.length === 2 &&
		titles.every(
			(node) =>
				Boolean(node.name) &&
				node.url.startsWith('https://play.google.com/') &&
				Boolean(node.aggregateRating ?? node.contentRating)
		),
	JSON.stringify(titles.map((node) => node.name))
);

for (const { name, ok, detail } of results) {
	console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok || !detail ? '' : `  → ${detail}`}`);
}
process.exit(results.every((result) => result.ok) ? 0 : 1);
