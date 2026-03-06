<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();
</script>

<Nav session={data.session} totalXP={data.totalXP} />
<main class="min-h-screen pt-14">
	{@render children()}
</main>
