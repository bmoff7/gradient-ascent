<script lang="ts">
	let matA = $state([[1, 2], [3, 4]]);
	let matB = $state([[5, 6], [7, 8]]);
	let highlightRow = $state(0);
	let highlightCol = $state(0);
	let step = $state(0);

	const CELL = 50;
	const GAP = 20;

	let result = $derived.by(() => {
		const rows = matA.length;
		const cols = matB[0].length;
		const inner = matB.length;
		const r: number[][] = [];
		for (let i = 0; i < rows; i++) {
			r[i] = [];
			for (let j = 0; j < cols; j++) {
				let sum = 0;
				for (let k = 0; k < inner; k++) {
					sum += matA[i][k] * matB[k][j];
				}
				r[i][j] = sum;
			}
		}
		return r;
	});

	let dotProductSteps = $derived.by(() => {
		const steps: string[] = [];
		const inner = matB.length;
		for (let k = 0; k < inner; k++) {
			steps.push(`${matA[highlightRow][k]} × ${matB[k][highlightCol]}`);
		}
		return steps;
	});

	let dotProductResult = $derived(result[highlightRow][highlightCol]);

	function nextCell() {
		let col = highlightCol + 1;
		let row = highlightRow;
		if (col >= matB[0].length) {
			col = 0;
			row++;
		}
		if (row >= matA.length) {
			row = 0;
		}
		highlightRow = row;
		highlightCol = col;
		step++;
	}

	function randomize() {
		matA = matA.map((row) => row.map(() => Math.floor(Math.random() * 9) + 1));
		matB = matB.map((row) => row.map(() => Math.floor(Math.random() * 9) + 1));
		highlightRow = 0;
		highlightCol = 0;
		step = 0;
	}
</script>

<div>
	<div class="flex items-end gap-2 mb-4">
		<button onclick={nextCell} class="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark">
			Next Cell
		</button>
		<button onclick={randomize} class="rounded-lg bg-bg-elevated border border-border px-3 py-1.5 text-xs font-medium text-text-muted hover:bg-bg-hover">
			Randomize
		</button>
	</div>

	<div class="flex flex-wrap items-center gap-4">
		<!-- Matrix A -->
		<div>
			<div class="text-xs font-medium text-text-muted mb-1 text-center">A</div>
			<div class="relative">
				<div class="absolute -left-2 top-0 bottom-0 w-1 rounded bg-accent-blue"></div>
				<div class="absolute -right-2 top-0 bottom-0 w-1 rounded bg-accent-blue"></div>
				<div class="grid" style="grid-template-columns: repeat({matA[0].length}, {CELL}px)">
					{#each matA as row, r}
						{#each row as val, c}
							<div
								class="flex items-center justify-center border border-border text-sm font-mono font-medium transition-colors
									{r === highlightRow ? 'bg-accent-blue/20 text-accent-blue' : 'bg-bg-elevated text-text'}"
								style="width: {CELL}px; height: {CELL}px"
							>
								<input
									type="number"
									value={val}
									oninput={(e) => { matA[r][c] = Number(e.currentTarget.value) || 0; }}
									class="w-full h-full text-center bg-transparent outline-none text-inherit font-inherit"
								/>
							</div>
						{/each}
					{/each}
				</div>
			</div>
		</div>

		<span class="text-xl text-text-dim">×</span>

		<!-- Matrix B -->
		<div>
			<div class="text-xs font-medium text-text-muted mb-1 text-center">B</div>
			<div class="relative">
				<div class="absolute -left-2 top-0 bottom-0 w-1 rounded bg-accent-purple"></div>
				<div class="absolute -right-2 top-0 bottom-0 w-1 rounded bg-accent-purple"></div>
				<div class="grid" style="grid-template-columns: repeat({matB[0].length}, {CELL}px)">
					{#each matB as row, r}
						{#each row as val, c}
							<div
								class="flex items-center justify-center border border-border text-sm font-mono font-medium transition-colors
									{c === highlightCol ? 'bg-accent-purple/20 text-accent-purple' : 'bg-bg-elevated text-text'}"
								style="width: {CELL}px; height: {CELL}px"
							>
								<input
									type="number"
									value={val}
									oninput={(e) => { matB[r][c] = Number(e.currentTarget.value) || 0; }}
									class="w-full h-full text-center bg-transparent outline-none text-inherit font-inherit"
								/>
							</div>
						{/each}
					{/each}
				</div>
			</div>
		</div>

		<span class="text-xl text-text-dim">=</span>

		<!-- Result -->
		<div>
			<div class="text-xs font-medium text-text-muted mb-1 text-center">Result</div>
			<div class="relative">
				<div class="absolute -left-2 top-0 bottom-0 w-1 rounded bg-accent-emerald"></div>
				<div class="absolute -right-2 top-0 bottom-0 w-1 rounded bg-accent-emerald"></div>
				<div class="grid" style="grid-template-columns: repeat({result[0].length}, {CELL}px)">
					{#each result as row, r}
						{#each row as val, c}
							<div
								class="flex items-center justify-center border border-border text-sm font-mono font-medium transition-colors
									{r === highlightRow && c === highlightCol ? 'bg-accent-emerald/20 text-accent-emerald ring-2 ring-accent-emerald' : 'bg-bg-elevated text-text'}"
								style="width: {CELL}px; height: {CELL}px"
							>
								{val}
							</div>
						{/each}
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Computation breakdown -->
	<div class="mt-4 rounded-lg bg-bg-elevated border border-border p-3">
		<div class="text-xs text-text-muted mb-1">
			Computing Result[{highlightRow}][{highlightCol}]:
		</div>
		<div class="font-mono text-sm">
			{#each dotProductSteps as step, i}
				<span class="text-accent-blue">{step}</span>{#if i < dotProductSteps.length - 1}<span class="text-text-dim"> + </span>{/if}
			{/each}
			<span class="text-text-dim"> = </span>
			<span class="text-accent-emerald font-bold">{dotProductResult}</span>
		</div>
	</div>
</div>
