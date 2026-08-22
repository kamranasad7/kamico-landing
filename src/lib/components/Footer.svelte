<footer>
	<div class="columns">
		<div class="brand">
			<div class="mark" role="img" aria-label="KamiCo"></div>
			<p>Independent mobile game studio. Publishing on Google Play since 2020.</p>
		</div>
		<div class="column">
			<span class="heading">Games</span>
			<a href="https://play.google.com/store/apps/details?id=com.kamico.si3" target="_blank" rel="noopener">
				Space Impact 3: Revamped
			</a>
			<a href="https://play.google.com/store/apps/details?id=com.kamico.salaryday" target="_blank" rel="noopener">
				Salary Day
			</a>
		</div>
		<div class="column">
			<span class="heading">Company</span>
			<a href="#studio">Studio</a>
			<a href="#numbers">Reach</a>
			<a href="#contact">Contact</a>
		</div>
		<div class="column">
			<span class="heading">Support</span>
			<a href="mailto:kamranasad7@gmail.com">Player support</a>
			<a href="https://play.google.com/store/apps/developer?id=KamiCo" target="_blank" rel="noopener">
				Developer page
			</a>
		</div>
	</div>
	<div class="bottom">
		<span>© 2026 KamiCo Interactive</span>
		<span>Made for small screens</span>
	</div>
</footer>

<style>
	footer {
		border-top: 1px solid var(--line);
		padding: 64px var(--gutter) 40px;
	}

	.columns {
		max-width: 1440px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1.4fr 1fr 1fr 1fr;
		gap: 48px;
	}

	.brand {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.mark {
		width: 44px;
		height: 44px;
		border-radius: 12px;
		background-image: url('/logo/kamico-icon.svg');
		background-size: cover;
	}

	.brand p {
		margin: 0;
		max-width: 26ch;
		font-size: 14px;
		line-height: 1.55;
		color: var(--faint);
	}

	.column {
		display: flex;
		flex-direction: column;
		gap: 12px;
		font-size: 14px;
	}

	.heading {
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--faint2);
	}

	.bottom {
		max-width: 1440px;
		margin: 40px auto 0;
		padding-top: 24px;
		border-top: 1px solid var(--line);
		display: flex;
		justify-content: space-between;
		gap: 24px;
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--faint2);
	}

	@media (max-width: 980px) {
		.columns {
			grid-template-columns: repeat(2, 1fr);
			gap: 32px;
		}
	}

	@media (max-width: 768px) {
		footer {
			padding: 48px var(--gutter) 32px;
		}

		.columns {
			grid-template-columns: 1fr;
		}

		.bottom {
			flex-wrap: wrap;
			gap: 8px;
		}
	}
</style>
