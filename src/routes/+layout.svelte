<script lang="ts">
	import '../app.css';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';

	let { children } = $props();
</script>

<div class="shell">
	<Header />
	{@render children()}
	<Footer />
</div>

<style>
	/* clip rather than hidden: it contains the hero orb without breaking the sticky header. */
	.shell {
		min-height: 100vh;
		overflow-x: clip;
		background: var(--bg);
		color: var(--text);
		transition:
			background 0.3s ease,
			color 0.3s ease;
	}
</style>
