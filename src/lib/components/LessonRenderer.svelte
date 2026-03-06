<script lang="ts">
	import { marked } from 'marked';
	import GradientDescentLab from './interactive/GradientDescentLab.svelte';
	import NeuralNetworkPlayground from './interactive/NeuralNetworkPlayground.svelte';
	import PerceptronLab from './interactive/PerceptronLab.svelte';
	import ActivationExplorer from './interactive/ActivationExplorer.svelte';
	import ConvolutionDemo from './interactive/ConvolutionDemo.svelte';
	import AttentionVisualizer from './interactive/AttentionVisualizer.svelte';
	import KMeansLab from './interactive/KMeansLab.svelte';
	import OverfittingDemo from './interactive/OverfittingDemo.svelte';
	import DecisionTreeBuilder from './interactive/DecisionTreeBuilder.svelte';
	import ScatterPlotClassifier from './interactive/ScatterPlotClassifier.svelte';
	import MatrixMultiplier from './interactive/MatrixMultiplier.svelte';
	import BackpropVisualizer from './interactive/BackpropVisualizer.svelte';
	import BiasExplorer from './interactive/BiasExplorer.svelte';
	import InteractiveTimeline from './interactive/InteractiveTimeline.svelte';
	import TuringTestChat from './interactive/TuringTestChat.svelte';
	import WordEmbeddingExplorer from './interactive/WordEmbeddingExplorer.svelte';
	import ReinforcementGridWorld from './interactive/ReinforcementGridWorld.svelte';
	import TokenizerDemo from './interactive/TokenizerDemo.svelte';

	let { content }: { content: string } = $props();

	const componentMap: Record<string, any> = {
		GradientDescentLab,
		NeuralNetworkPlayground,
		PerceptronLab,
		ActivationExplorer,
		ConvolutionDemo,
		AttentionVisualizer,
		KMeansLab,
		OverfittingDemo,
		DecisionTreeBuilder,
		ScatterPlotClassifier,
		MatrixMultiplier,
		BackpropVisualizer,
		BiasExplorer,
		InteractiveTimeline,
		TuringTestChat,
		WordEmbeddingExplorer,
		ReinforcementGridWorld,
		TokenizerDemo
	};

	interface ContentSegment {
		type: 'html' | 'interactive';
		content: string;
	}

	let segments = $derived.by(() => {
		const parts: ContentSegment[] = [];
		const regex = /<!-- interactive:(\w+) -->/g;
		let lastIndex = 0;
		let match;

		while ((match = regex.exec(content)) !== null) {
			if (match.index > lastIndex) {
				const md = content.slice(lastIndex, match.index);
				parts.push({ type: 'html', content: marked.parse(md) as string });
			}
			parts.push({ type: 'interactive', content: match[1] });
			lastIndex = regex.lastIndex;
		}

		if (lastIndex < content.length) {
			const md = content.slice(lastIndex);
			parts.push({ type: 'html', content: marked.parse(md) as string });
		}

		return parts;
	});
</script>

<div class="lesson-content">
	{#each segments as segment}
		{#if segment.type === 'html'}
			<div class="prose">{@html segment.content}</div>
		{:else if segment.type === 'interactive'}
			{#if componentMap[segment.content]}
				<div class="lab-container my-8">
					<div class="lab-header">
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
						</svg>
						Interactive Lab: {segment.content.replace(/([A-Z])/g, ' $1').trim()}
					</div>
					{#if segment.content === 'GradientDescentLab'}
						<GradientDescentLab />
					{:else if segment.content === 'NeuralNetworkPlayground'}
						<NeuralNetworkPlayground />
					{:else if segment.content === 'PerceptronLab'}
						<PerceptronLab />
					{:else if segment.content === 'ActivationExplorer'}
						<ActivationExplorer />
					{:else if segment.content === 'ConvolutionDemo'}
						<ConvolutionDemo />
					{:else if segment.content === 'AttentionVisualizer'}
						<AttentionVisualizer />
					{:else if segment.content === 'KMeansLab'}
						<KMeansLab />
					{:else if segment.content === 'OverfittingDemo'}
						<OverfittingDemo />
					{:else if segment.content === 'DecisionTreeBuilder'}
						<DecisionTreeBuilder />
					{:else if segment.content === 'ScatterPlotClassifier'}
						<ScatterPlotClassifier />
					{:else if segment.content === 'MatrixMultiplier'}
						<MatrixMultiplier />
					{:else if segment.content === 'BackpropVisualizer'}
						<BackpropVisualizer />
					{:else if segment.content === 'BiasExplorer'}
						<BiasExplorer />
					{:else if segment.content === 'InteractiveTimeline'}
						<InteractiveTimeline />
					{:else if segment.content === 'TuringTestChat'}
						<TuringTestChat />
					{:else if segment.content === 'WordEmbeddingExplorer'}
						<WordEmbeddingExplorer />
					{:else if segment.content === 'ReinforcementGridWorld'}
						<ReinforcementGridWorld />
					{:else if segment.content === 'TokenizerDemo'}
						<TokenizerDemo />
					{/if}
				</div>
			{/if}
		{/if}
	{/each}
</div>
