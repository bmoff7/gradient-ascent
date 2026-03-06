<script lang="ts">
	let groupASize = $state(70);
	let groupBSize = $state(30);
	let groupAPositiveRate = $state(0.6);
	let groupBPositiveRate = $state(0.4);
	let threshold = $state(0.5);

	// Simulate model predictions with demographic bias
	function simulate(groupSize: number, truePositiveRate: number) {
		let tp = 0, fp = 0, tn = 0, fn = 0;
		const totalPositive = Math.round(groupSize * truePositiveRate);
		const totalNegative = groupSize - totalPositive;

		// Model has accuracy ~80% but with slight bias
		tp = Math.round(totalPositive * (0.7 + threshold * 0.2));
		fn = totalPositive - tp;
		fp = Math.round(totalNegative * (0.3 - threshold * 0.15));
		tn = totalNegative - fp;

		tp = Math.max(0, tp);
		fn = Math.max(0, fn);
		fp = Math.max(0, fp);
		tn = Math.max(0, tn);

		const accuracy = groupSize > 0 ? (tp + tn) / groupSize : 0;
		const acceptRate = groupSize > 0 ? (tp + fp) / groupSize : 0;
		const precision = (tp + fp) > 0 ? tp / (tp + fp) : 0;
		const recall = (tp + fn) > 0 ? tp / (tp + fn) : 0;
		const fpr = (fp + tn) > 0 ? fp / (fp + tn) : 0;

		return { tp, fp, tn, fn, accuracy, acceptRate, precision, recall, fpr, total: groupSize };
	}

	let groupA = $derived(simulate(groupASize, groupAPositiveRate));
	let groupB = $derived(simulate(groupBSize, groupBPositiveRate));

	let disparateImpact = $derived(
		groupA.acceptRate > 0 ? groupB.acceptRate / groupA.acceptRate : 0
	);

	function barWidth(value: number, max: number) {
		return `${Math.min(100, (value / max) * 100)}%`;
	}
</script>

<div>
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
		<div class="rounded-lg bg-bg-elevated border border-border p-3">
			<div class="text-xs font-semibold text-accent-blue mb-2">Group A</div>
			<div class="flex flex-col gap-2">
				<div>
					<label class="text-xs text-text-muted">Population: {groupASize}%</label>
					<input type="range" min="10" max="90" step="5" bind:value={groupASize} class="w-full" />
				</div>
				<div>
					<label class="text-xs text-text-muted">True positive rate: {(groupAPositiveRate * 100).toFixed(0)}%</label>
					<input type="range" min="0.1" max="0.9" step="0.05" bind:value={groupAPositiveRate} class="w-full" />
				</div>
			</div>
		</div>
		<div class="rounded-lg bg-bg-elevated border border-border p-3">
			<div class="text-xs font-semibold text-accent-purple mb-2">Group B</div>
			<div class="flex flex-col gap-2">
				<div>
					<label class="text-xs text-text-muted">Population: {groupBSize}%</label>
					<input type="range" min="10" max="90" step="5" bind:value={groupBSize} class="w-full" />
				</div>
				<div>
					<label class="text-xs text-text-muted">True positive rate: {(groupBPositiveRate * 100).toFixed(0)}%</label>
					<input type="range" min="0.1" max="0.9" step="0.05" bind:value={groupBPositiveRate} class="w-full" />
				</div>
			</div>
		</div>
	</div>

	<div class="mb-4">
		<label class="text-xs text-text-muted">Decision Threshold: {threshold.toFixed(2)}</label>
		<input type="range" min="0.1" max="0.9" step="0.05" bind:value={threshold} class="w-full" />
	</div>

	<!-- Comparison bars -->
	<div class="space-y-4">
		{#each [
			{ label: 'Acceptance Rate', a: groupA.acceptRate, b: groupB.acceptRate },
			{ label: 'Accuracy', a: groupA.accuracy, b: groupB.accuracy },
			{ label: 'Precision', a: groupA.precision, b: groupB.precision },
			{ label: 'Recall', a: groupA.recall, b: groupB.recall },
			{ label: 'False Positive Rate', a: groupA.fpr, b: groupB.fpr }
		] as metric}
			<div>
				<div class="flex justify-between text-xs text-text-muted mb-1">
					<span>{metric.label}</span>
					<span class="text-text-dim">gap: {Math.abs(metric.a - metric.b).toFixed(3)}</span>
				</div>
				<div class="space-y-1">
					<div class="flex items-center gap-2">
						<span class="w-8 text-xs text-accent-blue text-right">A</span>
						<div class="flex-1 h-4 rounded-full bg-bg-elevated overflow-hidden">
							<div class="h-full rounded-full bg-accent-blue transition-all duration-300" style="width: {barWidth(metric.a, 1)}"></div>
						</div>
						<span class="w-12 text-xs text-right">{(metric.a * 100).toFixed(1)}%</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="w-8 text-xs text-accent-purple text-right">B</span>
						<div class="flex-1 h-4 rounded-full bg-bg-elevated overflow-hidden">
							<div class="h-full rounded-full bg-accent-purple transition-all duration-300" style="width: {barWidth(metric.b, 1)}"></div>
						</div>
						<span class="w-12 text-xs text-right">{(metric.b * 100).toFixed(1)}%</span>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Fairness metrics -->
	<div class="mt-4 rounded-lg border p-3 {disparateImpact >= 0.8 ? 'border-success/30 bg-success/5' : 'border-warning/30 bg-warning/5'}">
		<div class="flex items-center justify-between">
			<div>
				<div class="text-xs font-semibold {disparateImpact >= 0.8 ? 'text-success' : 'text-warning'}">
					Disparate Impact Ratio: {disparateImpact.toFixed(3)}
				</div>
				<div class="text-xs text-text-muted mt-0.5">
					{disparateImpact >= 0.8 ? 'Passes the 4/5 rule (ratio >= 0.8)' : 'Fails the 4/5 rule (ratio < 0.8) — potential bias detected'}
				</div>
			</div>
			<span class="text-2xl">{disparateImpact >= 0.8 ? '✓' : '⚠'}</span>
		</div>
	</div>
</div>
