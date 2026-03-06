<script lang="ts">
	let { value = 0, max = 100, size = 80, strokeWidth = 6, color = '#c9553d' }:
		{ value: number; max: number; size?: number; strokeWidth?: number; color?: string } = $props();

	let pct = $derived(max > 0 ? Math.min(100, (value / max) * 100) : 0);
	let radius = $derived((size - strokeWidth) / 2);
	let circumference = $derived(2 * Math.PI * radius);
	let offset = $derived(circumference - (pct / 100) * circumference);
</script>

<div class="relative inline-flex items-center justify-center" style="width: {size}px; height: {size}px">
	<svg width={size} height={size} class="-rotate-90">
		<circle
			cx={size / 2}
			cy={size / 2}
			r={radius}
			fill="none"
			stroke="var(--color-bg-elevated)"
			stroke-width={strokeWidth}
		/>
		<circle
			cx={size / 2}
			cy={size / 2}
			r={radius}
			fill="none"
			stroke={color}
			stroke-width={strokeWidth}
			stroke-linecap="round"
			stroke-dasharray={circumference}
			stroke-dashoffset={offset}
			class="transition-all duration-700 ease-out"
		/>
	</svg>
	<div class="absolute inset-0 flex items-center justify-center">
		<span class="text-sm font-semibold">{Math.round(pct)}%</span>
	</div>
</div>
