<script lang="ts">
	import XPBar from '$lib/components/XPBar.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Dashboard — Gradient Ascent</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-5 py-12 sm:px-8">
	<h1 class="display-serif text-2xl font-semibold mb-8">Dashboard</h1>

	<!-- Stats -->
	<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-8">
		{#each [
			{ label: 'Lessons Completed', value: data.completedLessons },
			{ label: 'Quizzes Passed', value: data.completedQuizzes },
			{ label: 'Current Streak', value: `${data.streak.currentStreak}d` },
			{ label: 'Achievements', value: data.achievements.length }
		] as stat}
			<div class="rounded-lg border border-border bg-bg-card p-4">
				<div class="text-[12px] text-text-dim mb-1">{stat.label}</div>
				<div class="text-2xl font-bold">{stat.value}</div>
			</div>
		{/each}
	</div>

	<div class="grid gap-6 lg:grid-cols-3">
		<div class="lg:col-span-2 space-y-6">
			<XPBar totalXP={data.totalXP} />

			<!-- Track progress -->
			<div class="rounded-lg border border-border bg-bg-card p-5">
				<h2 class="display-serif text-base font-semibold mb-4">Track Progress</h2>
				<div class="space-y-3">
					{#each data.trackProgress as track}
						<a href="/tracks/{track.slug}" class="flex items-center gap-4 rounded-md p-2.5 transition-colors hover:bg-bg-elevated">
							<div
								class="flex h-7 w-7 items-center justify-center rounded text-[10px] font-bold text-white/90"
								style="background: {track.color || 'var(--color-primary)'}"
							>
								{track.icon || ''}
							</div>
							<div class="flex-1 min-w-0">
								<div class="flex items-center justify-between mb-1">
									<span class="text-sm font-medium">{track.title}</span>
									<span class="text-[11px] text-text-dim">{track.completedModules}/{track.totalModules}</span>
								</div>
								<ProgressBar value={track.completedModules} max={track.totalModules} size="sm" />
							</div>
						</a>
					{/each}
				</div>
			</div>
		</div>

		<div class="space-y-6">
			<!-- Streak -->
			<div class="rounded-lg border border-border bg-bg-card p-5 text-center">
				<div class="text-3xl font-bold">{data.streak.currentStreak}</div>
				<div class="text-sm text-text-muted">day streak</div>
				<div class="text-[11px] text-text-dim mt-1">Best: {data.streak.longestStreak} days</div>
			</div>

			<!-- Recent XP -->
			<div class="rounded-lg border border-border bg-bg-card p-5">
				<h2 class="display-serif text-base font-semibold mb-3">Recent Activity</h2>
				{#if data.recentXP.length > 0}
					<div class="space-y-2.5">
						{#each data.recentXP as xp}
							<div class="flex items-center justify-between text-[13px]">
								<span class="text-text-muted">{xp.source.replace(/_/g, ' ')}</span>
								<span class="font-medium text-xp">+{xp.amount} XP</span>
							</div>
						{/each}
					</div>
				{:else}
					<p class="text-[13px] text-text-dim">No activity yet. Start a lesson.</p>
				{/if}
			</div>

			<a
				href="/tracks"
				class="block w-full rounded-md bg-primary px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-primary-dark"
			>
				Browse Tracks
			</a>
		</div>
	</div>
</div>
