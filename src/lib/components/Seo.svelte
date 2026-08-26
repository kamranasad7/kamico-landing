<script lang="ts">
	import { games } from '$lib/games';
	import { SITE_URL, abs, socialCard } from '$lib/site';

	// Everything origin-dependent lives here rather than in app.html: %sveltekit.assets% resolves to a
	// relative path in a static build, and crawlers only accept absolute URLs.
	const studio = `${SITE_URL}#studio`;

	const schema = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				'@id': studio,
				name: 'KamiCo',
				url: SITE_URL,
				logo: abs('/logo/kamico-icon.svg'),
				description: 'Independent mobile game studio. Publishing on Google Play since 2020.',
				foundingDate: '2020',
				email: 'kamranasad7@gmail.com',
				sameAs: ['https://play.google.com/store/apps/developer?id=KamiCo']
			},
			...games.map((game) => ({
				'@type': 'VideoGame',
				name: game.title,
				url: game.url,
				description: game.blurb,
				image: abs(game.shot),
				applicationCategory: 'GameApplication',
				operatingSystem: 'Android',
				publisher: { '@id': studio },
				contentRating: game.rated,
				// Only Space Impact 3 has published reviews; Salary Day ships with its content rating alone.
				...(game.rating && {
					aggregateRating: {
						'@type': 'AggregateRating',
						ratingValue: game.rating.value,
						reviewCount: game.rating.count
					}
				})
			}))
		]
	};
</script>

<svelte:head>
	<link rel="canonical" href={SITE_URL} />
	<meta property="og:url" content={SITE_URL} />
	<meta property="og:image" content={socialCard.url} />
	<meta property="og:image:width" content={String(socialCard.width)} />
	<meta property="og:image:height" content={String(socialCard.height)} />
	<meta property="og:image:alt" content={socialCard.alt} />
	<meta name="twitter:image" content={socialCard.url} />
	<!-- Svelte parses a literal <script> in the head as component code, so the block is emitted as markup. -->
	{@html `<script type="application/ld+json">${JSON.stringify(schema)}<\/script>`}
</svelte:head>
