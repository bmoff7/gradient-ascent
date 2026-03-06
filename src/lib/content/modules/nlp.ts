import type { Module } from '../types';

const nlp: Module = {
	slug: 'nlp',
	title: 'Natural Language Processing',
	description: 'Making machines understand language: tokenization, embeddings, core NLP tasks, and modern transformer-based approaches.',
	estimatedMinutes: 60,
	xpReward: 75,
	quizXpReward: 50,
	lessons: [
		{
			slug: 'text-to-numbers',
			title: 'From Text to Numbers',
			estimatedMinutes: 12,
			xpReward: 15,
			content: `
# From Text to Numbers

Natural language processing begins with a fundamental challenge: computers work with numbers, but language is made of words. The entire history of NLP can be read as a series of increasingly sophisticated answers to the question: **how do we represent text as numbers?**

## Why Text Is Hard

Text has properties that make it uniquely challenging for computation:

**Variable length.** A sentence can be 3 words or 300. A document can be 1 page or 1000. Unlike images (which can be resized to a fixed grid) or tabular data (which has a fixed number of columns), text has no natural fixed-size representation.

**Discrete symbols.** Words are discrete tokens — "cat" and "car" differ by one letter but have completely different meanings. There is no natural way to say that "cat" is 0.8 closer to "car" than to "democracy." Yet mathematical models need exactly this kind of continuous, graded similarity.

**Combinatorial explosion.** English has roughly 170,000 words in current use. A vocabulary of 50,000 common words, combined into sentences of 20 words, gives 50,000^20 possible sentences — far more than atoms in the observable universe. You cannot enumerate or memorize all possible inputs.

**Ambiguity everywhere.** "Bank" can mean a financial institution or the side of a river. "I saw her duck" can mean you witnessed her waterfowl or watched her lower her head. Meaning depends on context, and context can extend across paragraphs or entire documents.

## Tokenization: The First Step

Before any processing, raw text must be split into discrete units called **tokens**. The choice of tokenization strategy has profound effects on everything downstream.

### Word-Level Tokenization

The simplest approach: split on whitespace and punctuation.

"The cat sat on the mat." → ["The", "cat", "sat", "on", "the", "mat", "."]

**Problem:** The vocabulary is huge (100,000+ words for English), and any word not in the vocabulary — a typo, a new slang term, a name — is an unknown token. This "out-of-vocabulary" (OOV) problem is severe in practice.

### Subword Tokenization

Modern NLP uses **subword tokenization** — algorithms that break words into smaller pieces, learned from data. The most popular algorithm is **Byte-Pair Encoding (BPE)**.

BPE starts with individual characters and iteratively merges the most frequent pairs:
1. Start: ["l", "o", "w", "e", "r"]
2. "l" + "o" is frequent → merge to "lo": ["lo", "w", "e", "r"]
3. "lo" + "w" is frequent → merge to "low": ["low", "e", "r"]
4. "e" + "r" is frequent → merge to "er": ["low", "er"]

After thousands of merges, you get a vocabulary that includes common words as single tokens ("the", "and") and rare words as sequences of subwords ("un" + "believ" + "able").

<!-- interactive:TokenizerDemo -->

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>Subword tokenization elegantly solves the OOV problem. Even a word never seen in training can be broken into known subword pieces. "Cryptocurrency" might become ["cry", "pto", "currency"]. The model can leverage its understanding of the subword pieces to make reasonable predictions about the full word.</div>

### Character-Level Tokenization

The extreme approach: each character is a token. No OOV problem at all, but sequences become very long (a 500-word document is ~2500 characters), making it hard for models to capture long-range dependencies. Some architectures use character-level input with word-level processing via convolutions.

## Bag of Words and TF-IDF

The simplest numerical representation of text is the **bag of words** (BoW): count how many times each word appears, ignoring order.

"The cat sat on the mat" → {the: 2, cat: 1, sat: 1, on: 1, mat: 1}

This creates a sparse vector with one dimension per vocabulary word. Despite discarding all word order, BoW works surprisingly well for tasks like topic classification and spam detection.

**TF-IDF** (Term Frequency-Inverse Document Frequency) improves on raw counts by downweighting words that appear in many documents (like "the", "is", "and") and upweighting distinctive words:

**TF-IDF(word, doc) = TF(word, doc) × log(N / DF(word))**

Where TF is the word frequency in the document, N is the total number of documents, and DF is the number of documents containing the word. A word that appears frequently in one document but rarely across the corpus gets a high score — it is distinctive for that document.

<div class="callout callout-example"><div class="callout-title">Example</div>In a collection of medical papers, the word "patient" appears in nearly every document, so its IDF is low. But "glioblastoma" appears in only a few papers — its IDF is high. TF-IDF would give "glioblastoma" a much higher weight than "patient" when representing papers where it appears, even if "patient" occurs more frequently.</div>
`
		},
		{
			slug: 'word-embeddings',
			title: 'Word Embeddings',
			estimatedMinutes: 12,
			xpReward: 15,
			content: `
# Word Embeddings

Bag-of-words representations treat words as isolated, independent symbols. But words have rich relationships: "king" is to "queen" as "man" is to "woman." "Happy" and "joyful" are near-synonyms. "Bank" is related to both "money" and "river" depending on context. We need representations that capture these relationships.

## The Distributional Hypothesis

The key insight behind modern word embeddings comes from linguist J.R. Firth (1957): **"You shall know a word by the company it keeps."** Words that appear in similar contexts tend to have similar meanings.

"Dog" and "cat" appear in similar contexts: "The ___ sat on the mat," "I fed the ___," "The ___ chased the ball." "Dog" and "telescope" rarely share contexts. This statistical pattern — which words co-occur — is a powerful signal for meaning.

## Word2Vec: Learning Meaning from Context

In 2013, Tomas Mikolov and colleagues at Google released **Word2Vec**, which transformed NLP. The idea: train a neural network to predict a word from its context (or vice versa), and use the learned internal representations as word embeddings.

### Skip-gram Model

Given a target word, predict the surrounding context words. For the sentence "the quick brown fox jumps" with target "brown" and a window of 2:
- Input: "brown"
- Predict: "the", "quick", "fox", "jumps"

The network has a single hidden layer (the embedding layer). After training on billions of words, the embedding vectors capture semantic relationships.

### CBOW (Continuous Bag of Words)

The reverse: given context words, predict the target word. Same training data, opposite direction. CBOW is faster to train; Skip-gram works better for rare words.

## The Magic of Word Vectors

The trained Word2Vec embeddings exhibit remarkable algebraic properties:

**vector("king") - vector("man") + vector("woman") ≈ vector("queen")**

This is not a trick or cherry-picked example — it reflects genuine structure learned from word co-occurrence patterns. The "king → queen" direction in embedding space captures the concept of "gender," and this direction is consistent across many word pairs.

Other discovered relationships:
- **Paris - France + Italy ≈ Rome** (capital city relationship)
- **bigger - big + small ≈ smaller** (comparative form)
- **walking - walked + swam ≈ swimming** (tense transformation)

<!-- interactive:WordEmbeddingExplorer -->

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>Word embeddings learn that meaning can be decomposed into independent dimensions. There is a "gender" direction, a "tense" direction, a "formality" direction, and hundreds of other semantic axes — all discovered automatically from raw text, with no human labeling. This is a striking demonstration that statistical patterns in language encode genuine semantic structure.</div>

## GloVe: Global Vectors

**GloVe** (Global Vectors for Word Representation), developed at Stanford in 2014, takes a different approach. Instead of predicting context words, GloVe directly factorizes the word co-occurrence matrix. If words i and j co-occur frequently, their dot product should be high.

GloVe often produces embeddings similar to Word2Vec in quality, but the training is more principled and parallelizable.

## Limitations of Static Embeddings

Word2Vec and GloVe assign each word a **single, fixed vector** regardless of context. But "bank" in "river bank" and "bank account" should have different representations. These models cannot capture polysemy (multiple meanings).

This limitation was the primary motivation for **contextual embeddings** — models like ELMo and BERT that produce different representations for the same word depending on its surrounding context. We will explore these in the transformers and LLM modules.
`
		},
		{
			slug: 'core-nlp-tasks',
			title: 'Core NLP Tasks',
			estimatedMinutes: 12,
			xpReward: 15,
			content: `
# Core NLP Tasks

NLP encompasses a wide range of tasks, from simple classification to complex generation. Understanding the landscape of tasks helps you know what tools to reach for when solving real-world problems.

## Text Classification

**Goal:** Assign one or more labels to a text.

This is the most common and practical NLP task. Examples:
- **Sentiment analysis:** Is this review positive, negative, or neutral?
- **Spam detection:** Is this email spam?
- **Topic classification:** Is this article about sports, politics, or science?
- **Intent classification:** Does this user query want to book a flight, check weather, or ask a question?

**Approaches:**
- **Traditional:** TF-IDF features + logistic regression or SVM. Still competitive for many tasks.
- **Deep learning:** Fine-tune a pre-trained transformer (BERT, RoBERTa) on labeled examples. State-of-the-art for most benchmarks.
- **Zero/few-shot:** Use an LLM with a prompt: "Classify this text as positive or negative: [text]." No training data needed.

## Named Entity Recognition (NER)

**Goal:** Identify and classify named entities in text.

"Barack Obama was born in Honolulu, Hawaii on August 4, 1961."
→ [Barack Obama: PERSON], [Honolulu: LOCATION], [Hawaii: LOCATION], [August 4, 1961: DATE]

NER is a **token-level classification** task — each word gets a label. The standard labeling scheme is BIO:
- **B-PER:** Beginning of a person name
- **I-PER:** Inside (continuation of) a person name
- **O:** Outside any entity

Modern NER systems achieve 90%+ F1 on standard benchmarks, but performance degrades on domain-specific text (medical, legal) where entities are different from training data.

## Machine Translation

**Goal:** Translate text from one language to another.

Machine translation was one of the original motivations for AI research (dating back to the 1950s). The modern approach:

**Encoder-decoder transformers** — the encoder processes the source language, the decoder generates the target language, with cross-attention connecting them. The model is trained on millions of parallel sentence pairs (e.g., English-French sentence pairs from EU parliament proceedings).

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>Modern neural machine translation systems can produce fluent, natural-sounding translations for high-resource language pairs (English-French, English-German). But they still struggle with low-resource languages, idioms, cultural references, and texts that require deep world knowledge. Translation is not a solved problem — it is a spectrum from "good enough for tourists" to "publication-quality literary translation," and current systems excel at the former but not the latter.</div>

## Question Answering

**Goal:** Given a question (and optionally a context passage), produce an answer.

**Extractive QA:** The answer is a span in the provided context. "What year was Obama born?" + context → "1961" (extracted from the passage).

**Abstractive QA:** The answer is generated, not extracted. May combine information from multiple sources or rephrase.

**Open-domain QA:** No context is provided. The system must retrieve relevant documents and then extract or generate an answer. This is how search engines increasingly work.

## Text Summarization

**Goal:** Produce a shorter version of a text that preserves the key information.

**Extractive summarization:** Select the most important sentences from the original text. Simpler but limited — the summary reads like a collection of disjointed sentences.

**Abstractive summarization:** Generate a new, condensed version in the model's own words. Harder but produces more natural summaries. LLMs excel at this.

## Sequence Labeling: POS Tagging and Parsing

**Part-of-speech (POS) tagging** assigns grammatical labels to each word: noun, verb, adjective, etc.

"The quick brown fox jumps" → [DET, ADJ, ADJ, NOUN, VERB]

**Dependency parsing** identifies grammatical relationships between words: "fox" is the subject of "jumps," "quick" and "brown" modify "fox."

These tasks were central to traditional NLP but are less prominent in the era of large pre-trained models, which learn grammatical structure implicitly.
`
		},
		{
			slug: 'transformers-for-nlp',
			title: 'Transformers for NLP',
			estimatedMinutes: 12,
			xpReward: 15,
			content: `
# Transformers for NLP

The transformer architecture, introduced in 2017, revolutionized NLP. Within two years, transformers replaced RNNs and LSTMs as the dominant architecture for virtually every NLP task. The key innovation — **self-attention** — allows the model to directly relate any word to any other word, regardless of distance.

## BERT: Bidirectional Understanding

**BERT** (Bidirectional Encoder Representations from Transformers), released by Google in 2018, was the first model to demonstrate that pre-training a transformer on unlabeled text, then fine-tuning on downstream tasks, could achieve state-of-the-art results across a wide range of NLP benchmarks.

**Pre-training objectives:**
1. **Masked Language Modeling (MLM):** Randomly mask 15% of tokens and predict them. "The [MASK] sat on the [MASK]" → predict "cat", "mat". Unlike left-to-right language models, BERT sees context from both directions.
2. **Next Sentence Prediction (NSP):** Given two sentences, predict whether the second follows the first in the original text. This was later found to be less important than MLM.

**Fine-tuning:** After pre-training on massive text corpora, BERT is fine-tuned on specific tasks by adding a small output layer and training on labeled examples. The pre-trained weights provide a powerful initialization that captures general language understanding.

BERT-base has 110M parameters. BERT-large has 340M. At the time, these were considered enormous. By today's standards, they are tiny.

## GPT: Generative Pre-training

While BERT uses an encoder-only architecture with bidirectional attention, the **GPT** (Generative Pre-trained Transformer) family uses a decoder-only architecture with causal (left-to-right) attention.

**GPT's advantage:** It can generate text. Because it is trained to predict the next token, it can produce coherent text by repeatedly predicting the next word.

**GPT's tradeoff:** For understanding tasks (classification, NER), bidirectional models like BERT have an inherent advantage because they can use both left and right context simultaneously. For generation tasks, GPT has the advantage because it is natively autoregressive.

As models scaled up (GPT-2 at 1.5B parameters, GPT-3 at 175B, GPT-4 at reportedly trillions), the generative approach proved increasingly powerful, eventually achieving strong performance on understanding tasks too — often through in-context learning rather than fine-tuning.

## The Fine-Tuning Revolution

BERT introduced a paradigm shift in NLP:

**Before BERT:** For each NLP task, you designed a custom architecture, trained from scratch, and needed a large labeled dataset. Progress was slow and task-specific.

**After BERT:** Pre-train one model on a massive unlabeled corpus, then fine-tune it for any downstream task with a small amount of labeled data. The same pre-trained model can become a sentiment classifier, a named entity recognizer, a question answerer, or a translation system.

This is **transfer learning** for NLP — the idea that knowledge learned from one task (predicting masked words) transfers to other tasks (sentiment analysis, question answering). The pre-trained model captures general language understanding that is useful everywhere.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>The transformer revolution in NLP was not primarily about architecture — it was about scale and pre-training. The self-attention mechanism is important, but the real breakthrough was demonstrating that pre-training on massive unlabeled text creates representations that transfer effectively to any downstream task. This shifted NLP from a field of specialized models to a field of foundation models.</div>

## Modern NLP Pipeline

Today's NLP pipeline typically looks like:

1. **Choose a pre-trained model** (BERT for understanding, GPT for generation, T5/BART for both)
2. **Tokenize** input text using the model's tokenizer
3. **Fine-tune** on your specific task with labeled examples (or use prompting/in-context learning for LLMs)
4. **Evaluate** on held-out test data
5. **Deploy** with appropriate optimizations (quantization, distillation, caching)

For many tasks, off-the-shelf LLMs with good prompts now match or exceed fine-tuned BERT models, though fine-tuned models are cheaper to run at scale and may be preferred for production systems with high volume.
`
		},
		{
			slug: 'advanced-nlp',
			title: 'Advanced NLP Topics',
			estimatedMinutes: 12,
			xpReward: 15,
			content: `
# Advanced NLP Topics

Beyond the core tasks and architectures, several advanced topics are reshaping how we think about and build NLP systems.

## Retrieval-Augmented Generation (RAG)

LLMs have a critical limitation: their knowledge is frozen at the time of training. They cannot access information that post-dates their training data, and they may hallucinate facts they are uncertain about.

**RAG** addresses this by combining retrieval with generation:
1. **Query:** The user asks a question.
2. **Retrieve:** A retrieval system searches a knowledge base (documents, databases, APIs) for relevant information.
3. **Generate:** The LLM generates an answer conditioned on both the query and the retrieved information.

This approach gives LLMs access to current, domain-specific information while maintaining their fluent generation abilities. RAG is now the standard approach for building knowledge-grounded AI systems.

<div class="callout callout-example"><div class="callout-title">Example</div>A customer support chatbot using RAG: when a customer asks "What's the return policy for electronics?", the system retrieves the company's actual return policy document and generates a response based on it — rather than relying on the LLM's training data, which might be outdated or wrong.</div>

## Evaluation Metrics

Evaluating NLP systems is notoriously difficult. Common metrics:

**Accuracy/F1 for classification:** Straightforward for tasks with clear right/wrong answers (sentiment, NER, NLI).

**BLEU (Bilingual Evaluation Understudy):** For machine translation — measures n-gram overlap between the generated translation and reference translations. Widely used but poorly correlated with human judgments for modern, fluent systems.

**ROUGE (Recall-Oriented Understudy for Gisting Evaluation):** For summarization — measures overlap between generated and reference summaries. Variants include ROUGE-1 (unigram), ROUGE-2 (bigram), and ROUGE-L (longest common subsequence).

**Perplexity:** For language models — measures how "surprised" the model is by test data. Lower perplexity means better prediction. Perplexity of 1 means the model perfectly predicts every token.

**Human evaluation:** The gold standard but expensive and subjective. Common dimensions: fluency, coherence, relevance, factual accuracy.

## Prompt Engineering

With the rise of large language models, **prompt engineering** has become a crucial skill — designing inputs that elicit the desired outputs.

**Zero-shot prompting:** "Classify this movie review as positive or negative: [review]"

**Few-shot prompting:** Provide examples before the query:
"Review: Great movie! → Positive
Review: Terrible waste of time. → Negative
Review: [new review] → "

**Chain-of-thought prompting:** "Think step by step" — encouraging the model to show its reasoning, which often improves accuracy on complex tasks.

**System prompts:** Setting the model's role and constraints: "You are a medical assistant. Answer questions about symptoms using simple language. Always recommend consulting a doctor for diagnosis."

## Multilingual NLP

Modern transformer models can be trained on text from many languages simultaneously. **mBERT** (multilingual BERT) was trained on 104 languages. **XLM-RoBERTa** improved on this approach.

A remarkable finding: models trained on multiple languages develop **cross-lingual representations** — the internal representations for semantically similar words in different languages are close in embedding space, even without explicit alignment. This enables **zero-shot cross-lingual transfer**: fine-tune on English data, test on French, and get reasonable performance.

<div class="callout callout-think"><div class="callout-title">Think About It</div>Why would a model develop cross-lingual representations without explicit alignment? One hypothesis: many languages share structural patterns (subject-verb-object order, modifier-noun patterns), and the model discovers these universal patterns. Additionally, shared vocabulary (borrowed words, proper nouns, numbers) provides anchoring points between languages.</div>

## The Future of NLP

NLP is converging with general AI. The boundary between "NLP" and "AI" is blurring:

- **Multimodal models** process text alongside images, audio, and video
- **Tool-using LLMs** can search the web, run code, and call APIs
- **Reasoning models** can solve complex problems through step-by-step reasoning
- **Personalized models** adapt to individual users' writing styles and preferences

The field is moving from "understanding language" to "understanding and interacting with the world through language."
`
		}
	],
	quiz: {
		passingScore: 70,
		questions: [
			{
				id: 'nlp-q1',
				type: 'multiple-choice',
				question: 'What problem does subword tokenization (like BPE) solve?',
				options: [
					'It makes text shorter',
					'It solves the out-of-vocabulary problem',
					'It translates between languages',
					'It removes stop words'
				],
				correctIndex: 1,
				explanation: 'BPE breaks unknown words into known subword pieces, so even words never seen during training can be represented and processed.'
			},
			{
				id: 'nlp-q2',
				type: 'multiple-choice',
				question: 'What famous algebraic property do Word2Vec embeddings exhibit?',
				options: [
					'All vectors have the same length',
					'Semantic relationships can be expressed as vector arithmetic (e.g., king - man + woman ≈ queen)',
					'All words map to the same point',
					'Word vectors are always orthogonal'
				],
				correctIndex: 1,
				explanation: 'Word2Vec embeddings capture semantic relationships as directions in vector space, allowing analogy-solving through simple arithmetic.'
			},
			{
				id: 'nlp-q3',
				type: 'multiple-choice',
				question: 'What was BERT\'s primary pre-training objective?',
				options: [
					'Next token prediction',
					'Image classification',
					'Masked Language Modeling (MLM)',
					'Machine translation'
				],
				correctIndex: 2,
				explanation: 'BERT was pre-trained by randomly masking tokens and predicting them, allowing it to use bidirectional context.'
			},
			{
				id: 'nlp-q4',
				type: 'multiple-choice',
				question: 'What does RAG stand for in modern NLP?',
				options: [
					'Random Access Generation',
					'Retrieval-Augmented Generation',
					'Recursive Attention Graph',
					'Real-time Adaptive Grammar'
				],
				correctIndex: 1,
				explanation: 'RAG combines information retrieval with language generation to give LLMs access to current, domain-specific knowledge.'
			},
			{
				id: 'nlp-q5',
				type: 'ordering',
				question: 'Order the NLP representation techniques from earliest/simplest to most modern:',
				items: ['Bag of Words', 'TF-IDF', 'Word2Vec embeddings', 'Contextual embeddings (BERT)'],
				correctOrder: [0, 1, 2, 3],
				explanation: 'NLP representations evolved from simple word counts (BoW) to weighted counts (TF-IDF) to static dense vectors (Word2Vec) to context-dependent representations (BERT).'
			}
		]
	}
};

export default nlp;
