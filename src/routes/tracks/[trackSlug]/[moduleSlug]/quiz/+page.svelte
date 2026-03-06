<script lang="ts">
	import QuizComponent from '$lib/components/Quiz.svelte';
	import type { PageData } from './$types';
	import { progressStore, isSignedIn, isLoading } from '$lib/stores/progress';
	import { browser } from '$app/environment';

	let { data }: { data: PageData } = $props();

	let quizCompleted = $state(false);
	let lastScore = $state(0);
	let lastTotal = $state(0);
	let lastPassed = $state(false);

	let storeData = $derived($progressStore);
	let bestResult = $derived.by(() => {
		if (!browser) return null;
		const results = storeData.quizResults[data.module.slug];
		if (!results || results.length === 0) return null;
		return results.reduce((a: any, b: any) => (a.score > b.score ? a : b));
	});

	async function handleComplete(score: number, total: number, passed: boolean) {
		quizCompleted = true;
		lastScore = score;
		lastTotal = total;
		lastPassed = passed;
		await progressStore.submitQuiz(data.module.slug, score, total, passed);
	}
</script>

<svelte:head>
	<title>Quiz: {data.module.title} — Gradient Ascent</title>
</svelte:head>

{#if !$isLoading && !$isSignedIn}
	<div class="mx-auto max-w-3xl px-5 py-12 sm:px-8">
		<a href="/tracks/{data.track.slug}/{data.module.slug}" class="mb-4 inline-flex items-center gap-1 text-[13px] text-text-dim hover:text-text">
			<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path d="M15 19l-7-7 7-7" />
			</svg>
			Back to {data.module.title}
		</a>
		<h1 class="display-serif text-xl font-semibold mb-6">Module Quiz: {data.module.title}</h1>

		<div class="rounded-lg border border-border bg-bg-card/95 px-8 py-10 text-center max-w-md mx-auto">
			<svg class="h-8 w-8 mx-auto mb-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
				<path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
			</svg>
			<h3 class="display-serif text-lg font-semibold mb-1">Sign in to take quizzes</h3>
			<p class="text-sm text-text-muted mb-5">Create a free account to test your knowledge and earn XP.</p>
			<a
				href="/auth/signin"
				class="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
			>
				Sign Up Free
			</a>
		</div>
	</div>
{:else}
<div class="mx-auto max-w-3xl px-5 py-12 sm:px-8">
	<div class="mb-8">
		<a
			href="/tracks/{data.track.slug}/{data.module.slug}"
			class="mb-4 inline-flex items-center gap-1 text-[13px] text-text-dim hover:text-text"
		>
			<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path d="M15 19l-7-7 7-7" />
			</svg>
			Back to {data.module.title}
		</a>

		<h1 class="display-serif text-xl font-semibold mb-2">Module Quiz: {data.module.title}</h1>

		{#if bestResult}
			<div class="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-[13px] {bestResult.passed ? 'border-success/30 bg-success/5 text-success' : 'border-warning/30 bg-warning/5 text-warning'}">
				Best: {bestResult.score}/{bestResult.totalQuestions}
				({Math.round((bestResult.score / bestResult.totalQuestions) * 100)}%)
				{bestResult.passed ? '— Passed' : ''}
			</div>
		{/if}
	</div>

	<QuizComponent quiz={data.module.quiz} onComplete={handleComplete} />

	{#if quizCompleted && lastPassed}
		<div class="mt-8 text-center">
			<a
				href="/tracks/{data.track.slug}"
				class="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
			>
				Back to Track
				<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path d="M9 5l7 7-7 7" />
				</svg>
			</a>
		</div>
	{/if}
</div>
{/if}
