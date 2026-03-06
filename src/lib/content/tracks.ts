import type { Track } from './types';

export const tracks: Track[] = [
	{
		slug: 'base-camp',
		title: 'Base Camp',
		subtitle: 'Foundations',
		description:
			'Start your journey with the fundamentals. Understand what intelligence means, explore the rich history of AI, build your mathematical toolkit, and set up your programming environment.',
		color: '#c9553d',
		colorTo: '#e07a5f',
		icon: 'I',
		order: 1,
		modules: [
			{
				slug: 'what-is-intelligence',
				title: 'What is Intelligence?',
				description:
					'Explore the nature of intelligence — from human cognition to the question of whether machines can truly think.',
				estimatedMinutes: 45,
				lessonsCount: 4,
				xpReward: 60
			},
			{
				slug: 'history-of-ai',
				title: 'The History of AI',
				description:
					'A deep dive into the fascinating story of artificial intelligence, from ancient automata to modern language models.',
				estimatedMinutes: 120,
				lessonsCount: 9,
				xpReward: 135
			},
			{
				slug: 'math-for-ai',
				title: 'Mathematics for AI',
				description:
					'Build the mathematical intuition you need — linear algebra, calculus, probability, and information theory.',
				estimatedMinutes: 75,
				lessonsCount: 5,
				xpReward: 75
			},
			{
				slug: 'programming-for-ai',
				title: 'Programming for AI',
				description:
					'Set up your toolkit: Python, NumPy, Pandas, visualization, and your development environment.',
				estimatedMinutes: 60,
				lessonsCount: 5,
				xpReward: 75
			}
		]
	},
	{
		slug: 'the-ascent',
		title: 'The Ascent',
		subtitle: 'Core Machine Learning',
		description:
			'Learn the core concepts and algorithms of machine learning. From supervised and unsupervised learning to feature engineering, build the skills that every ML practitioner needs.',
		color: '#c78d4e',
		colorTo: '#d4a955',
		icon: 'II',
		order: 2,
		modules: [
			{
				slug: 'intro-to-ml',
				title: 'Introduction to Machine Learning',
				description:
					'Understand what machine learning is, how it works, and the fundamental concepts that underpin every ML system.',
				estimatedMinutes: 60,
				lessonsCount: 5,
				xpReward: 75
			},
			{
				slug: 'supervised-learning',
				title: 'Supervised Learning',
				description:
					'Master the algorithms that learn from labeled data: regression, classification, trees, SVMs, and more.',
				estimatedMinutes: 90,
				lessonsCount: 7,
				xpReward: 105
			},
			{
				slug: 'unsupervised-learning',
				title: 'Unsupervised Learning',
				description:
					'Discover hidden patterns: clustering, dimensionality reduction, anomaly detection.',
				estimatedMinutes: 60,
				lessonsCount: 5,
				xpReward: 75
			},
			{
				slug: 'feature-engineering',
				title: 'Feature Engineering & Data',
				description:
					'The art and science of preparing data: cleaning, transforming, selecting features, and handling real-world data challenges.',
				estimatedMinutes: 60,
				lessonsCount: 5,
				xpReward: 75
			}
		]
	},
	{
		slug: 'the-steep-climb',
		title: 'The Steep Climb',
		subtitle: 'Deep Learning',
		description:
			'Dive into neural networks and deep learning. Build networks from scratch, understand backpropagation, and master CNNs and RNNs.',
		color: '#d4a955',
		colorTo: '#b89a3e',
		icon: 'III',
		order: 3,
		modules: [
			{
				slug: 'neural-networks',
				title: 'Neural Networks from Scratch',
				description:
					'Build your understanding from a single neuron to deep networks. Perceptrons, activation functions, forward and backward propagation.',
				estimatedMinutes: 90,
				lessonsCount: 6,
				xpReward: 90
			},
			{
				slug: 'training-deep-networks',
				title: 'Training Deep Networks',
				description:
					'Master the art of training: optimizers, regularization, normalization, and hyperparameter tuning.',
				estimatedMinutes: 60,
				lessonsCount: 5,
				xpReward: 75
			},
			{
				slug: 'cnns',
				title: 'Convolutional Neural Networks',
				description:
					'How machines learn to see: convolutions, pooling, landmark architectures, transfer learning, and object detection.',
				estimatedMinutes: 75,
				lessonsCount: 6,
				xpReward: 90
			},
			{
				slug: 'rnns-sequences',
				title: 'RNNs & Sequences',
				description:
					'Processing sequential data: vanilla RNNs, LSTM, GRU, sequence-to-sequence models, and the attention mechanism.',
				estimatedMinutes: 75,
				lessonsCount: 6,
				xpReward: 90
			}
		]
	},
	{
		slug: 'the-summit',
		title: 'The Summit',
		subtitle: 'Modern AI',
		description:
			'Reach the cutting edge. Understand transformers, large language models, generative AI, and reinforcement learning — the technologies reshaping the world.',
		color: '#7a9e7e',
		colorTo: '#5b8c9e',
		icon: 'IV',
		order: 4,
		modules: [
			{
				slug: 'transformers',
				title: 'The Transformer Architecture',
				description:
					'The architecture that changed everything: self-attention, multi-head attention, and the full transformer.',
				estimatedMinutes: 75,
				lessonsCount: 5,
				xpReward: 75
			},
			{
				slug: 'large-language-models',
				title: 'Large Language Models',
				description:
					'Scaling laws, pre-training, alignment, prompting, and the LLM landscape.',
				estimatedMinutes: 90,
				lessonsCount: 6,
				xpReward: 90
			},
			{
				slug: 'generative-ai',
				title: 'Generative AI',
				description:
					'VAEs, GANs, diffusion models, text-to-image, and the ethics of generation.',
				estimatedMinutes: 75,
				lessonsCount: 6,
				xpReward: 90
			},
			{
				slug: 'reinforcement-learning',
				title: 'Reinforcement Learning',
				description:
					'Learning by doing: MDPs, Q-learning, deep RL, policy gradients, and AlphaGo.',
				estimatedMinutes: 75,
				lessonsCount: 6,
				xpReward: 90
			}
		]
	},
	{
		slug: 'the-ridge',
		title: 'The Ridge',
		subtitle: 'Applied AI',
		description:
			'Apply your knowledge to real-world domains. Natural language processing, computer vision, production ML systems, ethics, and autonomous agents.',
		color: '#5b8c9e',
		colorTo: '#8b7eb8',
		icon: 'V',
		order: 5,
		modules: [
			{
				slug: 'nlp',
				title: 'Natural Language Processing',
				description:
					'Making machines understand language: tokenization, embeddings, core NLP tasks, and modern transformer-based approaches.',
				estimatedMinutes: 60,
				lessonsCount: 5,
				xpReward: 75
			},
			{
				slug: 'computer-vision',
				title: 'Computer Vision',
				description:
					'Teaching machines to see: classification, detection, segmentation, and vision in the wild.',
				estimatedMinutes: 60,
				lessonsCount: 5,
				xpReward: 75
			},
			{
				slug: 'mlops',
				title: 'MLOps: Lab to Production',
				description:
					'Shipping ML systems: data pipelines, training infrastructure, deployment, monitoring.',
				estimatedMinutes: 60,
				lessonsCount: 5,
				xpReward: 75
			},
			{
				slug: 'ethics-safety',
				title: 'AI Ethics & Safety',
				description:
					'Responsible AI: bias, fairness, transparency, alignment, and governance.',
				estimatedMinutes: 60,
				lessonsCount: 5,
				xpReward: 75
			},
			{
				slug: 'ai-agents',
				title: 'AI Agents',
				description:
					'From chatbots to autonomous systems: tool use, planning, multi-agent systems, and robotics.',
				estimatedMinutes: 60,
				lessonsCount: 5,
				xpReward: 75
			}
		]
	},
	{
		slug: 'beyond-the-peak',
		title: 'Beyond the Peak',
		subtitle: 'The Frontier',
		description:
			'Explore the bleeding edge and the future of AI. Multimodal models, neurosymbolic approaches, quantum ML, and the path to artificial general intelligence.',
		color: '#8b7eb8',
		colorTo: '#b86b7a',
		icon: 'VI',
		order: 6,
		modules: [
			{
				slug: 'multimodal-ai',
				title: 'Multimodal AI',
				description:
					'Beyond text: vision-language models, audio AI, and unified multimodal systems.',
				estimatedMinutes: 45,
				lessonsCount: 4,
				xpReward: 60
			},
			{
				slug: 'neurosymbolic',
				title: 'Neurosymbolic AI',
				description:
					'Combining neural networks with symbolic reasoning: knowledge graphs, hybrid architectures, and compositional AI.',
				estimatedMinutes: 45,
				lessonsCount: 4,
				xpReward: 60
			},
			{
				slug: 'quantum-ml',
				title: 'Quantum Machine Learning',
				description:
					'Quantum computing meets AI: qubits, quantum algorithms, and the current reality.',
				estimatedMinutes: 35,
				lessonsCount: 3,
				xpReward: 45
			},
			{
				slug: 'agi-frontier',
				title: 'The Path to AGI',
				description:
					'Artificial general intelligence: what it is, current approaches, safety challenges, and the future.',
				estimatedMinutes: 45,
				lessonsCount: 4,
				xpReward: 60
			}
		]
	}
];

export function getTrack(slug: string): Track | undefined {
	return tracks.find((t) => t.slug === slug);
}

export function getModuleMeta(moduleSlug: string) {
	for (const track of tracks) {
		const mod = track.modules.find((m) => m.slug === moduleSlug);
		if (mod) return { track, module: mod };
	}
	return undefined;
}

export function getTrackForModule(moduleSlug: string): Track | undefined {
	return tracks.find((t) => t.modules.some((m) => m.slug === moduleSlug));
}

export function getAdjacentModules(trackSlug: string, moduleSlug: string) {
	const track = getTrack(trackSlug);
	if (!track) return { prev: undefined, next: undefined };
	const idx = track.modules.findIndex((m) => m.slug === moduleSlug);
	return {
		prev: idx > 0 ? track.modules[idx - 1] : undefined,
		next: idx < track.modules.length - 1 ? track.modules[idx + 1] : undefined
	};
}
