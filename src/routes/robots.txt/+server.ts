import { SITEMAP_URL } from '$lib/site';

export const prerender = true;

const body = `User-agent: *
Allow: /

Sitemap: ${SITEMAP_URL}
`;

export function GET() {
	return new Response(body, { headers: { 'content-type': 'text/plain' } });
}
