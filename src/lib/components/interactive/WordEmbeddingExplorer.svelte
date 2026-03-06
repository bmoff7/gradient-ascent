<script lang="ts">
	let selectedWord = $state('king');
	let hoveredWord = $state<string | null>(null);

	const WIDTH = 500;
	const HEIGHT = 380;
	const PADDING = 30;

	// Pre-computed 2D embeddings (t-SNE style projection of real-ish relationships)
	const words: { word: string; x: number; y: number; category: string }[] = [
		// Royalty cluster
		{ word: 'king', x: 0.72, y: 0.25, category: 'royalty' },
		{ word: 'queen', x: 0.68, y: 0.18, category: 'royalty' },
		{ word: 'prince', x: 0.78, y: 0.3, category: 'royalty' },
		{ word: 'princess', x: 0.75, y: 0.22, category: 'royalty' },
		{ word: 'throne', x: 0.65, y: 0.32, category: 'royalty' },
		{ word: 'crown', x: 0.7, y: 0.35, category: 'royalty' },
		// Animals cluster
		{ word: 'cat', x: 0.2, y: 0.7, category: 'animal' },
		{ word: 'dog', x: 0.25, y: 0.75, category: 'animal' },
		{ word: 'kitten', x: 0.18, y: 0.65, category: 'animal' },
		{ word: 'puppy', x: 0.28, y: 0.68, category: 'animal' },
		{ word: 'horse', x: 0.32, y: 0.8, category: 'animal' },
		{ word: 'fish', x: 0.15, y: 0.82, category: 'animal' },
		// Food cluster
		{ word: 'bread', x: 0.5, y: 0.65, category: 'food' },
		{ word: 'butter', x: 0.48, y: 0.7, category: 'food' },
		{ word: 'cheese', x: 0.53, y: 0.72, category: 'food' },
		{ word: 'apple', x: 0.45, y: 0.6, category: 'food' },
		{ word: 'rice', x: 0.55, y: 0.68, category: 'food' },
		// City cluster
		{ word: 'paris', x: 0.3, y: 0.2, category: 'place' },
		{ word: 'london', x: 0.35, y: 0.25, category: 'place' },
		{ word: 'tokyo', x: 0.25, y: 0.15, category: 'place' },
		{ word: 'berlin', x: 0.32, y: 0.28, category: 'place' },
		// Country cluster (near cities but offset)
		{ word: 'france', x: 0.3, y: 0.38, category: 'place' },
		{ word: 'england', x: 0.38, y: 0.35, category: 'place' },
		{ word: 'japan', x: 0.22, y: 0.32, category: 'place' },
		{ word: 'germany', x: 0.34, y: 0.42, category: 'place' },
		// Tech cluster
		{ word: 'computer', x: 0.8, y: 0.65, category: 'tech' },
		{ word: 'software', x: 0.82, y: 0.7, category: 'tech' },
		{ word: 'algorithm', x: 0.85, y: 0.6, category: 'tech' },
		{ word: 'network', x: 0.78, y: 0.72, category: 'tech' },
		{ word: 'data', x: 0.83, y: 0.75, category: 'tech' },
	];

	const categoryColors: Record<string, string> = {
		royalty: '#d4a955',
		animal: '#7a9e7e',
		food: '#c78d4e',
		place: '#5b8c9e',
		tech: '#8b7eb8',
	};

	function dist(a: { x: number; y: number }, b: { x: number; y: number }): number {
		return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
	}

	let selected = $derived(words.find(w => w.word === selectedWord));
	let nearest = $derived.by(() => {
		if (!selected) return [];
		return [...words]
			.filter(w => w.word !== selectedWord)
			.sort((a, b) => dist(a, selected!) - dist(b, selected!))
			.slice(0, 5);
	});

	// Analogy: king - man + woman = queen style
	const analogies = [
		{ a: 'king', b: 'queen', c: 'man', d: 'woman', label: 'king : queen :: man : woman' },
		{ a: 'paris', b: 'france', c: 'tokyo', d: 'japan', label: 'paris : france :: tokyo : japan' },
		{ a: 'kitten', b: 'cat', c: 'puppy', d: 'dog', label: 'kitten : cat :: puppy : dog' },
	];
	let currentAnalogy = $state(0);

	let ana = $derived(analogies[currentAnalogy]);
	let anaWordA = $derived(words.find(w => w.word === ana.a));
	let anaWordB = $derived(words.find(w => w.word === ana.b));
	let anaWordC = $derived(words.find(w => w.word === ana.c));
	let anaWordD = $derived(words.find(w => w.word === ana.d));

	function toSX(v: number) { return PADDING + v * (WIDTH - 2 * PADDING); }
	function toSY(v: number) { return PADDING + v * (HEIGHT - 2 * PADDING); }
</script>

<div>
	<div class="lab-controls">
		<div class="flex flex-col gap-1">
			<label class="text-xs text-text-muted">Select a word</label>
			<select bind:value={selectedWord} class="rounded-md border border-border bg-bg-elevated px-2 py-1 text-sm">
				{#each words as w}
					<option value={w.word}>{w.word}</option>
				{/each}
			</select>
		</div>
		<div class="flex flex-col gap-1">
			<label class="text-xs text-text-muted">Analogy</label>
			<select bind:value={currentAnalogy} class="rounded-md border border-border bg-bg-elevated px-2 py-1 text-sm">
				{#each analogies as a, i}
					<option value={i}>{a.label}</option>
				{/each}
			</select>
		</div>
	</div>

	<svg viewBox="0 0 {WIDTH} {HEIGHT}" class="w-full rounded-lg bg-bg/50">
		<!-- Connection lines from selected to nearest -->
		{#if selected}
			{#each nearest as n}
				<line
					x1={toSX(selected.x)} y1={toSY(selected.y)}
					x2={toSX(n.x)} y2={toSY(n.y)}
					stroke="var(--color-border-light)" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"
				/>
			{/each}
		{/if}

		<!-- Analogy arrows -->
		{#if anaWordA && anaWordB}
			<line x1={toSX(anaWordA.x)} y1={toSY(anaWordA.y)} x2={toSX(anaWordB.x)} y2={toSY(anaWordB.y)}
				stroke="var(--color-primary-light)" stroke-width="1.5" opacity="0.6"
				marker-end="url(#embed-arrow)" />
		{/if}
		{#if anaWordC && anaWordD}
			<line x1={toSX(anaWordC.x)} y1={toSY(anaWordC.y)} x2={toSX(anaWordD.x)} y2={toSY(anaWordD.y)}
				stroke="var(--color-primary-light)" stroke-width="1.5" opacity="0.6"
				marker-end="url(#embed-arrow)" />
		{/if}

		<defs>
			<marker id="embed-arrow" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
				<polygon points="0 0, 6 2, 0 4" fill="var(--color-primary-light)" opacity="0.6" />
			</marker>
		</defs>

		<!-- Word dots -->
		{#each words as w}
			{@const isSelected = w.word === selectedWord}
			{@const isNearest = nearest.some(n => n.word === w.word)}
			{@const isHovered = w.word === hoveredWord}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<g
				onclick={() => selectedWord = w.word}
				onmouseenter={() => hoveredWord = w.word}
				onmouseleave={() => hoveredWord = null}
				class="cursor-pointer"
				role="button"
				tabindex="0"
			>
				<circle
					cx={toSX(w.x)} cy={toSY(w.y)}
					r={isSelected ? 7 : isNearest ? 5 : isHovered ? 5 : 3.5}
					fill={categoryColors[w.category]}
					opacity={isSelected ? 1 : isNearest ? 0.9 : 0.5}
					stroke={isSelected ? 'white' : 'none'}
					stroke-width={isSelected ? 2 : 0}
				/>
				{#if isSelected || isNearest || isHovered}
					<text
						x={toSX(w.x)} y={toSY(w.y) - 10}
						text-anchor="middle" fill="var(--color-text)"
						font-size={isSelected ? '11' : '9'} font-weight={isSelected ? '600' : '400'}
					>
						{w.word}
					</text>
				{/if}
			</g>
		{/each}
	</svg>

	<!-- Legend + info -->
	<div class="mt-3 flex flex-wrap gap-3 text-[11px]">
		{#each Object.entries(categoryColors) as [cat, color]}
			<span class="flex items-center gap-1">
				<span class="inline-block h-2 w-2 rounded-full" style="background: {color}"></span>
				{cat}
			</span>
		{/each}
	</div>

	{#if selected}
		<div class="mt-3 text-xs text-text-muted">
			<strong class="text-text">Nearest to "{selectedWord}":</strong>
			{nearest.map(n => n.word).join(', ')}
		</div>
	{/if}
</div>
