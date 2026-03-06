<script lang="ts">
	let complexity = $state(3);
	let noise = $state(0.3);
	let dataPoints = $state(20);

	const WIDTH = 480;
	const HEIGHT = 300;
	const PADDING = 40;

	function generateData(n: number, noiseLevel: number): { x: number; y: number }[] {
		const pts: { x: number; y: number }[] = [];
		for (let i = 0; i < n; i++) {
			const x = (i / (n - 1)) * 6;
			const y = Math.sin(x) + 1.5 + (Math.random() - 0.5) * noiseLevel * 3;
			pts.push({ x, y });
		}
		return pts;
	}

	let data = $derived(generateData(dataPoints, noise));
	let testData = $derived(generateData(30, noise * 0.5));

	function polyFit(pts: { x: number; y: number }[], degree: number): number[] {
		const n = pts.length;
		const maxDeg = Math.min(degree, n - 1);
		const X: number[][] = [];
		const Y: number[] = [];
		for (const p of pts) {
			const row: number[] = [];
			for (let d = 0; d <= maxDeg; d++) row.push(p.x ** d);
			X.push(row);
			Y.push(p.y);
		}
		const cols = maxDeg + 1;
		const XtX: number[][] = Array.from({ length: cols }, () => Array(cols).fill(0));
		const XtY: number[] = Array(cols).fill(0);
		for (let i = 0; i < cols; i++) {
			for (let j = 0; j < cols; j++) {
				for (let k = 0; k < n; k++) XtX[i][j] += X[k][i] * X[k][j];
			}
			for (let k = 0; k < n; k++) XtY[i] += X[k][i] * Y[k];
		}
		const aug = XtX.map((row, i) => [...row, XtY[i]]);
		for (let i = 0; i < cols; i++) {
			let maxR = i;
			for (let r = i + 1; r < cols; r++) {
				if (Math.abs(aug[r][i]) > Math.abs(aug[maxR][i])) maxR = r;
			}
			[aug[i], aug[maxR]] = [aug[maxR], aug[i]];
			if (Math.abs(aug[i][i]) < 1e-10) continue;
			for (let r = 0; r < cols; r++) {
				if (r === i) continue;
				const factor = aug[r][i] / aug[i][i];
				for (let c = 0; c <= cols; c++) aug[r][c] -= factor * aug[i][c];
			}
		}
		return aug.map((row, i) => row[cols] / (row[i] || 1));
	}

	function evalPoly(coeffs: number[], x: number): number {
		let y = 0;
		for (let i = 0; i < coeffs.length; i++) y += coeffs[i] * x ** i;
		return y;
	}

	function mse(pts: { x: number; y: number }[], coeffs: number[]): number {
		let sum = 0;
		for (const p of pts) sum += (p.y - evalPoly(coeffs, p.x)) ** 2;
		return sum / pts.length;
	}

	let coeffs = $derived(polyFit(data, complexity));
	let trainError = $derived(mse(data, coeffs));
	let testError = $derived(mse(testData, coeffs));

	function toSX(x: number) { return PADDING + (x / 6) * (WIDTH - 2 * PADDING); }
	function toSY(y: number) { return HEIGHT - PADDING - ((y + 0.5) / 4.5) * (HEIGHT - 2 * PADDING); }

	let fitPath = $derived.by(() => {
		let d = '';
		for (let x = 0; x <= 6; x += 0.05) {
			const y = evalPoly(coeffs, x);
			const sy = toSY(Math.max(-0.5, Math.min(4, y)));
			d += (x === 0 ? 'M' : 'L') + `${toSX(x)},${sy}`;
		}
		return d;
	});

	let errorData = $derived.by(() => {
		const errs: { deg: number; train: number; test: number }[] = [];
		for (let d = 1; d <= 15; d++) {
			const c = polyFit(data, d);
			errs.push({ deg: d, train: mse(data, c), test: mse(testData, c) });
		}
		return errs;
	});

	let maxError = $derived(Math.max(...errorData.map((e) => Math.min(e.test, 5))));
	function errorToSY(e: number) { return HEIGHT - PADDING - (Math.min(e, maxError) / maxError) * (HEIGHT - 2 * PADDING); }
	function degToSX(d: number) { return PADDING + ((d - 1) / 14) * (WIDTH - 2 * PADDING); }

	let trainErrPath = $derived(errorData.map((e, i) => `${i === 0 ? 'M' : 'L'}${degToSX(e.deg)},${errorToSY(e.train)}`).join(''));
	let testErrPath = $derived(errorData.map((e, i) => `${i === 0 ? 'M' : 'L'}${degToSX(e.deg)},${errorToSY(Math.min(e.test, maxError))}`).join(''));
	let sweetSpot = $derived(errorData.reduce((best, e) => e.test < best.test ? e : best));
</script>

<div>
	<div class="lab-controls">
		<div class="flex flex-col gap-1">
			<label class="text-xs text-text-muted">Model Complexity (degree): {complexity}</label>
			<input type="range" min="1" max="15" step="1" bind:value={complexity} class="w-40" />
		</div>
		<div class="flex flex-col gap-1">
			<label class="text-xs text-text-muted">Noise: {noise.toFixed(2)}</label>
			<input type="range" min="0" max="1" step="0.05" bind:value={noise} class="w-28" />
		</div>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
		<div>
			<div class="text-xs font-medium text-text-muted mb-1">Model Fit</div>
			<svg viewBox="0 0 {WIDTH} {HEIGHT}" class="w-full rounded-lg bg-bg/50">
				{#each [0, 1, 2, 3] as y}
					<line x1={PADDING} y1={toSY(y)} x2={WIDTH - PADDING} y2={toSY(y)} stroke="var(--color-border)" stroke-width="0.5" />
				{/each}
				<path d={fitPath} fill="none" stroke="var(--color-primary)" stroke-width="2.5" />
				{#each data as p}
					<circle cx={toSX(p.x)} cy={toSY(p.y)} r="4" fill="var(--color-accent-blue)" stroke="white" stroke-width="1" />
				{/each}
			</svg>
			<div class="mt-1 text-xs text-text-dim">
				Train MSE: <span class="text-accent-blue">{trainError.toFixed(4)}</span> |
				Test MSE: <span class="text-accent-amber">{testError.toFixed(4)}</span>
			</div>
		</div>

		<div>
			<div class="text-xs font-medium text-text-muted mb-1">Train vs Test Error</div>
			<svg viewBox="0 0 {WIDTH} {HEIGHT}" class="w-full rounded-lg bg-bg/50">
				<line
					x1={degToSX(complexity)} y1={PADDING} x2={degToSX(complexity)} y2={HEIGHT - PADDING}
					stroke="var(--color-text-dim)" stroke-width="1" stroke-dasharray="4,3"
				/>
				<path d={trainErrPath} fill="none" stroke="var(--color-accent-blue)" stroke-width="2" />
				<path d={testErrPath} fill="none" stroke="var(--color-accent-amber)" stroke-width="2" />
				<text x={WIDTH - PADDING + 5} y={PADDING + 10} fill="var(--color-text-dim)" font-size="9">error</text>
				<text x={WIDTH / 2} y={HEIGHT - 5} text-anchor="middle" fill="var(--color-text-dim)" font-size="9">complexity</text>
				<circle cx={degToSX(sweetSpot.deg)} cy={errorToSY(sweetSpot.test)} r="5" fill="none" stroke="var(--color-success)" stroke-width="2" />
				<text x={degToSX(sweetSpot.deg) + 8} y={errorToSY(sweetSpot.test) - 5} fill="var(--color-success)" font-size="9">best</text>
				<text x={degToSX(2)} y={PADDING + 15} text-anchor="middle" fill="var(--color-text-dim)" font-size="9">underfit</text>
				<text x={degToSX(12)} y={PADDING + 15} text-anchor="middle" fill="var(--color-text-dim)" font-size="9">overfit</text>
			</svg>
			<div class="mt-1 flex gap-4 text-xs">
				<span class="flex items-center gap-1"><span class="inline-block w-3 h-0.5 bg-accent-blue"></span> train</span>
				<span class="flex items-center gap-1"><span class="inline-block w-3 h-0.5 bg-accent-amber"></span> test</span>
			</div>
		</div>
	</div>
</div>
