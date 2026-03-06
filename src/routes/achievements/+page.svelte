<script lang="ts">
	import { progressStore, isSignedIn } from '$lib/stores/progress';
	import { achievements } from '$lib/content/achievements';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	$effect(() => {
		if (browser && !$isSignedIn) {
			goto('/auth/signin');
		}
	});

	let enrichedAchievements = $derived(
		achievements.map((a) => ({
			...a,
			unlocked: $progressStore.unlockedAchievements.includes(a.id)
		}))
	);

	let unlockedCount = $derived(enrichedAchievements.filter((a) => a.unlocked).length);
</script>

<svelte:head>
	<title>Achievements — Gradient Ascent</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-5 py-12 sm:px-8">
	<div class="mb-8">
		<p class="mb-2 text-[13px] font-medium uppercase tracking-widest text-text-dim">Progress</p>
		<h1 class="display-serif text-2xl font-semibold">Achievements</h1>
		<p class="mt-1 text-sm text-text-muted">{unlockedCount} of {achievements.length} unlocked</p>
	</div>

	<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
		{#each enrichedAchievements as achievement}
			<div
				class="rounded-lg border p-4 transition-all
					{achievement.unlocked
						? 'border-xp/30 bg-bg-card'
						: 'border-border bg-bg-card/50 opacity-40'}"
			>
				<div class="flex items-start gap-3">
					<div class="text-2xl {achievement.unlocked ? '' : 'grayscale'}">
						{achievement.icon}
					</div>
					<div class="flex-1 min-w-0">
						<h3 class="text-sm font-semibold">{achievement.title}</h3>
						<p class="text-[12px] text-text-muted mt-0.5">{achievement.description}</p>
						<div class="mt-2 flex items-center gap-2">
							<span class="text-[11px] font-medium text-xp">+{achievement.xpReward} XP</span>
							{#if achievement.unlocked}
								<span class="text-[11px] text-success">Unlocked</span>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
