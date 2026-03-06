<script lang="ts">
	let { value = 0, max = 100, color = '', size = 'md', showLabel = false }:
		{ value: number; max: number; color?: string; size?: 'sm' | 'md' | 'lg'; showLabel?: boolean } = $props();

	let pct = $derived(max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0);
	let heightClass = $derived(size === 'sm' ? 'h-1' : size === 'lg' ? 'h-3' : 'h-1.5');
</script>

<div class="flex items-center gap-2">
	<div class="relative w-full overflow-hidden rounded-full bg-bg-elevated {heightClass}">
		<div
			class="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-500 ease-out"
			style="width: {pct}%{color ? `; background: ${color}` : ''}"
		></div>
	</div>
	{#if showLabel}
		<span class="min-w-[3ch] text-right text-[11px] font-medium text-text-dim">{pct}%</span>
	{/if}
</div>
