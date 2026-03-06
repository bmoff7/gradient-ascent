import type { Module } from '../types';

const neuralNetworks: Module = {
	slug: 'neural-networks',
	title: 'Neural Networks from Scratch',
	description:
		'Build your understanding of neural networks from the ground up -- starting with biological neurons and ending with the backpropagation algorithm that makes deep learning possible.',
	estimatedMinutes: 120,
	xpReward: 90,
	quizXpReward: 50,
	lessons: [
		{
			slug: 'biological-inspiration',
			title: 'The Biological Inspiration',
			estimatedMinutes: 18,
			xpReward: 15,
			content: `
# The Biological Inspiration

Your brain is, without exaggeration, the most complex object we have ever discovered in the universe. Roughly 86 billion neurons, each connected to thousands of others, form a web of approximately 100 *trillion* synaptic connections. This biological network lets you recognize faces in a crowd, compose music, feel emotions, and -- right now -- read and understand these very words.

When researchers in the 1940s first dreamed of building machines that could "think," they naturally looked to the brain for blueprints. What followed was one of the most productive acts of *selective plagiarism* in scientific history: borrowing just enough from neuroscience to build something useful, while cheerfully ignoring everything that was too complicated.

## The Real Neuron

A biological neuron is a specialized cell with three main components:

**Dendrites** -- tree-like branches that receive signals from other neurons. Think of them as the neuron's "inbox." A single neuron might have thousands of dendrites, each listening to a different sender.

**Cell body (soma)** -- the neuron's processing center. It collects all the incoming signals and performs a kind of tally. If the combined incoming signal is strong enough, the neuron "fires." If not, it stays quiet. This threshold behavior is crucial -- neurons are not simple relays that pass along every signal. They *decide*.

**Axon** -- a long cable that carries the neuron's output signal to other neurons. When the neuron fires, an electrical impulse (the "action potential") races down the axon at speeds up to 120 meters per second. At the end of the axon, chemicals called neurotransmitters jump across tiny gaps (synapses) to reach the dendrites of neighboring neurons.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>The connection between two neurons is not just "on" or "off." Synapses have varying *strengths*. A synapse that has been activated repeatedly becomes stronger (a phenomenon called Long-Term Potentiation), while neglected synapses weaken. This is the biological basis of learning -- the mantra neuroscientists use is "neurons that fire together, wire together."</div>

## The Simplification: What We Keep

Artificial neural networks borrow three key ideas from biology:

1. **Weighted inputs.** Just as dendrites receive signals of varying strengths, an artificial neuron receives numerical inputs, each multiplied by a *weight*. Larger weights mean that input matters more -- just like a stronger synapse.

2. **Summation and threshold.** The cell body sums up incoming signals and fires if they cross a threshold. An artificial neuron sums its weighted inputs and passes the result through an *activation function* that determines the output.

3. **Network structure.** Biological neurons are connected in networks. Artificial neurons are arranged in layers, with the output of one layer feeding into the input of the next.

That is genuinely it. Three ideas, lifted from a system of staggering complexity, simplified down to multiplication, addition, and a nonlinear function. And yet -- astonishingly -- this is enough to build systems that can translate languages, drive cars, and beat world champions at Go.

## What We Discard

The list of things artificial neural networks *ignore* about real brains is far longer than the list of things they keep. Understanding these differences matters, because it tempers unrealistic expectations about AI and highlights opportunities for future research.

**Timing and spikes.** Real neurons communicate through precisely timed electrical spikes. The *pattern* of spikes -- not just their presence or absence -- carries information. Artificial neurons, by contrast, pass around continuous real numbers. There is an entire subfield called "spiking neural networks" that tries to model this temporal coding, but mainstream deep learning ignores it entirely.

**Chemical diversity.** The brain uses over 100 different neurotransmitters -- dopamine, serotonin, GABA, glutamate, and many more -- each with different effects. Artificial neurons have a single type of connection.

**Structural complexity.** A real neuron is not a point; it is a complex three-dimensional cell with elaborate branching. The dendrites themselves perform computation. Artificial neurons are modeled as single mathematical functions.

**Energy efficiency.** Your brain operates on about 20 watts -- roughly the power of a dim light bulb. Training a large language model can consume megawatts. The brain's energy efficiency is something we have not come close to replicating.

**Neuroplasticity and growth.** The brain can grow new connections, prune old ones, and even repurpose entire regions after injury. Artificial networks have a fixed architecture once designed (though research on neural architecture search is closing this gap).

<div class="callout callout-think"><div class="callout-title">Think About It</div>The fact that we threw away almost everything about how real brains work -- and still built incredibly powerful systems -- tells us something profound. It suggests that the *principles* (weighted connections, nonlinear processing, learning through adjustment) matter more than the biological details. The brain inspired the idea, but modern neural networks have become their own thing.</div>

## The McCulloch-Pitts Neuron (1943)

The story of artificial neural networks begins with a remarkable paper by neurophysiologist Warren McCulloch and logician Walter Pitts. In 1943, they proposed the first mathematical model of a neuron.

Their model was elegantly simple: a neuron receives binary inputs (0 or 1), each with an associated weight. It sums the weighted inputs and compares the result to a threshold. If the sum meets or exceeds the threshold, the neuron outputs 1. Otherwise, it outputs 0.

Mathematically:

**output = 1** if (w1*x1 + w2*x2 + ... + wn*xn) >= threshold, else **output = 0**

McCulloch and Pitts proved something remarkable: networks of these simple binary neurons could compute *any* logical function -- AND, OR, NOT, and therefore any combination of them. Since all of digital computing can be built from logic gates, this meant (in theory) that networks of neurons could compute anything a digital computer could.

<div class="callout callout-example"><div class="callout-title">Example</div>Consider a McCulloch-Pitts neuron implementing AND. It receives two binary inputs, x1 and x2, each with weight 1. The threshold is 2. The neuron outputs 1 only when *both* inputs are 1 (since 1+1 = 2 >= threshold). When either input is 0, the sum is at most 1, which falls below the threshold. You have just built a logic gate from a model of a brain cell.</div>

However, the McCulloch-Pitts model had a critical limitation: the weights were *fixed*. You, the designer, had to figure out the right weights by hand. There was no learning algorithm. The neuron could compute, but it could not *learn*.

This limitation set the stage for the next breakthrough -- Frank Rosenblatt's perceptron, which could adjust its own weights automatically. The jump from "computing" to "learning" would change everything.

## Why This History Matters

You might wonder why we are spending time on models from the 1940s when modern networks have billions of parameters. The reason is that every deep learning system you will encounter -- from GPT to AlphaFold -- is built on these same foundational ideas. Weighted inputs, summation, nonlinear activation, layered architecture. The scale has changed by many orders of magnitude, but the conceptual DNA is identical.

Understanding these foundations does not just give you historical context. It gives you *intuition*. When you encounter concepts like weight initialization, gradient flow, or skip connections later in this track, you will understand *why* they matter, because you understand the fundamental mechanism they are all in service of: getting the right signals to flow through a network of simple computational units.

The brain inspired us to begin this journey. Now let us see where mathematics and engineering took it.
`
		},
		{
			slug: 'the-perceptron',
			title: 'The Perceptron',
			estimatedMinutes: 22,
			xpReward: 15,
			content: `
# The Perceptron

In 1957, a psychologist at the Cornell Aeronautical Laboratory named Frank Rosenblatt introduced the world to the **perceptron** -- and nothing in AI was ever quite the same. The McCulloch-Pitts neuron could compute, but you had to hand-wire it. The perceptron could *learn*. Given examples, it would figure out the right weights on its own.

The New York Times ran a story declaring that the Navy had built a computer that could "learn to recognize what it sees" and would eventually "walk, talk, see, write, reproduce itself and be conscious of its existence." The hype was, to put it gently, premature. But the core idea was real, important, and still alive in every neural network today.

## The Perceptron Model

A perceptron takes a vector of real-valued inputs, multiplies each by a learnable weight, sums them up, adds a bias term, and passes the result through a step function:

**output = step(w1*x1 + w2*x2 + ... + wn*xn + b)**

where step(z) = 1 if z >= 0, else 0.

Think of the perceptron as a judge evaluating evidence. Each input is a piece of evidence. Each weight represents how important that evidence is (and whether it supports a "yes" or "no" verdict -- negative weights count *against*). The bias is the judge's prior inclination. After weighing all the evidence, the judge renders a binary verdict.

The key innovation over McCulloch-Pitts is that the weights and bias are *learned from data*, not hand-designed.

## Linear Classification

What does a perceptron actually compute? Geometrically, the equation w1*x1 + w2*x2 + b = 0 defines a **line** (or, in higher dimensions, a hyperplane). The perceptron classifies inputs on one side of this line as class 1 and inputs on the other side as class 0.

Imagine scattering red and blue dots on a table. The perceptron is trying to find a straight line that separates all the red dots from all the blue dots. If such a line exists, the data is called **linearly separable**, and the perceptron will find it.

This is a powerful idea. Many real-world classification problems *are* approximately linearly separable, especially once you engineer the right input features. Spam vs. not-spam, fraudulent vs. legitimate transactions, tumor vs. healthy tissue -- when the right features are measured, a straight boundary often does surprisingly well.

## The Perceptron Learning Rule

The learning algorithm is beautifully simple. Rosenblatt proved it would converge to a correct solution whenever one exists:

1. Initialize weights and bias to small random values (or zeros).
2. For each training example (x, y) where y is the true label:
   - Compute the prediction: y_hat = step(w . x + b)
   - If y_hat == y, do nothing (the perceptron got it right).
   - If y_hat == 0 but y == 1 (missed a positive), *add* the input to the weights: w = w + x, b = b + 1
   - If y_hat == 1 but y == 0 (false positive), *subtract* the input from the weights: w = w - x, b = b - 1
3. Repeat until no errors remain.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>The learning rule is driven entirely by errors. When the perceptron is correct, nothing changes. When it is wrong, it nudges the weights in the direction that would have produced the correct answer. This "learn from mistakes" philosophy is the ancestor of all gradient-based learning in modern deep learning.</div>

The intuition is physical. Imagine the weight vector as an arrow pointing in some direction. When the perceptron misclassifies a positive example, it rotates the arrow *toward* that example. When it misclassifies a negative example, it rotates *away*. Over time, the arrow settles into an orientation that correctly separates the two classes.

**The Perceptron Convergence Theorem** states that if the training data is linearly separable, the perceptron learning rule is guaranteed to converge in a finite number of steps. This was one of the first mathematical guarantees in machine learning, and it caused enormous excitement.

<!-- interactive:PerceptronLab -->

## What Perceptrons Cannot Do: The XOR Problem

In 1969, Marvin Minsky and Seymour Papert published a book called *Perceptrons* that delivered a devastating blow. They proved, rigorously, that a single perceptron cannot learn certain simple functions -- most famously, XOR (exclusive or).

XOR takes two binary inputs and outputs 1 when exactly one input is 1:

| x1 | x2 | XOR |
|----|----|----|
| 0  | 0  |  0 |
| 0  | 1  |  1 |
| 1  | 0  |  1 |
| 1  | 1  |  0 |

If you plot these four points on a 2D plane, with the class labeled by the XOR output, you will see that no single straight line can separate the 1s from the 0s. The positive examples (0,1) and (1,0) are on *opposite corners* of a square, as are the negative examples (0,0) and (1,1). Any line that puts (0,1) on the "positive" side will inevitably include one of the negative examples too.

<div class="callout callout-example"><div class="callout-title">Example</div>Imagine you are sorting marbles on a table. Red marbles sit at the top-left and bottom-right corners. Blue marbles sit at the top-right and bottom-left corners. Now try to separate them with a single straight ruler. You cannot do it. You would need a curved boundary, or two separate lines. This is exactly the XOR problem.</div>

Minsky and Papert showed that XOR was just one example of a large class of problems that single-layer perceptrons could not solve. Any function requiring consideration of how inputs *interact* (rather than just their individual contributions) was out of reach.

## The AI Winter

The impact of Minsky and Papert's book went far beyond mathematics. It triggered a collapse in neural network research funding that lasted over a decade -- the first "AI winter."

The cruel irony is that Minsky and Papert *knew* that multi-layer networks could solve XOR. They said so in their book. But they argued (correctly, at the time) that no one had a good algorithm for *training* multi-layer networks. Without a learning rule for hidden layers, stacking perceptrons was interesting in theory but useless in practice.

Funding dried up. Researchers moved to other approaches -- symbolic AI, expert systems, logic programming. Neural networks became an academic backwater.

It would take until the 1980s, when the backpropagation algorithm was popularized (we will cover this in detail later in this module), for neural networks to make their comeback. But the comeback, when it came, was spectacular.

## The Perceptron's Legacy

Despite its limitations, the perceptron established ideas that remain central to all of deep learning:

- **Learnable weights.** The model adjusts its own parameters based on data, rather than being hand-programmed.
- **Error-driven learning.** Updates happen in response to mistakes, pushing the model toward better performance.
- **The importance of representation.** The XOR problem showed that the *representation* of the input matters as much as the learning algorithm. With the right features, linear classification is powerful. With the wrong features, it is helpless. This insight -- that learning good representations is the core challenge -- would become the central theme of deep learning.
- **The decision boundary.** Thinking of classification as finding a boundary in feature space is a geometric intuition that scales to arbitrarily complex models.

The perceptron was a beginning, not an end. Its limitations pointed the way forward: to solve harder problems, we need more layers, nonlinear activation functions, and an algorithm that can train them all. That is exactly where we are headed next.
`
		},
		{
			slug: 'multi-layer-perceptrons',
			title: 'Multi-Layer Perceptrons',
			estimatedMinutes: 20,
			xpReward: 15,
			content: `
# Multi-Layer Perceptrons

The perceptron's XOR problem had a straightforward solution, at least in principle: stack multiple layers of neurons. If one line cannot separate the data, perhaps *two* lines can carve the space into the right regions, and a final neuron can combine those regions into the correct classification. This is the idea behind the **Multi-Layer Perceptron (MLP)**, also called a feedforward neural network.

## Solving XOR with Two Layers

Let us return to the XOR problem and solve it by hand. We need a network with:

- 2 input neurons (for x1 and x2)
- 2 hidden neurons (the "hidden layer")
- 1 output neuron

Here is one solution. Hidden neuron h1 computes OR (fires when at least one input is 1). Hidden neuron h2 computes NAND (fires when it is NOT the case that both inputs are 1). The output neuron computes AND on the hidden layer outputs.

| x1 | x2 | h1 (OR) | h2 (NAND) | output (AND) |
|----|----|----|----|----|
| 0  | 0  |  0 |  1 |  0 |
| 0  | 1  |  1 |  1 |  1 |
| 1  | 0  |  1 |  1 |  1 |
| 1  | 1  |  1 |  0 |  0 |

The output column matches XOR exactly. The hidden layer has *transformed* the representation of the data. In the original (x1, x2) space, the classes were not linearly separable. In the transformed (h1, h2) space, they are. The output neuron just draws a straight line in this new space.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>This is the fundamental insight of deep learning: each layer transforms the data into a new representation where the problem becomes progressively easier to solve. The hidden layers are not just adding computational power -- they are learning to *represent* the data in more useful ways.</div>

## Anatomy of an MLP

An MLP consists of three types of layers:

**Input layer.** Not really a "layer" of computation -- it simply holds the input features and passes them to the first hidden layer. If your data has 784 features (like a flattened 28x28 image), the input layer has 784 neurons.

**Hidden layers.** These are where the magic happens. Each neuron in a hidden layer receives inputs from *every* neuron in the previous layer (this is called a "fully connected" or "dense" layer), applies weights and a bias, and passes the result through a nonlinear activation function. You can stack as many hidden layers as you want, and each can have a different number of neurons.

**Output layer.** Produces the final prediction. For binary classification, this is typically a single neuron with a sigmoid activation (outputting a probability between 0 and 1). For multi-class classification with k classes, this is k neurons with a softmax activation (outputting k probabilities that sum to 1). For regression, this is one or more neurons with no activation (or a linear activation).

Each connection between neurons in adjacent layers has its own learnable weight. A network with layers of sizes [784, 256, 128, 10] has 784*256 + 256*128 + 128*10 = 234,624 weight parameters, plus biases.

## The Universal Approximation Theorem

In 1989, George Cybenko proved a result that gave the field enormous confidence: **a feedforward network with a single hidden layer containing a finite number of neurons can approximate any continuous function on a compact subset of R^n to arbitrary accuracy**, provided the activation function satisfies certain mild conditions (basically, it needs to be nonlinear).

This is the **Universal Approximation Theorem**, and it sounds like it is saying "one hidden layer is all you need." But there is a critical subtlety that trips up many beginners.

<div class="callout callout-warning"><div class="callout-title">Warning</div>The Universal Approximation Theorem says a solution *exists* -- it does not say you can *find* it. It says nothing about how many hidden neurons you would need (the answer can be astronomically large), how much training data you would need, or whether gradient descent will converge to the right weights. It is an existence proof, not a practical recipe.</div>

Think of it this way: the theorem says "somewhere in the vast space of possible weight configurations, there is one that solves your problem." But that space might be enormous, and finding the right configuration might be intractably difficult with a single wide layer.

This is why, in practice, *deeper* networks (more layers) dramatically outperform *wider* networks (more neurons in a single layer) for complex tasks. Depth enables hierarchical feature learning -- early layers detect simple patterns, middle layers combine them into more complex features, and late layers assemble those into task-relevant abstractions. This hierarchy is far more efficient than trying to do everything in one step.

## Architecture Design

Designing an MLP architecture is part science, part art. Here are the key decisions:

**Number of hidden layers.** For simple tabular data, 1-3 hidden layers often suffice. For complex tasks, deeper networks are typically better, though they bring challenges (vanishing gradients, harder optimization) that we will address in later modules.

**Width of each layer.** Common choices include keeping all hidden layers the same width, or using a "funnel" shape that gradually narrows toward the output. A layer with 256 neurons can represent up to 2^256 distinct activation patterns -- far more than there are atoms in the observable universe. You usually do not need layers that wide.

**Activation functions.** Every hidden layer needs a nonlinear activation function (we will explore these in the next lesson). The output layer's activation depends on the task.

<div class="callout callout-example"><div class="callout-title">Example</div>Consider classifying handwritten digits (0-9) from 28x28 grayscale images. A reasonable MLP architecture might be: Input (784) -> Hidden (512, ReLU) -> Hidden (256, ReLU) -> Hidden (128, ReLU) -> Output (10, softmax). This gives approximately 535,000 parameters. Each hidden layer progressively compresses the representation, extracting increasingly abstract features, until the final layer maps to 10 class probabilities.</div>

**A note on naming.** You will see various terms used interchangeably: multi-layer perceptron (MLP), feedforward neural network, fully connected network, dense network. These all refer to essentially the same architecture. "Feedforward" emphasizes that information flows in one direction (input to output) with no loops. This distinguishes it from recurrent neural networks, which we will cover later.

## The Missing Piece

We now have a powerful architecture: multiple layers of neurons that can, in theory, learn any function. But we skipped over a crucial question: **how do we train it?**

The perceptron learning rule only works for a single layer. When there are hidden layers, we cannot directly see what the "correct" output of a hidden neuron should be -- that is why it is called "hidden." We know the desired output of the network as a whole, but how do we assign credit or blame to individual neurons deep inside the network?

This is the **credit assignment problem**, and solving it required the development of the backpropagation algorithm. Before we get there, we first need to understand activation functions and forward propagation. The pieces are coming together -- but we need all of them before the full picture emerges.
`
		},
		{
			slug: 'activation-functions',
			title: 'Activation Functions',
			estimatedMinutes: 20,
			xpReward: 15,
			content: `
# Activation Functions

Imagine a network where every neuron simply computes a weighted sum of its inputs -- no activation function, or equivalently, a linear activation. What happens? No matter how many layers you stack, the entire network collapses into a single linear transformation. A 100-layer linear network is mathematically equivalent to a single-layer linear network. All that depth gives you nothing.

This is not just a theoretical concern; it is easy to prove. If layer 1 computes y1 = W1*x + b1, and layer 2 computes y2 = W2*y1 + b2, then y2 = W2*(W1*x + b1) + b2 = (W2*W1)*x + (W2*b1 + b2), which is just another linear function of x. You can collapse those two matrices into one. Stack a hundred layers: same result.

**Activation functions break this linearity.** They introduce the nonlinear "kinks" and "curves" that allow neural networks to model complex, non-linear relationships. They are the reason deep networks are deep in any meaningful sense.

## The Activation Function Zoo

### Sigmoid

**Formula:** sigma(z) = 1 / (1 + e^(-z))

**Output range:** (0, 1)

The sigmoid function was the original workhorse of neural networks. It squashes any real number into the range (0, 1), which made it appealing for several reasons: the output can be interpreted as a probability, it is smooth and differentiable everywhere, and it loosely mimics the firing rate of biological neurons.

However, sigmoid has serious problems for deep networks:

- **Vanishing gradients.** When the input is very large or very small, the sigmoid saturates -- its derivative approaches zero. During backpropagation, gradients get multiplied across layers, and near-zero gradients in one layer mean near-zero gradients for all layers before it. Deep networks with sigmoids learn agonizingly slowly, if at all.
- **Not zero-centered.** The output is always positive, which means gradients on the weights are always all-positive or all-negative, causing inefficient zigzagging during optimization.
- **Expensive.** The exponential function is computationally more costly than simpler alternatives.

Sigmoid is still used in the output layer for binary classification, but almost never in hidden layers of modern networks.

### Tanh (Hyperbolic Tangent)

**Formula:** tanh(z) = (e^z - e^(-z)) / (e^z + e^(-z))

**Output range:** (-1, 1)

Tanh is essentially a rescaled sigmoid: tanh(z) = 2*sigmoid(2z) - 1. It fixes the zero-centering problem (outputs range from -1 to 1, centered at 0), which generally leads to faster convergence than sigmoid.

However, tanh still suffers from vanishing gradients at extreme values. For the same reason as sigmoid, it is not commonly used in modern deep hidden layers. You will still encounter it in certain contexts, particularly in recurrent neural networks (LSTMs and GRUs use tanh internally).

### ReLU (Rectified Linear Unit)

**Formula:** ReLU(z) = max(0, z)

**Output range:** [0, infinity)

ReLU was the breakthrough that made training deep networks practical. Introduced to deep learning in a 2010 paper by Nair and Hinton, it is embarrassingly simple: if the input is positive, pass it through unchanged. If it is negative, output zero.

Why is something so simple so effective?

- **No vanishing gradient (for positive inputs).** The derivative of ReLU is exactly 1 for positive inputs, meaning gradients flow through without shrinking. This allows training much deeper networks.
- **Sparse activation.** For any given input, roughly half the neurons output exactly zero. This sparsity is computationally efficient and may act as a form of regularization.
- **Computationally trivial.** It is just a comparison and a branch -- no exponentials needed.

<div class="callout callout-warning"><div class="callout-title">Warning</div>ReLU has a failure mode called the "dying ReLU" problem. If a neuron's weights get pushed to values where the weighted input is always negative, the neuron will always output zero. Since the gradient of ReLU at zero is also zero, the neuron can never recover -- it is permanently "dead." In extreme cases, a large fraction of a network's neurons can die during training.</div>

### Leaky ReLU

**Formula:** LeakyReLU(z) = z if z > 0, else alpha * z (typically alpha = 0.01)

**Output range:** (-infinity, infinity)

Leaky ReLU addresses the dying ReLU problem by allowing a small, non-zero gradient for negative inputs. Instead of outputting exactly zero for negative values, it outputs a small fraction (typically 1%) of the input. This means neurons can always recover from unfavorable weight configurations.

A variant called **Parametric ReLU (PReLU)** makes alpha a learnable parameter, letting the network decide how much to "leak."

### GELU (Gaussian Error Linear Unit)

**Formula:** GELU(z) = z * Phi(z), where Phi is the standard Gaussian cumulative distribution function

**Output range:** approximately (-0.17, infinity)

GELU was introduced in 2016 and rose to prominence through its use in BERT, GPT, and most modern transformer architectures. Unlike ReLU, which makes a hard decision (pass or block), GELU makes a *soft* decision. It smoothly interpolates between passing the input through and blocking it, with the probability of passing proportional to how large the input is.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>Think of ReLU as a binary gate: open or closed. GELU is more like a dimmer switch: it gradually lets more signal through as the input increases. This smoother behavior can lead to better optimization landscapes, which is why it has become the default in transformer-based architectures.</div>

### Swish

**Formula:** Swish(z) = z * sigmoid(z)

**Output range:** approximately (-0.28, infinity)

Discovered by Google Brain in 2017 through automated search over activation functions, Swish shares many properties with GELU. It is smooth, non-monotonic (it dips slightly below zero for negative inputs before rising), and has been shown to outperform ReLU on deeper networks. Swish and GELU behave very similarly and are often used interchangeably.

<!-- interactive:ActivationExplorer -->

## Properties That Matter

When choosing an activation function, four properties matter most:

**1. Non-linearity.** This is non-negotiable. Without non-linearity, depth is meaningless. All the functions above (except the identity/linear function) satisfy this requirement.

**2. Gradient behavior.** Does the gradient vanish for extreme inputs? Sigmoid and tanh suffer from this. Does the gradient die for negative inputs? Standard ReLU has this problem. The ideal activation maintains healthy gradient flow across a wide range of inputs.

**3. Computational cost.** ReLU is a single comparison. Sigmoid requires an exponential. GELU requires computing a Gaussian CDF (or an approximation). In practice, the activation function is applied billions of times during training, so even small differences in computational cost can add up. That said, on modern hardware, the difference is usually negligible compared to the cost of matrix multiplications.

**4. Output range and centering.** Zero-centered outputs (like tanh) can help optimization. Unbounded positive outputs (like ReLU) can be useful but may need careful initialization and normalization to prevent activations from exploding.

## Practical Recommendations

For most projects, the choice is straightforward:

- **Hidden layers in feedforward networks and CNNs:** Start with ReLU. If you encounter dying ReLU problems, try Leaky ReLU or GELU.
- **Hidden layers in transformers:** GELU is standard.
- **Output layer for binary classification:** Sigmoid.
- **Output layer for multi-class classification:** Softmax (which we will cover when discussing output layers in more detail).
- **Output layer for regression:** Linear (no activation).
- **Recurrent networks (LSTM/GRU internals):** Sigmoid and tanh, as specified by the architecture.

<div class="callout callout-think"><div class="callout-title">Think About It</div>The fact that something as simple as max(0, x) was a major breakthrough in deep learning tells us something important: in engineering, simplicity is not just elegant -- it is often *more effective* than complexity. ReLU works not despite its simplicity, but partly because of it. Simple functions have simple gradients, and simple gradients lead to reliable training.</div>

The activation function is a small component of a neural network, but getting it wrong can make the difference between a model that trains in hours and one that never converges at all. With this piece in place, we are ready to trace the full path of data through a network: forward propagation.
`
		},
		{
			slug: 'forward-propagation',
			title: 'Forward Propagation',
			estimatedMinutes: 20,
			xpReward: 15,
			content: `
# Forward Propagation

You now know the building blocks: neurons with weights and biases, layers stacked into architectures, and nonlinear activation functions. Forward propagation is the process of putting them all together -- feeding an input through the network, layer by layer, to produce an output. It is called "forward" because data flows in one direction: from input to output, never looping back.

If a neural network were a factory, forward propagation would be the assembly line. Raw materials (input features) enter at one end, are transformed at each station (layer), and a finished product (prediction) comes out the other end.

## The Math, Step by Step

Let us trace forward propagation through a concrete network with one hidden layer. The network classifies a 3-dimensional input into one of two classes.

**Architecture:** Input (3 neurons) -> Hidden (4 neurons, ReLU) -> Output (2 neurons, softmax)

**Step 1: Input layer.** Suppose our input is x = [1.5, -0.5, 2.0]. This vector is simply passed to the hidden layer unchanged. The input layer does no computation.

**Step 2: Hidden layer linear transformation.** Each of the 4 hidden neurons computes a weighted sum of all 3 inputs plus a bias:

z_hidden = W_hidden * x + b_hidden

where W_hidden is a 4x3 weight matrix and b_hidden is a 4-dimensional bias vector. Suppose:

W_hidden = [[0.2, -0.1, 0.4], [0.5, 0.3, -0.2], [-0.3, 0.7, 0.1], [0.1, -0.4, 0.6]]
b_hidden = [0.1, -0.1, 0.2, 0.0]

Then z_hidden = [0.2*1.5 + (-0.1)*(-0.5) + 0.4*2.0 + 0.1, ...] = [1.25, 0.95, -0.05, 1.45]

**Step 3: Hidden layer activation.** Apply ReLU element-wise:

h = ReLU(z_hidden) = [max(0, 1.25), max(0, 0.95), max(0, -0.05), max(0, 1.45)] = [1.25, 0.95, 0.0, 1.45]

Notice that the third neuron output zero -- it is "inactive" for this particular input. This is ReLU's sparsity in action.

**Step 4: Output layer linear transformation.** The 2 output neurons compute weighted sums of the 4 hidden outputs:

z_output = W_output * h + b_output

With appropriate weights and biases, suppose z_output = [1.8, 0.3].

**Step 5: Output layer activation.** Apply softmax to convert raw scores into probabilities:

softmax(z_i) = e^(z_i) / sum(e^(z_j))
p_0 = e^1.8 / (e^1.8 + e^0.3) = 6.05 / (6.05 + 1.35) = 0.817
p_1 = e^0.3 / (e^1.8 + e^0.3) = 1.35 / (6.05 + 1.35) = 0.183

**Result:** The network predicts class 0 with 81.7% confidence and class 1 with 18.3% confidence.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>Forward propagation is nothing more than alternating between two operations: linear transformations (matrix multiply + bias) and nonlinear activations. This pattern repeats for every layer. The entire computation is deterministic -- given the same input and the same weights, you always get the same output.</div>

## Matrix Operations: Why They Matter

You might have noticed that we described the hidden layer computation as a matrix multiplication. This is not just a notational convenience -- it is the key to making neural networks fast.

Instead of computing each neuron's output individually (which would require a separate loop for each neuron), we can compute the *entire layer's output at once* with a single matrix multiplication. Modern GPUs are extraordinarily good at matrix multiplication -- they can perform trillions of multiply-add operations per second. This is why neural network training maps so naturally onto GPU hardware.

Moreover, we can process multiple inputs simultaneously by stacking them into a *batch*. If we have a batch of 64 inputs, each with 3 features, we represent them as a 64x3 matrix and multiply by the same weight matrix. All 64 inputs are processed in parallel, at barely more cost than processing a single one.

**The forward propagation formula for one layer, processing an entire batch:**

H = activation(X * W^T + b)

where X is the batch_size x input_dim matrix, W is the output_dim x input_dim weight matrix, b is broadcast across the batch, and H is the batch_size x output_dim output matrix.

This is the fundamental computation of deep learning, and it is why GPUs -- originally designed for rendering millions of pixels in parallel for video games -- turned out to be the perfect hardware for neural networks.

## A Larger Perspective

In a deep network with many layers, forward propagation cascades these transformations:

h0 = x (input)
h1 = activation_1(W1 * h0 + b1)
h2 = activation_2(W2 * h1 + b2)
...
hL = activation_L(WL * h_{L-1} + bL) (output)

Each layer takes the previous layer's output, applies a linear transformation, then a nonlinear activation. The linear transformation can *rotate, scale, and shift* the data. The nonlinear activation can *bend and fold* the space. Together, they progressively reshape the data representation until the final layer's output aligns with the desired answer.

<div class="callout callout-example"><div class="callout-title">Example</div>Imagine classifying images of cats vs. dogs. The input is a grid of pixel values -- a high-dimensional point in "pixel space." The first hidden layer might learn to detect edges and color gradients. The second layer combines edges into textures and simple shapes. The third layer assembles shapes into parts: ears, noses, tails. The final layer combines part detections into a verdict: cat or dog. Each layer's transformation moves the data representation from "raw pixels" toward "semantic meaning."</div>

<!-- interactive:NeuralNetworkPlayground -->

## What Forward Propagation Does Not Do

Forward propagation computes a prediction, but it says nothing about whether that prediction is *good*. For that, we need a **loss function** that measures the gap between the prediction and the true answer.

And forward propagation gives us no way to *improve* the prediction. For that, we need to trace the computation in reverse, figuring out how each weight contributed to the error so that we can adjust it. That reverse process is **backpropagation**, and it is the subject of our next lesson.

Forward propagation is the question: "Given these weights, what does the network predict?" Backpropagation is the answer to: "How should I change the weights to predict better?" Together, they form the heartbeat of neural network training: forward, compute loss, backward, update weights, repeat. Millions of times, until the network learns.
`
		},
		{
			slug: 'backpropagation',
			title: 'Backpropagation: Learning from Mistakes',
			estimatedMinutes: 20,
			xpReward: 15,
			content: `
# Backpropagation: Learning from Mistakes

Backpropagation is the algorithm that makes deep learning possible. Without it, we would have beautiful network architectures with no way to train them. It is, in many ways, the single most important algorithm in all of modern AI.

The core problem backpropagation solves is this: we have a network with potentially millions of weights. We know the output is wrong (the loss function tells us by how much). But *which* weights are responsible? And how should each one change? This is the **credit assignment problem**, and backpropagation solves it elegantly using the chain rule of calculus.

## The Chain Rule: The Engine of Backpropagation

If you remember one thing from calculus, let it be the chain rule. If y = f(g(x)), then dy/dx = (dy/dg) * (dg/dx). In words: the rate of change of y with respect to x is the product of the rate of change of y with respect to g and the rate of change of g with respect to x.

A neural network is a giant chain of compositions: the output depends on the last layer's computation, which depends on the second-to-last layer, which depends on... all the way back to the inputs. The chain rule lets us compute how the output (and therefore the loss) depends on *any* weight in the network, no matter how deep.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>Backpropagation is not a single magical formula. It is the systematic application of the chain rule, working backward from the loss through each layer of the network. "Backpropagation" literally means "propagation of errors backward" -- we start at the output, where we know the error, and propagate it back through the network to compute gradients for every weight.</div>

## The Computational Graph

To understand backpropagation, it helps to think of the network as a **computational graph** -- a diagram where each node represents an operation (multiplication, addition, activation function) and edges represent the flow of data.

Consider a tiny example: a network with one input x, one weight w, one bias b, and a squared-error loss.

Forward pass:
1. z = w * x + b (linear transformation)
2. a = sigmoid(z) (activation)
3. L = (a - y)^2 (loss, where y is the true label)

Each of these is a node in the graph. In the forward pass, data flows left to right: x and w produce z, z produces a, and a and y produce L.

In the backward pass, gradients flow right to left. We start with dL/dL = 1 (the loss's gradient with respect to itself is trivially 1) and work backward:

**Step 1:** dL/da = 2(a - y). This is how the loss changes as the activation changes.

**Step 2:** dL/dz = dL/da * da/dz = 2(a - y) * sigmoid'(z) = 2(a - y) * a * (1 - a). Here we applied the chain rule: the gradient flows through the sigmoid.

**Step 3:** dL/dw = dL/dz * dz/dw = [2(a - y) * a * (1 - a)] * x. The gradient flows through the multiplication by x.

**Step 3 (also):** dL/db = dL/dz * dz/db = 2(a - y) * a * (1 - a) * 1. The gradient of z with respect to b is just 1.

Now we know exactly how to adjust w and b to reduce the loss. We update them using gradient descent:

w_new = w - learning_rate * dL/dw
b_new = b - learning_rate * dL/db

## A Numeric Example

Let us trace through this with actual numbers. Suppose x = 2.0, w = 0.5, b = 0.1, y = 1.0 (true label), and learning_rate = 0.1.

**Forward pass:**
1. z = 0.5 * 2.0 + 0.1 = 1.1
2. a = sigmoid(1.1) = 1 / (1 + e^(-1.1)) = 0.7503
3. L = (0.7503 - 1.0)^2 = 0.0624

The prediction is 0.75, but the true answer is 1.0. The loss is 0.0624.

**Backward pass:**
1. dL/da = 2 * (0.7503 - 1.0) = -0.4994
2. da/dz = 0.7503 * (1 - 0.7503) = 0.1875
3. dL/dz = -0.4994 * 0.1875 = -0.0937
4. dL/dw = -0.0937 * 2.0 = -0.1873
5. dL/db = -0.0937 * 1.0 = -0.0937

**Update:**
w_new = 0.5 - 0.1 * (-0.1873) = 0.5 + 0.0187 = 0.5187
b_new = 0.1 - 0.1 * (-0.0937) = 0.1 + 0.0094 = 0.1094

The weight increased from 0.5 to 0.5187, and the bias increased from 0.1 to 0.1094. Both changes push the output *higher*, toward the true value of 1.0. The negative gradient told us "increasing these values will decrease the loss," and that is exactly what we did.

<div class="callout callout-example"><div class="callout-title">Example</div>Verify: with the updated weights, z_new = 0.5187 * 2.0 + 0.1094 = 1.1468, a_new = sigmoid(1.1468) = 0.7590, L_new = (0.7590 - 1.0)^2 = 0.0581. The loss decreased from 0.0624 to 0.0581. Progress! Repeat this thousands of times and the network converges on the right answer.</div>

## Backpropagation in a Multi-Layer Network

The beauty of backpropagation is that it scales to any number of layers. At each layer, you compute two things:

1. **The gradient of the loss with respect to the layer's weights** (used to update those weights).
2. **The gradient of the loss with respect to the layer's *inputs*** (passed to the previous layer so it can compute its own gradients).

This is why it is called "propagation" -- each layer receives a gradient signal from the layer above, uses it to compute its own weight gradients, and then passes a gradient signal down to the layer below. The error signal ripples backward through the entire network.

For a fully connected layer with weight matrix W, input h_prev, and output z = W * h_prev + b:

- dL/dW = dL/dz * h_prev^T (outer product of gradient and input)
- dL/db = sum of dL/dz over the batch
- dL/dh_prev = W^T * dL/dz (this is the gradient passed to the previous layer)

The matrix W^T in that last equation is why the backward pass is sometimes called "transposed multiplication" -- we multiply by the *transpose* of the weight matrix to push gradients backward.

<!-- interactive:BackpropVisualizer -->

## Why "Backpropagation" Is Just the Chain Rule

There is a common misconception that backpropagation is something separate from or beyond the chain rule. It is not. Backpropagation is the chain rule, applied systematically to a computational graph, with one crucial efficiency trick: **caching intermediate results**.

During the forward pass, each layer computes and *stores* its input, its linear output z, and its activation output h. During the backward pass, these cached values are needed to compute the gradients. Without caching, we would need to recompute the forward pass at every layer during the backward pass, doubling the computational cost.

This is why training a neural network uses roughly twice as much memory as just running inference (forward propagation only): you need to store all the intermediate activations for the backward pass.

<div class="callout callout-think"><div class="callout-title">Think About It</div>Backpropagation was not invented once. It was independently discovered by multiple researchers across several decades: Henry Kelley (1960), Stuart Dreyfus (1962), Seppo Linnainmaa (1970), Paul Werbos (1974), and finally popularized by Rumelhart, Hinton, and Williams (1986). The fact that it was discovered so many times independently tells us it is a natural, almost inevitable idea once you frame learning as optimization over differentiable functions.</div>

## The Bigger Picture

Backpropagation, combined with forward propagation and gradient descent, gives us the complete training loop:

1. **Forward pass:** Feed input through the network, compute prediction.
2. **Compute loss:** Measure how far the prediction is from the truth.
3. **Backward pass:** Compute gradients of the loss with respect to every weight.
4. **Update weights:** Nudge each weight in the direction that reduces the loss.
5. **Repeat.**

This loop is the heartbeat of deep learning. Every breakthrough -- convolutional networks, recurrent networks, transformers, generative models -- uses this same loop. The architectures change, the loss functions change, the optimizers get fancier, but the forward-backward-update cycle remains constant.

You now have all the pieces to understand how neural networks learn. In the next module, we will explore the practical challenges of training deep networks -- the optimizers, regularizers, and tricks that make the difference between a network that learns and one that fails.
`
		}
	],
	quiz: {
		questions: [
			{
				type: 'multiple-choice',
				id: 'nn-q1',
				question:
					'Which of the following is NOT borrowed from biological neurons for artificial neural networks?',
				options: [
					'Weighted connections between units',
					'Summation of inputs with a threshold/activation',
					'Precise spike timing patterns',
					'Layered network structure'
				],
				correctIndex: 2,
				explanation:
					'Artificial neural networks use weighted connections, summation with activation, and layered structure from biological neurons. However, precise spike timing is discarded -- artificial neurons pass continuous real numbers, not timed electrical spikes.'
			},
			{
				type: 'multiple-choice',
				id: 'nn-q2',
				question:
					'What was the key limitation of the McCulloch-Pitts neuron model (1943)?',
				options: [
					'It could not compute logical functions',
					'It had no learning algorithm -- weights had to be set by hand',
					'It could only handle binary inputs',
					'It required too much computational power'
				],
				correctIndex: 1,
				explanation:
					'The McCulloch-Pitts model could compute any logical function, but the weights had to be manually designed. There was no learning algorithm to automatically find the right weights from data.'
			},
			{
				type: 'fill-in',
				id: 'nn-q3',
				question:
					'The famous problem that a single perceptron cannot solve, proving the limitations of linear classifiers, is called the _____ problem.',
				acceptedAnswers: ['XOR', 'xor', 'Xor', 'exclusive or', 'Exclusive Or', 'exclusive OR'],
				explanation:
					'XOR (exclusive or) outputs 1 when exactly one input is 1. The four data points are arranged so that no single straight line can separate the two classes, making it impossible for a linear classifier like a single perceptron.'
			},
			{
				type: 'multiple-choice',
				id: 'nn-q4',
				question:
					'Why does stacking multiple linear layers without activation functions not increase the representational power of a network?',
				options: [
					'Because each linear layer reduces dimensionality',
					'Because the composition of linear functions is still a linear function',
					'Because linear layers cannot use matrix multiplication',
					'Because linear layers have no learnable parameters'
				],
				correctIndex: 1,
				explanation:
					'The composition of any number of linear transformations is itself a linear transformation. Without nonlinear activation functions, a 100-layer network collapses to a single-layer linear model, making depth useless.'
			},
			{
				type: 'multiple-choice',
				id: 'nn-q5',
				question: 'What is the "dying ReLU" problem?',
				options: [
					'ReLU neurons become too large and cause overflow',
					'ReLU neurons with consistently negative inputs always output zero and cannot recover',
					'ReLU neurons slow down computation compared to sigmoid',
					'ReLU neurons cause the network to forget previous training'
				],
				correctIndex: 1,
				explanation:
					'When a ReLU neuron\'s weights are pushed to values where the weighted input is always negative, it always outputs zero. Since the gradient of ReLU at zero is also zero, the neuron receives no gradient signal and can never recover -- it is permanently "dead."'
			},
			{
				type: 'ordering',
				id: 'nn-q6',
				question:
					'Order the steps of a single training iteration in the correct sequence:',
				items: [
					'Feed input through the network (forward pass)',
					'Compute the loss',
					'Compute gradients via backpropagation (backward pass)',
					'Update weights using gradient descent'
				],
				correctOrder: [0, 1, 2, 3],
				explanation:
					'Training follows a strict sequence: forward pass to compute predictions, loss computation to measure error, backward pass to compute gradients, and finally weight updates. This cycle repeats for every training step.'
			},
			{
				type: 'multiple-choice',
				id: 'nn-q7',
				question:
					'What does the Universal Approximation Theorem guarantee about a single-hidden-layer network?',
				options: [
					'That gradient descent will find the optimal weights',
					'That a single hidden layer is always better than multiple layers',
					'That it can approximate any continuous function to arbitrary accuracy, given enough neurons',
					'That it will generalize well to unseen data'
				],
				correctIndex: 2,
				explanation:
					'The Universal Approximation Theorem is an existence proof: a solution exists with enough hidden neurons. It says nothing about whether gradient descent can find it, how many neurons are needed, or how well the network will generalize.'
			},
			{
				type: 'fill-in',
				id: 'nn-q8',
				question:
					'The mathematical rule from calculus that backpropagation is based on is called the _____ rule.',
				acceptedAnswers: ['chain', 'Chain', 'chain rule', 'Chain Rule'],
				explanation:
					'Backpropagation is the systematic application of the chain rule from calculus. The chain rule allows us to compute how the loss depends on any weight in the network by decomposing the derivative through each layer.'
			},
			{
				type: 'multiple-choice',
				id: 'nn-q9',
				question:
					'Which activation function is most commonly used in the hidden layers of modern transformer architectures?',
				options: ['Sigmoid', 'Tanh', 'ReLU', 'GELU'],
				correctIndex: 3,
				explanation:
					'GELU (Gaussian Error Linear Unit) is the standard activation function in modern transformers like BERT and GPT. It provides smooth, probabilistic gating of inputs, unlike the hard threshold of ReLU.'
			},
			{
				type: 'multiple-choice',
				id: 'nn-q10',
				question:
					'During backpropagation in a fully connected layer, how are gradients passed to the previous layer?',
				options: [
					'By multiplying the gradient by the weight matrix',
					'By multiplying the gradient by the transpose of the weight matrix',
					'By adding the gradient to the bias vector',
					'By applying the activation function in reverse'
				],
				correctIndex: 1,
				explanation:
					'To propagate gradients backward through a fully connected layer, the incoming gradient is multiplied by the transpose of the weight matrix (W^T). This "reverses" the linear transformation, distributing the error signal to the correct input neurons.'
			}
		],
		passingScore: 7
	}
};

export default neuralNetworks;
