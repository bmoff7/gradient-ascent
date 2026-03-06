<script lang="ts">
	import type { Track } from '$lib/content/types';
	import ProgressBar from './ProgressBar.svelte';

	let { track, completedModules = 0 }: { track: Track; completedModules?: number } = $props();

	let totalModules = $derived(track.modules.length);
	let totalLessons = $derived(track.modules.reduce((sum, m) => sum + m.lessonsCount, 0));
	let totalMinutes = $derived(track.modules.reduce((sum, m) => sum + m.estimatedMinutes, 0));
</script>

<a
	href="/tracks/{track.slug}"
	class="group block rounded-lg border border-border bg-bg-card p-5 transition-all hover:border-border-light hover:bg-bg-elevated"
	style="border-left: 3px solid {track.color}"
>
	<div class="mb-3 flex items-center justify-between">
		<div
			class="flex h-8 w-8 items-center justify-center rounded text-[11px] font-bold text-white/90"
			style="background: {track.color}"
		>
			{track.icon}
		</div>
		<span class="text-[11px] font-medium uppercase tracking-wider text-text-dim">
			{track.subtitle}
		</span>
	</div>

	<h3 class="display-serif mb-1 text-base font-semibold group-hover:text-primary-light transition-colors">
		{track.title}
	</h3>
	<p class="mb-3 text-[13px] leading-relaxed text-text-muted line-clamp-2">
		{track.description}
	</p>

	<div class="mb-3 flex items-center gap-3 text-[11px] text-text-dim">
		<span>{totalModules} modules</span>
		<span>{totalLessons} lessons</span>
		<span>~{Math.round(totalMinutes / 60)}h</span>
	</div>

	<ProgressBar value={completedModules} max={totalModules} color={track.color} showLabel />
</a>
