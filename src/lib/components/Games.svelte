<script lang="ts">
	import { games } from '$lib/games';
	import GameCard from './GameCard.svelte';
</script>

<section id="games">
	<div class="intro">
		<div class="heading">
			<span class="eyebrow">01 — Lineup</span>
			<h2>The lineup so far</h2>
		</div>
		<p>Playable offline and light on your data. Android today, more platforms later.</p>
	</div>
	<div class="grid">
		{#each games as game (game.url)}
			<GameCard {game} />
		{/each}
	</div>
</section>

<style>
	section {
		padding: 104px var(--gutter);
		max-width: 1440px;
		margin: 0 auto;
	}

	.intro {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 32px;
		padding-bottom: 40px;
	}

	.heading {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.eyebrow {
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--accent-ink);
	}

	h2 {
		margin: 0;
		font-size: clamp(32px, 4.6vw, 46px);
		line-height: 1.02;
		letter-spacing: -0.03em;
		font-weight: 700;
	}

	.intro p {
		margin: 0;
		max-width: 34ch;
		font-size: 16px;
		line-height: 1.55;
		color: var(--muted2);
		text-wrap: pretty;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 24px;
	}

	@media (max-width: 980px) {
		section {
			padding: 72px var(--gutter);
		}

		.intro {
			flex-direction: column;
			align-items: flex-start;
			gap: 20px;
		}

		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
