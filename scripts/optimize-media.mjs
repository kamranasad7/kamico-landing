// Regenerates static/media from the read-only design/media originals, at the sizes the page renders
// them at. The derivatives are committed, so npm run build stays free of image tooling.
// Usage: npm run media
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, statSync } from 'node:fs';

const originals = 'design/media';
const media = 'static/media';

// Widths are roughly twice the CSS box each image renders in — 668px for the card shots and the hero,
// 317px for the studio thumbs, 64px for the icons. The Play Store originals run up to 1080x2400.
const derivatives = [
	{ from: 'si3-shot.png', to: 'si3-shot.jpg', width: 1052 },
	{ from: 'salaryday-shot.jpg', to: 'salaryday-shot.jpg', width: 800 },
	{ from: 'studio-1.jpg', to: 'studio-1.jpg', width: 640 },
	{ from: 'studio-2.jpg', to: 'studio-2.jpg', width: 640 },
	{ from: 'studio-3.jpg', to: 'studio-3.jpg', width: 640 },
	{ from: 'studio-4.jpg', to: 'studio-4.jpg', width: 640 },
	// The icons stay PNG: si3's has the transparent corners the design rounds the artwork with.
	{ from: 'si3-icon.png', to: 'si3-icon.png', width: 128 },
	{ from: 'salaryday-icon.png', to: 'salaryday-icon.png', width: 128 }
];

rmSync(media, { recursive: true, force: true });
mkdirSync(media, { recursive: true });

for (const { from, to, width } of derivatives) {
	const format = to.endsWith('.jpg') ? ['--setProperty', 'format', 'jpeg', '--setProperty', 'formatOptions', '72'] : [];
	execFileSync('sips', [...format, '--resampleWidth', String(width), `${originals}/${from}`, '--out', `${media}/${to}`], {
		stdio: 'ignore'
	});
	console.log(`${to}  ${Math.round(statSync(`${media}/${to}`).size / 1024)} KB`);
}
