import type { Module } from '../types';

// Track 1: Base Camp
import whatIsIntelligence from './what-is-intelligence';
import historyOfAI from './history-of-ai';
import mathForAI from './math-for-ai';
import programmingForAI from './programming-for-ai';

// Track 2: The Ascent
import introToML from './intro-to-ml';
import supervisedLearning from './supervised-learning';
import unsupervisedLearning from './unsupervised-learning';
import featureEngineering from './feature-engineering';

// Track 3: The Steep Climb
import neuralNetworks from './neural-networks';
import trainingDeepNetworks from './training-deep-networks';
import cnns from './cnns';
import rnnsSequences from './rnns-sequences';

// Track 4: The Summit
import transformers from './transformers';
import largeLanguageModels from './large-language-models';
import generativeAI from './generative-ai';
import reinforcementLearning from './reinforcement-learning';

// Track 5: The Ridge
import nlp from './nlp';
import computerVision from './computer-vision';
import mlops from './mlops';
import ethicsSafety from './ethics-safety';
import aiAgents from './ai-agents';

// Track 6: Beyond the Peak
import multimodalAI from './multimodal-ai';
import neurosymbolic from './neurosymbolic';
import quantumML from './quantum-ml';
import agiFrontier from './agi-frontier';

export const modules: Record<string, Module> = {
	'what-is-intelligence': whatIsIntelligence,
	'history-of-ai': historyOfAI,
	'math-for-ai': mathForAI,
	'programming-for-ai': programmingForAI,
	'intro-to-ml': introToML,
	'supervised-learning': supervisedLearning,
	'unsupervised-learning': unsupervisedLearning,
	'feature-engineering': featureEngineering,
	'neural-networks': neuralNetworks,
	'training-deep-networks': trainingDeepNetworks,
	cnns: cnns,
	'rnns-sequences': rnnsSequences,
	transformers: transformers,
	'large-language-models': largeLanguageModels,
	'generative-ai': generativeAI,
	'reinforcement-learning': reinforcementLearning,
	nlp: nlp,
	'computer-vision': computerVision,
	mlops: mlops,
	'ethics-safety': ethicsSafety,
	'ai-agents': aiAgents,
	'multimodal-ai': multimodalAI,
	neurosymbolic: neurosymbolic,
	'quantum-ml': quantumML,
	'agi-frontier': agiFrontier
};

export function getModule(slug: string): Module | undefined {
	return modules[slug];
}
