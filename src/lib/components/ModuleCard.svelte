<script lang="ts">
	import type { ModuleMeta } from '$lib/content/types';
	import ProgressBar from './ProgressBar.svelte';

	let {
		module: mod,
		trackSlug,
		completedLessons = 0,
		quizPassed = false,
		index = 0
	}: {
		module: ModuleMeta;
		trackSlug: string;
		completedLessons?: number;
		quizPassed?: boolean;
		index?: number;
	} = $props();

	let isComplete = $derived(completedLessons >= mod.lessonsCount && quizPassed);
</script>

<a
	href="/tracks/{trackSlug}/{mod.slug}"
	class="group flex gap-4 rounded-lg border border-border bg-bg-card p-4 transition-all hover:border-border-light hover:bg-bg-elevated {isComplete ? 'border-l-3 border-l-success' : ''}"
>
	<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded text-[13px] font-semibold {isComplete ? 'bg-success/15 text-success' : 'bg-bg-elevated text-text-dim'}">
		{#if isComplete}
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
				<path d="M5 13l4 4L19 7" />
			</svg>
		{:else}
			{index + 1}
		{/if}
	</div>

	<div class="flex-1 min-w-0">
		<h4 class="text-sm font-semibold group-hover:text-primary-light transition-colors">
			{mod.title}
		</h4>
		<p class="mt-0.5 text-[13px] text-text-muted leading-relaxed line-clamp-2">
			{mod.description}
		</p>
		<div class="mt-2 flex items-center gap-3 text-[11px] text-text-dim">
			<span>{mod.estimatedMinutes} min</span>
			<span>{mod.lessonsCount} lessons</span>
			<span>{mod.xpReward} XP</span>
		</div>
		<div class="mt-2">
			<ProgressBar
				value={completedLessons + (quizPassed ? 1 : 0)}
				max={mod.lessonsCount + 1}
				size="sm"
			/>
		</div>
	</div>
</a>
