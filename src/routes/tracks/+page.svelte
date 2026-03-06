<script lang="ts">
	import { tracks } from '$lib/content/tracks';
	import TrackCard from '$lib/components/TrackCard.svelte';
</script>

<svelte:head>
	<title>Learning Tracks — Gradient Ascent</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-5 py-12 sm:px-8">
	<div class="mb-10">
		<p class="mb-2 text-[13px] font-medium uppercase tracking-widest text-text-dim">Curriculum</p>
		<h1 class="display-serif text-2xl font-semibold tracking-tight sm:text-3xl">Learning Tracks</h1>
		<p class="mt-2 text-sm text-text-muted">Each track builds on the previous one. Start at Base Camp and work your way up.</p>
	</div>

	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each tracks as track}
			<TrackCard {track} />
		{/each}
	</div>
</div>
