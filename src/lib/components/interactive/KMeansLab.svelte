<script lang="ts">
	let k = $state(3);
	let points = $state<{ x: number; y: number; cluster: number }[]>([]);
	let centroids = $state<{ x: number; y: number }[]>([]);
	let stepCount = $state(0);
	let converged = $state(false);

	const WIDTH = 450;
	const HEIGHT = 350;
	const PADDING = 20;
	const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

	function toSX(v: number) { return PADDING + (v / 10) * (WIDTH - 2 * PADDING); }
	function toSY(v: number) { return HEIGHT - PADDING - (v / 10) * (HEIGHT - 2 * PADDING); }

	function generatePoints() {
		const pts: typeof points = [];
		// Generate 3 clusters of random points
		const centers = [
			{ x: 2 + Math.random() * 2, y: 7 + Math.random() * 2 },
			{ x: 6 + Math.random() * 2, y: 3 + Math.random() * 2 },
			{ x: 3 + Math.random() * 2, y: 2 + Math.random() * 2 }
		];
		for (const c of centers) {
			for (let i = 0; i < 12; i++) {
				pts.push({
					x: c.x + (Math.random() - 0.5) * 3,
					y: c.y + (Math.random() - 0.5) * 3,
					cluster: -1
				});
			}
		}
		points = pts;
		initializeCentroids();
		stepCount = 0;
		converged = false;
	}

	function initializeCentroids() {
		const c: typeof centroids = [];
		for (let i = 0; i < k; i++) {
			c.push({
				x: 1 + Math.random() * 8,
				y: 1 + Math.random() * 8
			});
		}
		centroids = c;
	}

	function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
		return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
	}

	function assignStep() {
		let changed = false;
		points = points.map((p) => {
			let minD = Infinity;
			let minC = 0;
			for (let i = 0; i < centroids.length; i++) {
				const d = dist(p, centroids[i]);
				if (d < minD) { minD = d; minC = i; }
			}
			if (p.cluster !== minC) changed = true;
			return { ...p, cluster: minC };
		});
		return changed;
	}

	function updateCentroids() {
		centroids = centroids.map((_, i) => {
			const clusterPts = points.filter((p) => p.cluster === i);
			if (clusterPts.length === 0) return centroids[i];
			return {
				x: clusterPts.reduce((s, p) => s + p.x, 0) / clusterPts.length,
				y: clusterPts.reduce((s, p) => s + p.y, 0) / clusterPts.length
			};
		});
	}

	function doStep() {
		if (converged) return;
		const changed = assignStep();
		updateCentroids();
		stepCount++;
		if (!changed) converged = true;
	}

	function runToConvergence() {
		let maxIter = 50;
		while (!converged && maxIter-- > 0) {
			doStep();
		}
	}

	function addPoint(e: MouseEvent) {
		const svg = e.currentTarget as SVGSVGElement;
		const rect = svg.getBoundingClientRect();
		const scaleX = WIDTH / rect.width;
		const scaleY = HEIGHT / rect.height;
		const sx = (e.clientX - rect.left) * scaleX;
		const sy = (e.clientY - rect.top) * scaleY;
		const x = ((sx - PADDING) / (WIDTH - 2 * PADDING)) * 10;
		const y = ((HEIGHT - sy - PADDING) / (HEIGHT - 2 * PADDING)) * 10;
		if (x >= 0 && x <= 10 && y >= 0 && y <= 10) {
			points = [...points, { x, y, cluster: -1 }];
		}
	}

	// Generate initial points
	generatePoints();
</script>

<div>
	<div class="lab-controls">
		<div class="flex flex-col gap-1">
			<label class="text-xs text-text-muted">K = {k}</label>
			<input type="range" min="2" max="6" step="1" bind:value={k} class="w-28" />
		</div>
		<div class="flex items-end gap-2">
			<button onclick={doStep} disabled={converged} class="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark disabled:opacity-40">
				Step
			</button>
			<button onclick={runToConvergence} disabled={converged} class="rounded-lg bg-accent-emerald px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-40">
				Run
			</button>
			<button onclick={generatePoints} class="rounded-lg bg-bg-elevated border border-border px-3 py-1.5 text-xs font-medium text-text-muted hover:bg-bg-hover">
				New Data
			</button>
		</div>
	</div>

	<p class="text-xs text-text-dim mb-2">Click on the chart to add points.</p>

	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<svg viewBox="0 0 {WIDTH} {HEIGHT}" class="w-full max-w-lg rounded-lg bg-bg/50 cursor-crosshair" onclick={addPoint}>
		<!-- Grid -->
		{#each [0, 2, 4, 6, 8, 10] as v}
			<line x1={toSX(v)} y1={toSY(0)} x2={toSX(v)} y2={toSY(10)} stroke="var(--color-border)" stroke-width="0.5" />
			<line x1={toSX(0)} y1={toSY(v)} x2={toSX(10)} y2={toSY(v)} stroke="var(--color-border)" stroke-width="0.5" />
		{/each}

		<!-- Points -->
		{#each points as p}
			<circle
				cx={toSX(p.x)} cy={toSY(p.y)} r="5"
				fill={p.cluster >= 0 ? COLORS[p.cluster % COLORS.length] : 'var(--color-text-dim)'}
				opacity="0.8"
				stroke="white" stroke-width="0.5"
			/>
		{/each}

		<!-- Centroids -->
		{#each centroids as c, i}
			<g transform="translate({toSX(c.x)},{toSY(c.y)})">
				<line x1="-6" y1="-6" x2="6" y2="6" stroke={COLORS[i]} stroke-width="3" />
				<line x1="6" y1="-6" x2="-6" y2="6" stroke={COLORS[i]} stroke-width="3" />
				<circle r="10" fill="none" stroke={COLORS[i]} stroke-width="1.5" stroke-dasharray="3,3" />
			</g>
		{/each}
	</svg>

	<div class="mt-3 flex items-center gap-4 text-xs text-text-dim">
		<span>Step: {stepCount}</span>
		<span>Points: {points.length}</span>
		{#if converged}
			<span class="text-success font-medium">Converged!</span>
		{/if}
	</div>
</div>
