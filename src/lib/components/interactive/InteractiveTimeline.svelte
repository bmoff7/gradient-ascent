<script lang="ts">
	interface TimelineEvent {
		year: number;
		title: string;
		description: string;
		era: string;
		color: string;
	}

	const events: TimelineEvent[] = [
		{ year: 1642, title: "Pascal's Calculator", description: 'Blaise Pascal builds the Pascaline, a mechanical calculator — one of the first attempts to mechanize thought.', era: 'Ancient Dream', color: '#64748b' },
		{ year: 1770, title: 'The Mechanical Turk', description: 'Wolfgang von Kempelen creates an "automatic" chess-playing machine. A hoax, but it sparked imaginations about thinking machines.', era: 'Ancient Dream', color: '#64748b' },
		{ year: 1837, title: "Babbage's Analytical Engine", description: 'Charles Babbage designs a general-purpose computing machine. Ada Lovelace writes what many consider the first computer program.', era: 'Ancient Dream', color: '#64748b' },
		{ year: 1854, title: "Boole's Algebra of Logic", description: 'George Boole publishes "An Investigation of the Laws of Thought," creating Boolean algebra — the foundation of digital computing.', era: 'Ancient Dream', color: '#64748b' },
		{ year: 1936, title: 'Turing Machine', description: 'Alan Turing publishes "On Computable Numbers," describing a theoretical machine that can compute anything computable.', era: 'Mathematical Foundations', color: '#3b82f6' },
		{ year: 1943, title: 'McCulloch-Pitts Neuron', description: 'Warren McCulloch and Walter Pitts create the first mathematical model of a biological neuron.', era: 'Mathematical Foundations', color: '#3b82f6' },
		{ year: 1948, title: "Shannon's Information Theory", description: "Claude Shannon publishes 'A Mathematical Theory of Communication,' founding information theory.", era: 'Mathematical Foundations', color: '#3b82f6' },
		{ year: 1950, title: "Turing's Paper", description: 'Alan Turing publishes "Computing Machinery and Intelligence," proposing the Turing Test.', era: 'Birth of AI', color: '#6366f1' },
		{ year: 1956, title: 'Dartmouth Conference', description: 'John McCarthy coins the term "Artificial Intelligence" at a workshop at Dartmouth College. The field is officially born.', era: 'Birth of AI', color: '#6366f1' },
		{ year: 1957, title: 'The Perceptron', description: 'Frank Rosenblatt builds the Mark I Perceptron — the first artificial neural network implemented in hardware.', era: 'Birth of AI', color: '#6366f1' },
		{ year: 1966, title: 'ELIZA', description: 'Joseph Weizenbaum creates ELIZA, a chatbot that simulates a psychotherapist. Many users believe it truly understands them.', era: 'Golden Years', color: '#8b5cf6' },
		{ year: 1969, title: 'Perceptrons (Book)', description: 'Minsky and Papert publish "Perceptrons," proving limitations of single-layer networks. Funding for neural networks collapses.', era: 'First Winter', color: '#94a3b8' },
		{ year: 1973, title: 'Lighthill Report', description: 'Sir James Lighthill delivers a devastating critique of AI research to the British government. The first AI winter begins.', era: 'First Winter', color: '#94a3b8' },
		{ year: 1980, title: 'Expert Systems Rise', description: "R1/XCON deployed at DEC saves the company $40M/year. Expert systems become AI's first commercial success.", era: 'Expert Systems', color: '#f59e0b' },
		{ year: 1986, title: 'Backpropagation', description: 'Rumelhart, Hinton, and Williams publish the backpropagation algorithm, enabling training of multi-layer neural networks.', era: 'Expert Systems', color: '#f59e0b' },
		{ year: 1997, title: 'Deep Blue vs Kasparov', description: 'IBM Deep Blue defeats world chess champion Garry Kasparov. A landmark moment for AI in public consciousness.', era: 'Statistical Turn', color: '#ec4899' },
		{ year: 2006, title: 'Deep Belief Networks', description: 'Geoffrey Hinton publishes breakthrough work on training deep neural networks layer by layer.', era: 'Deep Learning', color: '#ef4444' },
		{ year: 2012, title: 'AlexNet', description: "Alex Krizhevsky's CNN crushes the ImageNet competition by a massive margin, igniting the deep learning revolution.", era: 'Deep Learning', color: '#ef4444' },
		{ year: 2014, title: 'GANs', description: 'Ian Goodfellow introduces Generative Adversarial Networks — two networks competing to generate realistic data.', era: 'Deep Learning', color: '#ef4444' },
		{ year: 2016, title: 'AlphaGo', description: "DeepMind's AlphaGo defeats world Go champion Lee Sedol 4-1. Go was thought to be decades away from AI mastery.", era: 'Deep Learning', color: '#ef4444' },
		{ year: 2017, title: 'Attention Is All You Need', description: 'Vaswani et al. publish the Transformer architecture. It will go on to revolutionize all of AI.', era: 'Transformer Age', color: '#f97316' },
		{ year: 2018, title: 'BERT', description: 'Google releases BERT, showing that pre-training transformers on unlabeled text creates powerful language understanding.', era: 'Transformer Age', color: '#f97316' },
		{ year: 2020, title: 'GPT-3', description: 'OpenAI releases GPT-3 with 175 billion parameters. Its few-shot abilities stun the AI community.', era: 'Transformer Age', color: '#f97316' },
		{ year: 2022, title: 'ChatGPT & Stable Diffusion', description: 'ChatGPT reaches 100M users in 2 months. Stable Diffusion democratizes image generation. AI enters mainstream consciousness.', era: 'Transformer Age', color: '#f97316' },
		{ year: 2024, title: 'Multimodal & Agents', description: 'GPT-4o, Claude 3, Gemini push multimodal capabilities. AI agents begin performing complex multi-step tasks autonomously.', era: 'Transformer Age', color: '#f97316' },
	];

	let selectedEvent = $state<TimelineEvent | null>(null);
	let scrollPos = $state(0);

	const TIMELINE_WIDTH = 3000;
	const HEIGHT = 160;

	function yearToX(year: number): number {
		const minYear = 1640;
		const maxYear = 2026;
		return 40 + ((year - minYear) / (maxYear - minYear)) * (TIMELINE_WIDTH - 80);
	}

	let container: HTMLDivElement;

	const eras = [...new Set(events.map((e) => e.era))];
	const eraData = eras.map((era) => {
		const eraEvents = events.filter((e) => e.era === era);
		return { era, events: eraEvents, startX: yearToX(eraEvents[0].year) - 20, endX: yearToX(eraEvents[eraEvents.length - 1].year) + 20, color: eraEvents[0].color };
	});
</script>

<div>
	<p class="text-xs text-text-dim mb-3">Scroll horizontally to explore. Click events for details.</p>

	<div class="overflow-x-auto rounded-lg bg-bg/50 border border-border" bind:this={container}>
		<svg viewBox="0 0 {TIMELINE_WIDTH} {HEIGHT}" width={TIMELINE_WIDTH} height={HEIGHT}>
			<!-- Timeline base line -->
			<line x1="30" y1="80" x2={TIMELINE_WIDTH - 30} y2="80" stroke="var(--color-border-light)" stroke-width="2" />

			<!-- Era backgrounds -->
			{#each eraData as ed}
				<rect
					x={ed.startX} y="10" width={ed.endX - ed.startX} height={HEIGHT - 20}
					fill={ed.color} opacity="0.04" rx="8"
				/>
				<text x={(ed.startX + ed.endX) / 2} y="25" text-anchor="middle" fill={ed.color} font-size="10" opacity="0.6">
					{ed.era}
				</text>
			{/each}

			<!-- Events -->
			{#each events as event}
				{@const x = yearToX(event.year)}
				{@const isSelected = selectedEvent === event}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<g
					onclick={() => selectedEvent = isSelected ? null : event}
					class="cursor-pointer"
					role="button"
					tabindex="0"
				>
					<!-- Vertical line -->
					<line x1={x} y1="35" x2={x} y2="75" stroke={event.color} stroke-width={isSelected ? 2 : 1} opacity={isSelected ? 1 : 0.5} />

					<!-- Dot -->
					<circle cx={x} cy="80" r={isSelected ? 8 : 5} fill={event.color} stroke="white" stroke-width="2">
						{#if isSelected}
							<animate attributeName="r" values="8;10;8" dur="1s" repeatCount="indefinite" />
						{/if}
					</circle>

					<!-- Year label -->
					<text x={x} y="100" text-anchor="middle" fill="var(--color-text-dim)" font-size="9">
						{event.year}
					</text>

					<!-- Title -->
					<text x={x} y="115" text-anchor="middle" fill="var(--color-text-muted)" font-size="8" font-weight="500">
						{event.title.length > 20 ? event.title.slice(0, 18) + '...' : event.title}
					</text>
				</g>
			{/each}
		</svg>
	</div>

	<!-- Selected event detail -->
	{#if selectedEvent}
		<div class="mt-3 rounded-lg border border-border bg-bg-elevated p-4 animate-achievement-pop">
			<div class="flex items-center gap-2 mb-2">
				<span class="rounded-full px-2 py-0.5 text-xs font-medium" style="background: {selectedEvent.color}20; color: {selectedEvent.color}">
					{selectedEvent.era}
				</span>
				<span class="text-sm font-bold text-text">{selectedEvent.year}</span>
			</div>
			<h4 class="text-base font-semibold mb-1">{selectedEvent.title}</h4>
			<p class="text-sm text-text-muted leading-relaxed">{selectedEvent.description}</p>
		</div>
	{/if}
</div>
