<section id="numbers">
	<div class="grid">
		<div class="cell">
			<span class="value">30K+</span>
			<span class="label">Downloads to date</span>
		</div>
		<div class="cell">
			<span class="value">4.4★</span>
			<span class="label">Across 200 reviews</span>
		</div>
		<div class="cell">
			<span class="value">2</span>
			<span class="label">Games published</span>
		</div>
		<div class="cell">
			<span class="value">Free</span>
			<span class="label">Both titles, ad-supported</span>
		</div>
	</div>
</section>

<style>
	section {
		border-top: 1px solid var(--line);
		border-bottom: 1px solid var(--line);
		background: var(--panel2);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		max-width: 1440px;
		margin: 0 auto;
	}

	.cell {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 56px 32px;
		border-right: 1px solid var(--line);
	}

	.cell:last-child {
		border-right: none;
	}

	.value {
		font-size: clamp(34px, 4.4vw, 44px);
		letter-spacing: -0.03em;
		font-weight: 700;
	}

	.label {
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--faint);
	}

	@media (max-width: 980px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.cell {
			padding: 40px var(--gutter);
		}

		.cell:nth-child(2n) {
			border-right: none;
		}

		.cell:nth-child(n + 3) {
			border-top: 1px solid var(--line);
		}
	}

	@media (max-width: 768px) {
		.grid {
			grid-template-columns: 1fr;
		}

		.cell {
			padding: 32px var(--gutter);
			border-right: none;
		}

		.cell:not(:first-child) {
			border-top: 1px solid var(--line);
		}
	}
</style>
