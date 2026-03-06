<script lang="ts">
	type Kernel = { name: string; values: number[][] };

	const kernels: Kernel[] = [
		{ name: 'Edge Detect', values: [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]] },
		{ name: 'Sharpen', values: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]] },
		{ name: 'Blur', values: [[1/9, 1/9, 1/9], [1/9, 1/9, 1/9], [1/9, 1/9, 1/9]] },
		{ name: 'Emboss', values: [[-2, -1, 0], [-1, 1, 1], [0, 1, 2]] },
		{ name: 'Horizontal', values: [[-1, -1, -1], [0, 0, 0], [1, 1, 1]] },
		{ name: 'Vertical', values: [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]] }
	];

	let selectedKernel = $state(0);
	let kernelPos = $state({ row: 0, col: 0 });
	let autoPlaying = $state(false);
	let animId: number;

	const INPUT_SIZE = 7;
	const CELL = 42;

	// Sample input image (grayscale values 0-255)
	const inputImage = [
		[20, 20, 20, 20, 20, 20, 20],
		[20, 50, 50, 200, 50, 50, 20],
		[20, 50, 200, 200, 200, 50, 20],
		[20, 200, 200, 255, 200, 200, 20],
		[20, 50, 200, 200, 200, 50, 20],
		[20, 50, 50, 200, 50, 50, 20],
		[20, 20, 20, 20, 20, 20, 20]
	];

	let kernel = $derived(kernels[selectedKernel]);
	let outputSize = $derived(INPUT_SIZE - 2); // 3x3 kernel, no padding

	let outputImage = $derived.by(() => {
		const out: number[][] = [];
		for (let r = 0; r < outputSize; r++) {
			out[r] = [];
			for (let c = 0; c < outputSize; c++) {
				let sum = 0;
				for (let kr = 0; kr < 3; kr++) {
					for (let kc = 0; kc < 3; kc++) {
						sum += inputImage[r + kr][c + kc] * kernel.values[kr][kc];
					}
				}
				out[r][c] = Math.max(0, Math.min(255, Math.round(sum)));
			}
		}
		return out;
	});

	let currentValue = $derived.by(() => {
		let sum = 0;
		for (let kr = 0; kr < 3; kr++) {
			for (let kc = 0; kc < 3; kc++) {
				sum += inputImage[kernelPos.row + kr][kernelPos.col + kc] * kernel.values[kr][kc];
			}
		}
		return Math.max(0, Math.min(255, Math.round(sum)));
	});

	function nextPosition() {
		let col = kernelPos.col + 1;
		let row = kernelPos.row;
		if (col >= outputSize) {
			col = 0;
			row++;
		}
		if (row >= outputSize) {
			row = 0;
			col = 0;
		}
		kernelPos = { row, col };
	}

	function autoPlay() {
		if (autoPlaying) {
			autoPlaying = false;
			cancelAnimationFrame(animId);
			return;
		}
		autoPlaying = true;
		let count = 0;
		function step() {
			if (!autoPlaying || count > outputSize * outputSize) {
				autoPlaying = false;
				return;
			}
			nextPosition();
			count++;
			setTimeout(() => { animId = requestAnimationFrame(step); }, 400);
		}
		animId = requestAnimationFrame(step);
	}

	function cellColor(value: number): string {
		const v = Math.round(value);
		return `rgb(${v}, ${v}, ${v})`;
	}

	function textColor(value: number): string {
		return value > 128 ? '#000' : '#fff';
	}
</script>

<div>
	<div class="lab-controls">
		<div class="flex flex-wrap gap-2">
			{#each kernels as k, i}
				<button
					onclick={() => { selectedKernel = i; kernelPos = { row: 0, col: 0 }; }}
					class="rounded-lg px-3 py-1.5 text-xs font-medium transition-all {selectedKernel === i ? 'bg-primary text-white' : 'bg-bg-elevated border border-border text-text-muted hover:bg-bg-hover'}"
				>
					{k.name}
				</button>
			{/each}
		</div>
		<div class="flex items-end gap-2">
			<button onclick={nextPosition} class="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark">Step</button>
			<button onclick={autoPlay} class="rounded-lg bg-accent-emerald px-3 py-1.5 text-xs font-medium text-white hover:opacity-90">
				{autoPlaying ? 'Stop' : 'Auto'}
			</button>
		</div>
	</div>

	<div class="flex flex-wrap gap-8 items-start">
		<!-- Input grid -->
		<div>
			<div class="text-xs font-medium text-text-muted mb-2">Input ({INPUT_SIZE}x{INPUT_SIZE})</div>
			<svg viewBox="0 0 {INPUT_SIZE * CELL} {INPUT_SIZE * CELL}" width={INPUT_SIZE * CELL} height={INPUT_SIZE * CELL}>
				{#each inputImage as row, r}
					{#each row as val, c}
						<rect
							x={c * CELL} y={r * CELL} width={CELL} height={CELL}
							fill={cellColor(val)} stroke="var(--color-border)" stroke-width="0.5"
						/>
						<text x={c * CELL + CELL / 2} y={r * CELL + CELL / 2 + 4} text-anchor="middle" fill={textColor(val)} font-size="10">
							{Math.round(val)}
						</text>
					{/each}
				{/each}
				<!-- Kernel overlay -->
				<rect
					x={kernelPos.col * CELL} y={kernelPos.row * CELL}
					width={3 * CELL} height={3 * CELL}
					fill="none" stroke="var(--color-accent-amber)" stroke-width="3" rx="2"
				/>
			</svg>
		</div>

		<!-- Kernel -->
		<div>
			<div class="text-xs font-medium text-text-muted mb-2">Kernel (3x3)</div>
			<svg viewBox="0 0 {3 * CELL} {3 * CELL}" width={3 * CELL} height={3 * CELL}>
				{#each kernel.values as row, r}
					{#each row as val, c}
						<rect
							x={c * CELL} y={r * CELL} width={CELL} height={CELL}
							fill="var(--color-bg-elevated)" stroke="var(--color-accent-amber)" stroke-width="1"
						/>
						<text x={c * CELL + CELL / 2} y={r * CELL + CELL / 2 + 4} text-anchor="middle" fill="var(--color-accent-amber)" font-size="10" font-weight="600">
							{val === Math.round(val) ? val : val.toFixed(2)}
						</text>
					{/each}
				{/each}
			</svg>
			<div class="mt-2 text-center text-sm font-semibold text-accent-amber">= {currentValue}</div>
		</div>

		<!-- Output grid -->
		<div>
			<div class="text-xs font-medium text-text-muted mb-2">Output ({outputSize}x{outputSize})</div>
			<svg viewBox="0 0 {outputSize * CELL} {outputSize * CELL}" width={outputSize * CELL} height={outputSize * CELL}>
				{#each outputImage as row, r}
					{#each row as val, c}
						<rect
							x={c * CELL} y={r * CELL} width={CELL} height={CELL}
							fill={cellColor(val)} stroke="var(--color-border)" stroke-width="0.5"
						/>
						<text x={c * CELL + CELL / 2} y={r * CELL + CELL / 2 + 4} text-anchor="middle" fill={textColor(val)} font-size="10">
							{val}
						</text>
					{/each}
				{/each}
				<!-- Highlight current output cell -->
				<rect
					x={kernelPos.col * CELL} y={kernelPos.row * CELL}
					width={CELL} height={CELL}
					fill="none" stroke="var(--color-accent-amber)" stroke-width="3" rx="2"
				/>
			</svg>
		</div>
	</div>
</div>
