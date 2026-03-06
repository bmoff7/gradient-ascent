import type { Module } from '../types';

const trainingDeepNetworks: Module = {
	slug: 'training-deep-networks',
	title: 'Training Deep Networks',
	description:
		'Master the art and science of training deep neural networks. From optimization algorithms and loss landscapes to regularization and hyperparameter tuning -- learn what separates a model that works from one that flounders.',
	estimatedMinutes: 100,
	xpReward: 75,
	quizXpReward: 50,
	lessons: [
		{
			slug: 'optimization-algorithms',
			title: 'Optimization Algorithms',
			estimatedMinutes: 22,
			xpReward: 15,
			content: `
# Optimization Algorithms

Training a neural network is an optimization problem: find the set of weights that minimizes the loss function. With millions of parameters, you cannot try every combination. You need a strategy for navigating this enormous landscape intelligently. That strategy is your **optimizer**, and choosing the right one can mean the difference between a model that converges beautifully and one that spirals into chaos.

## Stochastic Gradient Descent (SGD)

Gradient descent in its purest form is intuitive: compute the gradient of the loss over *all* training data, then step in the opposite direction. But computing the gradient over millions of examples is prohibitively expensive. You process every example before taking a single step -- like reading an entire library before writing one sentence of your book report.

**Stochastic Gradient Descent (SGD)** makes a practical compromise: instead of computing the gradient over the full dataset, compute it over a small random sample -- a **mini-batch** (typically 32 to 512 examples). The resulting gradient estimate is noisy, but it points in roughly the right direction, and you can compute it thousands of times faster.

Think of navigating a mountain in thick fog. Full-batch gradient descent is like waiting for the fog to completely clear before taking a step -- you get perfect information but move agonizingly slowly. SGD is like feeling the slope under your feet and stepping downhill immediately. Each individual step might not be perfectly directed, but you are making progress constantly.

**The problems with vanilla SGD:**

1. **The learning rate dilemma.** Too large and the optimizer oscillates or diverges. Too small and you wait forever. There is no single learning rate that is ideal for the entire training process.

2. **One size does not fit all.** Different weights in the network may need different step sizes. A weight that is nearly optimal needs tiny adjustments, while a weight that is far off needs large corrections. Vanilla SGD applies the same learning rate to everyone.

3. **Ravines.** When the loss surface is much steeper in one direction than another (imagine a long, narrow valley), SGD bounces back and forth between the steep walls while creeping slowly along the valley floor. Most of the movement is wasted on oscillation.

## Momentum: Building Inertia

Momentum was the first major improvement to SGD, and the idea is borrowed from physics. Instead of stepping based solely on the current gradient, we maintain a **velocity** that accumulates past gradients:

**v = beta * v + gradient**
**w = w - learning_rate * v**

The velocity builds up speed in directions where the gradient consistently points the same way (down the valley floor) and cancels out in directions where the gradient oscillates (the valley walls). It is exactly like a heavy ball rolling downhill -- it builds momentum in the consistent direction and smooths out the bumps.

The beta parameter (typically 0.9) controls how much "memory" the velocity has. With beta = 0.9, the current step is influenced by roughly the last 10 gradients. With beta = 0.99, the last 100.

<div class="callout callout-example"><div class="callout-title">Example</div>Imagine pushing a child on a swing. Each push (gradient) adds a little energy. But the swing does not respond to each push independently -- it accumulates energy over many pushes, swinging higher and higher. If you push at the wrong time (noisy gradient), the swing absorbs the mistake without losing much momentum. This is exactly how momentum works for optimization.</div>

## RMSprop: Adapting to Each Parameter

RMSprop (proposed by Geoff Hinton in a Coursera lecture -- never formally published!) takes a different approach. Instead of maintaining velocity, it maintains a running average of each parameter's squared gradients:

**s = decay_rate * s + (1 - decay_rate) * gradient^2**
**w = w - learning_rate * gradient / (sqrt(s) + epsilon)**

Parameters that have been receiving large gradients get a *smaller* effective learning rate (the denominator is large, shrinking the step). Parameters with small gradients get a *larger* effective learning rate. This automatically adapts the step size per parameter.

Think of a teacher grading students. A student who always scores high (large gradient) does not need as much attention per mistake. A student who rarely speaks up (small gradient) needs more encouragement when they do. RMSprop is the teacher who adjusts attention based on each student's history.

## Adam: The Swiss Army Knife

Adam (Adaptive Moment Estimation), introduced by Kingma and Ba in 2014, combines the best ideas of momentum *and* RMSprop:

**m = beta1 * m + (1 - beta1) * gradient** (first moment: exponential average of gradients, like momentum)

**v = beta2 * v + (1 - beta2) * gradient^2** (second moment: exponential average of squared gradients, like RMSprop)

**m_hat = m / (1 - beta1^t)** (bias correction for early steps)
**v_hat = v / (1 - beta2^t)** (bias correction for early steps)

**w = w - learning_rate * m_hat / (sqrt(v_hat) + epsilon)**

The default hyperparameters (beta1 = 0.9, beta2 = 0.999, epsilon = 1e-8) work well for a remarkable range of problems. This robustness is Adam's killer feature. You do not need to be an optimization expert to get good results with Adam.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>Adam is the most popular optimizer in deep learning -- not because it is always the absolute best, but because it is almost never terrible. It is the optimizer you use when you do not have time to tune the optimizer. For research prototypes, new architectures, and unfamiliar domains, Adam is the safe default.</div>

**AdamW** is a variant that handles weight decay (L2 regularization) correctly by decoupling it from the gradient computation. It has become the standard for training transformers and is generally preferred over vanilla Adam.

## Learning Rate Schedules

Even with Adam, the learning rate is the single most impactful hyperparameter. But the ideal learning rate changes during training: you want to take large steps early (to explore) and small steps later (to fine-tune). Learning rate schedules implement this idea.

**Warmup:** Start with a tiny learning rate and gradually increase it over the first few hundred or thousand steps. This stabilizes training when the initial gradients are large and unreliable. Nearly all large-model training uses warmup.

**Cosine annealing:** After warmup, decrease the learning rate following a cosine curve from its peak value to near zero. This is smooth, has no hyperparameters to tune (other than the total training duration), and works well empirically.

**Step decay:** Divide the learning rate by a constant (e.g., 10) at predefined epochs. Simple and effective, especially for CNNs.

**One-cycle policy:** Increase the learning rate from small to large in the first half of training, then decrease it back in the second half. Leslie Smith showed this can enable "super-convergence" -- reaching good performance much faster.

## Comparing Optimizers

| Optimizer | Strengths | Weaknesses | When to use |
|-----------|-----------|------------|-------------|
| SGD | Simple, well-understood | Slow, requires tuning | Rarely on its own |
| SGD + Momentum | Good final accuracy on vision tasks | Requires careful LR tuning | CNNs when you can afford to tune |
| RMSprop | Adaptive, handles sparse gradients | Less robust than Adam | RNNs, some RL tasks |
| Adam | Robust, fast convergence, low tuning | May generalize slightly worse than tuned SGD | General default |
| AdamW | Proper weight decay, great for transformers | Slightly more complex | Transformers, modern architectures |

A practical observation: SGD with momentum, when tuned by an expert, can match or slightly beat Adam on final accuracy for computer vision tasks. But Adam gets you 95% of the way there with 5% of the effort. Unless you are squeezing out the last fraction of a percent on a benchmark, Adam (or AdamW) is the pragmatic choice.
`
		},
		{
			slug: 'loss-landscape',
			title: 'The Loss Landscape',
			estimatedMinutes: 18,
			xpReward: 15,
			content: `
# The Loss Landscape

Every weight configuration in a neural network corresponds to a loss value. Map all possible weight configurations to their losses, and you get the **loss landscape** -- a vast, high-dimensional surface that the optimizer must navigate. Understanding the shape of this surface explains why some networks train easily, why others struggle, and why certain architectural choices matter so much.

## Visualizing What Cannot Be Seen

For a network with two weights, the loss landscape is a 3D surface -- like a physical terrain with hills, valleys, and ridges. You can plot it, rotate it, and develop intuition.

For a network with a million weights, the loss landscape is a million-dimensional surface. You cannot visualize it. But the geometric concepts -- valleys, ridges, saddle points -- still apply. Researchers have developed clever techniques to create 2D "slices" through these high-dimensional landscapes, and the resulting images are striking: some architectures produce smooth, bowl-like landscapes, while others produce chaotic, fractal-like surfaces.

The optimizer's job is to start at some random point on this landscape (determined by weight initialization) and find its way to the lowest point (minimum loss). Gradient descent follows the direction of steepest downhill slope at each step, like water flowing downhill.

## Local Minima: Less Scary Than You Think

A **local minimum** is a point where the loss is lower than at all neighboring points, but not necessarily the lowest point overall (the **global minimum**). In 2D, local minima are common and dangerous -- you can easily get trapped in a mediocre valley.

But here is a remarkable fact about high-dimensional spaces: **local minima become extremely rare as the number of dimensions increases.**

The reason is statistical. At a local minimum, the loss must curve *upward* in every single dimension -- all million of them. At each dimension, the curvature is either up or down, roughly like a coin flip. The probability that a million coin flips all come up heads is unimaginably small. So most critical points (where the gradient is zero) in high-dimensional spaces are not local minima at all -- they are **saddle points**.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>The conventional wisdom that neural network training gets "stuck in local minima" is largely a myth. In high-dimensional spaces, the real challenges are saddle points (where progress stalls temporarily), plateaus (regions where the gradient is very small), and poorly conditioned landscapes (where the surface curves much more steeply in some directions than others). True local minima, when they exist at all, tend to have loss values very close to the global minimum.</div>

## Saddle Points: The Actual Enemy

A **saddle point** is a critical point where the loss curves upward in some dimensions and downward in others. The gradient is zero (so vanilla gradient descent stops), but the point is not a minimum -- there are escape routes in the "downward" dimensions.

Think of a mountain pass: standing at the pass, the terrain goes up if you look left and right (the mountain walls), but down if you look forward and backward (the trail descending on both sides). The gradient at the pass is zero, but it is clearly not the lowest point on the mountain.

In a million-dimensional space, saddle points are overwhelmingly the most common type of critical point. A randomly selected critical point might have 499,000 upward-curving dimensions and 501,000 downward-curving dimensions. The gradient is zero, but there are hundreds of thousands of directions of escape.

**Why momentum helps with saddle points:** A ball rolling with momentum does not stop at a saddle point -- its velocity carries it through. This is one of the most important practical reasons to use momentum or Adam rather than vanilla SGD.

<!-- interactive:GradientDescentLab -->

## The Flatness Hypothesis: Sharp vs. Flat Minima

Recent research has revealed that not all minima are equal. Some minima are **sharp** -- the loss rises steeply in every direction. Others are **flat** -- the loss remains low even when the weights are perturbed slightly.

The **flatness hypothesis** states that flat minima generalize better than sharp ones. The intuition:

Imagine two bowls -- one narrow like a teacup and one wide like a salad bowl. If you place a ball at the bottom of each and then shake the table slightly (simulating the difference between training and test data), the ball in the teacup flies out, but the ball in the salad bowl stays put. A flat minimum is robust to small perturbations; a sharp minimum is not.

<div class="callout callout-think"><div class="callout-title">Think About It</div>This connects to a deep idea: the best solutions are not the ones that exploit every quirk of the training data (sharp minima), but the ones that capture the general patterns (flat minima). Flat minima correspond to solutions that are "simple" in some sense -- they do not rely on precise weight values, so they are robust to the inevitable differences between training and test data.</div>

## Batch Size and the Loss Landscape

Batch size has a surprisingly profound effect on where the optimizer ends up:

**Small batches (16-64):** The gradient estimate is noisy, which introduces a random perturbation at each step. This noise helps the optimizer escape sharp minima and tends to guide it toward flat, generalizable regions. Think of it as shaking the table -- the ball bounces out of narrow bowls and settles in wide ones.

**Large batches (512-4096+):** The gradient estimate is accurate, which means less random perturbation. The optimizer tends to converge to the nearest minimum, which may be sharp. This can lead to worse generalization despite lower training loss.

The **linear scaling rule** provides a practical recipe: when you increase the batch size by a factor k, multiply the learning rate by k as well. This approximately preserves the training dynamics. Combined with learning rate warmup, this rule enables efficient large-batch training.

However, there are limits. Very large batch sizes (beyond about 8000 for many tasks) tend to degrade generalization regardless of learning rate tuning, suggesting that the noise from small batches serves an important regularizing function that cannot be easily replicated by other means.

## Architecture Shapes the Landscape

The loss landscape is not a fixed property of the task -- it depends heavily on the network architecture:

**Skip connections (ResNet)** dramatically smooth the loss landscape. Without them, deep networks have chaotic, rough landscapes that are nearly impossible to optimize. With them, the landscape becomes much smoother, enabling training of networks with hundreds of layers. This is arguably the most important insight about why ResNets work -- it is not just about gradient flow, but about creating a navigable optimization surface.

**Batch normalization** also smooths the landscape by making it less sensitive to the scale of parameters and reducing the dependence between layers.

**Over-parameterization** (using far more parameters than strictly necessary) tends to produce smoother landscapes with more paths to good solutions. This is one reason why large models often train more easily than small ones, even though intuition might suggest otherwise.

The takeaway is that architecture design is not just about representational capacity -- it is about creating an optimization landscape that the optimizer can actually navigate. A brilliant architecture with a terrible landscape will fail just as surely as a poor architecture with a smooth one.
`
		},
		{
			slug: 'regularization-techniques',
			title: 'Regularization Techniques',
			estimatedMinutes: 22,
			xpReward: 15,
			content: `
# Regularization Techniques

A neural network with a million parameters has an extraordinary capacity to memorize data. Show it enough examples and it will learn every single one -- including the noise, the outliers, the measurement errors, and the flukes that are unique to that particular training set. This is **overfitting**, and it is the central antagonist of machine learning.

Regularization is any technique that makes the model generalize better to unseen data, even if it means slightly worse performance on the training data. It is the discipline that turns raw memorization into genuine understanding.

## Recognizing Overfitting

The classic symptom: training loss steadily decreases, but **validation loss** starts *increasing* after some point. The gap between training and validation performance grows wider over time.

An analogy: a student who memorizes every practice problem verbatim can score 100% on homework but fails the exam, which presents the same concepts in new variations. The student has learned the answers, not the principles. Regularization is the study technique that prioritizes understanding over memorization.

The risk of overfitting depends on three factors: model complexity (more parameters = more risk), dataset size (less data = more risk), and the complexity of the true underlying pattern (simpler patterns are easier to learn and harder to overfit). Regularization addresses the first factor directly and the other two indirectly.

## L2 Regularization (Weight Decay)

The simplest and most widely used regularization technique: add a penalty to the loss that grows with the *magnitude* of the weights:

**Total Loss = Data Loss + (lambda/2) * sum(w_i^2)**

This penalty discourages large weights. Why does this help?

Large weights mean the network is making sharp, high-confidence predictions based on specific features. Small weights mean smoother, more conservative predictions. Overfitted networks tend to have large weights because they are amplifying noise in the training data. By penalizing weight magnitude, L2 regularization pushes the network toward simpler, smoother functions that generalize better.

<div class="callout callout-example"><div class="callout-title">Analogy</div>Imagine a committee making decisions. Without L2 regularization, one opinionated member (large weight) can dominate the discussion, and the committee's decisions reflect that member's biases. L2 regularization is like a rule that limits how loudly any member can speak. The result is that decisions are based on broader consensus rather than individual opinions, leading to more balanced, generalizable outcomes.</div>

In practice, L2 regularization is implemented as **weight decay** -- at each update step, weights are multiplied by a factor slightly less than 1:

**w = (1 - lr * lambda) * w - lr * gradient**

Common values for lambda (the weight decay coefficient) range from 1e-5 to 1e-2. For AdamW with transformers, 0.01 to 0.1 is typical. For SGD on CNNs, 1e-4 is a common starting point.

## L1 Regularization

L1 regularization penalizes the *absolute values* of weights:

**Total Loss = Data Loss + lambda * sum(|w_i|)**

The crucial difference from L2: L1 tends to drive many weights to *exactly zero*, producing a **sparse** network. L2 shrinks all weights toward zero but rarely makes them exactly zero.

This sparsity can be useful for feature selection -- the network effectively identifies which inputs are irrelevant and disconnects them. However, L1 is less commonly used in deep learning than L2. The non-smooth nature of the absolute value at zero can complicate optimization.

## Dropout: The Ensemble in Disguise

Dropout is one of the most elegant ideas in deep learning. The concept, developed in Geoffrey Hinton's group and published by Srivastava et al. in 2014, is deceptively simple:

**During training:** For each mini-batch, randomly set each neuron's output to zero with probability p (typically 0.5 for hidden layers). Different neurons are dropped in every forward pass.

**During inference:** Use all neurons, but multiply each neuron's output by (1-p) to account for the fact that more neurons are active.

Why does randomly destroying information during training lead to a *better* model? Several complementary explanations:

**Ensemble interpretation.** Each training step uses a different random subnetwork. A network with n neurons has 2^n possible subnetworks. Over the course of training, you are implicitly training an exponential number of models that share weights. At test time, using all neurons with scaled outputs approximately averages the predictions of all these subnetworks. Ensembles almost always outperform individual models.

**Co-adaptation prevention.** Without dropout, neurons can develop complex co-dependencies -- "I only need to detect vertical lines because I know neuron 47 handles horizontal lines." Dropout breaks these co-dependencies by randomly removing teammates. Each neuron must learn to be useful on its own, regardless of which other neurons are present. The result is more robust, independent feature detectors.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>Dropout is like training a sports team by randomly benching players at each practice. No player can rely on a specific teammate always being there, so every player must develop well-rounded skills. The result is a team of versatile athletes who perform well in any combination -- even combinations they have never practiced together.</div>

**Practical details:**
- Dropout of 0.5 for large fully connected layers is a classic starting point
- Modern architectures (transformers) typically use lower dropout rates (0.1-0.3)
- Dropout is applied after activation functions
- Dropout is **never** applied during inference/evaluation -- only during training
- Some architectures use "inverted dropout," which scales activations up during training (dividing by 1-p) instead of down during inference, so the inference path is unchanged

## Data Augmentation

Rather than constraining the model, data augmentation expands the *effective* training set by creating synthetic variations of existing examples. This directly attacks the root cause of overfitting: insufficient data diversity.

**For images:** Random horizontal flips, random crops, rotation, color jitter, random erasing, cutout, mixup, cutmix. A single training image can generate thousands of variations, each teaching the network that a cat is still a cat whether the image is slightly rotated, cropped, brightened, or partially occluded.

**For text:** Synonym replacement, random word insertion/deletion, back-translation (translate to another language and back), token masking.

**For audio:** Time stretching, pitch shifting, adding background noise, SpecAugment (masking frequency bands and time steps).

Data augmentation is often the single most effective regularization technique for computer vision. It is essentially free -- you create new data without collecting it -- and it teaches the network exactly the invariances you want it to have.

<div class="callout callout-warning"><div class="callout-title">Important Note</div>Augmentation must preserve the label. Flipping a picture of a cat horizontally still produces a picture of a cat. But flipping the digit "6" vertically produces "9" -- a different label. Always think carefully about which transformations are label-preserving for your specific task.</div>

**Mixup** is a particularly powerful augmentation that generates new examples by linearly interpolating between pairs of training examples and their labels. If image A (100% cat) and image B (100% dog) are mixed at a 70/30 ratio, the result is a training example that is "70% cat, 30% dog." This encourages the network to produce calibrated, smooth predictions rather than overconfident ones.

## Early Stopping

The simplest regularization of all: **stop training before the model overfits.**

Monitor the validation loss after each epoch. If it has not improved for a specified number of epochs (the "patience"), stop training and restore the weights from the epoch with the best validation loss.

Early stopping works because overfitting is a progressive process. In the early epochs, the model learns genuine patterns (training and validation loss both decrease). In later epochs, the model starts memorizing noise (training loss continues to decrease but validation loss increases). Early stopping catches this transition point and preserves the model from before it started memorizing.

## Combining Techniques

In practice, you will use multiple regularization techniques simultaneously:

- **CNNs:** Data augmentation + weight decay + dropout (in fully connected head)
- **Transformers:** Weight decay (via AdamW) + dropout (in attention and feed-forward layers) + sometimes label smoothing
- **Small datasets:** Aggressive data augmentation + dropout + early stopping + possibly L2

The techniques are complementary, not redundant. Data augmentation makes the training data richer. Weight decay constrains the model complexity. Dropout prevents co-adaptation. Early stopping prevents over-training. Together, they form a multi-layered defense against overfitting.
`
		},
		{
			slug: 'batch-normalization-and-beyond',
			title: 'Batch Normalization and Beyond',
			estimatedMinutes: 18,
			xpReward: 15,
			content: `
# Batch Normalization and Beyond

In 2015, Sergey Ioffe and Christian Szegedy introduced **Batch Normalization**, and it immediately became one of the most widely adopted techniques in deep learning. The paper has been cited over 40,000 times. Virtually every convolutional neural network architecture published since 2015 uses it. And yet, the reason *why* it works is still debated.

## The Original Motivation: Internal Covariate Shift

Ioffe and Szegedy's original argument went like this: during training, the weights in each layer change, which means the *distribution* of inputs to the next layer shifts from step to step. Layer 5 is trying to learn a useful transformation, but the data it receives from layer 4 keeps changing because layer 4's weights keep updating. It is like trying to learn to hit a baseball when the pitcher changes their throwing style every few pitches.

They called this phenomenon **internal covariate shift** and proposed batch normalization as the fix: normalize the inputs to each layer so they always have the same distribution, regardless of how the previous layer's weights change.

More recent research has cast doubt on whether internal covariate shift is actually the primary mechanism. A 2018 paper by Santurkar et al. showed that batch norm primarily works by **smoothing the loss landscape**, making the optimization surface less chaotic and more amenable to gradient descent. But regardless of the theoretical explanation, the practical benefits are undeniable.

## Batch Norm Mechanics

Batch normalization operates on each feature independently. For a mini-batch of N examples, and for each feature dimension:

**Step 1.** Compute the mean across the batch: mu = (1/N) * sum(x_i)

**Step 2.** Compute the variance across the batch: sigma^2 = (1/N) * sum((x_i - mu)^2)

**Step 3.** Normalize: x_hat_i = (x_i - mu) / sqrt(sigma^2 + epsilon)

**Step 4.** Scale and shift: y_i = gamma * x_hat_i + beta

The epsilon (typically 1e-5) prevents division by zero. The gamma and beta are **learnable parameters** that the network optimizes during training.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>Step 4 is the subtle genius of batch norm. Without gamma and beta, the normalization would force every layer's activations to have exactly zero mean and unit variance, which might not be optimal. The learnable scale (gamma) and shift (beta) let the network undo the normalization if that produces better results. Batch norm does not impose a fixed distribution -- it gives the network the *option* of normalized activations while preserving full expressiveness.</div>

**During inference**, there is no batch to compute statistics from (you might be processing a single example). So batch norm uses *running averages* of the mean and variance accumulated during training (via exponential moving average). This is computed automatically by deep learning frameworks.

## Why Batch Norm Helps

Regardless of the theoretical debate, the practical benefits are well-established:

**Higher learning rates.** Without batch norm, large learning rates cause the optimization to diverge. With batch norm, the smoothed loss landscape tolerates much larger steps. Training that took days can often be done in hours.

**Less sensitivity to initialization.** Without batch norm, careful weight initialization (He initialization, Xavier initialization) is critical. With batch norm, even mediocre initialization works well, because the normalization corrects the activation scale automatically.

**Mild regularization.** Because the batch statistics (mean, variance) depend on which examples happen to be in the same mini-batch, each example's normalization is slightly different depending on its batch-mates. This randomness acts as a form of noise injection, providing mild regularization similar to dropout. Using larger batch sizes reduces this effect.

<!-- interactive:OverfittingDemo -->

**Stabilized activations.** By preventing activations from drifting too far in magnitude, batch norm reduces the risk of exploding or vanishing activations in deep networks.

## Where to Place Batch Norm

Two conventions exist:

**Pre-activation (original paper):** Linear -> BatchNorm -> Activation
**Post-activation:** Linear -> Activation -> BatchNorm

Both work well. The original paper used pre-activation, and this remains the more common pattern. The difference in practice is small enough that it rarely matters.

## Layer Normalization

**Layer Norm** (Ba et al., 2016) normalizes across the *features* (not the batch) for each individual example. Where batch norm computes statistics across all examples in a batch for each feature, layer norm computes statistics across all features for each example.

The key advantage: layer norm is completely independent of the batch. Each example is normalized using only its own feature statistics. This makes it ideal for:

- **Transformers.** Layer norm is the universal choice in transformer architectures, from the original "Attention Is All You Need" paper to GPT and BERT. Transformers process variable-length sequences, making batch statistics ill-defined or unreliable.
- **Recurrent networks.** In RNNs, the same layer is applied at each time step, and the statistics can vary wildly across time steps. Layer norm handles this gracefully.
- **Small batch sizes.** When the batch is too small for reliable statistics, layer norm is unaffected.

<div class="callout callout-think"><div class="callout-title">Think About It</div>Batch norm and layer norm normalize along orthogonal axes. Batch norm asks "how does this feature compare to the same feature in other examples?" Layer norm asks "how does this feature compare to other features in the same example?" The right choice depends on whether cross-example or cross-feature normalization is more meaningful for your task.</div>

## Group Normalization

**Group Norm** (Wu & He, 2018) divides channels into groups and normalizes within each group. It is a middle ground between:

- **Layer norm** (all channels in one group)
- **Instance norm** (each channel is its own group)

Group norm is independent of batch size and has been shown to outperform batch norm for small batch sizes (common in object detection and segmentation, where large images limit batch size). With 32 groups, group norm closely matches batch norm's performance at large batch sizes while being robust at small ones.

## Instance Normalization

**Instance Norm** normalizes each channel of each example independently. It was originally proposed for neural style transfer, where normalizing out the style-specific contrast and brightness of individual feature maps allows the network to focus on content vs. style.

Instance norm is less commonly used outside of style transfer and generative models.

## RMSNorm

**RMSNorm** is a simplified variant of layer norm that skips the mean-centering step and only divides by the root mean square of the activations. It has gained popularity in recent large language models (including LLaMA) because it is computationally cheaper than full layer norm while producing comparable results.

## Choosing the Right Normalization

| Technique | Normalizes across | Best for | Batch-dependent? |
|-----------|------------------|----------|-----------------|
| Batch Norm | Batch | CNNs with batch >= 16 | Yes |
| Layer Norm | Features | Transformers, RNNs | No |
| Group Norm | Channel groups | CNNs with small batches | No |
| Instance Norm | Individual channels | Style transfer, generative | No |
| RMSNorm | Features (no mean) | Large language models | No |

**Practical advice:** Follow the conventions of your domain. Transformers: layer norm (or RMSNorm). CNNs with decent batch sizes: batch norm. CNNs with tiny batches: group norm. When in doubt, layer norm is the safest general-purpose choice.
`
		},
		{
			slug: 'hyperparameter-tuning',
			title: 'Hyperparameter Tuning',
			estimatedMinutes: 20,
			xpReward: 15,
			content: `
# Hyperparameter Tuning

A neural network has two kinds of numbers: **parameters** (weights and biases, learned by the optimizer) and **hyperparameters** (everything else, set by you). The architecture, the learning rate, the batch size, the amount of regularization -- these are all hyperparameters, and they can make or break your model.

If training a neural network is like baking, the parameters are what the oven does (heating the dough into bread). The hyperparameters are what *you* do: choosing the temperature, the baking time, the type of flour, and when to add the yeast. The oven handles the execution, but the recipe determines the outcome.

## The Learning Rate: King of Hyperparameters

If you can only tune one thing, tune the learning rate. It has more influence over training success than any other hyperparameter, by a large margin.

**Too high:** The optimizer overshoots, oscillates, or diverges entirely. Loss becomes NaN. The model is destroyed.

**Too low:** Training proceeds so slowly that you run out of compute budget before reaching a good solution. Or the optimizer gets trapped in a poor region of the landscape because it does not have enough "energy" to escape.

**Just right:** The optimizer converges quickly and reliably to a good solution.

**The Learning Rate Finder** is a practical tool for identifying the sweet spot. The technique, popularized by Leslie Smith:

1. Start with a very small learning rate (e.g., 1e-7)
2. Gradually increase it (exponentially) over the course of one epoch
3. Record the loss at each step
4. Plot loss vs. learning rate

The optimal learning rate is typically in the region where the loss is decreasing most steeply -- roughly 10x below the learning rate where the loss starts to explode.

<div class="callout callout-example"><div class="callout-title">Example</div>Suppose you run the learning rate finder and see that the loss decreases rapidly between learning rates 1e-4 and 1e-2, then starts increasing sharply at 5e-2. A good starting learning rate would be around 1e-3 to 3e-3 -- safely in the "steep descent" zone, well below the "explosion" zone.</div>

**Learning rate and batch size are coupled.** The linear scaling rule states: when you multiply the batch size by k, multiply the learning rate by k. This preserves the approximate signal-to-noise ratio of the gradient updates. Typical starting points:

- Adam with batch size 32-128: lr = 1e-4 to 3e-4
- AdamW for transformers with batch size 256-2048: lr = 1e-4 to 5e-4 (with warmup)
- SGD with momentum with batch size 128-256: lr = 0.01 to 0.1

## Batch Size

Batch size affects training speed, memory usage, and -- less obviously -- generalization quality:

**Small batches (16-64):** Noisier gradients, better generalization (due to implicit regularization), but slower per-epoch speed and underutilized GPU.

**Large batches (256-4096):** Cleaner gradients, faster per-epoch speed, better GPU utilization, but potentially worse generalization and higher memory cost.

**Practical approach:** Start with the largest batch size that fits in your GPU memory. If the model overfits, try reducing the batch size. If training is too slow, try increasing it (with proportional learning rate adjustment).

## Network Architecture

**Depth (number of layers):** More layers enable more hierarchical feature learning, but also make training harder (vanishing gradients, overfitting). Follow domain conventions: ResNet-50 for image classification, 6-12 transformer layers for moderate-scale NLP, etc.

**Width (neurons/channels per layer):** Wider layers increase capacity but also increase computation and memory. Doubling the width roughly quadruples the computation (because matrix multiplication cost scales quadratically with dimension).

**Architecture choice is often more impactful than architecture tuning.** The decision to use a transformer vs. a CNN vs. an MLP matters more than whether the transformer has 6 or 8 layers. Start with a proven architecture for your domain and make small adjustments.

## Regularization Hyperparameters

**Weight decay (lambda):**
- SGD: 1e-4 to 5e-4 (classic choices)
- AdamW for transformers: 0.01 to 0.1

**Dropout rate:**
- Fully connected layers: 0.3 to 0.5
- Transformer attention/feed-forward: 0.1 to 0.3
- Large models on large datasets: possibly no dropout needed

## Search Strategies

**Grid search:** Define a grid of hyperparameter values and try every combination. Thorough but exponentially expensive. With 4 hyperparameters and 5 values each, you need 625 experiments.

**Random search:** Sample hyperparameter combinations randomly. Bergstra and Bengio (2012) demonstrated that random search is dramatically more efficient than grid search. The reason is simple and important:

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>Not all hyperparameters are equally important. If only the learning rate really matters (and the other hyperparameters have little effect), grid search with 25 trials tests only 5 different learning rates (the grid repeats each LR with 5 values of the other parameter). Random search with 25 trials tests 25 *different* learning rates, because each random sample is unique. Random search gets 5x more information about the dimension that matters.</div>

**Bayesian optimization:** Build a probabilistic model (usually a Gaussian process) of how hyperparameters relate to performance. Use the model to intelligently decide which hyperparameters to try next, balancing exploration of new regions with exploitation of promising ones. Tools like **Optuna**, **Weights & Biases Sweeps**, and **Ray Tune** implement this.

Bayesian optimization typically finds good hyperparameters in 20-50 trials, compared to hundreds for random search. For expensive models (where each training run takes hours or days), this efficiency is essential.

## A Practical Tuning Playbook

1. **Start with proven defaults.** Use Adam with lr=3e-4, batch size that fills GPU memory, and a standard architecture for your task. Run for a reasonable number of epochs.

2. **Run a learning rate finder.** Identify the optimal range.

3. **Coarse random search.** Sample 10-20 random combinations of learning rate, weight decay, and dropout rate from reasonable ranges. Use short training runs (10-20% of full training) to quickly eliminate bad configurations.

4. **Fine-tune the best.** Take the top 3-5 configurations and train them to completion. Select the one with the best validation performance.

5. **Adjust regularization.** If the final model overfits (training >> validation), increase regularization. If it underfits (both are poor), reduce regularization or increase model capacity.

<div class="callout callout-warning"><div class="callout-title">Critical Warning</div>Never tune hyperparameters on the test set. Split your data into training, validation, and test sets. Tune on validation performance. Report results on the test set. If you tune on the test set, your reported performance is overly optimistic because you have implicitly "fit" your hyperparameters to the test data. This is one of the most common and most serious mistakes in machine learning.</div>

## When to Stop Tuning

Hyperparameter tuning obeys the law of diminishing returns. The first round (getting the learning rate right) produces the biggest improvement. Subsequent rounds yield progressively smaller gains. A reasonable rule: spend no more than 10-20% of your total compute budget on hyperparameter search, then invest the rest in training the best configuration fully.

And remember: the best model is not always the one with the lowest validation loss. A model that is 0.2% less accurate but trains 10x faster, uses less memory, and is more robust to distribution shift might be the better choice for production.
`
		}
	],
	quiz: {
		questions: [
			{
				type: 'multiple-choice',
				id: 'tdn-q1',
				question: 'Why does SGD with momentum converge faster than vanilla SGD?',
				options: [
					'Momentum uses a larger learning rate',
					'Momentum accumulates velocity in consistent gradient directions and dampens oscillation',
					'Momentum computes exact gradients instead of stochastic estimates',
					'Momentum adapts the learning rate for each parameter individually'
				],
				correctIndex: 1,
				explanation:
					'Momentum maintains a velocity vector that accelerates in directions where gradients consistently agree (down the valley) and cancels out oscillation in directions where gradients alternate (across the valley). This smoothing effect speeds convergence significantly.'
			},
			{
				type: 'multiple-choice',
				id: 'tdn-q2',
				question:
					'What makes Adam the most popular general-purpose optimizer?',
				options: [
					'It always achieves the highest accuracy',
					'It requires no hyperparameters at all',
					'It combines momentum and per-parameter adaptive learning rates with robust defaults',
					'It is the fastest optimizer to compute'
				],
				correctIndex: 2,
				explanation:
					'Adam combines the benefits of momentum (first moment) and RMSprop (second moment/adaptive learning rates), and its default hyperparameters (beta1=0.9, beta2=0.999, epsilon=1e-8) work well across a wide range of problems with minimal tuning.'
			},
			{
				type: 'fill-in',
				id: 'tdn-q3',
				question:
					'In high-dimensional loss landscapes, most critical points (where the gradient is zero) are not local minima but _____ points.',
				acceptedAnswers: ['saddle', 'Saddle', 'saddle points'],
				explanation:
					'At a saddle point, the loss curves upward in some dimensions and downward in others. In high-dimensional spaces, the probability that all dimensions curve upward (required for a local minimum) is vanishingly small, making saddle points overwhelmingly more common than true local minima.'
			},
			{
				type: 'multiple-choice',
				id: 'tdn-q4',
				question:
					'According to the flatness hypothesis, why might smaller batch sizes lead to better generalization?',
				options: [
					'Smaller batches compute gradients faster',
					'Smaller batches require less GPU memory',
					'The noise from small batches helps the optimizer find flat minima that are robust to perturbations',
					'Smaller batches always produce lower training loss'
				],
				correctIndex: 2,
				explanation:
					'Small batch sizes produce noisier gradient estimates, which act like random perturbations. This noise helps the optimizer escape sharp minima (which overfit) and settle in flat minima (which are robust to the differences between training and test data).'
			},
			{
				type: 'ordering',
				id: 'tdn-q5',
				question:
					'Order these optimizers from least to most sophisticated:',
				items: ['Adam', 'SGD with Momentum', 'Vanilla SGD', 'RMSprop'],
				correctOrder: [2, 1, 3, 0],
				explanation:
					'Vanilla SGD has no adaptation. SGD with Momentum adds velocity. RMSprop adds per-parameter adaptive learning rates. Adam combines both momentum and adaptive rates with bias correction, making it the most sophisticated of the four.'
			},
			{
				type: 'multiple-choice',
				id: 'tdn-q6',
				question:
					'Why does dropout improve generalization?',
				options: [
					'It reduces the number of parameters in the model',
					'It speeds up the forward pass computation',
					'It forces neurons to learn robust, independent features by randomly disabling teammates during training',
					'It increases the learning rate for active neurons'
				],
				correctIndex: 2,
				explanation:
					'Dropout randomly sets neuron outputs to zero during training, preventing neurons from developing co-dependencies. Each neuron must learn to be useful independently, producing more robust features. Additionally, dropout implicitly trains an exponential ensemble of subnetworks.'
			},
			{
				type: 'multiple-choice',
				id: 'tdn-q7',
				question:
					'Why is Layer Normalization preferred over Batch Normalization for transformer architectures?',
				options: [
					'Layer norm is computationally cheaper',
					'Layer norm normalizes within each example independently, avoiding batch-size dependence',
					'Layer norm was invented more recently',
					'Layer norm does not use learnable parameters'
				],
				correctIndex: 1,
				explanation:
					'Layer norm normalizes across features within each individual example, making it independent of batch size. This is crucial for transformers, which process variable-length sequences and often use small effective batch sizes. Batch norm depends on batch statistics, which can be unreliable in these settings.'
			},
			{
				type: 'multiple-choice',
				id: 'tdn-q8',
				question:
					'Why is random search more efficient than grid search for hyperparameter tuning?',
				options: [
					'Random search always finds the global optimum',
					'Random search is easier to implement',
					'Random search explores more unique values of important hyperparameters rather than repeating the same values with different unimportant ones',
					'Random search requires fewer computational resources per trial'
				],
				correctIndex: 2,
				explanation:
					'When only some hyperparameters are important (which is almost always the case), grid search wastes trials by testing the same values of the important hyperparameter paired with different values of the unimportant one. Random search gives each trial a unique value for every hyperparameter, providing more information about the dimensions that actually matter.'
			}
		],
		passingScore: 6
	}
};

export default trainingDeepNetworks;
