<script lang="ts">
	let sentence = $state('The cat sat on the mat');
	let selectedToken = $state(0);

	let tokens = $derived(sentence.split(' ').filter(Boolean));

	// Simulate attention weights (pre-computed patterns that look realistic)
	function computeAttention(fromIdx: number, toIdx: number, total: number): number {
		// Self-attention pattern: tokens attend to related words
		const distance = Math.abs(fromIdx - toIdx);
		let weight = Math.exp(-distance * 0.3); // Nearby tokens get more attention

		// Boost "the" → noun connections
		const from = tokens[fromIdx]?.toLowerCase() ?? '';
		const to = tokens[toIdx]?.toLowerCase() ?? '';
		if (from === 'the' && ['cat', 'mat', 'dog', 'hat'].includes(to)) weight *= 2;
		if (['cat', 'mat', 'dog', 'sat'].includes(from) && from === to) weight *= 1.5;
		if (to === from) weight *= 1.3; // Self-attention

		return weight;
	}

	let attentionWeights = $derived.by(() => {
		const n = tokens.length;
		if (n === 0) return [];
		const raw: number[] = [];
		let sum = 0;
		for (let i = 0; i < n; i++) {
			const w = computeAttention(selectedToken, i, n);
			raw.push(w);
			sum += w;
		}
		return raw.map((w) => w / sum); // Softmax-like normalization
	});

	const WIDTH = 500;
	const TOKEN_HEIGHT = 40;
	const ROW_GAP = 120;
	const PADDING = 20;

	function tokenX(idx: number, total: number): number {
		const available = WIDTH - 2 * PADDING;
		const gap = available / (total + 1);
		return PADDING + gap * (idx + 1);
	}
</script>

<div>
	<div class="lab-controls">
		<div class="flex flex-col gap-1 flex-1">
			<label class="text-xs text-text-muted">Input sentence:</label>
			<input
				type="text"
				bind:value={sentence}
				class="w-full rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm outline-none focus:border-primary"
				placeholder="Type a sentence..."
			/>
		</div>
	</div>

	<p class="text-xs text-text-dim mb-3">Click a token in the top row to see what it attends to.</p>

	<svg viewBox="0 0 {WIDTH} {ROW_GAP + TOKEN_HEIGHT * 2 + 40}" class="w-full rounded-lg bg-bg/50">
		<!-- Source tokens (top row) -->
		{#each tokens as token, i}
			{@const x = tokenX(i, tokens.length)}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<g
				onclick={() => selectedToken = i}
				class="cursor-pointer"
				role="button"
				tabindex="0"
			>
				<rect
					x={x - 30} y={PADDING} width="60" height={TOKEN_HEIGHT}
					rx="8" fill={selectedToken === i ? 'var(--color-primary)' : 'var(--color-bg-elevated)'}
					stroke={selectedToken === i ? 'var(--color-primary-light)' : 'var(--color-border)'}
					stroke-width="1.5"
				/>
				<text
					x={x} y={PADDING + TOKEN_HEIGHT / 2 + 4}
					text-anchor="middle" fill={selectedToken === i ? 'white' : 'var(--color-text)'}
					font-size="12" font-weight="500"
				>{token}</text>
			</g>
		{/each}

		<!-- Attention lines -->
		{#each tokens as _, i}
			{@const weight = attentionWeights[i] ?? 0}
			{@const fromX = tokenX(selectedToken, tokens.length)}
			{@const toX = tokenX(i, tokens.length)}
			<line
				x1={fromX} y1={PADDING + TOKEN_HEIGHT}
				x2={toX} y2={PADDING + TOKEN_HEIGHT + ROW_GAP}
				stroke="var(--color-primary)"
				stroke-width={1 + weight * 8}
				opacity={0.15 + weight * 0.85}
			/>
		{/each}

		<!-- Target tokens (bottom row) -->
		{#each tokens as token, i}
			{@const x = tokenX(i, tokens.length)}
			{@const weight = attentionWeights[i] ?? 0}
			<rect
				x={x - 30} y={PADDING + TOKEN_HEIGHT + ROW_GAP} width="60" height={TOKEN_HEIGHT}
				rx="8"
				fill="var(--color-bg-elevated)"
				stroke="var(--color-primary)"
				stroke-width={0.5 + weight * 3}
				opacity={0.3 + weight * 0.7}
			/>
			<text
				x={x} y={PADDING + TOKEN_HEIGHT + ROW_GAP + TOKEN_HEIGHT / 2 + 4}
				text-anchor="middle" fill="var(--color-text)"
				font-size="12" font-weight="500"
				opacity={0.4 + weight * 0.6}
			>{token}</text>
			<!-- Weight label -->
			<text
				x={x} y={PADDING + TOKEN_HEIGHT + ROW_GAP + TOKEN_HEIGHT + 14}
				text-anchor="middle" fill="var(--color-primary-light)"
				font-size="9"
			>{(weight * 100).toFixed(1)}%</text>
		{/each}

		<!-- Labels -->
		<text x={5} y={PADDING + TOKEN_HEIGHT / 2 + 4} fill="var(--color-text-dim)" font-size="9">from</text>
		<text x={5} y={PADDING + TOKEN_HEIGHT + ROW_GAP + TOKEN_HEIGHT / 2 + 4} fill="var(--color-text-dim)" font-size="9">to</text>
	</svg>

	<div class="mt-3 text-xs text-text-muted">
		<strong>"{tokens[selectedToken]}"</strong> attends most to:
		{#each [...attentionWeights].map((w, i) => ({ w, i })).sort((a, b) => b.w - a.w).slice(0, 3) as { w, i }, idx}
			<span class="text-primary-light">"{tokens[i]}"</span> ({(w * 100).toFixed(1)}%){idx < 2 ? ', ' : ''}
		{/each}
	</div>
</div>
