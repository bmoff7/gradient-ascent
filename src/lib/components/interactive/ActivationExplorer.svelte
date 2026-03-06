<script lang="ts">
	type ActivationFn = { name: string; fn: (x: number) => number; color: string; description: string };

	const activations: ActivationFn[] = [
		{ name: 'Sigmoid', fn: (x) => 1 / (1 + Math.exp(-x)), color: '#3b82f6', description: 'Squashes output to (0, 1). Classic but suffers from vanishing gradients.' },
		{ name: 'Tanh', fn: (x) => Math.tanh(x), color: '#8b5cf6', description: 'Squashes to (-1, 1). Zero-centered, stronger gradients than sigmoid.' },
		{ name: 'ReLU', fn: (x) => Math.max(0, x), color: '#10b981', description: 'Simple and effective. Can cause "dead neurons" when inputs are negative.' },
		{ name: 'Leaky ReLU', fn: (x) => x >= 0 ? x : 0.01 * x, color: '#f59e0b', description: 'Fixes the dying ReLU problem with a small slope for negatives.' },
		{ name: 'GELU', fn: (x) => x * 0.5 * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3))), color: '#ec4899', description: 'Smooth approximation used in transformers. Allows small negative values.' },
		{ name: 'Swish', fn: (x) => x / (1 + Math.exp(-x)), color: '#06b6d4', description: 'Self-gated activation. Smooth, non-monotonic. Used in EfficientNet.' }
	];

	let selected = $state<Set<string>>(new Set(['ReLU', 'Sigmoid']));

	const WIDTH = 500;
	const HEIGHT = 300;
	const PADDING = 40;
	const X_MIN = -6;
	const X_MAX = 6;
	const Y_MIN = -2;
	const Y_MAX = 4;

	function toSX(x: number) { return PADDING + ((x - X_MIN) / (X_MAX - X_MIN)) * (WIDTH - 2 * PADDING); }
	function toSY(y: number) { return HEIGHT - PADDING - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (HEIGHT - 2 * PADDING); }

	function getPath(fn: (x: number) => number): string {
		let d = '';
		for (let x = X_MIN; x <= X_MAX; x += 0.05) {
			const y = fn(x);
			const sx = toSX(x);
			const sy = toSY(Math.max(Y_MIN, Math.min(Y_MAX, y)));
			d += (x === X_MIN ? 'M' : 'L') + `${sx},${sy}`;
		}
		return d;
	}

	function toggle(name: string) {
		const next = new Set(selected);
		if (next.has(name)) next.delete(name);
		else next.add(name);
		selected = next;
	}

	let inputX = $state(0);
	let hovering = $state(false);
</script>

<div>
	<div class="flex flex-wrap gap-2 mb-4">
		{#each activations as act}
			<button
				onclick={() => toggle(act.name)}
				class="rounded-full px-3 py-1.5 text-xs font-medium border transition-all
					{selected.has(act.name)
						? 'border-transparent text-white'
						: 'border-border text-text-muted hover:border-border-light'}"
				style={selected.has(act.name) ? `background-color: ${act.color}` : ''}
			>
				{act.name}
			</button>
		{/each}
	</div>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<svg
		viewBox="0 0 {WIDTH} {HEIGHT}"
		class="w-full rounded-lg bg-bg/50"
		onmousemove={(e) => {
			const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
			const sx = (e.clientX - rect.left) / rect.width * WIDTH;
			inputX = X_MIN + ((sx - PADDING) / (WIDTH - 2 * PADDING)) * (X_MAX - X_MIN);
			hovering = true;
		}}
		onmouseleave={() => hovering = false}
	>
		<!-- Grid -->
		{#each [-4, -2, 0, 2, 4] as x}
			<line x1={toSX(x)} y1={toSY(Y_MIN)} x2={toSX(x)} y2={toSY(Y_MAX)} stroke="var(--color-border)" stroke-width="0.5" />
			<text x={toSX(x)} y={toSY(0) + 14} text-anchor="middle" fill="var(--color-text-dim)" font-size="9">{x}</text>
		{/each}
		{#each [-1, 0, 1, 2, 3] as y}
			<line x1={toSX(X_MIN)} y1={toSY(y)} x2={toSX(X_MAX)} y2={toSY(y)} stroke="var(--color-border)" stroke-width="0.5" />
			<text x={toSX(0) - 8} y={toSY(y) + 4} text-anchor="end" fill="var(--color-text-dim)" font-size="9">{y}</text>
		{/each}

		<!-- Axes -->
		<line x1={toSX(X_MIN)} y1={toSY(0)} x2={toSX(X_MAX)} y2={toSY(0)} stroke="var(--color-text-dim)" stroke-width="1" />
		<line x1={toSX(0)} y1={toSY(Y_MIN)} x2={toSX(0)} y2={toSY(Y_MAX)} stroke="var(--color-text-dim)" stroke-width="1" />

		<!-- Activation curves -->
		{#each activations as act}
			{#if selected.has(act.name)}
				<path d={getPath(act.fn)} fill="none" stroke={act.color} stroke-width="2.5" />
			{/if}
		{/each}

		<!-- Hover line -->
		{#if hovering && inputX >= X_MIN && inputX <= X_MAX}
			<line
				x1={toSX(inputX)} y1={toSY(Y_MIN)} x2={toSX(inputX)} y2={toSY(Y_MAX)}
				stroke="var(--color-text-dim)" stroke-width="0.5" stroke-dasharray="3,3"
			/>
			{#each activations as act}
				{#if selected.has(act.name)}
					{@const y = act.fn(inputX)}
					<circle cx={toSX(inputX)} cy={toSY(y)} r="4" fill={act.color} stroke="white" stroke-width="1" />
				{/if}
			{/each}
		{/if}
	</svg>

	<!-- Values readout -->
	{#if hovering}
		<div class="mt-2 flex flex-wrap gap-3 text-xs">
			<span class="text-text-dim">x = {inputX.toFixed(2)}</span>
			{#each activations as act}
				{#if selected.has(act.name)}
					<span style="color: {act.color}">{act.name}: {act.fn(inputX).toFixed(4)}</span>
				{/if}
			{/each}
		</div>
	{/if}

	<!-- Descriptions -->
	<div class="mt-3 space-y-1.5">
		{#each activations as act}
			{#if selected.has(act.name)}
				<div class="flex items-start gap-2 text-xs">
					<div class="mt-1 h-2.5 w-2.5 rounded-full shrink-0" style="background-color: {act.color}"></div>
					<span class="text-text-muted"><strong class="text-text">{act.name}:</strong> {act.description}</span>
				</div>
			{/if}
		{/each}
	</div>
</div>
