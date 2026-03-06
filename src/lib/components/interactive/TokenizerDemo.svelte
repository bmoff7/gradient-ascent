<script lang="ts">
	let inputText = $state("The quick brown fox jumps over the lazy dog.");
	let mode = $state<'word' | 'bpe' | 'character'>('bpe');

	// Simple BPE-like vocabulary (pre-trained common subwords)
	const bpeVocab = [
		'the', 'The', 'ing', 'tion', 'er', 'ed', 'es', 'al', 'ly', 'ment',
		'qu', 'ick', 'br', 'own', 'fox', 'jump', 'over', 'la', 'zy', 'dog',
		'cat', 'sat', 'mat', 'hat', 'run', 'walk', 'talk', 'fast', 'slow',
		'Hel', 'lo', 'wor', 'ld', 'art', 'ific', 'ial', 'int', 'ell', 'ig',
		'ence', 'learn', 'mach', 'ine', 'deep', 'neur', 'net', 'work',
		'trans', 'form', 'att', 'ent', 'ion', 'self', 'pre', 'train',
		'mod', 'el', 'tok', 'en', 'iz', 'dat', 'pro', 'gram', 'comp', 'ut',
		' ', '.', ',', '!', '?', "'", '"', '-', ':', ';',
		'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
		'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
		'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
		'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
		'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
	];

	function tokenizeWord(text: string): string[] {
		return text.split(/(\s+)/).filter(t => t.length > 0);
	}

	function tokenizeCharacter(text: string): string[] {
		return text.split('');
	}

	function tokenizeBPE(text: string): string[] {
		const tokens: string[] = [];
		let remaining = text;

		while (remaining.length > 0) {
			let bestMatch = '';
			// Greedy: find longest matching token in vocab
			for (const token of bpeVocab) {
				if (remaining.startsWith(token) && token.length > bestMatch.length) {
					bestMatch = token;
				}
			}
			if (bestMatch.length === 0) {
				// Unknown character, take one char
				tokens.push(remaining[0]);
				remaining = remaining.slice(1);
			} else {
				tokens.push(bestMatch);
				remaining = remaining.slice(bestMatch.length);
			}
		}
		return tokens;
	}

	let tokens = $derived.by(() => {
		if (mode === 'word') return tokenizeWord(inputText);
		if (mode === 'character') return tokenizeCharacter(inputText);
		return tokenizeBPE(inputText);
	});

	// Color each token distinctly
	const tokenColors = [
		'#c9553d', '#5b8c9e', '#7a9e7e', '#d4a955', '#8b7eb8',
		'#c78d4e', '#b86b7a', '#5b8c9e', '#c9553d', '#7a9e7e',
		'#d4a955', '#8b7eb8', '#c78d4e', '#b86b7a', '#5b8c9e',
	];

	function getTokenColor(index: number): string {
		return tokenColors[index % tokenColors.length];
	}

	const examples = [
		"The quick brown fox jumps over the lazy dog.",
		"Artificial intelligence is transforming the world.",
		"Tokenization breaks text into smaller pieces.",
		"GPT models use byte-pair encoding for tokenization.",
		"Hello, world! How are you today?",
	];
</script>

<div>
	<div class="lab-controls">
		<div class="flex flex-col gap-1">
			<label class="text-xs text-text-muted">Tokenization Method</label>
			<div class="flex gap-1">
				{#each [['word', 'Word'], ['bpe', 'BPE'], ['character', 'Character']] as [val, label]}
					<button
						onclick={() => mode = val as 'word' | 'bpe' | 'character'}
						class="rounded-md px-3 py-1.5 text-xs font-medium transition-colors
							{mode === val ? 'bg-primary text-white' : 'border border-border bg-bg-elevated text-text-muted hover:bg-bg-hover'}"
					>
						{label}
					</button>
				{/each}
			</div>
		</div>
		<div class="flex flex-col gap-1">
			<label class="text-xs text-text-muted">Try an example</label>
			<select
				onchange={(e) => { inputText = e.currentTarget.value; }}
				class="rounded-md border border-border bg-bg-elevated px-2 py-1.5 text-xs"
			>
				{#each examples as ex}
					<option value={ex}>{ex.slice(0, 40)}...</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- Input -->
	<div class="mb-4">
		<label class="text-xs text-text-dim mb-1 block">Input Text</label>
		<textarea
			bind:value={inputText}
			rows="2"
			class="w-full rounded-md border border-border bg-bg-elevated px-3 py-2 text-sm outline-none focus:border-primary resize-none"
		></textarea>
	</div>

	<!-- Tokenized output -->
	<div class="mb-4">
		<label class="text-xs text-text-dim mb-1 block">Tokens ({tokens.length})</label>
		<div class="flex flex-wrap gap-1 rounded-md border border-border bg-bg-card p-3 min-h-[3rem]">
			{#each tokens as token, i}
				<span
					class="inline-flex items-center rounded px-1.5 py-0.5 text-sm font-mono"
					style="background: {getTokenColor(i)}18; color: {getTokenColor(i)}; border: 1px solid {getTokenColor(i)}30"
				>
					{token === ' ' ? '\u2423' : token}
				</span>
			{/each}
		</div>
	</div>

	<!-- Token IDs (simulated) -->
	<div class="mb-4">
		<label class="text-xs text-text-dim mb-1 block">Token IDs (simulated)</label>
		<div class="flex flex-wrap gap-1 rounded-md border border-border bg-bg-card p-3 font-mono text-xs text-text-muted">
			[{tokens.map((t, i) => {
				if (mode === 'character') return t.charCodeAt(0);
				const vocabIdx = bpeVocab.indexOf(t);
				return vocabIdx >= 0 ? vocabIdx : '?';
			}).join(', ')}]
		</div>
	</div>

	<!-- Stats -->
	<div class="flex gap-6 text-xs text-text-dim">
		<span>Characters: {inputText.length}</span>
		<span>Tokens: {tokens.length}</span>
		<span>Ratio: {inputText.length > 0 ? (inputText.length / tokens.length).toFixed(1) : '0'} chars/token</span>
	</div>
</div>
