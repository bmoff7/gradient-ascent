<script lang="ts">
	let w1 = $state(0.5);
	let w2 = $state(-0.3);
	let bias = $state(0.1);
	let points = $state<{ x: number; y: number; label: number }[]>([
		{ x: 1, y: 3, label: 1 },
		{ x: 2, y: 4, label: 1 },
		{ x: 3, y: 1, label: 0 },
		{ x: 4, y: 2, label: 0 },
		{ x: 1.5, y: 2, label: 1 },
		{ x: 3.5, y: 3, label: 0 },
		{ x: 2, y: 1.5, label: 0 },
		{ x: 1, y: 4, label: 1 }
	]);
	let training = $state(false);
	let epoch = $state(0);
	let lr = $state(0.1);

	const WIDTH = 400;
	const HEIGHT = 400;
	const PADDING = 30;
	const GRID_MIN = 0;
	const GRID_MAX = 5;

	function toSX(v: number) { return PADDING + ((v - GRID_MIN) / (GRID_MAX - GRID_MIN)) * (WIDTH - 2 * PADDING); }
	function toSY(v: number) { return HEIGHT - PADDING - ((v - GRID_MIN) / (GRID_MAX - GRID_MIN)) * (HEIGHT - 2 * PADDING); }

	function predict(x: number, y: number): number {
		return (w1 * x + w2 * y + bias) >= 0 ? 1 : 0;
	}

	function accuracy(): number {
		let correct = 0;
		for (const p of points) {
			if (predict(p.x, p.y) === p.label) correct++;
		}
		return Math.round((correct / points.length) * 100);
	}

	// Decision boundary: w1*x + w2*y + bias = 0 => y = -(w1*x + bias) / w2
	let boundaryLine = $derived.by(() => {
		if (Math.abs(w2) < 0.001) return null;
		const x1 = GRID_MIN;
		const y1 = -(w1 * x1 + bias) / w2;
		const x2 = GRID_MAX;
		const y2 = -(w1 * x2 + bias) / w2;
		return { x1: toSX(x1), y1: toSY(y1), x2: toSX(x2), y2: toSY(y2) };
	});

	function trainStep() {
		for (const p of points) {
			const pred = predict(p.x, p.y);
			const error = p.label - pred;
			if (error !== 0) {
				w1 += lr * error * p.x;
				w2 += lr * error * p.y;
				bias += lr * error;
			}
		}
		epoch++;
	}

	function trainLoop() {
		training = true;
		let steps = 0;
		function step() {
			if (!training || steps > 100 || accuracy() === 100) {
				training = false;
				return;
			}
			trainStep();
			steps++;
			requestAnimationFrame(step);
		}
		requestAnimationFrame(step);
	}

	function reset() {
		training = false;
		w1 = 0.5;
		w2 = -0.3;
		bias = 0.1;
		epoch = 0;
	}

	function addPoint(e: MouseEvent) {
		const svg = e.currentTarget as SVGSVGElement;
		const rect = svg.getBoundingClientRect();
		const sx = e.clientX - rect.left;
		const sy = e.clientY - rect.top;
		const scaleX = WIDTH / rect.width;
		const scaleY = HEIGHT / rect.height;
		const x = GRID_MIN + ((sx * scaleX - PADDING) / (WIDTH - 2 * PADDING)) * (GRID_MAX - GRID_MIN);
		const y = GRID_MIN + ((HEIGHT - sy * scaleY - PADDING) / (HEIGHT - 2 * PADDING)) * (GRID_MAX - GRID_MIN);
		if (x >= GRID_MIN && x <= GRID_MAX && y >= GRID_MIN && y <= GRID_MAX) {
			const label = e.shiftKey ? 0 : 1;
			points = [...points, { x, y, label }];
		}
	}
</script>

<div>
	<div class="lab-controls">
		<div class="flex flex-col gap-1">
			<label class="text-xs text-text-muted">w1: {w1.toFixed(3)}</label>
			<input type="range" min="-3" max="3" step="0.01" bind:value={w1} class="w-28" />
		</div>
		<div class="flex flex-col gap-1">
			<label class="text-xs text-text-muted">w2: {w2.toFixed(3)}</label>
			<input type="range" min="-3" max="3" step="0.01" bind:value={w2} class="w-28" />
		</div>
		<div class="flex flex-col gap-1">
			<label class="text-xs text-text-muted">bias: {bias.toFixed(3)}</label>
			<input type="range" min="-3" max="3" step="0.01" bind:value={bias} class="w-28" />
		</div>
	</div>

	<div class="flex flex-wrap items-end gap-2 mb-3">
		<button onclick={trainStep} class="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark">
			Train 1 Epoch
		</button>
		<button onclick={trainLoop} disabled={training} class="rounded-lg bg-accent-emerald px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-40">
			Auto Train
		</button>
		<button onclick={reset} class="rounded-lg bg-bg-elevated border border-border px-3 py-1.5 text-xs font-medium text-text-muted hover:bg-bg-hover">
			Reset
		</button>
		<span class="text-xs text-text-dim ml-2">Click to add blue points. Shift+click for red.</span>
	</div>

	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<svg viewBox="0 0 {WIDTH} {HEIGHT}" class="w-full max-w-md rounded-lg bg-bg/50 cursor-crosshair" onclick={addPoint}>
		<!-- Grid -->
		{#each [0, 1, 2, 3, 4, 5] as v}
			<line x1={toSX(v)} y1={toSY(GRID_MIN)} x2={toSX(v)} y2={toSY(GRID_MAX)} stroke="var(--color-border)" stroke-width="0.5" />
			<line x1={toSX(GRID_MIN)} y1={toSY(v)} x2={toSX(GRID_MAX)} y2={toSY(v)} stroke="var(--color-border)" stroke-width="0.5" />
		{/each}

		<!-- Decision boundary -->
		{#if boundaryLine}
			<line
				x1={boundaryLine.x1} y1={boundaryLine.y1}
				x2={boundaryLine.x2} y2={boundaryLine.y2}
				stroke="var(--color-accent-amber)"
				stroke-width="2"
				stroke-dasharray="6,3"
			/>
		{/if}

		<!-- Points -->
		{#each points as p}
			<circle
				cx={toSX(p.x)} cy={toSY(p.y)} r="6"
				fill={p.label === 1 ? 'var(--color-accent-blue)' : 'var(--color-accent-red)'}
				stroke="white" stroke-width="1.5"
			/>
		{/each}
	</svg>

	<div class="mt-3 flex items-center gap-4 text-xs text-text-dim">
		<span>Epoch: {epoch}</span>
		<span>Accuracy: {accuracy()}%</span>
		<span>w1={w1.toFixed(2)}, w2={w2.toFixed(2)}, b={bias.toFixed(2)}</span>
	</div>
</div>
