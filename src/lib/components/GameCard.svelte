<script lang="ts">
	import type { Game } from '$lib/games';

	let { game }: { game: Game } = $props();
</script>

<a class="card" href={game.url} target="_blank" rel="noopener">
	<img class="shot" src={game.shot} alt="{game.title} screenshot" loading="lazy" decoding="async" />
	<div class="body">
		<img class="icon" src={game.icon} alt="" loading="lazy" decoding="async" />
		<div class="text">
			<div class="head">
				<h3>{game.title}</h3>
				<span class="installs">{game.installs}</span>
			</div>
			<p>{game.blurb}</p>
			<div class="chips">
				<span class="chip">{game.genre}</span>
				<span class="chip">{game.sessions}</span>
				<span class="chip">{game.rated}</span>
			</div>
			<span class="link">Google Play →</span>
		</div>
	</div>
</a>

<style>
	.card {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--line);
		border-radius: 22px;
		overflow: hidden;
		background: var(--panel);
		transition: border-color 0.2s ease;
	}

	.card:hover {
		border-color: var(--line3);
		color: var(--text);
	}

	/* The portrait store shots crop hard in the 16:9 frame, as in the design. */
	.shot {
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		background-color: #17171b;
	}

	.body {
		display: flex;
		gap: 18px;
		padding: 22px 24px 26px;
	}

	.icon {
		flex: none;
		width: 64px;
		height: 64px;
		border-radius: 16px;
		background-color: #1c1c21;
	}

	.text {
		display: flex;
		flex-direction: column;
		gap: 10px;
		flex: 1;
		min-width: 0;
	}

	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
	}

	h3 {
		margin: 0;
		font-size: 24px;
		letter-spacing: -0.02em;
		font-weight: 700;
	}

	.installs {
		flex: none;
		font-size: 11px;
		color: var(--faint);
	}

	.text p {
		margin: 0;
		font-size: 15px;
		line-height: 1.5;
		color: var(--muted2);
		text-wrap: pretty;
	}

	.chips {
		display: flex;
		gap: 8px;
		padding-top: 6px;
		flex-wrap: wrap;
	}

	.chip {
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--chip);
		border: 1px solid var(--line2);
		border-radius: 999px;
		padding: 5px 10px;
	}

	.link {
		padding-top: 8px;
		font-size: 14px;
		font-weight: 500;
		color: var(--accent-ink);
	}

	@media (max-width: 560px) {
		.body {
			padding: 20px;
			gap: 14px;
		}

		.icon {
			width: 52px;
			height: 52px;
		}

		h3 {
			font-size: 21px;
		}
	}
</style>
