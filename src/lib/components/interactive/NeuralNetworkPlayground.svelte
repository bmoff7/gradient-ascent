<script lang="ts">
	let layers = $state([2, 4, 3, 1]);
	let weights = $state<number[][][]>([]);
	let activations = $state<number[][]>([]);
	let inputValues = $state([0.8, 0.3]);

	const WIDTH = 550;
	const HEIGHT = 350;
	const LAYER_GAP = 140;
	const START_X = 60;

	function sigmoid(x: number) { return 1 / (1 + Math.exp(-x)); }

	function initWeights() {
		const w: number[][][] = [];
		for (let l = 0; l < layers.length - 1; l++) {
			w[l] = [];
			for (let i = 0; i < layers[l]; i++) {
				w[l][i] = [];
				for (let j = 0; j < layers[l + 1]; j++) {
					w[l][i][j] = (Math.random() - 0.5) * 2;
				}
			}
		}
		weights = w;
	}

	function forwardPass() {
		const acts: number[][] = [inputValues];
		for (let l = 0; l < layers.length - 1; l++) {
			const prev = acts[l];
			const next: number[] = [];
			for (let j = 0; j < layers[l + 1]; j++) {
				let sum = 0;
				for (let i = 0; i < layers[l]; i++) {
					sum += prev[i] * (weights[l]?.[i]?.[j] ?? 0);
				}
				next.push(sigmoid(sum));
			}
			acts.push(next);
		}
		activations = acts;
	}

	function nodeY(layerSize: number, nodeIndex: number): number {
		const totalHeight = (layerSize - 1) * 60;
		return HEIGHT / 2 - totalHeight / 2 + nodeIndex * 60;
	}

	function nodeX(layerIndex: number): number {
		return START_X + layerIndex * LAYER_GAP;
	}

	function randomize() {
		initWeights();
		inputValues = [Math.random(), Math.random()];
		forwardPass();
	}

	function actColor(value: number): string {
		const r = Math.round(99 + value * 130);
		const g = Math.round(102 + value * 98);
		const b = Math.round(241);
		return `rgb(${r}, ${g}, ${b})`;
	}

	function weightColor(w: number): string {
		if (w > 0) return `rgba(34, 197, 94, ${Math.min(Math.abs(w), 1)})`;
		return `rgba(239, 68, 68, ${Math.min(Math.abs(w), 1)})`;
	}

	function weightWidth(w: number): number {
		return 0.5 + Math.min(Math.abs(w), 1) * 2.5;
	}

	initWeights();
	forwardPass();

	$effect(() => {
		forwardPass();
	});
</script>

<div>
	<div class="lab-controls">
		<div class="flex flex-col gap-1">
			<label class="text-xs text-text-muted">Input 1: {inputValues[0].toFixed(2)}</label>
			<input type="range" min="0" max="1" step="0.01" bind:value={inputValues[0]} class="w-28" />
		</div>
		<div class="flex flex-col gap-1">
			<label class="text-xs text-text-muted">Input 2: {inputValues[1].toFixed(2)}</label>
			<input type="range" min="0" max="1" step="0.01" bind:value={inputValues[1]} class="w-28" />
		</div>
		<button onclick={randomize} class="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark self-end">
			Randomize
		</button>
	</div>

	<svg viewBox="0 0 {WIDTH} {HEIGHT}" class="w-full rounded-lg bg-bg/50">
		<!-- Connections (weights) -->
		{#each layers as layerSize, l}
			{#if l < layers.length - 1}
				{#each Array(layerSize) as _, i}
					{#each Array(layers[l + 1]) as _, j}
						{@const w = weights[l]?.[i]?.[j] ?? 0}
						<line
							x1={nodeX(l)} y1={nodeY(layerSize, i)}
							x2={nodeX(l + 1)} y2={nodeY(layers[l + 1], j)}
							stroke={weightColor(w)} stroke-width={weightWidth(w)}
						/>
					{/each}
				{/each}
			{/if}
		{/each}

		<!-- Nodes -->
		{#each layers as layerSize, l}
			{#each Array(layerSize) as _, i}
				{@const act = activations[l]?.[i] ?? 0}
				<circle
					cx={nodeX(l)} cy={nodeY(layerSize, i)} r="18"
					fill={actColor(act)} stroke="white" stroke-width="1.5"
				/>
				<text
					x={nodeX(l)} y={nodeY(layerSize, i) + 4}
					text-anchor="middle" fill="white" font-size="10" font-weight="600"
				>
					{act.toFixed(2)}
				</text>
			{/each}
		{/each}

		<!-- Layer labels -->
		{#each layers as _, l}
			<text
				x={nodeX(l)} y={HEIGHT - 10}
				text-anchor="middle" fill="var(--color-text-dim)" font-size="10"
			>
				{l === 0 ? 'Input' : l === layers.length - 1 ? 'Output' : `Hidden ${l}`}
			</text>
		{/each}
	</svg>

	<div class="mt-3 flex items-center gap-4 text-xs text-text-dim">
		<span>Architecture: {layers.join(' → ')}</span>
		<span>Output: {(activations[activations.length - 1]?.[0] ?? 0).toFixed(4)}</span>
		<div class="flex items-center gap-2 ml-auto">
			<span class="flex items-center gap-1"><span class="inline-block w-3 h-0.5 bg-success"></span> positive</span>
			<span class="flex items-center gap-1"><span class="inline-block w-3 h-0.5 bg-error"></span> negative</span>
		</div>
	</div>
</div>
