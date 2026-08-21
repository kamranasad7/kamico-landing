<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';
</script>

<header>
	<a class="brand" href="#top" aria-label="KamiCo">
		<div class="wordmark"></div>
	</a>
	<nav>
		<a href="#games">Games</a>
		<a href="#studio">Studio</a>
		<a href="#numbers">Reach</a>
		<a href="#contact">Contact</a>
	</nav>
	<div class="actions">
		<ThemeToggle />
		<a class="cta" href="https://play.google.com/store/apps/developer?id=KamiCo" target="_blank" rel="noopener">
			Get on Google Play
		</a>
	</div>
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 32px;
		padding: 18px var(--gutter);
		background: var(--header-bg);
		-webkit-backdrop-filter: blur(14px);
		backdrop-filter: blur(14px);
		border-bottom: 1px solid var(--line);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.wordmark {
		height: 34px;
		width: 189px;
		background-image: url('/logo/kamico-dark.svg');
		background-size: contain;
		background-position: left center;
		background-repeat: no-repeat;
	}

	:global(:root[data-theme='light']) .wordmark {
		background-image: url('/logo/kamico-light.svg');
	}

	nav {
		display: flex;
		align-items: center;
		gap: 34px;
		font-size: 14px;
		letter-spacing: 0.01em;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.cta {
		padding: 11px 20px;
		border-radius: 999px;
		background: var(--accent);
		color: #0b0b0d;
		font-weight: 700;
		font-size: 14px;
		white-space: nowrap;
		transition: filter 0.2s ease;
	}

	.cta:hover {
		filter: brightness(1.12);
		color: #0b0b0d;
	}

	/* The nav drops to its own full-width row before it can crowd the brand out. */
	@media (max-width: 900px) {
		header {
			flex-wrap: wrap;
			gap: 16px;
		}

		nav {
			order: 3;
			width: 100%;
			justify-content: space-between;
			gap: 16px;
		}
	}

	@media (max-width: 560px) {
		.wordmark {
			height: 24px;
			width: 133px;
		}

		nav {
			font-size: 13px;
		}

		.actions {
			gap: 10px;
		}

		.cta {
			padding: 9px 14px;
			font-size: 12px;
		}
	}
</style>
