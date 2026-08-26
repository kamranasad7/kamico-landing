/** The origin the site is deployed to. Every absolute URL the page hands out is derived from it. */
export const SITE_URL = 'https://kamico-landing.vercel.app';

/** Resolves a path under static/ against the canonical origin. */
export const abs = (path: string) => `${SITE_URL}${path}`;

export const SITEMAP_URL = abs('/sitemap.xml');

/** The social card: the hero shot, at the pixel size static/media/si3-shot.jpg actually is. */
export const socialCard = {
	url: abs('/media/si3-shot.jpg'),
	width: 1052,
	height: 592,
	alt: 'Space Impact 3: Revamped, stage 1'
};
