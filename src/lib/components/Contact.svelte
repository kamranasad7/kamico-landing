<section id="contact">
	<div class="card">
		<div class="copy">
			<span class="eyebrow">03 — Contact</span>
			<h2>Bug reports, press, or just say hi</h2>
			<p>
				Player support and press enquiries go to the same inbox, and it's read by the person who made the game.
			</p>
		</div>
		<div class="links">
			<a href="mailto:kamranasad7@gmail.com">
				<span class="label">Player support</span>
				<span class="value">kamranasad7@gmail.com</span>
			</a>
			<a href="https://play.google.com/store/apps/developer?id=KamiCo" target="_blank" rel="noopener">
				<span class="label">Developer page</span>
				<span class="value">Google Play →</span>
			</a>
		</div>
	</div>
</section>

<style>
	section {
		padding: 0 var(--gutter) 104px;
		max-width: 1440px;
		margin: 0 auto;
	}

	.card {
		border: 1px solid var(--line);
		border-radius: 24px;
		background: var(--panel);
		padding: 48px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 56px;
		align-items: center;
	}

	.copy {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.eyebrow {
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--accent-ink);
	}

	h2 {
		margin: 0;
		font-size: clamp(28px, 3.8vw, 38px);
		line-height: 1.05;
		letter-spacing: -0.03em;
		font-weight: 700;
		text-wrap: balance;
	}

	.copy p {
		margin: 0;
		font-size: 16px;
		line-height: 1.55;
		color: var(--muted2);
		text-wrap: pretty;
	}

	.links {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.links a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		padding: 20px 4px;
		border-top: 1px solid var(--line);
		transition: padding 0.2s ease;
	}

	.links a:hover {
		padding-left: 10px;
	}

	.label {
		font-size: 18px;
		font-weight: 500;
	}

	.value {
		font-size: 12px;
		color: var(--faint);
	}

	@media (max-width: 980px) {
		section {
			padding: 0 var(--gutter) 72px;
		}

		.card {
			grid-template-columns: 1fr;
			gap: 32px;
			padding: 32px;
		}
	}

	@media (max-width: 560px) {
		.card {
			padding: 24px;
		}

		.links a {
			flex-wrap: wrap;
			gap: 6px;
		}
	}
</style>
