<script lang="ts">
	interface TreeNode {
		id: number;
		feature: string;
		threshold: number;
		left: TreeNode | null;
		right: TreeNode | null;
		prediction: number | null;
		depth: number;
		samples: number;
	}

	let splitFeature = $state<'x' | 'y'>('x');
	let splitValue = $state(4);
	let maxDepth = $state(2);

	// Simple dataset
	let data = $state([
		{ x: 1, y: 5, label: 1 }, { x: 2, y: 4, label: 1 }, { x: 1.5, y: 6, label: 1 },
		{ x: 3, y: 5, label: 1 }, { x: 2, y: 3, label: 1 },
		{ x: 5, y: 2, label: 0 }, { x: 6, y: 1, label: 0 }, { x: 5.5, y: 3, label: 0 },
		{ x: 7, y: 2, label: 0 }, { x: 6, y: 1.5, label: 0 },
		{ x: 5, y: 6, label: 1 }, { x: 6, y: 5, label: 1 },
		{ x: 2, y: 1, label: 0 }, { x: 3, y: 2, label: 0 }
	]);

	function gini(labels: number[]): number {
		if (labels.length === 0) return 0;
		const p1 = labels.filter((l) => l === 1).length / labels.length;
		return 1 - p1 * p1 - (1 - p1) * (1 - p1);
	}

	function buildTree(points: typeof data, depth: number, nodeId: number): TreeNode {
		const labels = points.map((p) => p.label);
		const majorityClass = labels.filter((l) => l === 1).length > labels.length / 2 ? 1 : 0;

		if (depth >= maxDepth || gini(labels) === 0 || points.length <= 2) {
			return { id: nodeId, feature: '', threshold: 0, left: null, right: null, prediction: majorityClass, depth, samples: points.length };
		}

		let bestGain = -1;
		let bestFeature = 'x';
		let bestThreshold = 0;

		for (const feature of ['x', 'y'] as const) {
			const values = [...new Set(points.map((p) => p[feature]))].sort((a, b) => a - b);
			for (let i = 0; i < values.length - 1; i++) {
				const thresh = (values[i] + values[i + 1]) / 2;
				const leftLabels = points.filter((p) => p[feature] <= thresh).map((p) => p.label);
				const rightLabels = points.filter((p) => p[feature] > thresh).map((p) => p.label);
				if (leftLabels.length === 0 || rightLabels.length === 0) continue;
				const gain = gini(labels) - (leftLabels.length / labels.length) * gini(leftLabels) - (rightLabels.length / labels.length) * gini(rightLabels);
				if (gain > bestGain) {
					bestGain = gain;
					bestFeature = feature;
					bestThreshold = thresh;
				}
			}
		}

		if (bestGain <= 0) {
			return { id: nodeId, feature: '', threshold: 0, left: null, right: null, prediction: majorityClass, depth, samples: points.length };
		}

		const leftPts = points.filter((p) => p[bestFeature as 'x' | 'y'] <= bestThreshold);
		const rightPts = points.filter((p) => p[bestFeature as 'x' | 'y'] > bestThreshold);

		return {
			id: nodeId,
			feature: bestFeature,
			threshold: bestThreshold,
			left: buildTree(leftPts, depth + 1, nodeId * 2 + 1),
			right: buildTree(rightPts, depth + 1, nodeId * 2 + 2),
			prediction: null,
			depth,
			samples: points.length
		};
	}

	let tree = $derived(buildTree(data, 0, 0));

	// Render tree as SVG
	const TREE_W = 450;
	const TREE_H = 200;
	const NODE_R = 24;

	function getNodePositions(node: TreeNode | null, x: number, y: number, spread: number): { node: TreeNode; x: number; y: number }[] {
		if (!node) return [];
		const result = [{ node, x, y }];
		if (node.left) result.push(...getNodePositions(node.left, x - spread, y + 55, spread / 2));
		if (node.right) result.push(...getNodePositions(node.right, x + spread, y + 55, spread / 2));
		return result;
	}

	let nodePositions = $derived(getNodePositions(tree, TREE_W / 2, 30, 100));

	// Scatter plot
	const PLOT_W = 450;
	const PLOT_H = 250;
	const P_PAD = 30;
	function toSX(v: number) { return P_PAD + (v / 8) * (PLOT_W - 2 * P_PAD); }
	function toSY(v: number) { return PLOT_H - P_PAD - (v / 8) * (PLOT_H - 2 * P_PAD); }

	// Get split lines from tree
	function getSplitLines(node: TreeNode | null, xMin: number, xMax: number, yMin: number, yMax: number): { x1: number; y1: number; x2: number; y2: number; color: string }[] {
		if (!node || node.prediction !== null) return [];
		const lines: ReturnType<typeof getSplitLines> = [];
		const colors = ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-accent-amber)'];
		const color = colors[node.depth % colors.length];

		if (node.feature === 'x') {
			lines.push({ x1: toSX(node.threshold), y1: toSY(yMin), x2: toSX(node.threshold), y2: toSY(yMax), color });
			if (node.left) lines.push(...getSplitLines(node.left, xMin, node.threshold, yMin, yMax));
			if (node.right) lines.push(...getSplitLines(node.right, node.threshold, xMax, yMin, yMax));
		} else {
			lines.push({ x1: toSX(xMin), y1: toSY(node.threshold), x2: toSX(xMax), y2: toSY(node.threshold), color });
			if (node.left) lines.push(...getSplitLines(node.left, xMin, xMax, yMin, node.threshold));
			if (node.right) lines.push(...getSplitLines(node.right, xMin, xMax, node.threshold, yMax));
		}
		return lines;
	}

	let splitLines = $derived(getSplitLines(tree, 0, 8, 0, 8));
</script>

<div>
	<div class="lab-controls">
		<div class="flex flex-col gap-1">
			<label class="text-xs text-text-muted">Max Depth: {maxDepth}</label>
			<input type="range" min="1" max="5" step="1" bind:value={maxDepth} class="w-28" />
		</div>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
		<!-- Scatter plot with splits -->
		<div>
			<div class="text-xs font-medium text-text-muted mb-1">Feature Space</div>
			<svg viewBox="0 0 {PLOT_W} {PLOT_H}" class="w-full rounded-lg bg-bg/50">
				{#each [0, 2, 4, 6, 8] as v}
					<line x1={toSX(v)} y1={toSY(0)} x2={toSX(v)} y2={toSY(8)} stroke="var(--color-border)" stroke-width="0.5" />
					<line x1={toSX(0)} y1={toSY(v)} x2={toSX(8)} y2={toSY(v)} stroke="var(--color-border)" stroke-width="0.5" />
				{/each}

				{#each splitLines as line}
					<line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke={line.color} stroke-width="2" stroke-dasharray="6,3" />
				{/each}

				{#each data as p}
					<circle cx={toSX(p.x)} cy={toSY(p.y)} r="5"
						fill={p.label === 1 ? 'var(--color-accent-blue)' : 'var(--color-accent-red)'}
						stroke="white" stroke-width="1"
					/>
				{/each}
			</svg>
		</div>

		<!-- Tree visualization -->
		<div>
			<div class="text-xs font-medium text-text-muted mb-1">Decision Tree</div>
			<svg viewBox="0 0 {TREE_W} {TREE_H}" class="w-full rounded-lg bg-bg/50">
				<!-- Edges -->
				{#each nodePositions as { node: n, x, y }}
					{#if n.left}
						{@const leftPos = nodePositions.find((p) => p.node === n.left)}
						{#if leftPos}
							<line x1={x} y1={y + NODE_R} x2={leftPos.x} y2={leftPos.y - NODE_R} stroke="var(--color-border-light)" stroke-width="1.5" />
						{/if}
					{/if}
					{#if n.right}
						{@const rightPos = nodePositions.find((p) => p.node === n.right)}
						{#if rightPos}
							<line x1={x} y1={y + NODE_R} x2={rightPos.x} y2={rightPos.y - NODE_R} stroke="var(--color-border-light)" stroke-width="1.5" />
						{/if}
					{/if}
				{/each}

				<!-- Nodes -->
				{#each nodePositions as { node: n, x, y }}
					<circle cx={x} cy={y} r={NODE_R}
						fill={n.prediction !== null ? (n.prediction === 1 ? 'rgba(59,130,246,0.2)' : 'rgba(239,68,68,0.2)') : 'var(--color-bg-elevated)'}
						stroke={n.prediction !== null ? (n.prediction === 1 ? 'var(--color-accent-blue)' : 'var(--color-accent-red)') : 'var(--color-border-light)'}
						stroke-width="1.5"
					/>
					{#if n.prediction !== null}
						<text x={x} y={y + 4} text-anchor="middle" fill={n.prediction === 1 ? 'var(--color-accent-blue)' : 'var(--color-accent-red)'} font-size="10" font-weight="600">
							{n.prediction === 1 ? 'Blue' : 'Red'}
						</text>
					{:else}
						<text x={x} y={y - 2} text-anchor="middle" fill="var(--color-text)" font-size="9" font-weight="600">{n.feature}</text>
						<text x={x} y={y + 10} text-anchor="middle" fill="var(--color-text-muted)" font-size="8">≤ {n.threshold.toFixed(1)}</text>
					{/if}
				{/each}
			</svg>
		</div>
	</div>
</div>
