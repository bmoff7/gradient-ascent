<script lang="ts">
	let learningRate = $state(0.1);
	let ballX = $state(4);
	let running = $state(false);
	let history = $state<{ x: number; y: number }[]>([]);
	let animationId: number;

	const WIDTH = 500;
	const HEIGHT = 300;
	const PADDING = 40;

	// f(x) = (x-1)^2 + 0.5*sin(3x) - a function with a clear minimum near x=1
	function f(x: number): number {
		return (x - 1) ** 2 + 0.5 * Math.sin(3 * x);
	}

	// Derivative: f'(x) = 2(x-1) + 1.5*cos(3x)
	function df(x: number): number {
		return 2 * (x - 1) + 1.5 * Math.cos(3 * x);
	}

	function toScreenX(x: number): number {
		return PADDING + ((x + 2) / 8) * (WIDTH - 2 * PADDING);
	}

	function toScreenY(y: number): number {
		return HEIGHT - PADDING - (y / 20) * (HEIGHT - 2 * PADDING);
	}

	let curvePath = $derived.by(() => {
		let d = '';
		for (let i = -2; i <= 6; i += 0.05) {
			const sx = toScreenX(i);
			const sy = toScreenY(f(i));
			d += (i === -2 ? 'M' : 'L') + `${sx},${sy}`;
		}
		return d;
	});

	let ballScreenX = $derived(toScreenX(ballX));
	let ballScreenY = $derived(toScreenY(f(ballX)));

	let historyPath = $derived.by(() => {
		if (history.length < 2) return '';
		return history.map((p, i) => `${i === 0 ? 'M' : 'L'}${toScreenX(p.x)},${toScreenY(p.y)}`).join('');
	});

	function step() {
		const grad = df(ballX);
		ballX = ballX - learningRate * grad;
		ballX = Math.max(-2, Math.min(6, ballX));
		history = [...history, { x: ballX, y: f(ballX) }];
	}

	function startAnimation() {
		if (running) return;
		running = true;
		function animate() {
			step();
			if (Math.abs(df(ballX)) > 0.001 && history.length < 200 && running) {
				animationId = requestAnimationFrame(animate);
			} else {
				running = false;
			}
		}
		animationId = requestAnimationFrame(animate);
	}

	function reset() {
		running = false;
		cancelAnimationFrame(animationId);
		ballX = 4;
		history = [{ x: 4, y: f(4) }];
	}

	function handleStep() {
		step();
	}

	// Initialize history
	history = [{ x: ballX, y: f(ballX) }];
</script>

<div>
	<div class="lab-controls">
		<div class="flex flex-col gap-1">
			<label class="text-xs text-text-muted">Learning Rate: {learningRate.toFixed(3)}</label>
			<input
				type="range"
				min="0.001"
				max="0.5"
				step="0.001"
				bind:value={learningRate}
				class="w-40"
			/>
		</div>
		<div class="flex items-end gap-2">
			<button
				onclick={handleStep}
				disabled={running}
				class="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark disabled:opacity-40"
			>
				Step
			</button>
			<button
				onclick={startAnimation}
				disabled={running}
				class="rounded-lg bg-accent-emerald px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-40"
			>
				Run
			</button>
			<button
				onclick={reset}
				class="rounded-lg bg-bg-elevated border border-border px-3 py-1.5 text-xs font-medium text-text-muted hover:bg-bg-hover"
			>
				Reset
			</button>
		</div>
	</div>

	<svg viewBox="0 0 {WIDTH} {HEIGHT}" class="w-full rounded-lg bg-bg/50">
		<!-- Grid -->
		{#each [0, 5, 10, 15, 20] as y}
			<line
				x1={PADDING}
				y1={toScreenY(y)}
				x2={WIDTH - PADDING}
				y2={toScreenY(y)}
				stroke="var(--color-border)"
				stroke-width="0.5"
			/>
			<text x={PADDING - 5} y={toScreenY(y) + 4} text-anchor="end" fill="var(--color-text-dim)" font-size="10">
				{y}
			</text>
		{/each}

		<!-- Axes labels -->
		<text x={WIDTH / 2} y={HEIGHT - 5} text-anchor="middle" fill="var(--color-text-dim)" font-size="11">x</text>
		<text x={12} y={HEIGHT / 2} text-anchor="middle" fill="var(--color-text-dim)" font-size="11" transform="rotate(-90, 12, {HEIGHT / 2})">f(x)</text>

		<!-- Curve -->
		<path d={curvePath} fill="none" stroke="var(--color-primary)" stroke-width="2.5" />

		<!-- History trail -->
		{#if historyPath}
			<path d={historyPath} fill="none" stroke="var(--color-accent-amber)" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6" />
		{/if}

		<!-- History dots -->
		{#each history as point, i}
			<circle
				cx={toScreenX(point.x)}
				cy={toScreenY(point.y)}
				r={i === history.length - 1 ? 0 : 2}
				fill="var(--color-accent-amber)"
				opacity={0.3 + (i / history.length) * 0.7}
			/>
		{/each}

		<!-- Ball -->
		<circle cx={ballScreenX} cy={ballScreenY} r="8" fill="var(--color-accent-amber)" stroke="white" stroke-width="2">
			<animate attributeName="r" values="8;9;8" dur="1.5s" repeatCount="indefinite" />
		</circle>

		<!-- Gradient arrow -->
		{#each [df(ballX)] as grad}
			{@const arrowLen = Math.min(Math.abs(grad) * 15, 60)}
			{@const arrowDir = grad > 0 ? -1 : 1}
			<line
				x1={ballScreenX}
				y1={ballScreenY + 15}
				x2={ballScreenX + arrowDir * arrowLen}
				y2={ballScreenY + 15}
				stroke="var(--color-accent-emerald)"
				stroke-width="2"
				marker-end="url(#arrowhead)"
			/>
		{/each}
		<defs>
			<marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
				<polygon points="0 0, 6 2, 0 4" fill="var(--color-accent-emerald)" />
			</marker>
		</defs>
	</svg>

	<div class="mt-3 flex items-center justify-between text-xs text-text-dim">
		<span>Steps: {history.length - 1}</span>
		<span>x = {ballX.toFixed(4)}</span>
		<span>f(x) = {f(ballX).toFixed(4)}</span>
		<span>gradient = {df(ballX).toFixed(4)}</span>
	</div>
</div>
