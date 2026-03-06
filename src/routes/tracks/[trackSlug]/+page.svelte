<script lang="ts">
	import ModuleCard from '$lib/components/ModuleCard.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let completedModules = $derived(
		data.track.modules.filter((m) => {
			const p = data.moduleProgress[m.slug];
			return p && p.completedLessons >= m.lessonsCount && p.quizPassed;
		}).length
	);
</script>

<svelte:head>
	<title>{data.track.title}: {data.track.subtitle} — Gradient Ascent</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-5 py-12 sm:px-8">
	<!-- Track header -->
	<div class="mb-10">
		<a href="/tracks" class="mb-4 inline-flex items-center gap-1 text-[13px] text-text-dim hover:text-text transition-colors">
			<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path d="M15 19l-7-7 7-7" />
			</svg>
			All Tracks
		</a>

		<div class="flex items-start gap-4">
			<div
				class="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-sm font-bold text-white/90"
				style="background: {data.track.color}"
			>
				{data.track.icon}
			</div>
			<div class="flex-1">
				<div class="flex items-center gap-3 mb-1">
					<h1 class="display-serif text-xl font-semibold sm:text-2xl">{data.track.title}</h1>
					<span class="text-[11px] font-medium uppercase tracking-wider text-text-dim">
						{data.track.subtitle}
					</span>
				</div>
				<p class="text-sm text-text-muted mb-4">{data.track.description}</p>
				<div class="flex items-center gap-3">
					<div class="flex-1 max-w-xs">
						<ProgressBar value={completedModules} max={data.track.modules.length} color={data.track.color} />
					</div>
					<span class="text-[12px] text-text-dim">{completedModules}/{data.track.modules.length} modules</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Modules -->
	<div class="space-y-3">
		{#each data.track.modules as mod, i}
			<ModuleCard
				module={mod}
				trackSlug={data.track.slug}
				completedLessons={data.moduleProgress[mod.slug]?.completedLessons ?? 0}
				quizPassed={data.moduleProgress[mod.slug]?.quizPassed ?? false}
				index={i}
			/>
		{/each}
	</div>
</div>
