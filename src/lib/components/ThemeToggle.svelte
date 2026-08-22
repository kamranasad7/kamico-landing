<script lang="ts">
	import { onMount } from 'svelte';
	import { theme } from '$lib/theme.svelte';

	onMount(() => theme.sync());
</script>

<button aria-label="Toggle light or dark mode" onclick={() => theme.toggle()}>
	{#if theme.value === 'dark'}
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
			<circle cx="12" cy="12" r="4.5" fill="currentColor" stroke="none"></circle>
			<line x1="12" y1="2" x2="12" y2="5"></line><line x1="12" y1="19" x2="12" y2="22"></line>
			<line x1="2" y1="12" x2="5" y2="12"></line><line x1="19" y1="12" x2="22" y2="12"></line>
			<line x1="4.9" y1="4.9" x2="7" y2="7"></line><line x1="17" y1="17" x2="19.1" y2="19.1"></line>
			<line x1="4.9" y1="19.1" x2="7" y2="17"></line><line x1="17" y1="7" x2="19.1" y2="4.9"></line>
		</svg>
	{:else}
		<svg width="18" height="18" viewBox="0 0 24 24">
			<mask id="kc-moon"><rect width="24" height="24" fill="white"></rect><circle cx="16" cy="8" r="8" fill="black"></circle></mask>
			<circle cx="12" cy="12" r="9" fill="currentColor" mask="url(#kc-moon)"></circle>
		</svg>
	{/if}
</button>

<style>
	button {
		flex: none;
		cursor: pointer;
		background: none;
		border: 1px solid var(--line2);
		border-radius: 999px;
		width: 38px;
		height: 38px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text);
		transition: border-color 0.2s ease;
	}

	button:hover {
		border-color: var(--line3);
	}

	@media (max-width: 560px) {
		button {
			width: 34px;
			height: 34px;
		}
	}
</style>
