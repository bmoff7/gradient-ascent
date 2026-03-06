<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
	import { progressStore } from '$lib/stores/progress';
	import { browser } from '$app/environment';

	let { children }: { children: any } = $props();

	// Initialize store from localStorage on client
	if (browser) {
		progressStore.init();
	}
</script>

<Nav />
<main class="min-h-screen pt-14">
	{@render children()}
</main>
