import { SITE_URL } from '$lib/site';

export const prerender = true;

// One page, one entry: the whole site is the single prerendered landing page.
const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>${SITE_URL}</loc>
	</url>
</urlset>
`;

export function GET() {
	return new Response(body, { headers: { 'content-type': 'application/xml' } });
}
