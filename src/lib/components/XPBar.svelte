<script lang="ts">
	import { getLevelForXP } from '$lib/content/types';

	let { totalXP = 0 }: { totalXP: number } = $props();

	let level = $derived(getLevelForXP(totalXP));
</script>

<div class="rounded-lg bg-bg-card border border-border p-4">
	<div class="flex items-center justify-between mb-2">
		<div class="flex items-center gap-2">
			<span class="text-lg">{level.icon}</span>
			<div>
				<div class="text-sm font-semibold">{level.name}</div>
				<div class="text-[11px] text-text-dim">Level {level.index + 1}</div>
			</div>
		</div>
		<div class="text-right">
			<div class="text-sm font-semibold text-xp">{totalXP.toLocaleString()} XP</div>
			{#if level.nextLevel}
				<div class="text-[11px] text-text-dim">{level.nextLevel.minXP - totalXP} to {level.nextLevel.name}</div>
			{:else}
				<div class="text-[11px] text-text-dim">Max level</div>
			{/if}
		</div>
	</div>

	<div class="relative h-1.5 overflow-hidden rounded-full bg-bg-elevated">
		<div
			class="absolute inset-y-0 left-0 rounded-full bg-xp transition-all duration-700 ease-out"
			style="width: {level.progressToNext * 100}%"
		></div>
	</div>

	{#if level.nextLevel}
		<div class="mt-1.5 flex justify-between text-[10px] text-text-dim">
			<span>{level.minXP}</span>
			<span>{level.nextLevel.minXP}</span>
		</div>
	{/if}
</div>
