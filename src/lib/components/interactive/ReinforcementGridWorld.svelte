<script lang="ts">
	const GRID = 5;
	const GOAL = { r: 0, c: GRID - 1 };
	const TRAP = { r: 2, c: 2 };
	const WALLS = [{ r: 1, c: 1 }, { r: 1, c: 2 }, { r: 3, c: 3 }];

	let agentPos = $state({ r: GRID - 1, c: 0 });
	let qTable = $state<number[][][]>(
		Array.from({ length: GRID }, () =>
			Array.from({ length: GRID }, () => [0, 0, 0, 0])
		)
	);
	let episodes = $state(0);
	let totalReward = $state(0);
	let running = $state(false);
	let speed = $state(100);
	let epsilon = $state(0.3);
	let learningRate = $state(0.2);
	let trail = $state<{ r: number; c: number }[]>([]);

	const ACTIONS = [
		{ dr: -1, dc: 0, label: 'Up' },
		{ dr: 1, dc: 0, label: 'Down' },
		{ dr: 0, dc: -1, label: 'Left' },
		{ dr: 0, dc: 1, label: 'Right' },
	];

	function isWall(r: number, c: number): boolean {
		return WALLS.some(w => w.r === r && w.c === c);
	}

	function getReward(r: number, c: number): number {
		if (r === GOAL.r && c === GOAL.c) return 10;
		if (r === TRAP.r && c === TRAP.c) return -5;
		return -0.1;
	}

	function step(pos: { r: number; c: number }, action: number): { r: number; c: number } {
		const nr = pos.r + ACTIONS[action].dr;
		const nc = pos.c + ACTIONS[action].dc;
		if (nr < 0 || nr >= GRID || nc < 0 || nc >= GRID || isWall(nr, nc)) return pos;
		return { r: nr, c: nc };
	}

	function chooseAction(r: number, c: number): number {
		if (Math.random() < epsilon) return Math.floor(Math.random() * 4);
		const q = qTable[r][c];
		let bestA = 0;
		for (let a = 1; a < 4; a++) {
			if (q[a] > q[bestA]) bestA = a;
		}
		return bestA;
	}

	function bestAction(r: number, c: number): number {
		const q = qTable[r][c];
		let bestA = 0;
		for (let a = 1; a < 4; a++) if (q[a] > q[bestA]) bestA = a;
		return bestA;
	}

	function maxQ(r: number, c: number): number {
		return Math.max(...qTable[r][c]);
	}

	async function runEpisode() {
		agentPos = { r: GRID - 1, c: 0 };
		trail = [{ ...agentPos }];
		let steps = 0;
		let epReward = 0;

		while (steps < 50) {
			const { r, c } = agentPos;
			const a = chooseAction(r, c);
			const next = step(agentPos, a);
			const reward = getReward(next.r, next.c);

			// Q-learning update
			const oldQ = qTable[r][c][a];
			qTable[r][c][a] = oldQ + learningRate * (reward + 0.9 * maxQ(next.r, next.c) - oldQ);
			qTable = qTable; // trigger reactivity

			agentPos = next;
			trail = [...trail, { ...next }];
			epReward += reward;
			steps++;

			if (next.r === GOAL.r && next.c === GOAL.c) break;
			if (next.r === TRAP.r && next.c === TRAP.c) break;

			if (speed < 500) await new Promise(resolve => setTimeout(resolve, speed));
		}

		totalReward += epReward;
		episodes++;
	}

	async function runTraining() {
		if (running) return;
		running = true;
		for (let i = 0; i < 20 && running; i++) {
			await runEpisode();
		}
		running = false;
	}

	function reset() {
		running = false;
		agentPos = { r: GRID - 1, c: 0 };
		qTable = Array.from({ length: GRID }, () =>
			Array.from({ length: GRID }, () => [0, 0, 0, 0])
		);
		episodes = 0;
		totalReward = 0;
		trail = [];
	}

	function stopTraining() {
		running = false;
	}

	const CELL = 56;
	const GAP = 2;
	let svgSize = $derived(GRID * (CELL + GAP) + GAP);

	// Arrow directions for best policy display
	const arrows: Record<number, string> = {
		0: 'M0,-5 L4,3 L-4,3Z', // up
		1: 'M0,5 L4,-3 L-4,-3Z', // down
		2: 'M-5,0 L3,4 L3,-4Z', // left
		3: 'M5,0 L-3,4 L-3,-4Z', // right
	};
</script>

<div>
	<div class="lab-controls">
		<div class="flex flex-col gap-1">
			<label class="text-xs text-text-muted">Speed (ms): {speed}</label>
			<input type="range" min="10" max="500" step="10" bind:value={speed} class="w-28" />
		</div>
		<div class="flex flex-col gap-1">
			<label class="text-xs text-text-muted">Exploration (epsilon): {epsilon.toFixed(2)}</label>
			<input type="range" min="0.01" max="1" step="0.01" bind:value={epsilon} class="w-28" />
		</div>
		<div class="flex items-end gap-2">
			{#if running}
				<button onclick={stopTraining} class="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark">Stop</button>
			{:else}
				<button onclick={runTraining} class="rounded-md bg-accent-sage px-3 py-1.5 text-xs font-medium text-white hover:opacity-90">Train 20 episodes</button>
				<button onclick={() => runEpisode()} class="rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-white hover:opacity-90">1 episode</button>
			{/if}
			<button onclick={reset} class="rounded-md border border-border bg-bg-elevated px-3 py-1.5 text-xs font-medium text-text-muted hover:bg-bg-hover">Reset</button>
		</div>
	</div>

	<div class="flex flex-col sm:flex-row gap-6">
		<!-- Grid -->
		<svg viewBox="0 0 {svgSize} {svgSize}" width={svgSize} height={svgSize} class="rounded-lg">
			{#each Array(GRID) as _, r}
				{#each Array(GRID) as _, c}
					{@const cx = GAP + c * (CELL + GAP)}
					{@const cy = GAP + r * (CELL + GAP)}
					{@const isGoal = r === GOAL.r && c === GOAL.c}
					{@const isTrap = r === TRAP.r && c === TRAP.c}
					{@const isWallCell = isWall(r, c)}
					{@const isAgent = agentPos.r === r && agentPos.c === c}
					{@const onTrail = trail.some(t => t.r === r && t.c === c)}

					<rect
						x={cx} y={cy} width={CELL} height={CELL} rx="4"
						fill={isWallCell ? 'var(--color-border)' : isGoal ? 'rgba(122,158,126,0.2)' : isTrap ? 'rgba(201,85,61,0.15)' : onTrail ? 'rgba(91,140,158,0.08)' : 'var(--color-bg-card)'}
						stroke={isAgent ? 'var(--color-secondary-light)' : 'var(--color-border)'}
						stroke-width={isAgent ? 2 : 0.5}
					/>

					{#if isGoal}
						<text x={cx + CELL / 2} y={cy + CELL / 2 + 4} text-anchor="middle" fill="var(--color-accent-sage)" font-size="16" font-weight="600">G</text>
					{:else if isTrap}
						<text x={cx + CELL / 2} y={cy + CELL / 2 + 4} text-anchor="middle" fill="var(--color-primary)" font-size="14">X</text>
					{:else if isWallCell}
						<!-- wall, leave empty -->
					{:else if isAgent}
						<circle cx={cx + CELL / 2} cy={cy + CELL / 2} r="10" fill="var(--color-secondary)" />
					{:else if episodes > 0}
						<!-- Show policy arrow -->
						{@const ba = bestAction(r, c)}
						<g transform="translate({cx + CELL / 2}, {cy + CELL / 2})">
							<path d={arrows[ba]} fill="var(--color-text-dim)" opacity="0.4" />
						</g>
					{/if}
				{/each}
			{/each}
		</svg>

		<!-- Stats -->
		<div class="flex-1 space-y-3 text-xs">
			<div class="rounded-md border border-border bg-bg-card p-3">
				<div class="text-text-dim mb-1">Episodes</div>
				<div class="text-lg font-bold">{episodes}</div>
			</div>
			<div class="rounded-md border border-border bg-bg-card p-3">
				<div class="text-text-dim mb-1">Total Reward</div>
				<div class="text-lg font-bold {totalReward >= 0 ? 'text-accent-sage' : 'text-primary'}">{totalReward.toFixed(1)}</div>
			</div>
			<div class="text-text-dim leading-relaxed">
				<p><strong class="text-text">Green (G)</strong> = goal (+10)</p>
				<p><strong class="text-primary-light">Red (X)</strong> = trap (-5)</p>
				<p><strong class="text-text">Grey</strong> = walls</p>
				<p>Arrows show learned policy.</p>
			</div>
		</div>
	</div>
</div>
