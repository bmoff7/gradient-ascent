import type { Module } from '../types';

const rnnsSequences: Module = {
	slug: 'rnns-sequences',
	title: 'Recurrent Neural Networks and Sequences',
	description:
		'Explore networks that understand time and order. From vanilla RNNs and the vanishing gradient problem to LSTMs, GRUs, and the attention mechanism that launched the transformer revolution.',
	estimatedMinutes: 120,
	xpReward: 90,
	quizXpReward: 50,
	lessons: [
		{
			slug: 'sequential-data',
			title: 'Sequential Data',
			estimatedMinutes: 16,
			xpReward: 15,
			content: `
# Sequential Data

So far, we have studied networks that process fixed-size inputs: a vector of features, an image with defined dimensions. These networks treat each input as an isolated snapshot, with no concept of what came before or what comes after. But the world is not a collection of snapshots -- it is a continuous stream of events where **order matters**.

## Why Order Matters

Consider these two sentences:

- "The dog bit the man."
- "The man bit the dog."

Same words, completely different meanings. The order is everything. A feedforward network that processes words as an unordered bag ("bag of words") would see these sentences as identical. But they describe completely different events.

Or consider a stock price. Knowing that the price is $150 tells you very little. Knowing that it went from $100 to $120 to $140 to $150 over four days tells you there is an upward trend. The individual values matter, but the *sequence* of values carries critical additional information.

This is the fundamental challenge of sequential data: the meaning is encoded not just in the elements, but in their **arrangement**.

## Types of Sequential Data

Sequential data is everywhere:

**Natural language.** Every sentence is a sequence of words. Every word is a sequence of characters. Every conversation is a sequence of sentences. Understanding language requires understanding sequences at multiple levels simultaneously.

**Time series.** Stock prices, weather measurements, sensor readings, heart rate monitors, server logs. Any data recorded over time is a sequence. Predicting future values requires understanding patterns in past values.

**Audio and speech.** Sound is a sequence of pressure values over time. Speech recognition requires mapping this sequence to a sequence of words. Music generation requires producing coherent sequences of notes.

**Video.** A video is a sequence of image frames. Understanding a video -- recognizing actions, tracking objects, anticipating events -- requires processing frames in order.

**Biological sequences.** DNA is a sequence of nucleotides. Proteins are sequences of amino acids. Understanding their function requires understanding their sequential structure.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>What makes sequential data special is not that it has multiple elements (images have thousands of pixels too), but that the elements have a meaningful *order*. Shuffling the pixels of an image destroys it. Shuffling the words of a sentence destroys it. Shuffling the time steps of a stock price destroys it. Any architecture for sequential data must be sensitive to order.</div>

## Why Feedforward Networks Fail

Feedforward networks (MLPs and CNNs) have two fundamental limitations with sequences:

**Fixed input size.** A feedforward network has a fixed number of input neurons. But sentences have different lengths. Time series have different durations. You cannot design a network that accepts exactly 17 words -- what happens when the sentence has 18 words, or 5?

You could pad all sequences to the same length (adding zeros to short sequences and truncating long ones), but this is wasteful, introduces artifacts, and cannot handle truly variable-length data.

**No memory across time steps.** Each input to a feedforward network is processed independently. The network has no way to remember what it saw one step ago, ten steps ago, or at the beginning of the sequence. It cannot learn patterns that span multiple time steps, like "if the temperature has been rising for three days, expect rain."

<div class="callout callout-example"><div class="callout-title">Example</div>Imagine trying to understand a movie by looking at individual frames in random order. You see a person running, then a sunset, then an explosion, then a handshake. Without knowing the order, you cannot understand the plot. A feedforward network processing each frame independently is in exactly this situation. It can recognize objects in each frame but cannot follow the narrative across frames.</div>

## What We Need

We need a network architecture that:

1. **Handles variable-length inputs** naturally, without padding or truncation
2. **Maintains state across time steps** -- a "memory" that accumulates information as it processes the sequence
3. **Shares parameters across time steps** -- just as CNNs share parameters across spatial positions, a sequential network should apply the same transformation at every time step (the rules of English do not change from the beginning of a sentence to the end)

This is the **recurrent neural network (RNN)**, and it is the subject of our next lesson. The key idea is deceptively simple: give the network a loop.
`
		},
		{
			slug: 'vanilla-rnns',
			title: 'Vanilla RNNs',
			estimatedMinutes: 22,
			xpReward: 15,
			content: `
# Vanilla RNNs

The idea behind a recurrent neural network is simple enough to state in one sentence: give the network a hidden state that persists across time steps, so that the output at each step depends not just on the current input but on everything that came before.

## The Recurrence Relation

A vanilla RNN processes a sequence one element at a time. At each time step t, it receives two inputs: the current element x_t and the hidden state h_{t-1} from the previous step. It produces two outputs: an output y_t and an updated hidden state h_t.

**h_t = tanh(W_hh * h_{t-1} + W_xh * x_t + b_h)**
**y_t = W_hy * h_t + b_y**

That is the entire architecture. Two matrix multiplications, a sum, a tanh activation, and the output. The magic is in the *recurrence*: h_t depends on h_{t-1}, which depends on h_{t-2}, and so on, all the way back to h_0 (which is typically initialized to zeros).

The hidden state h is the network's **memory**. It is a vector (typically 128 to 1024 dimensions) that encodes a compressed summary of everything the network has seen so far. At each time step, the network updates this summary by combining it with the new input.

<div class="callout callout-example"><div class="callout-title">Example</div>Imagine reading a book one word at a time. Your mental state (hidden state) changes with each word. After reading "The cat sat on the," your mental state includes the expectation that a noun is coming. When you read "mat," your mental state updates to include the complete phrase. You do not need to re-read the entire sentence at each word -- your accumulated mental state carries the context forward. An RNN works the same way.</div>

**Parameter sharing:** The same weight matrices (W_hh, W_xh, W_hy) are used at every time step. The RNN does not have separate weights for position 1, position 2, etc. This means:
- The network can handle sequences of any length
- The number of parameters does not depend on the sequence length
- Patterns learned at one position transfer to all positions

## Unrolling Through Time

To understand how an RNN processes an entire sequence, it helps to "unroll" the recurrence -- draw out the network as if it were a separate copy at each time step, with connections flowing left to right:

h_0 -> [RNN Cell] -> h_1 -> [RNN Cell] -> h_2 -> [RNN Cell] -> h_3 -> ...
         ^                    ^                    ^
         |                    |                    |
        x_1                  x_2                  x_3

Each "RNN Cell" is the same set of weights, applied with different inputs and states. The unrolled view makes it clear that an RNN is really just a very deep feedforward network -- one layer per time step -- with **tied weights** (the same weights at every layer) and a special **recurrent connection** (h flows from one step to the next).

This perspective is crucial for understanding how training works.

## Backpropagation Through Time (BPTT)

Since the unrolled RNN is just a deep feedforward network, we can train it with backpropagation. We compute the loss at each time step (or at the final step, depending on the task), and propagate gradients backward through the unrolled graph. Because the gradients flow backward through time, this is called **Backpropagation Through Time (BPTT)**.

For a sequence of length T, BPTT computes gradients flowing back through T layers. The gradients must pass through T matrix multiplications by W_hh (one per time step). And this is where the trouble begins.

## The Vanishing Gradient Problem

Remember the vanishing gradient problem from deep feedforward networks? It is catastrophically worse in RNNs.

At each time step, the gradient is multiplied by the matrix W_hh. Over T time steps, the gradient is effectively multiplied by W_hh^T (W_hh raised to the power T). If the largest eigenvalue of W_hh is less than 1, this product **shrinks exponentially**. After 50-100 time steps, the gradient is essentially zero. The network cannot learn dependencies that span more than a few dozen steps.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>The vanishing gradient problem in RNNs is not just a numerical annoyance -- it creates a fundamental limitation on what the network can learn. If a word at position 5 is critical for understanding a word at position 100, the gradient signal connecting them passes through 95 matrix multiplications. With vanishing gradients, this signal is astronomically small, and the network effectively cannot learn the dependency.</div>

Conversely, if the largest eigenvalue of W_hh is greater than 1, the product **grows exponentially**. Gradients explode to infinity, causing numerical overflow and destroying the network. This is the **exploding gradient problem**, which is less conceptually problematic (it can be mitigated with gradient clipping -- capping the gradient magnitude) but equally destructive in practice.

<div class="callout callout-warning"><div class="callout-title">Warning</div>The vanishing gradient problem means vanilla RNNs have an effective memory of roughly 10-20 time steps. They can learn short-range dependencies ("the cat sat on the ___") but not long-range ones ("The author, who had spent years studying marine biology in various coastal laboratories across three continents, wrote a book about ___"). For most practical sequence tasks, this is insufficient.</div>

## Why Not Just Make the Gradients Bigger?

You might wonder: if the gradients vanish because they are multiplied by a number less than 1 repeatedly, why not just set W_hh so its eigenvalues equal 1? The problem is that the eigenvalues of W_hh are not directly controlled -- they are learned during training, and the combination of the tanh activation (which squashes gradients) and the matrix multiplication makes it nearly impossible to maintain eigenvalues near 1 throughout training.

The real solution is not to fix vanilla RNNs but to replace them with architectures specifically designed to allow gradients to flow over long distances without vanishing. This is exactly what LSTMs and GRUs do, and they are the subject of our next two lessons.

## Applications of Vanilla RNNs

Despite their limitations, vanilla RNNs established the foundation for all sequence modeling in deep learning. They are rarely used in practice today (LSTMs, GRUs, and transformers have superseded them), but understanding them is essential because:

1. They introduce the core concepts: hidden state, recurrence, parameter sharing across time
2. The vanishing gradient problem motivates the gated architectures that followed
3. The unrolling perspective and BPTT are used by all recurrent architectures
4. Many theoretical results about sequence modeling were first derived for vanilla RNNs

Think of vanilla RNNs as the Model T of sequence modeling -- you would not drive one today, but you need to understand it to appreciate why modern cars are designed the way they are.
`
		},
		{
			slug: 'lstm',
			title: 'LSTM: Long Short-Term Memory',
			estimatedMinutes: 22,
			xpReward: 15,
			content: `
# LSTM: Long Short-Term Memory

In 1997, Sepp Hochreiter and Jurgen Schmidhuber published "Long Short-Term Memory," a paper that would solve the vanishing gradient problem for recurrent networks and dominate sequence modeling for the next two decades. LSTMs are one of the most impactful architectural innovations in deep learning history.

## The Core Problem and the Core Solution

Vanilla RNNs have one path for information to flow through time: the hidden state h, which is overwritten at every step. Information from early time steps must survive through dozens or hundreds of tanh squashings and matrix multiplications. It rarely does.

The LSTM adds a second path: the **cell state** C, which runs through the entire sequence like a conveyor belt. Information can be placed on the conveyor belt, read from it, or removed from it at each time step -- but the default behavior is to let it flow through unchanged. This makes it easy for information to persist over long distances without degradation.

The cell state is regulated by three **gates** -- neural network layers that learn when to add information, when to remove it, and what to output. Let us examine each gate.

## The Forget Gate: What to Discard

**f_t = sigmoid(W_f * [h_{t-1}, x_t] + b_f)**

The forget gate looks at the previous hidden state h_{t-1} and the current input x_t, and outputs a vector of values between 0 and 1 for each element of the cell state. A value of 1 means "keep this completely." A value of 0 means "discard this completely."

<div class="callout callout-example"><div class="callout-title">Example</div>Imagine you are reading a novel and tracking the subject of the current sentence. When you read "She walked to the park. He picked up the phone," the forget gate should clear the subject "she" from memory when the new sentence begins with "he." The forget gate learns when old information has become irrelevant and should be discarded to make room for new information.</div>

## The Input Gate: What to Remember

The input gate has two parts:

**i_t = sigmoid(W_i * [h_{t-1}, x_t] + b_i)** (which values to update)
**C_tilde = tanh(W_C * [h_{t-1}, x_t] + b_C)** (candidate new values)

The sigmoid layer (i_t) decides which elements of the cell state to update. The tanh layer creates a vector of candidate new values. The product i_t * C_tilde determines what new information is actually written to the cell state.

## Updating the Cell State

**C_t = f_t * C_{t-1} + i_t * C_tilde**

This is the heart of the LSTM. The new cell state is:
- The old cell state, selectively forgotten (f_t * C_{t-1})
- Plus new information, selectively added (i_t * C_tilde)

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>This update equation is why LSTMs solve the vanishing gradient problem. Look at it: C_t depends on C_{t-1} through multiplication by f_t (a number between 0 and 1). When f_t = 1 (the forget gate is fully open), C_t = C_{t-1} + new stuff. The gradient flows through the cell state with a multiplicative factor of 1, meaning no vanishing! The cell state acts as a **gradient highway** -- information and gradients can flow through it over arbitrarily many time steps without degradation, as long as the forget gate stays open.</div>

Compare this to the vanilla RNN, where h_t depends on h_{t-1} through a tanh(W * h_{t-1} + ...) operation. The tanh squashes the gradient at every step. The LSTM's cell state has no tanh gate -- it is a direct additive connection, analogous to the skip connections in ResNet.

## The Output Gate: What to Reveal

**o_t = sigmoid(W_o * [h_{t-1}, x_t] + b_o)**
**h_t = o_t * tanh(C_t)**

The cell state contains the LSTM's full memory, but not all of it is relevant at every time step. The output gate decides which parts of the cell state to expose as the hidden state h_t (which is what the next time step and any output layers see).

The tanh squashes the cell state to the range [-1, 1], and the output gate selectively passes through the relevant portions.

## An Intuitive Summary

Think of the LSTM as a person taking notes during a lecture:

- **Cell state (C):** The notebook where important points are written down.
- **Forget gate (f):** Erasing outdated notes to prevent confusion.
- **Input gate (i):** Deciding which new points from the current slide are worth writing down.
- **Output gate (o):** Deciding which notes are relevant to the current question being asked.

The notebook persists throughout the lecture. Not everything is written down (input gate), outdated information is erased (forget gate), and only relevant notes are consulted at any given moment (output gate). This selective read/write mechanism is what makes LSTMs so effective.

## Why Each Gate Uses Sigmoid

All three gates use the sigmoid activation function, which outputs values between 0 and 1. This is by design: the gates are multiplicative masks. A value of 0 means "block everything," a value of 1 means "pass everything through," and values in between provide partial gating. The sigmoid's bounded output makes it a natural choice for controlling information flow.

The candidate values (C_tilde) and the cell-to-hidden transformation use tanh, which outputs values between -1 and 1. This centering around zero helps with optimization.

## LSTM in Practice

LSTMs were the dominant architecture for sequence tasks from roughly 2014 to 2017:

- **Machine translation:** Google Translate switched to LSTM-based neural machine translation in 2016, dramatically improving translation quality.
- **Speech recognition:** LSTMs achieved the best results in speech recognition for several years.
- **Language modeling:** Predicting the next word in a sentence was dominated by LSTMs.
- **Time series forecasting:** LSTMs handle the long-range dependencies common in financial and weather data.
- **Music generation:** LSTMs can learn to compose coherent musical sequences.

<div class="callout callout-think"><div class="callout-title">Think About It</div>The LSTM was published in 1997 but did not become widely used until around 2014. Why the 17-year gap? The answer is compute and data. LSTMs have 4x the parameters of a vanilla RNN (four sets of weight matrices for the three gates plus the candidate), and they need enough data and compute to train effectively. The GPU revolution and the availability of large datasets in the 2010s finally made LSTMs practical. This is a recurring theme in deep learning: good ideas often have to wait for hardware to catch up.</div>
`
		},
		{
			slug: 'gru-and-variants',
			title: 'GRU and Variants',
			estimatedMinutes: 18,
			xpReward: 15,
			content: `
# GRU and Variants

The LSTM solved the vanishing gradient problem, but it did so with substantial complexity: three gates, a separate cell state, and eight weight matrices. In 2014, Kyunghyun Cho et al. proposed a simpler alternative: the **Gated Recurrent Unit (GRU)**. It achieves comparable performance to the LSTM with fewer parameters and less computational cost.

## The GRU Architecture

The GRU simplifies the LSTM by merging the cell state and hidden state into a single hidden state h, and reducing the number of gates from three to two:

**Update gate:** z_t = sigmoid(W_z * [h_{t-1}, x_t] + b_z)
**Reset gate:** r_t = sigmoid(W_r * [h_{t-1}, x_t] + b_r)
**Candidate state:** h_tilde = tanh(W * [r_t * h_{t-1}, x_t] + b)
**New hidden state:** h_t = (1 - z_t) * h_{t-1} + z_t * h_tilde

Two gates instead of three. No separate cell state. Fewer weight matrices. Let us understand each component.

## The Update Gate: A Dual-Purpose Controller

The update gate z_t plays the role of *both* the LSTM's forget gate and input gate. When z_t is close to 0, the hidden state is carried forward unchanged (like a forget gate set to 1 -- "forget nothing"). When z_t is close to 1, the hidden state is replaced with the candidate (like an input gate set to 1 -- "write everything").

The elegant constraint: the amount of old state kept (1 - z_t) and the amount of new state added (z_t) always sum to 1. The GRU *must* forget exactly as much as it remembers. This coupling is a simplification over the LSTM, where the forget and input gates operate independently.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>The GRU's key simplification is the update gate: a single gate controls both forgetting and remembering. This is like a sliding door -- opening it to new information automatically closes it to old information. The LSTM has two separate doors (forget gate and input gate), giving it more flexibility but also more parameters. In practice, this additional flexibility rarely matters, which is why GRUs match LSTMs on most tasks.</div>

## The Reset Gate: How Much History to Use

The reset gate r_t determines how much of the previous hidden state to use when computing the candidate new state. When r_t is close to 0, the candidate is computed mostly from the current input (ignoring history). When r_t is close to 1, the candidate uses the full previous state.

This is useful for sequences where certain transitions represent "fresh starts." For example, at a paragraph boundary in text, the reset gate might activate to compute a candidate state based primarily on the new paragraph's content rather than the previous one.

## LSTM vs. GRU: The Comparison

| Feature | LSTM | GRU |
|---------|------|-----|
| Gates | 3 (forget, input, output) | 2 (update, reset) |
| State vectors | 2 (cell state + hidden state) | 1 (hidden state only) |
| Parameters | ~4x vanilla RNN | ~3x vanilla RNN |
| Output gate | Yes (selectively exposes cell state) | No (full hidden state is output) |
| Training speed | Slower (more computation per step) | Faster (fewer operations) |
| Performance | Generally equal | Generally equal |

**When to choose which:**
- **GRU:** Default choice for most tasks. Faster training, fewer parameters, comparable performance.
- **LSTM:** When the task requires very fine-grained control over memory (the separate cell state and output gate give more flexibility). Some benchmarks favor LSTM on tasks requiring very long-range dependencies.
- **In practice:** The performance difference is usually within the noise. Try both and pick whichever works better on your validation set. If they are equal, choose GRU for its simplicity and speed.

<div class="callout callout-think"><div class="callout-title">Think About It</div>The fact that GRUs match LSTMs despite having fewer gates suggests that the LSTM may be slightly over-engineered for most tasks. The separate forget and input gates give the LSTM more flexibility, but the tasks where this flexibility matters are rare. This is a common pattern in deep learning: simpler models often perform as well as complex ones, and the burden of proof is on the complex model to justify its additional parameters.</div>

## Bidirectional RNNs

Standard RNNs process sequences in one direction: left to right (or past to future). But for many tasks, the future context is just as important as the past.

Consider the sentence: "He went to the ___." The missing word could be "store," "park," "doctor," etc. Now consider: "He went to the ___ to buy groceries." The word after the blank ("to buy groceries") tells us the answer is "store." A left-to-right RNN would not have this information when processing the blank.

A **bidirectional RNN** processes the sequence in both directions: one RNN reads left-to-right, another reads right-to-left. At each time step, the outputs of both RNNs are concatenated, giving the network access to both past and future context.

This doubles the number of parameters and computation, but the improvement in tasks like named entity recognition, sentiment analysis, and machine translation is substantial. Bidirectional processing was a key component of BERT and other pre-transformer language models.

**Important limitation:** Bidirectional RNNs require the entire sequence to be available before processing begins. This makes them unsuitable for real-time tasks like speech recognition or streaming text generation, where you must produce output before seeing the full input.

## Deep RNNs (Stacking Layers)

Just as we stack convolutional layers for deeper feature extraction, we can stack RNN layers. In a deep RNN, the hidden state output of one RNN layer becomes the input sequence for the next:

Layer 1 processes the input sequence and produces hidden states h1_t
Layer 2 treats h1_t as its input and produces h2_t
Layer 3 treats h2_t as its input and produces h3_t

Each additional layer allows the network to learn more abstract representations of the sequence. In practice, 2-4 layers of LSTM or GRU are common. Beyond 4 layers, training becomes difficult (even with gating) and the benefits diminish.

Residual connections between stacked RNN layers help with gradient flow, just as they do in deep CNNs. This is sometimes called a **residual RNN** or a **deep residual RNN**.

## The Bigger Picture

LSTMs and GRUs represent the high-water mark of recurrent sequence modeling. They dominated NLP and time series tasks for several years and are still used today for certain applications (especially time series and tasks where the full sequence is not available upfront).

But they have a fundamental limitation: they process sequences **one step at a time**. Each hidden state must be computed before the next one can begin. This means RNN computation cannot be parallelized across time steps, making them much slower to train than architectures that can process the entire sequence simultaneously.

This sequential bottleneck, combined with the persistent (though mitigated) difficulty of learning very long-range dependencies, set the stage for the next great innovation in sequence modeling: the **attention mechanism**, which leads directly to the transformer architecture. We will explore attention after first looking at the sequence-to-sequence framework that made it necessary.
`
		},
		{
			slug: 'sequence-to-sequence',
			title: 'Sequence-to-Sequence Models',
			estimatedMinutes: 20,
			xpReward: 15,
			content: `
# Sequence-to-Sequence Models

Many important problems require mapping one sequence to another: translating English to French, summarizing a document, converting speech to text, generating a caption for an image. The sequences can be different lengths, which means we cannot simply map input position 1 to output position 1. We need an architecture that can *read* an entire input sequence and then *write* an output sequence of arbitrary length.

This is the **sequence-to-sequence (seq2seq)** framework, introduced by Sutskever, Vinyals, and Le (2014) and Cho et al. (2014). It consists of two components: an **encoder** that reads the input and an **decoder** that produces the output.

## The Encoder-Decoder Architecture

**The Encoder** is an RNN (typically LSTM or GRU) that processes the input sequence one token at a time. It does not produce any output at each step -- it simply updates its hidden state to absorb the input. After processing the entire input sequence, the encoder's final hidden state is a fixed-size vector that (ideally) encodes all the information from the input. This vector is called the **context vector** or **thought vector**.

**The Decoder** is a separate RNN that generates the output sequence, one token at a time. It is initialized with the encoder's context vector as its hidden state. At each step, it produces one output token, which is then fed back as input to the next step (along with the hidden state). This continues until the decoder produces a special "end of sequence" token.

<div class="callout callout-example"><div class="callout-title">Example</div>Translation of "I love cats" to French "J'aime les chats":

Encoder processes: "I" -> "love" -> "cats" -> [final hidden state = context vector]

Decoder (initialized with context vector):
Step 1: Produces "J'aime" (fed back as input)
Step 2: Receives "J'aime", produces "les"
Step 3: Receives "les", produces "chats"
Step 4: Receives "chats", produces [END]

The encoder compresses the meaning of the English sentence into the context vector. The decoder decompresses it into French.</div>

## The Bottleneck Problem

The seq2seq architecture has an elegant simplicity, but it has a critical weakness: the **bottleneck**.

All the information from the input sequence -- no matter how long -- must be compressed into a single fixed-size vector (the context vector). For short sentences, this works well. For long sentences or documents, it is like trying to squeeze a novel through a keyhole. Important details are inevitably lost.

Empirically, seq2seq models with vanilla encoder-decoder architectures show significant quality degradation as input length increases. A model that translates 10-word sentences well might struggle badly with 30-word sentences, because the context vector does not have enough capacity to store everything.

<div class="callout callout-think"><div class="callout-title">Think About It</div>The bottleneck is a spatial metaphor, but think of it temporally. When the decoder is generating the last word of a translation, the information about the first word of the input has passed through the entire encoder (accumulating in the context vector), then through the entire decoder. It has survived dozens of processing steps, each one potentially overwriting or degrading it. The longer the sequences, the more degradation occurs.</div>

## Teacher Forcing

During training, the decoder must generate one token at a time. But what happens when it generates a wrong token? If we feed the wrong token back as input to the next step, the error compounds -- each wrong token makes the next prediction harder, creating a cascade of errors.

**Teacher forcing** solves this by feeding the *correct* target token as input to the decoder at each step, regardless of what the decoder actually predicted. This means the decoder always sees the right context during training, which speeds up convergence and improves stability.

However, teacher forcing creates a discrepancy: during training, the decoder sees correct tokens (provided by the teacher), but during inference, it sees its own predictions (which may be wrong). This is called **exposure bias** -- the model is never exposed to its own mistakes during training, so it does not learn to recover from them.

**Scheduled sampling** is a compromise: during training, randomly choose whether to feed the correct token or the decoder's own prediction, with the probability of using the decoder's prediction increasing over the course of training. This gradually exposes the model to its own errors while maintaining the stability benefits of teacher forcing.

## Beam Search Decoding

At inference time, the decoder must choose a token at each step. The simplest approach is **greedy decoding**: at each step, pick the token with the highest probability. But greedy decoding can produce suboptimal results because the locally best choice at each step might not lead to the globally best sequence.

**Beam search** maintains the top-k most promising partial sequences (the "beam") at each step, rather than committing to a single best token. At each step:

1. For each of the k partial sequences, consider all possible next tokens
2. Score each resulting sequence (typically by log probability)
3. Keep only the top k sequences
4. Repeat until all sequences have generated an end token

With beam width k=1, beam search reduces to greedy decoding. With k=5-10, it typically produces significantly better translations. Larger beams are more expensive but provide diminishing returns beyond k=10-20.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>Beam search reveals a fundamental tension in sequence generation: the best sequence is not necessarily the one where each individual token is the most likely. Sometimes choosing a slightly less probable word early on leads to a much better overall sentence. Beam search navigates this by exploring multiple paths simultaneously, hedging against the risk of committing too early to a suboptimal choice.</div>

## The seq2seq Legacy

The encoder-decoder framework was a major breakthrough. For the first time, neural networks could handle arbitrary-length input-to-output mappings. Machine translation, text summarization, question answering, chatbots -- all became tractable.

But the bottleneck problem remained a fundamental limitation. The solution came not from making the context vector larger, but from allowing the decoder to look back at the *entire* encoder output at every generation step. This is the **attention mechanism**, and it is the subject of our final lesson in this module. Attention did not just improve seq2seq models -- it opened the door to the transformer architecture, which has revolutionized nearly every area of AI.
`
		},
		{
			slug: 'attention-mechanism',
			title: 'The Attention Mechanism',
			estimatedMinutes: 22,
			xpReward: 15,
			content: `
# The Attention Mechanism

The attention mechanism is, in my assessment, the single most consequential idea in modern deep learning. It solved the bottleneck problem in sequence-to-sequence models, enabled the construction of far more powerful translation systems, and -- most importantly -- led directly to the transformer architecture that powers GPT, BERT, and virtually every large language model.

## The Bottleneck, Revisited

Recall the problem: in a standard seq2seq model, the entire input sequence is compressed into a single fixed-size context vector. The decoder must reconstruct the output from this compressed representation alone, with no way to go back and re-read specific parts of the input.

This is like taking an exam with closed notes after reading a textbook once. You must rely entirely on what you remember (the context vector). If the textbook was short, your memory might suffice. If it was long, important details will be lost.

Attention says: **keep the book open during the exam.** Instead of compressing the entire input into one vector, let the decoder look back at all the encoder hidden states and focus on the most relevant ones at each generation step.

## The Mechanics of Attention

At each decoder time step t, attention computes three things:

**1. Alignment scores.** For each encoder hidden state h_i (one per input token), compute a score indicating how relevant it is to the current decoder state s_t:

score(s_t, h_i) = some function of s_t and h_i

These scores are called **alignment scores** because they measure how well the input at position i aligns with the output at position t.

**2. Attention weights.** Normalize the scores using softmax to get a probability distribution:

alpha_{t,i} = softmax(score(s_t, h_i))

The attention weights sum to 1. They represent how much "attention" the decoder should pay to each input position when generating the current output token.

**3. Context vector.** Compute a weighted sum of the encoder hidden states:

c_t = sum(alpha_{t,i} * h_i)

This context vector is a dynamic, step-specific summary of the input, focusing on the parts most relevant to the current output. Unlike the fixed context vector in vanilla seq2seq, this context vector changes at every decoder step.

The decoder then uses c_t (along with its own state s_t) to generate the output token.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>Without attention, the decoder receives the same context vector at every step -- a fixed summary of the entire input. With attention, the decoder receives a *different* context vector at every step, customized to focus on the input positions most relevant to the current output. This is the difference between taking an exam from memory and taking an open-book exam where you can look up specific passages as needed.</div>

## Bahdanau Attention (Additive Attention)

The first attention mechanism was proposed by Bahdanau, Cho, and Bengio in their 2014 paper "Neural Machine Translation by Jointly Learning to Align and Translate." Their scoring function uses a small neural network:

**score(s_t, h_i) = v^T * tanh(W_1 * s_t + W_2 * h_i)**

This is called **additive attention** because the query (decoder state) and key (encoder state) are combined by addition inside the tanh. The learnable parameters (v, W_1, W_2) allow the network to learn which input-output alignments are useful.

Bahdanau attention was originally applied to machine translation and produced dramatic improvements, particularly on long sentences -- exactly where the bottleneck problem was most severe. On sentences of 30+ words, attention improved BLEU scores (a standard translation quality metric) by several points.

## Luong Attention (Multiplicative Attention)

Luong et al. (2015) proposed a simpler scoring function:

**score(s_t, h_i) = s_t^T * W * h_i** (general)

or even simpler:

**score(s_t, h_i) = s_t^T * h_i** (dot product)

These are called **multiplicative attention** because the query and key interact through multiplication rather than addition. Dot-product attention is computationally cheaper than additive attention and has become the standard, especially in transformers (where it is called "scaled dot-product attention").

The scaling in the transformer's attention (dividing by sqrt(d_k), where d_k is the key dimension) prevents the dot products from becoming too large in high dimensions, which would cause the softmax to produce nearly one-hot distributions with very small gradients.

## Attention Weights as Alignment

One of the most compelling properties of attention is **interpretability**. The attention weights alpha_{t,i} directly indicate which input tokens the model is focusing on when generating each output token. You can visualize these weights as a heatmap (input positions on one axis, output positions on the other), and the resulting pattern often reveals meaningful alignments.

For machine translation, the attention heatmap typically shows a roughly diagonal pattern (input word i corresponds to output word i, plus or minus some reordering), with deviations that correspond to syntactic differences between languages. For English-to-French translation, "the red car" -> "la voiture rouge" shows the attention weights shifting: when generating "rouge" (the third French word), the model attends to "red" (the second English word).

<div class="callout callout-example"><div class="callout-title">Example</div>Consider translating "The agreement on the European Economic Area was signed in August 1992" to French. When the decoder generates the French word for "European," it should attend most strongly to "European" in the English input. When it generates the French word for "1992," it should attend to "1992." The attention mechanism learns these correspondences automatically, without any explicit alignment supervision.</div>

<!-- interactive:AttentionVisualizer -->

## Beyond Translation: Attention as a General Mechanism

Once attention was introduced for translation, researchers quickly realized it was applicable far beyond seq2seq models:

**Self-attention:** Instead of attending from a decoder to an encoder, a sequence can attend to *itself*. Each position computes attention over all other positions in the same sequence, allowing the model to capture dependencies between any two positions regardless of distance. This is the core operation of the transformer.

**Image attention:** In image captioning, attention allows the model to focus on different parts of the image when generating each word of the caption. When producing "dog," it attends to the dog region. When producing "frisbee," it attends to the frisbee.

**Document attention:** In document summarization, attention identifies which sentences are most relevant to the summary being generated.

## The Bridge to Transformers

Attention was introduced as an add-on to RNN-based seq2seq models. The recurrent structure was still there -- attention simply gave the decoder a way to look back at the encoder. The processing was still sequential, one token at a time.

In 2017, Vaswani et al. asked a radical question: **what if we get rid of the RNN entirely and use only attention?** Their paper, "Attention Is All You Need," introduced the **transformer** -- an architecture built entirely from self-attention layers, with no recurrence at all.

The transformer can process all positions in a sequence simultaneously (massive parallelism, fully utilizing GPUs), can attend from any position to any other position without distance decay (solving long-range dependencies), and scales to enormous model sizes (billions of parameters).

<div class="callout callout-think"><div class="callout-title">Think About It</div>The journey from vanilla RNNs to transformers follows a clear arc: (1) RNNs introduced recurrent state for sequence modeling, but suffered from vanishing gradients. (2) LSTMs/GRUs solved vanishing gradients with gating, but were still sequential and struggled with very long dependencies. (3) Attention allowed looking at the full input, solving the bottleneck, but was still attached to RNNs. (4) Transformers removed the RNN entirely, using self-attention as the only mechanism for both sequence modeling and long-range dependencies. Each step solved the previous step's limitation.</div>

The transformer has since become the dominant architecture not just for NLP, but for vision (Vision Transformers), audio (Whisper), protein folding (AlphaFold), and virtually every domain where sequences or structured data appear. Understanding the attention mechanism is the key to understanding transformers, which is the key to understanding modern AI.

The attention mechanism began as a practical solution to the bottleneck problem in machine translation. It ended as the foundation of the most powerful AI systems ever built. Few ideas in the history of computing have had such an outsized impact relative to their simplicity.
`
		}
	],
	quiz: {
		questions: [
			{
				type: 'multiple-choice',
				id: 'rnn-q1',
				question:
					'Why are feedforward networks (MLPs) unsuitable for processing sequential data?',
				options: [
					'They cannot learn nonlinear functions',
					'They have a fixed input size and no memory across time steps',
					'They are too computationally expensive for sequences',
					'They can only process numerical data, not text or audio'
				],
				correctIndex: 1,
				explanation:
					'Feedforward networks require a fixed-size input and process each input independently with no memory of previous inputs. Sequences have variable length and their meaning depends on order and context, both of which feedforward networks cannot capture.'
			},
			{
				type: 'fill-in',
				id: 'rnn-q2',
				question:
					'The training algorithm for RNNs that propagates gradients backward through the unrolled time steps is called Backpropagation Through _____.',
				acceptedAnswers: ['Time', 'time', 'BPTT'],
				explanation:
					'Backpropagation Through Time (BPTT) is the standard training algorithm for RNNs. The RNN is unrolled across time steps, creating a deep feedforward-like graph, and standard backpropagation is applied to compute gradients flowing backward through time.'
			},
			{
				type: 'multiple-choice',
				id: 'rnn-q3',
				question:
					'What causes the vanishing gradient problem in vanilla RNNs?',
				options: [
					'The hidden state vector is too small',
					'The learning rate is too low',
					'Gradients are multiplied by the recurrent weight matrix at each time step, causing exponential decay',
					'The input sequences are too long for the network to process'
				],
				correctIndex: 2,
				explanation:
					'At each time step, the gradient is multiplied by the weight matrix W_hh and passed through the tanh derivative. Over T time steps, the gradient is effectively multiplied by these factors T times. When the largest eigenvalue of W_hh is less than 1, this product shrinks exponentially, making it impossible to learn long-range dependencies.'
			},
			{
				type: 'multiple-choice',
				id: 'rnn-q4',
				question: 'How does the LSTM cell state solve the vanishing gradient problem?',
				options: [
					'By using a larger hidden state vector',
					'By eliminating the need for backpropagation',
					'By providing an additive path (gradient highway) that allows gradients to flow through time without exponential decay',
					'By using a different activation function'
				],
				correctIndex: 2,
				explanation:
					'The LSTM cell state is updated additively (C_t = f_t * C_{t-1} + i_t * C_tilde). When the forget gate f_t is near 1, gradients flow through the cell state virtually unchanged, creating a "gradient highway" analogous to skip connections in ResNet. This prevents the exponential decay that plagues vanilla RNNs.'
			},
			{
				type: 'ordering',
				id: 'rnn-q5',
				question:
					'Order the LSTM gate operations in the correct sequence for processing one time step:',
				items: [
					'Compute output gate and hidden state',
					'Compute forget gate',
					'Compute input gate and candidate values',
					'Update cell state'
				],
				correctOrder: [1, 2, 3, 0],
				explanation:
					'The LSTM first computes the forget gate (what to discard from cell state), then the input gate and candidate values (what new information to add), then updates the cell state using these gates, and finally computes the output gate to determine what to expose as the hidden state.'
			},
			{
				type: 'multiple-choice',
				id: 'rnn-q6',
				question:
					'What is the key simplification of GRU compared to LSTM?',
				options: [
					'GRU uses a single gate that controls both forgetting and updating, and merges the cell state and hidden state',
					'GRU eliminates all gating mechanisms',
					'GRU uses convolutional operations instead of recurrent ones',
					'GRU can only process fixed-length sequences'
				],
				correctIndex: 0,
				explanation:
					'GRU reduces the LSTM\'s three gates to two (update and reset), and merges the separate cell state and hidden state into a single hidden state. The update gate simultaneously controls forgetting and adding, trading some flexibility for simplicity and speed.'
			},
			{
				type: 'fill-in',
				id: 'rnn-q7',
				question:
					'In the sequence-to-sequence framework, the fixed-size vector produced by the encoder that summarizes the entire input is called the _____ vector.',
				acceptedAnswers: ['context', 'Context', 'thought', 'Thought'],
				explanation:
					'The context vector (also called the thought vector) is the encoder\'s final hidden state, which is meant to encode all the information from the input sequence into a fixed-size representation. This vector initializes the decoder, which generates the output sequence from it.'
			},
			{
				type: 'multiple-choice',
				id: 'rnn-q8',
				question:
					'What problem does the attention mechanism solve in seq2seq models?',
				options: [
					'It speeds up training by parallelizing computation',
					'It eliminates the need for an encoder',
					'It allows the decoder to focus on relevant parts of the input at each step, solving the information bottleneck',
					'It reduces the number of parameters in the model'
				],
				correctIndex: 2,
				explanation:
					'The attention mechanism lets the decoder compute a different, dynamic context vector at each generation step by taking a weighted sum of all encoder hidden states. This means the decoder can focus on specific parts of the input relevant to the current output, rather than relying on a single compressed context vector.'
			},
			{
				type: 'multiple-choice',
				id: 'rnn-q9',
				question:
					'What does beam search do during sequence generation?',
				options: [
					'It trains the model using multiple random initializations',
					'It maintains the top-k most promising partial sequences at each step instead of committing to a single best token',
					'It searches for the optimal learning rate',
					'It removes low-probability tokens from the vocabulary'
				],
				correctIndex: 1,
				explanation:
					'Beam search explores multiple candidate sequences in parallel (the "beam"). At each step, it extends all current candidates with all possible next tokens, scores the results, and keeps only the top k. This finds better overall sequences than greedy decoding (which commits to one token at each step) at the cost of k times more computation.'
			},
			{
				type: 'multiple-choice',
				id: 'rnn-q10',
				question:
					'How did the attention mechanism lead to the development of transformers?',
				options: [
					'Transformers added attention to convolutional networks',
					'Researchers realized attention alone (without any recurrence) could model sequences, enabling full parallelization',
					'Transformers replaced attention with a simpler mechanism',
					'Attention was found to only work with RNNs, so transformers were developed as a separate approach'
				],
				correctIndex: 1,
				explanation:
					'The transformer architecture ("Attention Is All You Need," 2017) demonstrated that self-attention alone, without any recurrent connections, could model sequences effectively. By removing recurrence, transformers could process all positions in parallel, enabling massive speedups and scaling to much larger models.'
			}
		],
		passingScore: 7
	}
};

export default rnnsSequences;
