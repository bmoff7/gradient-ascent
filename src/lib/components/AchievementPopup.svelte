<script lang="ts">
	import type { Achievement } from '$lib/content/types';

	let { achievement, show = false, onclose }: { achievement: Achievement | null; show: boolean; onclose: () => void } = $props();
</script>

{#if show && achievement}
	<div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" role="dialog">
		<div class="animate-achievement-pop mx-4 max-w-sm rounded-lg border border-xp/30 bg-bg-card p-8 text-center shadow-2xl">
			<div class="mb-4 text-5xl">{achievement.icon}</div>
			<div class="mb-1 text-[11px] font-semibold uppercase tracking-widest text-xp">
				Achievement Unlocked
			</div>
			<h3 class="display-serif mb-2 text-xl font-semibold">{achievement.title}</h3>
			<p class="mb-4 text-sm text-text-muted">{achievement.description}</p>
			<div class="mb-6 inline-flex items-center gap-1 rounded-md bg-xp/10 px-3 py-1 text-sm font-semibold text-xp">
				+{achievement.xpReward} XP
			</div>
			<br />
			<button
				onclick={onclose}
				class="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
			>
				Continue
			</button>
		</div>
	</div>
{/if}
