import type { Module } from '../types';

const largeLanguageModels: Module = {
	slug: 'large-language-models',
	title: 'Large Language Models',
	description:
		'Explore the world of Large Language Models: scaling laws, pre-training, alignment through RLHF and DPO, prompting techniques, efficient adaptation with LoRA, and the evolving landscape of frontier and open-weight models.',
	estimatedMinutes: 110,
	xpReward: 90,
	quizXpReward: 50,
	lessons: [
		{
			slug: 'what-makes-a-model-large',
			title: 'What Makes a Model "Large"?',
			estimatedMinutes: 18,
			xpReward: 15,
			content: `
## What Makes a Model "Large"?

The word "large" in Large Language Model is not marketing — it is a description of a phenomenon that has redefined what neural networks can do. The story of LLMs is, in many ways, the story of what happens when you make models bigger, train them on more data, and give them more compute. The results have surprised even the researchers who made it happen.

### The Parameter Explosion

A neural network's **parameters** are its learned weights — the millions or billions of numbers adjusted during training that determine the model's behavior. The trajectory of parameter counts in language models is one of the most dramatic exponential curves in technology:

| Model | Year | Parameters |
|-------|------|-----------|
| Word2Vec | 2013 | ~3 million |
| ELMo | 2018 | 94 million |
| BERT-base | 2018 | 110 million |
| GPT-2 | 2019 | 1.5 billion |
| GPT-3 | 2020 | 175 billion |
| PaLM | 2022 | 540 billion |
| Llama 3 405B | 2024 | 405 billion |

In about a decade, parameter counts grew by a factor of more than **100,000x**. This growth was not gradual; it was exponential. And at each major jump in scale, models displayed qualitatively new capabilities that smaller models did not possess.

### Scaling Laws: The Science of "Bigger Is Better"

Is there a principled relationship between model size and performance, or are we just hoping that bigger is better? The answer came in 2020, when Kaplan et al. at OpenAI published their landmark paper on **neural scaling laws**.

They discovered that language model performance (measured by cross-entropy loss on held-out text) follows remarkably clean **power laws** as a function of three variables:

1. **Model size (N)**: Number of parameters. More parameters = lower loss.
2. **Dataset size (D)**: Number of training tokens. More data = lower loss.
3. **Compute budget (C)**: Total floating-point operations. More compute = lower loss.

These are not vague trends — they are smooth, predictable mathematical relationships that hold over many orders of magnitude. Given a compute budget, you can predict what loss your model will achieve before training begins.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>Scaling laws mean that AI progress is partially predictable. If you have 10x more compute than last year, you can estimate how much better your model will be. This predictability is both empowering (for planning research) and sobering (it suggests that massive compute budgets are genuinely necessary for frontier performance).</div>

The Kaplan et al. paper initially suggested that when you have more compute, you should prioritize making the model *bigger* over training it on more data. This advice shaped the development of GPT-3 and similar models — enormous parameter counts trained on "just enough" data.

### The Chinchilla Correction

In 2022, DeepMind published a paper that overturned the Kaplan scaling strategy. The **Chinchilla** paper (Hoffmann et al.) trained a systematic set of models of different sizes on different amounts of data, carefully measuring the relationship between model size, data, and compute.

Their conclusion was stark: **most existing large models were massively undertrained.** GPT-3, with 175 billion parameters, had been trained on about 300 billion tokens. According to Chinchilla's optimal scaling, a 175B model should have been trained on approximately 3.5 trillion tokens — more than 10x what it actually saw.

The paper demonstrated this with a concrete example: **Chinchilla** (70 billion parameters, trained on 1.4 trillion tokens) outperformed **Gopher** (280 billion parameters, trained on 300 billion tokens) on virtually every benchmark — despite being 4x smaller and using the same total compute. The smaller model, trained on proportionally more data, was simply better.

The **Chinchilla-optimal** ratio is approximately **20 tokens per parameter**. A 7B model should see about 140B tokens. A 70B model should see about 1.4T tokens.

<div class="callout callout-think"><div class="callout-title">Think About It</div>This finding had enormous practical implications. Labs shifted from building ever-larger models to building moderately-sized models trained on much more data. Meta's Llama 2 7B was trained on 2 trillion tokens — far beyond Chinchilla-optimal — because inference cost is proportional to model size, and a smaller, well-trained model is cheaper to serve. This led to the concept of "over-training" small models for practical deployment.</div>

### Emergent Abilities

The most philosophically provocative finding about scale is the apparent emergence of qualitatively new abilities at certain model sizes — capabilities that are essentially absent below a threshold and then appear quite suddenly above it.

Documented examples include:

- **Multi-step arithmetic**: Models below ~10B parameters consistently fail at multi-digit addition. Above ~100B, accuracy jumps sharply.
- **Chain-of-thought reasoning**: Prompting a model with "Let's think step by step" only improves performance above a certain scale — below that threshold, it has no effect or even hurts.
- **Analogical reasoning**: The ability to complete analogies like "atom is to molecule as cell is to ___" appears at scale.
- **Code execution tracing**: Mentally "running" code to predict output appears in large models but not small ones.
- **Multi-lingual transfer**: Knowledge learned in English is applied when answering questions in French — but only above a certain scale.

<div class="callout callout-warning"><div class="callout-title">The Emergence Debate</div>Whether these capabilities truly "emerge" (appear discontinuously) or merely appear to emerge because of how we measure them is actively debated. Schaeffer et al. (2023) argued that when performance is measured with smooth, continuous metrics rather than sharp pass/fail cutoffs, improvement looks gradual, not sudden. The truth likely lies somewhere in between — some capabilities genuinely have threshold effects, while others are measurement artifacts.</div>

### Compute Requirements and Cost

Training frontier LLMs is among the most resource-intensive activities in all of computing:

- **GPT-3**: ~3,640 petaflop-days. Estimated cost: $4.6 million (at 2020 cloud prices).
- **PaLM (540B)**: Trained on 6,144 TPU v4 chips. Estimated cost: $8-12 million.
- **Llama 2 70B**: ~1.7 million A100 GPU-hours. Estimated cost: ~$2 million.
- **GPT-4**: Rumored training cost exceeding $100 million.

These costs create a significant barrier to entry. Only a handful of organizations worldwide can afford to train frontier models from scratch. This concentration of capability raises important questions about access, equity, and the distribution of power in AI.

### The Scaling Hypothesis

All of these observations — power-law improvements, emergent abilities, the sheer breadth of what large models can do — have given rise to the **scaling hypothesis**: the idea that sufficient scale (parameters, data, and compute) may be sufficient for achieving increasingly general intelligence, without requiring fundamental architectural breakthroughs.

The strong version of this hypothesis holds that if we simply keep scaling current architectures with current training methods, we will eventually reach artificial general intelligence. The weak version holds that scale is necessary but not sufficient — we will also need new ideas about architecture, training, and perhaps entirely new paradigms.

The debate remains unresolved, and the answer has profound implications for the future of AI research and society.
`
		},
		{
			slug: 'pre-training-learning-language',
			title: 'Pre-training: Learning Language',
			estimatedMinutes: 20,
			xpReward: 15,
			content: `
## Pre-training: Learning Language

Pre-training is the foundation on which everything else rests. It is the phase where a language model is exposed to vast quantities of text and develops its understanding of language, facts, reasoning patterns, and the structure of the world as described by text. This phase consumes the overwhelming majority of the compute budget and determines the ceiling of the model's capabilities.

### Next Token Prediction: The Simplest Powerful Idea

The pre-training objective for decoder-only models (GPT, Claude, Llama) is deceptively simple: **predict the next token.** Given a sequence of tokens, what token comes next?

This is **autoregressive language modeling**. For a training text [t1, t2, t3, ..., tn], the model learns to maximize the probability:

P(t1) * P(t2 | t1) * P(t3 | t1, t2) * ... * P(tn | t1, t2, ..., tn-1)

At each position, the model produces a probability distribution over the entire vocabulary (50,000-100,000+ tokens). The loss function is cross-entropy: how surprised is the model by the actual next token?

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>Next token prediction sounds trivially simple, but consider what the model must learn to do it well. To predict the next word in "The 16th president of the United States was ___," the model must learn historical facts. For "def fibonacci(n): if n <= 1: return ___," it must learn programming. For "The patient's symptoms suggest ___," it must learn medical knowledge. A single, universal objective forces the model to become a general-purpose knowledge store and reasoning engine.</div>

The beauty of this objective is its universality and scalability. Every piece of text on the internet — every Wikipedia article, novel, codebase, forum post, academic paper — becomes training data. No human labeling is required. The supervision is built into the text itself.

<!-- interactive:TokenizerDemo -->

### Masked Language Modeling

Encoder-only models like BERT use a different objective: **Masked Language Modeling (MLM)**. Rather than predicting left to right, the model randomly masks 15% of tokens and predicts them using context from both directions.

For example, given "The [MASK] chased the ball across the [MASK]," the model must predict "dog" and "yard" (or other plausible words) using bidirectional context.

MLM has an advantage: each training example provides supervision at ~15% of positions (versus just one position per step in autoregressive modeling). But it has a disadvantage: it does not produce a generative model — you cannot easily use BERT to generate coherent text because it was not trained to produce tokens sequentially.

<!-- interactive:AttentionVisualizer -->

### Training Data: Quantity, Quality, and Composition

The training data is arguably as important as the architecture itself. Modern LLMs are trained on multi-trillion-token datasets assembled from diverse sources:

**Common Crawl** is the backbone — a massive, continually updated web scrape. In its raw form, Common Crawl is noisy: duplicated pages, spam, low-quality content, even malicious text. Processing it into usable training data requires extensive filtering:
- Language detection and filtering
- Deduplication (removing near-identical pages)
- Quality classification (training a classifier to distinguish "high quality" from "low quality" text)
- Content filtering (removing toxic, illegal, or harmful content)
- URL-based filtering (blacklisting known low-quality domains)

**Books** provide long-form, well-edited, coherent text. They teach the model about narrative structure, sustained argumentation, and domain-specific knowledge. Most major LLMs include book corpora, though the exact sources are often undisclosed due to copyright concerns.

**Wikipedia** is universally included — it is high-quality, factual, well-structured, and available in hundreds of languages. Despite being a small fraction of total training data by volume, Wikipedia likely has outsized influence on factual knowledge.

**Code** from GitHub, GitLab, and StackOverflow is included in most modern LLM training sets. This is not just for code generation — training on code has been shown to significantly improve reasoning and structured problem-solving on non-code tasks. The hypothesis is that code requires precise logical thinking, variable tracking, and compositional reasoning, and these skills transfer to natural language.

<div class="callout callout-example"><div class="callout-title">Data Composition Example</div>Meta's Llama 2 training data breakdown (approximate): 67% web data (filtered Common Crawl), 15% code, 4.5% Wikipedia, 4.5% books, 2% academic papers, 7% other curated sources. The total dataset was approximately 2 trillion tokens. Each source was sampled at different rates — Wikipedia and books were "upsampled" (repeated more often) because of their high quality.</div>

**Academic papers** from ArXiv, PubMed, and Semantic Scholar contribute scientific and technical knowledge.

**Conversational data** (Reddit, forums) teaches the model about dialogue patterns, informal language, and common questions.

### The Data Quality Revolution

A critical lesson from the Chinchilla era is that **data quality matters enormously**. Training on more low-quality data can actually hurt performance — the model wastes capacity on noise and spam. The field has shifted toward aggressive data curation:

- **Deduplication** removes redundant training examples. Redundancy causes the model to memorize rather than generalize, and wastes compute on repeated content.
- **Quality filtering** uses classifier models trained on human judgments of text quality. High-quality text is upsampled; low-quality text is downsampled or removed.
- **Domain balancing** adjusts the proportion of different text types. Too much web data makes the model sound like a generic website; too much academic text makes it overly formal.

### What Models Learn During Pre-training

Through the relentless pressure of next-token prediction across trillions of tokens, LLMs develop remarkably structured internal representations:

**Language structure** — grammar, syntax, morphology — is learned implicitly. The model infers the rules of language from statistical patterns, without ever being taught a grammar textbook. Studies have shown that transformer hidden states encode syntactic parse trees, dependency relations, and morphological features.

**Factual knowledge** — dates, names, scientific facts, geographical information — is stored primarily in the feed-forward layers of the transformer. Research by Meng et al. (2022) showed that specific facts can be localized to specific neurons and even edited directly.

**Reasoning patterns** — logical inference, mathematical reasoning, causal analysis — emerge from exposure to text that demonstrates these patterns: textbooks, proofs, explanations, and especially code.

**World models** — there is growing evidence that LLMs build internal models of the world described by their training data. Othello-GPT (Li et al., 2022) showed that a model trained only on game move sequences developed an internal representation of the board state. Whether this constitutes "understanding" is debated, but the representations are real and structured.

<div class="callout callout-warning"><div class="callout-title">The Cutoff Problem</div>A pre-trained model's knowledge is frozen at the time of training. It knows nothing about events, discoveries, or changes that occurred after its training data was collected. This is why modern deployments often use retrieval-augmented generation (RAG) — letting the model query a database or the web for current information — and why model providers regularly update their training data and release new model versions.</div>

### The Pre-training Pipeline

The engineering behind pre-training at scale is a field unto itself:

1. **Data collection and processing** — months of work to assemble, clean, filter, and deduplicate the training corpus.
2. **Tokenization** — converting raw text into subword tokens using BPE, SentencePiece, or similar algorithms.
3. **Distributed training** — splitting the model across hundreds or thousands of GPUs/TPUs using techniques like data parallelism, tensor parallelism, pipeline parallelism, and expert parallelism.
4. **Monitoring and recovery** — training runs last weeks to months. Hardware failures are inevitable at this scale, so robust checkpointing and automatic restart mechanisms are essential.
5. **Evaluation** — periodically assessing the model on held-out data and downstream benchmarks to track progress and detect issues.

The result of pre-training is a "base model" — a powerful but undirected language predictor. It can continue any text pattern it has seen, but it does not follow instructions, refuse harmful requests, or format its outputs helpfully. Turning this raw capability into a useful assistant is the job of the next phase: alignment.
`
		},
		{
			slug: 'fine-tuning-and-alignment',
			title: 'Fine-tuning and Alignment',
			estimatedMinutes: 20,
			xpReward: 15,
			content: `
## Fine-tuning and Alignment

A pre-trained language model is a remarkable piece of technology — and also a somewhat dangerous one. It has absorbed the full spectrum of human text: the insightful and the toxic, the truthful and the fabricated, the helpful and the harmful. It will cheerfully continue any text pattern, whether that is a helpful explanation or instructions for something dangerous. The process of shaping this raw capability into a safe, helpful, instruction-following assistant is called **alignment**.

### Supervised Fine-Tuning (SFT)

The first alignment step is **supervised fine-tuning (SFT)**. The idea is simple: show the model examples of the behavior you want, and train it to reproduce that behavior.

An SFT dataset consists of (prompt, ideal response) pairs, typically written by skilled human annotators. These examples demonstrate:
- Following instructions precisely and completely
- Providing helpful, detailed, accurate answers
- Refusing harmful, unethical, or illegal requests
- Admitting uncertainty rather than fabricating information
- Formatting responses clearly with appropriate structure
- Being respectful, patient, and constructive

The SFT dataset is tiny compared to pre-training data — perhaps 10,000 to 100,000 examples versus trillions of pre-training tokens. But these examples have outsized impact. They shift the model's behavior from "continue any text pattern" to "respond helpfully to instructions."

<div class="callout callout-think"><div class="callout-title">Think About It</div>Here is an intuition for why SFT works so well with so little data: the pre-trained model already "knows" how to be helpful — it has seen millions of helpful explanations in its training data. It also "knows" how to be harmful. SFT does not teach new knowledge; it teaches the model which *mode* to operate in. It is like a multilingual speaker who knows both French and German — SFT is simply saying "please speak French." The knowledge was always there; SFT activates the right behavioral mode.</div>

### RLHF: Reinforcement Learning from Human Feedback

SFT gets the model most of the way to good behavior, but it has a limitation: writing perfect demonstrations is difficult, expensive, and subjective. It is much easier for humans to *compare* two responses and say which is better than to write the perfect response from scratch. This insight led to **RLHF**, arguably the single most important technique in modern AI alignment.

RLHF has three stages:

**Stage 1: Collect comparison data.** Human annotators are shown a prompt and two (or more) model responses. They rank the responses by quality. These rankings become the training signal.

**Stage 2: Train a reward model.** A separate neural network (often initialized from the LLM itself) is trained to predict human preferences. Given a (prompt, response) pair, it outputs a scalar score — higher for responses that humans prefer. This reward model captures the "shape" of human preference in a differentiable, queryable form.

**Stage 3: Optimize the policy with RL.** The LLM is now the "policy" in a reinforcement learning framework. It generates responses, the reward model scores them, and the model's parameters are updated (using PPO — Proximal Policy Optimization) to increase the probability of high-scoring responses.

A critical addition is a **KL divergence penalty** that constrains the RL-optimized model to stay close to the SFT model. Without this constraint, the model would learn to exploit quirks of the reward model (called "reward hacking") — generating responses that score highly on the reward model but are actually low quality.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>The reward model is the linchpin of RLHF. If the reward model accurately captures human preferences, the resulting LLM will be well-aligned. If the reward model has blind spots or biases, those will be amplified during RL training. This is why reward model quality — and the quality of the human preference data it is trained on — is critically important.</div>

### Constitutional AI (RLAIF)

Anthropic's **Constitutional AI (CAI)** addresses a practical and ethical problem with RLHF: collecting human feedback on harmful content requires humans to read and evaluate harmful text, which is psychologically damaging.

CAI replaces human judgment (in part) with AI judgment, guided by a written **constitution** — a set of explicit principles like "Choose the response that is most helpful," "Choose the response that is least likely to encourage illegal activity," and "Choose the response that best respects user autonomy."

The process:
1. Generate responses to potentially harmful prompts.
2. Ask the model to **critique** its own responses according to the constitutional principles.
3. Ask the model to **revise** its responses based on the critique.
4. Use the revised responses to train a reward model (AI feedback instead of human feedback — hence **RLAIF**).
5. Run RL optimization using this reward model.

The key advantages: the principles are explicit and auditable (you can read the constitution), the feedback loop does not require humans to evaluate harmful content, and the approach scales more easily than human annotation.

### DPO: Direct Preference Optimization

**DPO (Direct Preference Optimization)**, introduced by Rafailov et al. (2023), made a surprising discovery: the complex RLHF pipeline (train reward model, then run PPO) can be mathematically reformulated into a single, elegant objective function that can be optimized directly on preference data.

The insight: under the KL-constrained RLHF objective, the optimal policy has a closed-form relationship with the reward function. DPO exploits this to derive a loss function that takes a preference pair (winning response, losing response) and directly adjusts the model's log-probabilities — increasing the probability of the preferred response and decreasing the probability of the dispreferred one.

DPO's advantages are significant:
- **No reward model needed.** The entire RL pipeline is eliminated.
- **Simpler implementation.** DPO is essentially a supervised learning objective, requiring no RL infrastructure.
- **Stable training.** PPO is notoriously finicky; DPO is straightforward to tune.
- **Competitive results.** DPO matches or approaches RLHF quality on most benchmarks.

Variants have proliferated: **IPO** (Identity Preference Optimization) addresses some theoretical issues with DPO. **KTO** (Kahneman-Tversky Optimization) works with unpaired preference data (just "good" and "bad" examples, without explicit comparisons). **ORPO** (Odds Ratio Preference Optimization) combines SFT and preference alignment in a single stage.

<div class="callout callout-example"><div class="callout-title">The Alignment Pipeline, Simplified</div>
1. **Pre-train** on trillions of tokens of text — months of compute, the most expensive step.
2. **SFT** on thousands of high-quality demonstration examples — days of compute.
3. **RLHF or DPO** on human preference data — days of compute.
4. **Evaluate** on safety benchmarks, capability benchmarks, and red-teaming.
5. **Deploy** with additional safety layers (content filtering, rate limiting, monitoring).
</div>

### Why Alignment Is Hard

Alignment is not a solved problem. Key challenges include:

**Specification.** What does "helpful, harmless, and honest" actually mean in every possible context? The principles sound clear in the abstract but become ambiguous in edge cases. Should the model help a user write a thriller novel that includes violence? Should it provide information about drug interactions that could be misused?

**Evaluation.** How do you measure alignment? Static benchmarks capture some aspects but miss others. Red-teaming (adversarially trying to elicit bad behavior) is essential but labor-intensive and never exhaustive.

**Robustness.** Aligned models can be "jailbroken" — manipulated through clever prompting to bypass their safety training. The cat-and-mouse game between alignment researchers and adversarial prompts is ongoing and shows no signs of ending.

**The alignment tax.** Alignment techniques can reduce raw capability — RLHF can make models less creative, more verbose, or more likely to refuse legitimate requests. Minimizing this "alignment tax" while maintaining strong safety guarantees is a central research challenge.

<div class="callout callout-warning"><div class="callout-title">Important</div>Alignment is not a "set it and forget it" process. As models become more capable, new alignment challenges emerge. A technique that adequately aligns a 7B model may be insufficient for a 700B model with much greater capacity for harmful output. Alignment research must keep pace with — and ideally stay ahead of — capability research.</div>
`
		},
		{
			slug: 'prompting-and-in-context-learning',
			title: 'Prompting and In-Context Learning',
			estimatedMinutes: 16,
			xpReward: 15,
			content: `
## Prompting and In-Context Learning

One of the most remarkable properties of large language models is that you can change their behavior simply by changing the words in your prompt. No retraining, no fine-tuning, no gradient updates — just words. This capability, called **in-context learning**, is arguably the most practically important feature of modern LLMs, and also one of the most theoretically mysterious.

### Zero-Shot Prompting

In its simplest form, you just tell the model what to do:

"Translate the following English text to Japanese: 'The cherry blossoms are blooming early this year.'"

The model has never been fine-tuned on a translation task. It was not given any examples. But it produces a correct translation anyway, because during pre-training it learned from multilingual text. The SFT and RLHF phases taught it to follow instructions. Combined, these abilities allow it to perform tasks from a simple description.

Zero-shot prompting works well when the task is clear and the model has seen similar patterns during pre-training. It works less well for unusual tasks, ambiguous instructions, or highly specific output formats.

### Few-Shot Prompting

When zero-shot is not sufficient, you can provide examples — "shots" — that demonstrate the desired pattern:

"Convert temperatures from Fahrenheit to Celsius:
212F -> 100C
32F -> 0C
98.6F -> 37C
72F ->"

The model recognizes the pattern and continues: "22.2C." This is **few-shot prompting**, and it was the central finding of the GPT-3 paper (Brown et al., 2020). The model's weights do not change — it learns the task purely from the examples in the context window. More examples generally improve performance, up to a point.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>Few-shot learning in LLMs is qualitatively different from few-shot learning in traditional machine learning. In traditional ML, few-shot learning involves updating model parameters on a small dataset. In LLMs, the parameters never change — the model "learns" from examples that are simply part of the input text. This is a fundamentally new kind of adaptation.</div>

### Chain-of-Thought Prompting

A breakthrough discovery by Wei et al. (2022): for tasks that require multi-step reasoning, asking the model to **show its work** dramatically improves accuracy.

Without chain-of-thought: "If a shirt costs $25 and is 20% off, what is the sale price?" → Model might answer correctly or might not.

With chain-of-thought: "If a shirt costs $25 and is 20% off, what is the sale price? Think step by step." → "The discount is 20% of $25 = $5. The sale price is $25 - $5 = $20."

Why does this work? Each token the model generates is a forward pass through the entire neural network — effectively additional computation. By generating intermediate reasoning steps, the model gets more "thinking time." It converts a hard single-step problem into a series of easier steps.

**Zero-shot CoT**: Simply append "Let's think step by step" to any prompt. Surprisingly effective.

**Self-consistency**: Generate multiple chain-of-thought solutions and take a majority vote on the final answer. This improves robustness because different reasoning paths may have different errors.

**Tree-of-thought**: Instead of a single reasoning chain, explore multiple reasoning branches, evaluate them, and select the best. This is computationally expensive but can solve problems that defeat linear chain-of-thought.

### Prompt Engineering Principles

Prompt engineering is the craft of writing prompts that elicit the best possible model behavior. Key principles:

**Be specific and explicit.** "Write a Python function that takes a list of integers and returns the second-largest unique value, raising a ValueError if the list has fewer than 2 unique values" outperforms "Write a function to find the second largest number."

**Provide context.** Tell the model who you are, what you need the output for, what format it should be in, and what constraints apply. Models perform better when they understand the full picture.

**Use delimiters.** When providing text for the model to process, clearly separate it from the instructions using markers like triple backticks, XML tags, or other delimiters.

**Specify the output format.** If you need JSON, say so. If you need a numbered list, say so. If you need a specific structure, provide a template.

**Ask the model to adopt a persona.** "You are an expert data scientist" or "You are a patient teacher explaining to a 10-year-old" can significantly shift the style, depth, and accuracy of responses.

### System Prompts

Modern chat-based LLMs support **system prompts** — privileged instructions that set the model's behavior for an entire conversation. Unlike user messages, system prompts are intended to be persistent and authoritative.

A system prompt might specify:
- Role and persona: "You are a medical information assistant"
- Behavioral constraints: "Never provide specific dosage recommendations; always recommend consulting a healthcare professional"
- Output format: "Always respond in valid JSON with fields: answer, confidence, sources"
- Tone and style: "Be concise and professional; avoid humor"
- Knowledge boundaries: "Only answer questions about the products in our catalog"

System prompts are a powerful lever for customization without training. They are essentially "programming in natural language."

### Tool Use and Function Calling

The most significant recent advance in LLM capability is **tool use** — the ability for models to invoke external functions, APIs, and services as part of their response.

Instead of relying solely on knowledge stored in its weights, a tool-using model can:
- **Search the web** for current information
- **Execute code** to perform calculations, data analysis, or visualizations
- **Query databases** for specific records
- **Call APIs** for weather, stock prices, flight schedules, etc.
- **Read and write files** for document processing
- **Interact with services** like email, calendars, or project management tools

The mechanism works by defining available tools (with their names, descriptions, and parameter schemas) in the system prompt or through a dedicated API. When the model determines it needs a tool, it generates a structured tool call (typically in JSON) instead of a text response. The system executes the call, returns the result, and the model incorporates it into its response.

<div class="callout callout-example"><div class="callout-title">Example: Tool Use in Action</div>User: "What is the current weather in Tokyo?"

Without tools, the model must apologize: "I don't have access to real-time data."

With a weather API tool, the model generates: \`{"tool": "get_weather", "location": "Tokyo"}\`, receives \`{"temp": 18, "condition": "partly cloudy"}\`, and responds: "It's currently 18 degrees Celsius and partly cloudy in Tokyo."</div>

Tool use transforms LLMs from static knowledge stores into **dynamic agents** that can take actions in the world. This is the foundation of AI agent systems — LLMs that can plan, execute multi-step workflows, and interact with external systems autonomously.

### Why In-Context Learning Remains Mysterious

Despite its enormous practical importance, the mechanism behind in-context learning is not fully understood. Key hypotheses:

**Implicit gradient descent**: Akyurek et al. (2022) and von Oswald et al. (2023) showed that transformer attention layers can implement a form of gradient descent during the forward pass. In-context examples may serve as implicit training data that the attention mechanism "fits" on the fly.

**Task location, not task learning**: Another view is that in-context examples do not teach the model a new task — they help the model locate a task it already knows from pre-training. The examples are a pointer, not a lesson.

**Induction heads**: Olsson et al. (2022) identified specific attention head patterns ("induction heads") that implement a copy-and-continue mechanism, which may be the basis of in-context learning.

<div class="callout callout-warning"><div class="callout-title">Limitations</div>In-context learning is powerful but not a replacement for fine-tuning in all scenarios. It is limited by the context window size, sensitive to the choice and ordering of examples, and less reliable for highly specialized or data-intensive tasks. For production applications requiring consistent, high-accuracy behavior on a specific task, fine-tuning (or efficient adaptation) is often more reliable.</div>
`
		},
		{
			slug: 'efficient-adaptation',
			title: 'Efficient Adaptation',
			estimatedMinutes: 18,
			xpReward: 15,
			content: `
## Efficient Adaptation

Full fine-tuning of a large language model — updating every parameter on a new dataset — is prohibitively expensive for most organizations. A 70B parameter model requires ~280 GB just to store the weights in 32-bit precision, plus 2-3x more for optimizer states and gradients. You would need a cluster of high-end GPUs just to load it, let alone train it.

But what if you could adapt a large model to a new task by training less than 1% of its parameters? This is the promise of **parameter-efficient fine-tuning (PEFT)**, a family of techniques that has democratized access to LLM customization.

### LoRA: Low-Rank Adaptation

**LoRA** (Low-Rank Adaptation, Hu et al., 2021) is the most popular and widely used PEFT method. Its key insight is that the weight changes needed to adapt a model to a new task are **low-rank** — they can be captured by a matrix much smaller than the original weight matrix.

Here is how it works. A transformer has many large weight matrices (in the attention and feed-forward layers). For a weight matrix **W** of shape (d x d), full fine-tuning would modify all d^2 entries. LoRA instead freezes W entirely and adds a low-rank update:

**W' = W + A * B**

Where **A** has shape (d x r) and **B** has shape (r x d), with **r** (the "rank") typically set to 4, 8, 16, or 32 — vastly smaller than d (which might be 4096 or larger).

<div class="callout callout-example"><div class="callout-title">Counting Parameters</div>For a weight matrix of shape 4096 x 4096:
- **Full fine-tuning**: 16,777,216 trainable parameters
- **LoRA (rank 16)**: 4096 x 16 + 16 x 4096 = 131,072 trainable parameters
- **Ratio**: 0.78% — less than 1% of the full matrix

Applied across all attention matrices in a 7B model, LoRA typically trains 0.1-1% of total parameters while achieving 95-100% of full fine-tuning performance.</div>

**Why does this work?** The hypothesis is that the "task difference" — the change needed to go from general-purpose behavior to task-specific behavior — lives in a low-dimensional subspace. You do not need to modify every parameter; a targeted perturbation along a few important directions is sufficient.

LoRA has compelling practical advantages:
- **Memory efficient**: Only the small A and B matrices require optimizer states. A LoRA adapter for a 70B model might be only 50-100 MB.
- **Modular**: Different LoRA adapters for different tasks can be swapped in and out without modifying the base model. One base model can serve dozens of tasks.
- **Zero overhead at inference**: Before serving, A * B can be precomputed and merged into W. The resulting model is exactly the same size and speed as the original.
- **Composable**: Multiple LoRA adapters can be merged, interpolated, or stacked.

### QLoRA: Pushing Efficiency Further

**QLoRA** (Dettmers et al., 2023) combined LoRA with aggressive quantization to enable fine-tuning of very large models on consumer hardware. The recipe:

1. **Quantize the base model to 4-bit** using NormalFloat4 (NF4), a data type specifically designed for the distribution of neural network weights.
2. **Add LoRA adapters** in higher precision (BFloat16).
3. **Train only the LoRA parameters** while the 4-bit base model remains frozen.

The result: a 65B parameter model can be fine-tuned on a single 48GB GPU. A 33B model can be fine-tuned on a 24GB consumer GPU. This brought LLM fine-tuning within reach of individual researchers and hobbyists.

QLoRA also introduced **double quantization** (quantizing the quantization constants) and **paged optimizers** (using CPU RAM as overflow when GPU memory is exhausted). Together, these innovations reduce the memory footprint to a fraction of what was previously required.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>QLoRA showed that you can fine-tune a 65B model on a single GPU without meaningful quality loss. This was a watershed moment for democratization — it meant that a graduate student with a gaming GPU could customize models that previously required a cluster.</div>

### Adapters

Before LoRA, **adapter layers** (Houlsby et al., 2019) were the primary PEFT approach. Adapters insert small trainable modules between existing transformer layers:

1. A **down-projection** that reduces the representation dimension (e.g., from 768 to 64).
2. A **nonlinear activation** (ReLU or GELU).
3. An **up-projection** that restores the original dimension (64 back to 768).
4. A **residual connection** that adds the adapter output to the input.

Only the adapter parameters are trained; the original model is frozen. Adapters add a small amount of inference latency (extra layers in the forward pass), which is their main disadvantage compared to LoRA.

### Prefix Tuning and Prompt Tuning

**Prefix tuning** (Li and Liang, 2021) takes a radically different approach: instead of modifying weights at all, it prepends learnable "virtual tokens" to the input at each transformer layer. These tokens do not correspond to real words — they are continuous vectors optimized by gradient descent to steer the model's behavior for a specific task.

**Prompt tuning** (Lester et al., 2021) is a simplified version that only prepends virtual tokens to the input embedding (not every layer). Surprisingly, prompt tuning with just 20-100 virtual tokens can match full fine-tuning performance on many tasks, especially with larger models.

<div class="callout callout-think"><div class="callout-title">Think About It</div>There is a revealing trend: as models get larger, simpler adaptation methods become more effective. A 100M parameter model might need full fine-tuning to adapt. A 10B model does well with LoRA. A 100B+ model can often be adapted with nothing more than careful prompting. This suggests that larger models develop more "ready-made" internal representations — they need less modification to apply their knowledge to new tasks.</div>

### Quantization: Making Models Accessible

Quantization is not fine-tuning, but it is essential for making LLMs practical. The idea is to reduce the numerical precision of model weights from 16-bit or 32-bit floating point to lower-precision formats:

- **16-bit (FP16/BF16)**: Standard training precision. A 70B model needs ~140GB.
- **8-bit (INT8)**: Half the memory of FP16. A 70B model needs ~70GB. Minimal quality loss.
- **4-bit (INT4/NF4)**: Quarter the memory. A 70B model fits in ~35GB. Some quality loss, but often acceptable for inference.
- **2-bit**: Experimental. Significant quality degradation for most models.

Popular quantization methods include:
- **GPTQ**: Post-training quantization using calibration data to minimize error. Fast GPU inference.
- **AWQ (Activation-Aware Weight Quantization)**: Identifies and preserves the most important weights, producing better quality at the same bit width.
- **GGUF** (formerly GGML): The format used by llama.cpp, optimized for CPU inference. Widely used for running models locally.
- **bitsandbytes**: A library that provides easy 8-bit and 4-bit quantization integrated with Hugging Face transformers.

### Running LLMs Locally

The combination of open-weight models, quantization, and efficient inference engines has created a vibrant ecosystem for running LLMs on personal hardware:

**llama.cpp**: A C/C++ inference engine that runs quantized models on CPUs and GPUs. A 4-bit quantized 7B model runs comfortably on a laptop with 8GB RAM, generating 10-30 tokens per second.

**Ollama**: A user-friendly tool that wraps llama.cpp and provides a simple interface: \`ollama run llama3\` downloads and runs a model with a single command.

**vLLM**: A high-performance Python-based inference engine for GPU serving, featuring PagedAttention for efficient memory management.

**ExLlamaV2**: Optimized for NVIDIA consumer GPUs, achieving high throughput with quantized models.

### The Democratization

The convergence of these technologies has fundamentally changed who can work with LLMs:

- A **student** can fine-tune a 13B model on a single $300 GPU using QLoRA.
- A **startup** can serve a customized 70B model for pennies per request using quantization and batched inference.
- A **developer** can run a capable model entirely offline, with full privacy, on a laptop.
- A **researcher** can experiment with alignment techniques, interpretability tools, and novel training methods on their own hardware.

<div class="callout callout-warning"><div class="callout-title">Caveat</div>Smaller, quantized, or efficiently adapted models are not free substitutes for larger, full-precision models. There are quality trade-offs, especially for complex reasoning, rare knowledge, and long-context tasks. The right approach depends on the specific use case, quality requirements, and budget constraints. The good news is that practitioners now have a rich toolkit for navigating these trade-offs.</div>

This democratization is one of the most important trends in modern AI. It distributes capability broadly, enables permissionless innovation, and provides a check on the concentration of AI power in a handful of large organizations.
`
		},
		{
			slug: 'the-llm-landscape',
			title: 'The LLM Landscape',
			estimatedMinutes: 18,
			xpReward: 15,
			content: `
## The LLM Landscape

The large language model ecosystem has evolved from a handful of research models into a complex landscape of competing architectures, providers, licensing models, and evaluation methodologies. Understanding this landscape — who is building what, how they differ, and how to evaluate them — is essential for anyone working with modern AI.

### The Major Model Families

**OpenAI — GPT Series**

OpenAI launched the modern LLM era. GPT-3 (2020, 175B parameters) demonstrated in-context learning. GPT-3.5-turbo (late 2022) powered the original ChatGPT, which reached 100 million users in two months — the fastest-growing consumer application in history. GPT-4 (March 2023) marked a significant leap in reasoning, multimodal understanding, and reliability. GPT-4o (2024) unified text, vision, and audio in a single model with faster inference.

OpenAI's models are closed-source: accessible only through APIs. Their exact architectures, parameter counts, and training data are not publicly disclosed.

**Anthropic — Claude Series**

Founded by former OpenAI researchers focused on AI safety, Anthropic has built the Claude model family. Claude's distinguishing features include very long context windows (up to 200K tokens, enabling analysis of entire codebases or books), strong instruction following, careful safety behavior via Constitutional AI, and strong performance on complex reasoning and analysis tasks.

Like OpenAI, Anthropic provides API access without releasing model weights. Their focus on safety research — interpretability, alignment, and responsible deployment — shapes both their model development and their organizational mission.

**Google DeepMind — Gemini**

Google's Gemini family represents a bet on **native multimodality** — training from the ground up on text, images, audio, and video, rather than adding vision capabilities to a text model after the fact. Gemini 1.5 introduced a 1-million-token context window using a Mixture-of-Experts architecture. Gemini powers Google's AI features across Search, Workspace, and other products.

Google also maintains specialized models like Med-PaLM (medicine), AlphaCode (competitive programming), and AlphaFold (protein structure).

**Meta — Llama Series**

Meta's Llama models are the most influential **open-weight** LLMs. Llama 1 (2023) was released to researchers, catalyzing an explosion of open-source LLM development. Llama 2 was released with a permissive commercial license. Llama 3 (2024) pushed the open-weight frontier to 405B parameters, approaching closed-model quality on many benchmarks.

Meta's open-weight strategy has had an outsized impact on the field. Thousands of fine-tuned variants, research papers, and commercial products are built on Llama.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>"Open-weight" means the model parameters are publicly available, but the training data, training code, and exact methodology may not be. This is an important distinction from true "open-source" in the traditional software sense. Most "open" LLMs are technically open-weight or source-available with restrictions.</div>

**Mistral AI**

This French startup has become a significant player remarkably quickly. Mistral 7B (2023) matched or exceeded much larger models. Mixtral 8x7B brought Mixture-of-Experts to the open-weight world, running 8 expert networks of 7B parameters each but only activating 2 per token — achieving GPT-3.5-class performance at a fraction of the compute cost.

**Other Notable Players**

- **DeepSeek** (China): Producing frontier-competitive models with innovative architectures. DeepSeek-V2/V3 use novel MoE designs achieving strong performance at unusually low training and inference costs.
- **Alibaba (Qwen)**: Strong multilingual open-weight models, particularly effective in Chinese and East Asian languages.
- **Cohere (Command R)**: Enterprise-focused models with built-in retrieval augmentation and citation capabilities.
- **01.AI (Yi)**: Founded by Kai-Fu Lee, producing competitive multilingual models.

### Benchmarks and Evaluation

How do we compare models? The field relies on a growing — and increasingly contested — set of benchmarks:

**Knowledge Benchmarks**
- **MMLU** (Massive Multitask Language Understanding): 57 academic subjects from elementary math to professional medicine. The most widely cited general knowledge benchmark.
- **ARC** (AI2 Reasoning Challenge): Science questions at grade-school and challenge levels.
- **TriviaQA / Natural Questions**: Factual question answering from real web queries.

**Reasoning Benchmarks**
- **GSM8K**: Grade school math word problems. Surprisingly challenging — models must perform multi-step arithmetic.
- **MATH**: Competition-level mathematics problems. Much harder than GSM8K.
- **BBH (Big Bench Hard)**: A curated set of challenging reasoning tasks where models still struggle.

**Code Benchmarks**
- **HumanEval**: Given a function signature and docstring, generate working code. Pass rate (pass@1) is the metric.
- **MBPP (Mostly Basic Python Programs)**: Simpler coding tasks.
- **SWE-bench**: Given a real GitHub issue, generate a working code patch. The most realistic coding evaluation.

**Chat and Instruction Following**
- **Chatbot Arena (LMSYS)**: Crowdsourced head-to-head comparisons. Users chat with two anonymous models and vote for the better one. The resulting Elo ranking is widely considered the most reliable indicator of real-world conversational quality.
- **MT-Bench**: Multi-turn conversation evaluation using an LLM judge (typically GPT-4).
- **AlpacaEval**: Automated instruction-following evaluation.

<div class="callout callout-warning"><div class="callout-title">Benchmark Limitations</div>Static benchmarks have serious limitations. Models can be optimized (intentionally or accidentally) for benchmark performance — "teaching to the test." Training data contamination (test questions appearing in training data) inflates scores. And benchmarks measure narrow slices of capability that may not reflect real-world usefulness. The Chatbot Arena, with its dynamic, human-judged comparisons, partly addresses these issues but is limited to conversational tasks and biased toward the preferences of its user base.</div>

### Multimodal LLMs

The frontier has moved decisively beyond text. Modern multimodal LLMs process and generate across multiple modalities:

**Vision-Language Models** can understand images: describing them, answering questions about visual content, reading text in images (OCR), analyzing charts and diagrams, and reasoning about spatial relationships. GPT-4o, Claude, Gemini, and open models like LLaVA demonstrate this capability.

**Audio Models** process and generate speech. GPT-4o can engage in real-time spoken conversation. Whisper handles speech-to-text in nearly 100 languages.

**Video Understanding** is the current frontier. Gemini 1.5 can process up to an hour of video. Specialized models are emerging for video question answering, temporal reasoning, and video generation.

The trend is toward **unified models** — single architectures that handle text, images, audio, and video natively, rather than separate specialists connected by pipelines. This unification simplifies deployment and enables cross-modal reasoning (e.g., answering questions about what someone said in a video by combining visual and auditory understanding).

### The Open vs. Closed Debate

The tension between open and closed model development is one of the defining dynamics of the current AI landscape:

**The case for open models:** Transparency enables independent safety research, auditing, and accountability. The open-source community innovates faster than any single organization. Open models democratize access and prevent dangerous concentration of power. Historically, open technology has been more robust and trustworthy than proprietary alternatives.

**The case for closed models:** The most powerful models could be misused if freely available. Safety measures (alignment, content filtering) can be removed from open models. Developing frontier models costs billions, requiring revenue models that open release may undermine.

In practice, the ecosystem has settled into a productive coexistence. Closed-source labs push the frontier of capability. Open-weight labs follow within months, providing near-frontier quality to everyone. Most practitioners use both: closed APIs for the hardest tasks, open models for cost-sensitive or privacy-critical applications.

### Current State and Open Questions

As of the current era, the most capable LLMs can engage in nuanced conversation, write and debug code, analyze documents and images, solve complex multi-step problems, and use tools to interact with external systems. They are being integrated into products, workflows, and decision processes across virtually every industry.

They still struggle with consistent factual accuracy, novel mathematical proofs, robust long-horizon planning, and reliable performance under adversarial conditions. The gap between "impressive demonstration" and "dependable production system" remains significant.

Open questions that will shape the next era:
- Will scaling continue to yield capability improvements, or will we hit diminishing returns?
- Can alignment techniques keep pace with growing model capabilities?
- Will open or closed models dominate the long-term ecosystem?
- How will society adapt to pervasive AI assistance in knowledge work?

These questions do not yet have answers, and the answers will shape not just AI but the broader trajectory of technology and society.
`
		}
	],
	quiz: {
		questions: [
			{
				type: 'multiple-choice',
				id: 'llm-q1',
				question:
					'What key finding did the Chinchilla paper (Hoffmann et al., 2022) demonstrate about training large language models?',
				options: [
					'Larger models always perform better regardless of training data',
					'Most large models were undertrained; model size and data should be scaled roughly equally',
					'Pre-training data quality does not matter if the model is large enough',
					'Training for more epochs is always better than training on more data'
				],
				correctIndex: 1,
				explanation:
					'The Chinchilla paper showed that for a given compute budget, model size and dataset size should be scaled roughly equally. A 70B model trained on 1.4T tokens (Chinchilla) outperformed a 280B model trained on 300B tokens (Gopher) using the same compute, demonstrating that most existing models were undertrained.'
			},
			{
				type: 'fill-in',
				id: 'llm-q2',
				question:
					'The pre-training objective for decoder-only language models like GPT is called _____ language modeling.',
				acceptedAnswers: [
					'autoregressive',
					'Autoregressive',
					'next-token',
					'next token'
				],
				explanation:
					'Decoder-only LLMs use autoregressive language modeling: predicting the next token given all preceding tokens. This simple objective, applied across trillions of tokens, forces the model to learn language structure, factual knowledge, and reasoning patterns.'
			},
			{
				type: 'multiple-choice',
				id: 'llm-q3',
				question:
					'In RLHF, what is the role of the reward model?',
				options: [
					'It generates training data for the language model',
					'It predicts human preferences, scoring responses so the LLM can be optimized to produce preferred outputs',
					'It filters harmful content from model outputs',
					'It compresses the language model for efficient inference'
				],
				correctIndex: 1,
				explanation:
					'The reward model is trained on human preference rankings to predict which responses humans prefer. It outputs a scalar score for any (prompt, response) pair, which is then used as the reward signal for PPO optimization of the language model.'
			},
			{
				type: 'ordering',
				id: 'llm-q4',
				question:
					'Order the stages of building an aligned LLM from first to last:',
				items: [
					'RLHF or DPO on preference data',
					'Pre-training on trillions of tokens',
					'Evaluation and red-teaming',
					'Supervised fine-tuning on demonstration data'
				],
				correctOrder: [1, 3, 0, 2],
				explanation:
					'The standard pipeline is: (1) Pre-train on massive text data, (2) Supervised fine-tuning (SFT) on high-quality demonstrations, (3) RLHF/DPO on human preference data, (4) Evaluation and red-teaming before deployment.'
			},
			{
				type: 'multiple-choice',
				id: 'llm-q5',
				question:
					'What is the key advantage of DPO over standard RLHF?',
				options: [
					'DPO always produces higher quality models',
					'DPO eliminates the need for a separate reward model and RL training loop',
					'DPO requires no preference data at all',
					'DPO works only with encoder-only models'
				],
				correctIndex: 1,
				explanation:
					'DPO (Direct Preference Optimization) reformulates the RLHF objective into a single loss function that can be optimized directly on preference pairs, eliminating the need for a separate reward model and the complex PPO training loop. This makes alignment simpler, more stable, and easier to implement.'
			},
			{
				type: 'fill-in',
				id: 'llm-q6',
				question:
					'LoRA stands for Low-_____ Adaptation.',
				acceptedAnswers: ['Rank', 'rank'],
				explanation:
					'LoRA (Low-Rank Adaptation) adds trainable low-rank matrices to frozen model weights. By constraining updates to a low-rank subspace, it achieves near-full-fine-tuning performance while training less than 1% of the parameters.'
			},
			{
				type: 'multiple-choice',
				id: 'llm-q7',
				question:
					'Which prompting technique involves asking the model to show its reasoning step by step?',
				options: [
					'Few-shot prompting',
					'Chain-of-thought prompting',
					'Prefix tuning',
					'System prompting'
				],
				correctIndex: 1,
				explanation:
					'Chain-of-thought (CoT) prompting asks models to generate intermediate reasoning steps before the final answer. This dramatically improves performance on multi-step reasoning tasks by giving the model additional computation through generated tokens.'
			},
			{
				type: 'multiple-choice',
				id: 'llm-q8',
				question:
					'What enables QLoRA to fine-tune a 65B parameter model on a single GPU?',
				options: [
					'It removes half the model layers during training',
					'It quantizes the base model to 4-bit and trains only small LoRA adapter matrices',
					'It uses CPU instead of GPU for training',
					'It reduces the vocabulary size to save memory'
				],
				correctIndex: 1,
				explanation:
					'QLoRA quantizes the base model weights to 4-bit precision (reducing memory ~4x) while adding and training small LoRA adapter matrices in higher precision. This combination dramatically reduces the memory required for fine-tuning.'
			},
			{
				type: 'multiple-choice',
				id: 'llm-q9',
				question:
					'Which evaluation method is widely considered the most reliable for assessing real-world LLM quality?',
				options: [
					'MMLU benchmark scores',
					'HumanEval pass rate',
					'Chatbot Arena with crowdsourced Elo rankings',
					'Perplexity on a held-out test set'
				],
				correctIndex: 2,
				explanation:
					'Chatbot Arena (LMSYS) uses crowdsourced head-to-head comparisons where real users interact with two anonymous models and vote for the better one. The resulting Elo rankings are dynamic, hard to game, and reflect actual user preferences better than static benchmarks.'
			},
			{
				type: 'multiple-choice',
				id: 'llm-q10',
				question:
					'What does "open-weight" mean in the context of LLMs like Llama?',
				options: [
					'The model weights, training data, and all code are publicly available',
					'The model weights are publicly available, but training data and code may not be',
					'The model can run on any hardware without restrictions',
					'The model is free to use but its architecture is proprietary'
				],
				correctIndex: 1,
				explanation:
					'Open-weight means the trained model parameters are publicly released, but the training data, training code, and exact methodology may be withheld. This is an important distinction from fully open-source, which would include all components.'
			}
		],
		passingScore: 7
	}
};

export default largeLanguageModels;
