<section id="studio">
	<div class="copy">
		<span class="eyebrow">02 — Studio</span>
		<h2>Independent, small, and in no hurry</h2>
		<p>
			KamiCo has been publishing since 2020, starting with a nostalgic revival of the 2D space shooter a lot of us
			grew up on. We self-publish, keep our games light, and only ship what we'd play ourselves.
		</p>
		<div class="features">
			<div class="feature">
				<span class="title">Play offline</span>
				<span class="detail">No account, no sign-up, no connection required.</span>
			</div>
			<div class="feature">
				<span class="title">Free to play</span>
				<span class="detail">Both titles are free downloads, supported by ads rather than paywalls.</span>
			</div>
		</div>
	</div>
	<div class="shots">
		<img src="/media/studio-1.jpg" alt="" loading="lazy" decoding="async" />
		<img src="/media/studio-2.jpg" alt="" loading="lazy" decoding="async" />
		<img src="/media/studio-3.jpg" alt="" loading="lazy" decoding="async" />
		<img src="/media/studio-4.jpg" alt="" loading="lazy" decoding="async" />
	</div>
</section>

<style>
	section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 64px;
		align-items: center;
		padding: 104px var(--gutter);
		max-width: 1440px;
		margin: 0 auto;
	}

	.copy {
		display: flex;
		flex-direction: column;
		gap: 24px;
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
		line-height: 1.04;
		letter-spacing: -0.03em;
		font-weight: 700;
		text-wrap: balance;
	}

	.copy p {
		margin: 0;
		font-size: 17px;
		line-height: 1.6;
		color: var(--muted);
		text-wrap: pretty;
	}

	.features {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 22px;
		padding-top: 8px;
	}

	.feature {
		display: flex;
		flex-direction: column;
		gap: 6px;
		border-left: 1px solid var(--accent-ink);
		padding-left: 16px;
	}

	.title {
		font-size: 15px;
		font-weight: 700;
	}

	.detail {
		font-size: 14px;
		line-height: 1.5;
		color: var(--muted2);
	}

	.shots {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}

	.shots img {
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border-radius: 16px;
		border: 1px solid var(--line);
	}

	@media (max-width: 980px) {
		section {
			grid-template-columns: 1fr;
			gap: 48px;
			padding: 72px var(--gutter);
		}
	}

	@media (max-width: 768px) {
		.features,
		.shots {
			grid-template-columns: 1fr;
		}
	}
</style>
