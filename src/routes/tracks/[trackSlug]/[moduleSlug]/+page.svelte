<script lang="ts">
	import LessonRenderer from '$lib/components/LessonRenderer.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import type { PageData } from './$types';
	import { progressStore } from '$lib/stores/progress';
	import { browser } from '$app/environment';

	let { data }: { data: PageData } = $props();

	let currentLessonIndex = $state(0);
	let currentLesson = $derived(data.module.lessons[currentLessonIndex]);

	// Reactive completed lessons from store - reading $progressStore triggers auto-subscription
	let storeData = $derived($progressStore);
	let completedLessons = $derived(
		browser ? (storeData.completedLessons[data.module.slug] ?? []) : []
	);
	let isLessonComplete = $derived(completedLessons.includes(currentLesson.slug));

	async function markComplete() {
		await progressStore.completeLesson(data.track.slug, data.module.slug, currentLesson.slug);
		if (currentLessonIndex < data.module.lessons.length - 1) {
			currentLessonIndex++;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function goToLesson(index: number) {
		currentLessonIndex = index;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<svelte:head>
	<title>{data.module.title} — Gradient Ascent</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-3.5rem)]">
	<!-- Sidebar -->
	<aside class="hidden w-64 shrink-0 border-r border-border bg-bg-card/40 p-4 lg:block overflow-y-auto sticky top-14 h-[calc(100vh-3.5rem)]">
		<a href="/tracks/{data.track.slug}" class="mb-3 inline-flex items-center gap-1 text-[11px] text-text-dim hover:text-text">
			<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path d="M15 19l-7-7 7-7" />
			</svg>
			{data.track.title}
		</a>

		<h2 class="display-serif mb-1 text-sm font-semibold">{data.module.title}</h2>
		<div class="mb-3">
			<ProgressBar value={completedLessons.length} max={data.module.lessons.length} size="sm" />
			<span class="text-[10px] text-text-dim">{completedLessons.length}/{data.module.lessons.length} lessons</span>
		</div>

		<nav class="space-y-0.5">
			{#each data.module.lessons as lesson, i}
				<button
					onclick={() => goToLesson(i)}
					class="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[13px] transition-colors
						{currentLessonIndex === i ? 'bg-primary/10 text-primary-light font-medium' : 'text-text-muted hover:bg-bg-hover hover:text-text'}"
				>
					<div class="flex h-4 w-4 shrink-0 items-center justify-center rounded text-[10px]
						{completedLessons.includes(lesson.slug) ? 'text-success' : 'text-text-dim'}">
						{#if completedLessons.includes(lesson.slug)}
							<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
								<path d="M5 13l4 4L19 7" />
							</svg>
						{:else}
							{i + 1}
						{/if}
					</div>
					<span class="truncate">{lesson.title}</span>
				</button>
			{/each}

			<a
				href="/tracks/{data.track.slug}/{data.module.slug}/quiz"
				class="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[13px] text-text-muted hover:bg-bg-hover hover:text-text"
			>
				<div class="flex h-4 w-4 shrink-0 items-center justify-center text-text-dim">
					<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
					</svg>
				</div>
				<span>Module Quiz</span>
			</a>
		</nav>
	</aside>

	<!-- Main content -->
	<div class="flex-1 overflow-x-hidden">
		<!-- Mobile header -->
		<div class="border-b border-border bg-bg-card/40 p-4 lg:hidden">
			<a href="/tracks/{data.track.slug}" class="mb-2 inline-flex items-center gap-1 text-[11px] text-text-dim">
				<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path d="M15 19l-7-7 7-7" />
				</svg>
				{data.track.title}
			</a>
			<h2 class="display-serif text-sm font-semibold">{data.module.title}</h2>
			<div class="mt-2 flex items-center gap-2">
				<ProgressBar value={completedLessons.length} max={data.module.lessons.length} size="sm" />
				<span class="text-[10px] text-text-dim">{completedLessons.length}/{data.module.lessons.length}</span>
			</div>
			<select
				value={currentLessonIndex}
				onchange={(e) => goToLesson(Number(e.currentTarget.value))}
				class="mt-2 w-full rounded-md border border-border bg-bg-elevated px-3 py-2 text-sm"
			>
				{#each data.module.lessons as lesson, i}
					<option value={i}>{i + 1}. {lesson.title}</option>
				{/each}
			</select>
		</div>

		<!-- Lesson content -->
		<div class="mx-auto max-w-3xl px-5 py-8 sm:px-8">
			<div class="mb-6">
				<div class="flex items-center gap-2 text-[11px] text-text-dim mb-2">
					<span>Lesson {currentLessonIndex + 1} of {data.module.lessons.length}</span>
					<span class="text-border-light">/</span>
					<span>{currentLesson.estimatedMinutes} min read</span>
					<span class="text-border-light">/</span>
					<span>{currentLesson.xpReward} XP</span>
				</div>
				<h1 class="display-serif text-2xl font-semibold tracking-tight sm:text-3xl">{currentLesson.title}</h1>
			</div>

			<LessonRenderer content={currentLesson.content} />

			<!-- Bottom actions -->
			<div class="mt-12 flex items-center justify-between border-t border-border pt-6">
				<button
					onclick={() => goToLesson(currentLessonIndex - 1)}
					disabled={currentLessonIndex === 0}
					class="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-[13px] text-text-muted hover:bg-bg-elevated disabled:opacity-30 disabled:cursor-not-allowed"
				>
					<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path d="M15 19l-7-7 7-7" />
					</svg>
					Previous
				</button>

				{#if !isLessonComplete}
					<button
						onclick={markComplete}
						class="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
					>
						Complete & Continue
						<span class="text-[11px] opacity-75">+{currentLesson.xpReward} XP</span>
					</button>
				{:else if currentLessonIndex < data.module.lessons.length - 1}
					<button
						onclick={() => goToLesson(currentLessonIndex + 1)}
						class="inline-flex items-center gap-1 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
					>
						Next Lesson
						<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path d="M9 5l7 7-7 7" />
						</svg>
					</button>
				{:else}
					<a
						href="/tracks/{data.track.slug}/{data.module.slug}/quiz"
						class="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
					>
						Take the Quiz
						<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path d="M9 5l7 7-7 7" />
						</svg>
					</a>
				{/if}

				<button
					onclick={() => goToLesson(currentLessonIndex + 1)}
					disabled={currentLessonIndex === data.module.lessons.length - 1}
					class="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-[13px] text-text-muted hover:bg-bg-elevated disabled:opacity-30 disabled:cursor-not-allowed"
				>
					Next
					<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path d="M9 5l7 7-7 7" />
					</svg>
				</button>
			</div>
		</div>
	</div>
</div>
