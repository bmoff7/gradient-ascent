<script lang="ts">
	let points = $state<{ x: number; y: number; label: number }[]>([
		{ x: 1, y: 4, label: 1 }, { x: 2, y: 3.5, label: 1 }, { x: 1.5, y: 5, label: 1 },
		{ x: 2.5, y: 4.5, label: 1 }, { x: 1.2, y: 3, label: 1 }, { x: 3, y: 5, label: 1 },
		{ x: 5, y: 1.5, label: 0 }, { x: 6, y: 2, label: 0 }, { x: 5.5, y: 1, label: 0 },
		{ x: 4.5, y: 2.5, label: 0 }, { x: 6.5, y: 1.8, label: 0 }, { x: 5, y: 0.5, label: 0 }
	]);

	let w1 = $state(-0.8);
	let w2 = $state(0.6);
	let bias = $state(1.0);
	let currentLabel = $state(1);

	const WIDTH = 450;
	const HEIGHT = 350;
	const PADDING = 30;
	const RANGE = 8;

	function toSX(v: number) { return PADDING + (v / RANGE) * (WIDTH - 2 * PADDING); }
	function toSY(v: number) { return HEIGHT - PADDING - (v / RANGE) * (HEIGHT - 2 * PADDING); }

	// Decision boundary: w1*x + w2*y + bias = 0
	let boundary = $derived.by(() => {
		if (Math.abs(w2) < 0.001) return null;
		const x1 = 0, y1 = -(w1 * x1 + bias) / w2;
		const x2 = RANGE, y2 = -(w1 * x2 + bias) / w2;
		return { x1: toSX(x1), y1: toSY(y1), x2: toSX(x2), y2: toSY(y2) };
	});

	// Classification regions
	let regionPath = $derived.by(() => {
		const STEP = 0.3;
		const rects: { x: number; y: number; label: number }[] = [];
		for (let x = 0; x < RANGE; x += STEP) {
			for (let y = 0; y < RANGE; y += STEP) {
				const pred = (w1 * x + w2 * y + bias) >= 0 ? 1 : 0;
				rects.push({ x, y, label: pred });
			}
		}
		return rects;
	});

	let accuracy = $derived.by(() => {
		let correct = 0;
		for (const p of points) {
			const pred = (w1 * p.x + w2 * p.y + bias) >= 0 ? 1 : 0;
			if (pred === p.label) correct++;
		}
		return points.length > 0 ? Math.round((correct / points.length) * 100) : 0;
	});

	function addPoint(e: MouseEvent) {
		const svg = e.currentTarget as SVGSVGElement;
		const rect = svg.getBoundingClientRect();
		const scaleX = WIDTH / rect.width;
		const scaleY = HEIGHT / rect.height;
		const sx = (e.clientX - rect.left) * scaleX;
		const sy = (e.clientY - rect.top) * scaleY;
		const x = ((sx - PADDING) / (WIDTH - 2 * PADDING)) * RANGE;
		const y = ((HEIGHT - sy - PADDING) / (HEIGHT - 2 * PADDING)) * RANGE;
		if (x >= 0 && x <= RANGE && y >= 0 && y <= RANGE) {
			points = [...points, { x, y, label: currentLabel }];
		}
	}

	function clearPoints() {
		points = [];
	}
</script>

<div>
	<div class="lab-controls">
		<div class="flex flex-col gap-1">
			<label class="text-xs text-text-muted">w1: {w1.toFixed(2)}</label>
			<input type="range" min="-3" max="3" step="0.05" bind:value={w1} class="w-28" />
		</div>
		<div class="flex flex-col gap-1">
			<label class="text-xs text-text-muted">w2: {w2.toFixed(2)}</label>
			<input type="range" min="-3" max="3" step="0.05" bind:value={w2} class="w-28" />
		</div>
		<div class="flex flex-col gap-1">
			<label class="text-xs text-text-muted">bias: {bias.toFixed(2)}</label>
			<input type="range" min="-5" max="5" step="0.1" bind:value={bias} class="w-28" />
		</div>
	</div>
	<div class="flex items-center gap-2 mb-3">
		<span class="text-xs text-text-dim">Place:</span>
		<button onclick={() => currentLabel = 1} class="rounded-full px-3 py-1 text-xs {currentLabel === 1 ? 'bg-accent-blue text-white' : 'bg-bg-elevated text-text-muted border border-border'}">
			Blue (class 1)
		</button>
		<button onclick={() => currentLabel = 0} class="rounded-full px-3 py-1 text-xs {currentLabel === 0 ? 'bg-accent-red text-white' : 'bg-bg-elevated text-text-muted border border-border'}">
			Red (class 0)
		</button>
		<button onclick={clearPoints} class="rounded-full px-3 py-1 text-xs bg-bg-elevated text-text-muted border border-border hover:bg-bg-hover ml-auto">
			Clear
		</button>
	</div>

	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<svg viewBox="0 0 {WIDTH} {HEIGHT}" class="w-full max-w-lg rounded-lg bg-bg/50 cursor-crosshair" onclick={addPoint}>
		<!-- Classification regions -->
		{#each regionPath as r}
			<rect
				x={toSX(r.x)} y={toSY(r.y + 0.3)}
				width={toSX(0.3) - toSX(0)} height={toSY(0) - toSY(0.3)}
				fill={r.label === 1 ? 'rgba(59,130,246,0.08)' : 'rgba(239,68,68,0.08)'}
			/>
		{/each}

		<!-- Grid -->
		{#each [0, 2, 4, 6, 8] as v}
			<line x1={toSX(v)} y1={toSY(0)} x2={toSX(v)} y2={toSY(RANGE)} stroke="var(--color-border)" stroke-width="0.5" />
			<line x1={toSX(0)} y1={toSY(v)} x2={toSX(RANGE)} y2={toSY(v)} stroke="var(--color-border)" stroke-width="0.5" />
		{/each}

		<!-- Decision boundary -->
		{#if boundary}
			<line x1={boundary.x1} y1={boundary.y1} x2={boundary.x2} y2={boundary.y2} stroke="var(--color-text)" stroke-width="2" />
		{/if}

		<!-- Points -->
		{#each points as p}
			<circle cx={toSX(p.x)} cy={toSY(p.y)} r="6"
				fill={p.label === 1 ? 'var(--color-accent-blue)' : 'var(--color-accent-red)'}
				stroke="white" stroke-width="1.5"
			/>
		{/each}
	</svg>

	<div class="mt-3 text-xs text-text-dim">
		Accuracy: <span class="font-semibold text-text">{accuracy}%</span> | Points: {points.length}
	</div>
</div>
