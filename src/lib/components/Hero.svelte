<section id="top">
	<div class="copy">
		<h1>Games worth<br />your <span>pocket.</span></h1>
		<p>KamiCo is an independent game studio. Easy to pick up, hard to put down, free on Google Play.</p>
		<div class="buttons">
			<a class="primary" href="#games">See the games</a>
			<a class="secondary" href="#studio">About the studio</a>
		</div>
		<div class="stats">
			<div class="stat">
				<span class="value">30K+</span>
				<span class="label">Downloads</span>
			</div>
			<div class="stat">
				<span class="value">4.4★</span>
				<span class="label">200 reviews</span>
			</div>
			<div class="stat">
				<span class="value">2020</span>
				<span class="label">Shipping since</span>
			</div>
		</div>
	</div>
	<div class="art">
		<div class="orb"></div>
		<figure>
			<div class="frame">
				<img src="/media/si3-shot.png" alt="Space Impact 3: Revamped, stage 1" decoding="async" />
			</div>
			<figcaption>
				<span>Space Impact 3: Revamped — stage 1</span>
				<span>Android</span>
			</figcaption>
		</figure>
	</div>
</section>

<style>
	section {
		position: relative;
		display: grid;
		grid-template-columns: 1.15fr 0.85fr;
		gap: 56px;
		align-items: center;
		padding: 96px var(--gutter) 88px;
		max-width: 1440px;
		margin: 0 auto;
	}

	.copy {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 28px;
	}

	h1 {
		margin: 0;
		font-size: clamp(40px, 7.6vw, 80px);
		line-height: 0.94;
		letter-spacing: -0.035em;
		font-weight: 700;
		text-wrap: balance;
	}

	h1 span {
		color: var(--accent-ink);
	}

	.copy p {
		margin: 0;
		max-width: 32ch;
		font-size: 19px;
		line-height: 1.5;
		color: var(--muted);
		text-wrap: pretty;
	}

	.buttons {
		display: flex;
		align-items: center;
		gap: 14px;
		flex-wrap: wrap;
	}

	.primary,
	.secondary {
		padding: 15px 26px;
		border-radius: 12px;
		font-size: 15px;
	}

	.primary {
		background: var(--accent);
		color: #0b0b0d;
		font-weight: 700;
		transition: filter 0.2s ease;
	}

	.primary:hover {
		filter: brightness(1.12);
		color: #0b0b0d;
	}

	.secondary {
		border: 1px solid var(--line2);
		font-weight: 500;
		transition: border-color 0.2s ease;
	}

	.secondary:hover {
		border-color: var(--accent-ink);
	}

	.stats {
		display: flex;
		flex-wrap: wrap;
		gap: 40px;
		padding-top: 12px;
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.value {
		font-size: 26px;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.label {
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--faint);
	}

	.art {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.orb {
		position: absolute;
		width: min(420px, 100%);
		aspect-ratio: 1;
		border-radius: 999px;
		background: var(--accent-soft);
		filter: blur(90px);
	}

	figure {
		position: relative;
		margin: 0;
		width: 100%;
		max-width: 560px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.frame {
		width: 100%;
		border-radius: 22px;
		border: 1px solid var(--line2);
		background: var(--panel);
		box-shadow: var(--shadow);
		overflow: hidden;
		padding: 8px;
	}

	.frame img {
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 16px;
		object-fit: cover;
		background-color: #17171b;
	}

	figcaption {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--faint);
	}

	@media (max-width: 980px) {
		section {
			grid-template-columns: 1fr;
			gap: 48px;
			padding: 64px var(--gutter);
		}

		figure {
			max-width: none;
		}
	}

	@media (max-width: 560px) {
		.copy p {
			font-size: 17px;
		}

		.stats {
			gap: 24px;
		}
	}
</style>
