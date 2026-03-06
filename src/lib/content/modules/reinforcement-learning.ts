import type { Module } from '../types';

const reinforcementLearning: Module = {
	slug: 'reinforcement-learning',
	title: 'Reinforcement Learning',
	description:
		'Learn how agents learn by interacting with environments. From Markov Decision Processes and Q-learning to deep RL breakthroughs like DQN and PPO, explore the paradigm that powered AlphaGo, game-playing AIs, and RLHF for language models.',
	estimatedMinutes: 110,
	xpReward: 90,
	quizXpReward: 50,
	lessons: [
		{
			slug: 'learning-by-doing',
			title: 'Learning by Doing',
			estimatedMinutes: 18,
			xpReward: 15,
			content: `
## Learning by Doing

Supervised learning needs a teacher who provides the right answers. Unsupervised learning finds patterns in unlabeled data. But there is a third paradigm — one that is arguably the most natural form of learning, because it is how humans and animals learn most things in life. It is called **reinforcement learning (RL)**, and its central idea is simple: learn by trying things and observing the consequences.

### The RL Framework

Reinforcement learning involves an **agent** interacting with an **environment** over a sequence of discrete time steps. At each step:

1. The agent observes the current **state** of the environment.
2. The agent chooses an **action**.
3. The environment transitions to a new state (partly determined by the action, partly by the environment's dynamics).
4. The environment provides a **reward** — a scalar signal indicating how good or bad the action was.

The agent's goal is to learn a **policy** — a mapping from states to actions — that maximizes the **cumulative reward** over time.

<div class="callout callout-example"><div class="callout-title">Real-World Analogy: Training a Dog</div>You are training your dog to sit on command.
- **Agent**: The dog.
- **Environment**: The room, your commands, the floor.
- **State**: Your hand signal, the dog's current posture, the position of the treat.
- **Action**: Sit, stand, lie down, jump, bark, etc.
- **Reward**: +1 treat when the dog sits on command. 0 otherwise.

The dog does not understand language or your intentions. It tries random things. Sometimes, when it happens to sit after your command, it gets a treat. Over many repetitions, the dog associates the command-state with the sit-action because that combination consistently leads to reward. That is reinforcement learning.</div>

### How RL Differs from Supervised and Unsupervised Learning

The differences are fundamental:

**No labeled examples.** In supervised learning, you have input-output pairs: "this image is a cat." In RL, the agent has no teacher showing the correct action. It must discover good actions through trial and error.

**Delayed rewards.** The consequences of an action may not be apparent for many steps. A chess move in the opening might only be revealed as brilliant or disastrous 30 moves later. This **temporal credit assignment problem** — figuring out which past actions led to the current reward — is one of the central challenges in RL.

**Sequential decision making.** Each action affects not only the immediate reward but also the future state, which affects all future rewards. The agent must reason about long-term consequences, not just immediate gratification.

**Exploration vs. exploitation.** The agent faces a fundamental dilemma: should it **exploit** actions it already knows work well (maximizing short-term reward) or **explore** new actions that might lead to even better outcomes (accepting short-term risk for potential long-term gain)?

<div class="callout callout-think"><div class="callout-title">Think About It</div>Consider learning to ride a bicycle. Nobody gives you labeled examples ("at this angle, apply this force to the handlebars"). You try, you fall, you try again. Falling is negative reward. Staying upright is positive reward. Over many attempts, you discover the policy — the mapping from states (your body angle, speed, handlebar position) to actions (lean, pedal, steer) — that keeps you upright. This is reinforcement learning in its purest form.</div>

### Exploration vs. Exploitation

This tension is one of the deepest problems in RL — and in decision-making generally.

Imagine you are in a new city choosing restaurants. You have found one restaurant you enjoy (7/10). Should you go there again tonight (exploit — guaranteed decent meal) or try a new restaurant that might be 9/10 or might be 3/10 (explore — risky but potentially rewarding)?

If you always exploit, you never discover better options. If you always explore, you never benefit from what you have learned. Every RL algorithm must find a balance.

**Epsilon-greedy** is the simplest approach: with probability epsilon (e.g., 0.1), choose a random action (explore). With probability 1 - epsilon, choose the best known action (exploit). Epsilon typically starts high (lots of exploration) and decays over time (shifting to exploitation as the agent learns).

**More sophisticated strategies** include:
- **Upper Confidence Bound (UCB)**: Explore actions that are uncertain — actions you have tried fewer times.
- **Thompson Sampling**: Maintain a probability distribution over how good each action is, and sample from it.
- **Intrinsic motivation**: Give the agent internal reward for visiting novel states, encouraging systematic exploration.

### The Reward Signal

The reward signal is how the designer communicates the goal to the agent. Good reward design is critical — and harder than it sounds.

**Sparse rewards** provide a signal only at the end of a task (e.g., +1 for winning a chess game, 0 otherwise). These are clean but make learning extremely slow — the agent must stumble upon success through random exploration before it can learn anything.

**Dense rewards** provide frequent feedback (e.g., +0.1 for each piece captured in chess, -0.01 for each time step). These speed up learning but can lead to unexpected behavior — the agent might find ways to maximize the dense reward that do not achieve the actual goal (this is called **reward hacking**).

<div class="callout callout-warning"><div class="callout-title">Reward Hacking</div>A famous example: an agent trained in a boat racing game was rewarded for hitting checkpoint markers. Instead of learning to race the course, it discovered a strategy of driving in circles, repeatedly hitting three markers in a small area. It maximized reward but never finished the race. The reward signal specified *what* was rewarded but not *how* the designer intended it to be earned. Reward design is one of the most important and underappreciated challenges in RL.</div>

### Key Terminology

Before we dive deeper, let us establish the vocabulary:

- **Policy (pi)**: The agent's strategy — a mapping from states to actions. Can be deterministic (one action per state) or stochastic (probability distribution over actions).
- **Value function V(s)**: The expected cumulative reward starting from state s and following the current policy. "How good is it to be in this state?"
- **Action-value function Q(s, a)**: The expected cumulative reward starting from state s, taking action a, and then following the current policy. "How good is it to take this action in this state?"
- **Episode**: A complete sequence from start to termination (e.g., one complete game of chess).
- **Trajectory**: The sequence of (state, action, reward) tuples experienced during an episode.
- **Discount factor (gamma)**: A number between 0 and 1 that determines how much the agent values future rewards relative to immediate ones. Gamma = 0.99 means a reward one step in the future is worth 99% of an immediate reward.
- **Return (G)**: The total discounted reward from a time step onward: G_t = r_t + gamma * r_{t+1} + gamma^2 * r_{t+2} + ...

### RL Is Everywhere

Although we will study RL in the context of games and simulations, the paradigm is far more general:

- **Robotics**: Learning to walk, grasp objects, navigate environments.
- **Recommendation systems**: Each recommendation is an action; user engagement is the reward.
- **Resource management**: Allocating compute resources, managing power grids, controlling traffic lights.
- **Finance**: Portfolio management, trading strategies.
- **LLM alignment**: RLHF uses RL to align language models with human preferences — the connection between RL and LLMs is direct and profound.

Understanding RL gives you a framework for thinking about any problem where an agent must make sequential decisions under uncertainty. In the next lesson, we formalize this framework with Markov Decision Processes.
`
		},
		{
			slug: 'markov-decision-processes',
			title: 'Markov Decision Processes',
			estimatedMinutes: 20,
			xpReward: 15,
			content: `
## Markov Decision Processes

To do rigorous reinforcement learning, we need a mathematical framework that captures the structure of sequential decision problems. That framework is the **Markov Decision Process (MDP)**. MDPs are the lingua franca of RL — virtually every RL algorithm is either solving an MDP directly or approximating a solution to one.

### The Components of an MDP

An MDP is defined by five elements:

1. **S** — A set of **states**. Every possible configuration of the environment. In chess, each legal board position is a state. In a navigation task, each (x, y) coordinate is a state.

2. **A** — A set of **actions** available to the agent. In chess, the legal moves. In navigation, up/down/left/right.

3. **P(s' | s, a)** — The **transition function**. Given that the agent is in state s and takes action a, P(s' | s, a) gives the probability of transitioning to state s'. This captures the dynamics of the environment: deterministic environments have P = 1 for one state and 0 for all others; stochastic environments spread probability across multiple outcomes.

4. **R(s, a, s')** — The **reward function**. The immediate reward received when transitioning from state s to state s' via action a. Sometimes simplified to R(s, a) or R(s).

5. **gamma** — The **discount factor** (between 0 and 1). Determines the present value of future rewards.

### The Markov Property

The "Markov" in MDP refers to the **Markov property**: the future depends only on the current state, not on the history of how you got there. Formally:

P(s_{t+1} | s_t, a_t, s_{t-1}, a_{t-1}, ..., s_0, a_0) = P(s_{t+1} | s_t, a_t)

<div class="callout callout-example"><div class="callout-title">Analogy: The Chess Position</div>In chess, the current board position (plus whose turn it is) is sufficient to determine all future possibilities. It does not matter whether you arrived at this position through a Sicilian Defense or a Queen's Gambit — the current state encodes everything the agent needs to make an optimal decision. This is the Markov property in action.

Contrast this with a card game where some cards have been played and are no longer visible. The current visible state does not contain all the information — you also need to remember which cards were played earlier. This violates the Markov property, making the problem a **Partially Observable MDP (POMDP)**, which is significantly harder.</div>

### The Discount Factor

Why discount future rewards? Several reasons:

**Mathematical convenience:** Without discounting, the sum of rewards over an infinite horizon might diverge to infinity. Discounting ensures the sum converges: the geometric series 1 + gamma + gamma^2 + ... = 1/(1-gamma).

**Preference for sooner rewards:** A reward now is worth more than the same reward later — there is uncertainty about the future, and receiving reward sooner gives more flexibility.

**Modeling time preference:** In economics, humans and organizations demonstrably prefer immediate rewards over delayed ones. Discount factors formalize this preference.

The choice of gamma has a significant impact on behavior:
- **gamma = 0**: The agent is completely myopic — it only cares about the immediate reward. It will never sacrifice short-term reward for long-term benefit.
- **gamma = 0.99**: The agent is far-sighted — a reward 100 steps in the future is worth about 37% of an immediate reward. The agent plans ahead.
- **gamma = 1**: No discounting. The agent cares equally about all future rewards. This only works for finite-horizon problems (where episodes end).

### Value Functions

The **value function** V^pi(s) answers a fundamental question: "If I am in state s and follow policy pi from now on, what is my expected total discounted reward?"

V^pi(s) = E[r_t + gamma * r_{t+1} + gamma^2 * r_{t+2} + ... | s_t = s, pi]

This is the expected **return** — the sum of discounted future rewards — starting from state s under policy pi.

The **action-value function** (or Q-function) Q^pi(s, a) answers a related question: "If I am in state s, take action a, and then follow policy pi, what is my expected total discounted reward?"

Q^pi(s, a) = E[r_t + gamma * r_{t+1} + gamma^2 * r_{t+2} + ... | s_t = s, a_t = a, pi]

The relationship between V and Q is straightforward: V^pi(s) = Q^pi(s, pi(s)) — the value of a state is the Q-value of the action the policy would choose.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>If you have the optimal Q-function Q*(s, a), the optimal policy is trivially easy: in every state, just pick the action with the highest Q-value. The entire challenge of RL can be framed as "learn Q* accurately." This is why Q-learning (the subject of the next lesson) is so central to the field.</div>

### The Bellman Equations

The most important equations in all of RL are the **Bellman equations**, which express the value of a state in terms of the values of successor states.

**Bellman expectation equation** (for a given policy pi):

V^pi(s) = sum_a pi(a|s) * sum_s' P(s'|s,a) * [R(s,a,s') + gamma * V^pi(s')]

In words: the value of state s is the expected immediate reward plus the discounted value of the next state, averaged over all possible actions (under the policy) and all possible next states (under the transition dynamics).

**Bellman optimality equation** (for the optimal value function):

V*(s) = max_a sum_s' P(s'|s,a) * [R(s,a,s') + gamma * V*(s')]

In words: the optimal value of state s is the value of the *best* action, where each action's value is the expected immediate reward plus the discounted optimal value of the next state.

<div class="callout callout-think"><div class="callout-title">Think About It</div>The Bellman equation is a recursive definition: the value of a state depends on the values of future states, which depend on the values of even further future states, and so on. This recursion terminates at terminal states (where the episode ends and the value is just the final reward). Solving RL means finding values that are self-consistent — that satisfy this recursion simultaneously for all states.</div>

### Intuition for the Bellman Equations

Here is an intuitive way to think about the Bellman equation using everyday decisions:

Imagine you are deciding whether to take a job offer. The value of your current state (considering the offer) is:

Value = immediate salary this year + gamma * (value of your career position next year)

The value of your career position next year depends on the job you take, which affects what opportunities you will have the year after, and so on. Each decision's value is the immediate reward plus the discounted future value — exactly the Bellman equation.

### Why MDPs Matter

MDPs provide the mathematical foundation for all of RL. Every algorithm we will study — Q-learning, SARSA, DQN, PPO — is either:
- Solving the Bellman equations exactly (for small problems), or
- Approximating a solution to the Bellman equations (for large problems).

Understanding MDPs means understanding what RL algorithms are really trying to do: find a policy that maximizes expected cumulative reward, as formalized by the MDP framework and the Bellman equations. With this foundation in place, we are ready to study the first practical algorithm for doing so: Q-learning.
`
		},
		{
			slug: 'q-learning-and-temporal-difference',
			title: 'Q-Learning and Temporal Difference',
			estimatedMinutes: 18,
			xpReward: 15,
			content: `
## Q-Learning and Temporal Difference

In the previous lesson, we established that if we could compute the optimal Q-function Q*(s, a), the optimal policy would be trivial: just pick the action with the highest Q-value in each state. The question is: **how do we compute Q*?** For large problems, we cannot solve the Bellman equations analytically. We need algorithms that learn from experience. The most foundational of these is **Q-learning**.

### Tabular Q-Learning

The simplest version of Q-learning maintains a **Q-table** — a lookup table with one entry for every (state, action) pair. For a gridworld with 100 states and 4 actions, this is a 100 x 4 table of numbers, initially set to zero (or random values).

The algorithm is remarkably simple:

1. Start in some state s.
2. Choose an action a (using epsilon-greedy: with probability epsilon, explore randomly; otherwise, pick the action with the highest Q-value).
3. Take action a, observe the reward r and the new state s'.
4. **Update the Q-table:**
   \`Q(s, a) = Q(s, a) + alpha * [r + gamma * max_a' Q(s', a') - Q(s, a)]\`
5. Set s = s', and repeat.

That is it. Over thousands of episodes, the Q-values converge to Q* — the optimal action-value function — and the agent learns the optimal policy.

<!-- interactive:ReinforcementGridWorld -->

### Understanding the Update Rule

The update rule is the heart of Q-learning. Let us break it down:

\`Q(s, a) = Q(s, a) + alpha * [target - current_estimate]\`

Where:
- **current_estimate** = Q(s, a) — what we currently think this state-action pair is worth.
- **target** = r + gamma * max_a' Q(s', a') — the immediate reward plus the discounted value of the best action in the next state. This is our new, better estimate based on what actually happened.
- **alpha** (learning rate) — how much we adjust toward the new estimate. Alpha = 0 means no learning. Alpha = 1 means we completely replace the old estimate.

The difference (target - current_estimate) is called the **temporal difference (TD) error**. It measures how "surprised" the agent is by the outcome. If the TD error is positive, the action was better than expected — increase its Q-value. If negative, it was worse than expected — decrease it.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>The brilliance of TD learning is that the agent does not have to wait until the end of an episode to update its estimates. After every single step, it can update Q(s, a) using the immediate reward and its current estimate of the next state's value. This is called "bootstrapping" — using estimates to update estimates — and it makes learning dramatically faster than waiting for complete episodes.</div>

### A Worked Example

Imagine a simple gridworld where an agent navigates from a start cell to a goal cell, receiving +10 at the goal and -1 for each step (to encourage efficiency).

Early in training, all Q-values are 0. The agent stumbles around randomly. Eventually, it reaches the goal by chance and receives +10. The Q-value for the (goal-adjacent cell, move-to-goal) action is updated:

\`Q(s_adj, right) = 0 + 0.1 * [10 + 0 - 0] = 1.0\`

Now the cell adjacent to the goal has a non-zero Q-value. On the next episode, when the agent happens to reach that cell, it has a reason to move right. And when it does, the cell *two steps* from the goal gets updated:

\`Q(s_adj2, right) = 0 + 0.1 * [-1 + 0.99 * 1.0 - 0] = -0.001\` (approximately)

Over many episodes, the reward signal propagates backward from the goal through the Q-table, eventually giving every state a meaningful Q-value that guides the agent along the shortest path.

<div class="callout callout-example"><div class="callout-title">Analogy: Word of Mouth</div>Imagine you are in a city with no map, looking for a great restaurant. You try random streets. Eventually, you find the restaurant and tell everyone on the adjacent block how to get there. They tell the next block over. Gradually, everyone in the city learns which direction to walk — the information propagates outward from the goal. This is how value propagation works in Q-learning.</div>

### SARSA: The On-Policy Alternative

Q-learning is **off-policy**: it updates Q-values using the maximum Q-value of the next state (max_a' Q(s', a')), regardless of which action the agent actually takes. This means it learns the value of the optimal policy even while following an exploratory policy.

**SARSA** (State-Action-Reward-State-Action) is the **on-policy** alternative. It updates using the action the agent *actually takes* next:

\`Q(s, a) = Q(s, a) + alpha * [r + gamma * Q(s', a') - Q(s, a)]\`

Where a' is the action actually chosen (via the epsilon-greedy policy) in state s', not the maximum Q-value action.

The difference matters: SARSA is more conservative. Because it evaluates the policy it is actually following (including random exploration), it learns a safer policy. If the agent is using epsilon-greedy with epsilon = 0.1, SARSA accounts for the fact that 10% of the time the agent will take a random action — potentially a bad one. Q-learning ignores this, learning the optimal policy assuming perfect future behavior.

<div class="callout callout-think"><div class="callout-title">Think About It</div>Consider a cliff-walking problem: the agent must walk along a path next to a cliff. One wrong step means falling off (large negative reward). SARSA, being on-policy, learns a path far from the cliff edge — because its epsilon-greedy exploration means it will occasionally take a random step toward the cliff. Q-learning, being off-policy, learns the shortest path right along the cliff edge — optimal *if* the agent always acts optimally, but dangerous with random exploration.</div>

### Epsilon-Greedy Exploration

The epsilon-greedy strategy is the simplest and most common exploration method:

\`\`\`
with probability epsilon: choose a random action
with probability 1 - epsilon: choose argmax_a Q(s, a)
\`\`\`

**Epsilon decay**: Typically, epsilon starts high (e.g., 1.0 — fully random) and gradually decays toward a small value (e.g., 0.01). This allows lots of exploration early in training when Q-values are unreliable, transitioning to mostly exploitation as the agent learns.

### Convergence

Q-learning has a beautiful theoretical guarantee: given sufficient exploration (every state-action pair is visited infinitely often), a learning rate that decays appropriately, and the Markov property, **Q-learning converges to Q*** — the optimal action-value function. The agent will learn the optimal policy.

In practice, this guarantee requires conditions that are hard to satisfy in large problems (visiting every state-action pair infinitely often is impractical if there are millions of states). This is where deep RL comes in.

### Limitations of Tabular Methods

Tabular Q-learning works well for small problems — gridworlds with a few hundred states, simple games, small navigation tasks. But real-world problems have enormous state spaces:

- **Chess**: ~10^47 possible board positions. A Q-table cannot fit in any computer's memory.
- **Go**: ~10^170 positions. Incomprehensibly large.
- **Continuous state spaces** (robotics, physics simulations): Infinite states. Tables are fundamentally impossible.

For these problems, we need function approximation — using neural networks to estimate Q-values instead of storing them in a table. This is the leap to **deep reinforcement learning**, which we will explore in the next lesson.
`
		},
		{
			slug: 'deep-reinforcement-learning',
			title: 'Deep Reinforcement Learning',
			estimatedMinutes: 20,
			xpReward: 15,
			content: `
## Deep Reinforcement Learning

Tabular Q-learning works beautifully for small problems, but real-world problems have state spaces that are far too large for lookup tables. Chess has approximately 10^47 legal positions. A video game screen at 210 x 160 pixels with 128 colors has 128^(210*160) possible frames — a number so large it dwarfs the number of atoms in the observable universe.

The solution: replace the Q-table with a **neural network** that takes a state as input and outputs Q-values for all possible actions. This is **deep Q-learning**, and its success in 2013-2015 launched the modern era of deep reinforcement learning.

### DQN: Deep Q-Network

**DQN (Deep Q-Network)**, introduced by Mnih et al. at DeepMind (2013/2015), was the breakthrough that proved deep RL could work at scale. The achievement was remarkable: a single neural network, trained with the same algorithm and hyperparameters, learned to play 49 different Atari games from raw pixel input — and achieved superhuman performance on 29 of them.

The core idea is straightforward: instead of maintaining a Q-table, train a neural network Q(s, a; theta) to approximate Q*(s, a). The network takes game frames as input (the state) and outputs a Q-value for each possible action (e.g., up, down, left, right, fire).

But simply replacing the Q-table with a neural network does not work out of the box. The naive approach is wildly unstable — Q-values oscillate, diverge, or collapse. DQN introduced two critical innovations that made it work.

### Innovation 1: Experience Replay

In standard Q-learning, the agent updates on each transition immediately after experiencing it. This creates two problems:

1. **Temporal correlation**: Consecutive experiences are highly correlated (frame 1000 looks a lot like frame 1001). Training a neural network on correlated data leads to poor generalization.
2. **Data inefficiency**: Each experience is used once and discarded.

**Experience replay** solves both problems. The agent stores all its experiences (s, a, r, s') in a **replay buffer** — a large memory bank. During training, instead of updating on the most recent transition, the agent samples a random mini-batch of transitions from the replay buffer.

This simple change has profound effects:
- **Breaks correlations**: Random sampling ensures the training mini-batch contains diverse, uncorrelated experiences.
- **Reuses data**: Each experience can be sampled and trained on many times, dramatically improving data efficiency.
- **Stabilizes learning**: The training distribution changes slowly (the buffer contains a mix of old and recent experiences) rather than shifting wildly with each new experience.

<div class="callout callout-example"><div class="callout-title">Analogy: Studying for an Exam</div>Imagine studying for a history exam. The naive approach is to study events in chronological order, focusing only on what you just read. Experience replay is like using flashcards: you write each fact on a card, shuffle the deck, and review random cards during each study session. You see the same facts multiple times, in different orders, which leads to much more robust learning.</div>

### Innovation 2: Target Network

The Q-learning update uses a target: r + gamma * max_a' Q(s', a'). But notice: the same network that is being updated is also used to compute the target. This is like trying to hit a moving target — every time you update the network, the target values change, creating oscillation and instability.

DQN solves this with a **target network** — a separate copy of the Q-network whose weights are frozen for many steps and then periodically updated (copied from the main network). The target is computed using the frozen target network:

\`target = r + gamma * max_a' Q_target(s', a')\`

Because the target network's weights are fixed for thousands of steps, the target values are stable, and training converges much more reliably.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>The two innovations in DQN — experience replay and target networks — both address the same fundamental issue: stability. Neural networks are powerful function approximators, but they require stable, uncorrelated training data to learn effectively. The naive RL setup provides neither. DQN's innovations engineer stability into the learning process.</div>

### The Atari Breakthrough

DQN's achievement was not just technical — it was a dramatic demonstration. The network received only raw pixel data (four consecutive frames, to capture motion) and the game score. It had no knowledge of the game rules, no hand-crafted features, and no human demonstrations. Yet it discovered sophisticated strategies:

- In **Breakout**, it learned to tunnel through the side of the brick wall and bounce the ball behind the wall, clearing bricks rapidly from above — a strategy that human players also discover, but that the agent found entirely on its own.
- In **Space Invaders**, it learned to target the edges of the alien formation for maximum efficiency.
- In **Pong**, it learned to aim the ball at the opponent's corners.

This was the proof of concept that convinced the AI community that deep RL was a viable path to intelligent behavior.

### Rainbow DQN: The Full Upgrade

After DQN, researchers identified several independent improvements that could be combined:

**Double DQN** (van Hasselt et al., 2016): DQN tends to overestimate Q-values because it uses the max operator to select and evaluate actions simultaneously. Double DQN decouples these: the main network selects the best action, but the target network evaluates it. This simple change reduces overestimation and improves performance.

**Prioritized Experience Replay** (Schaul et al., 2016): Instead of sampling uniformly from the replay buffer, prioritize transitions with high TD error — experiences where the agent was most "surprised." This focuses learning on the most informative experiences.

**Dueling DQN** (Wang et al., 2016): Separates the Q-value into two components: the **value** of the state V(s) and the **advantage** of each action A(s, a). Q(s, a) = V(s) + A(s, a). This architecture learns more efficiently because many states have similar values regardless of the action taken.

**Noisy Networks** (Fortunato et al., 2018): Adds learnable noise parameters to the network weights, providing a more principled form of exploration than epsilon-greedy.

**Distributional RL** (Bellemare et al., 2017): Instead of learning the expected Q-value (a single number), learn the full distribution of possible returns. This provides richer information about the uncertainty and variability of outcomes.

**Multi-step returns** (Sutton, 1988): Instead of using the one-step TD target (r + gamma * Q(s')), use multi-step returns (r1 + gamma*r2 + gamma^2*r3 + ... + gamma^n * Q(s_n)), which propagates reward information faster.

**Rainbow** (Hessel et al., 2018) combined all six improvements on top of DQN and showed that each contributed to performance. The combined agent dramatically outperformed any individual improvement.

<div class="callout callout-warning"><div class="callout-title">Limitations of DQN</div>DQN and its variants work well for problems with discrete, low-dimensional action spaces (e.g., Atari games with ~18 possible actions). They struggle with continuous action spaces (e.g., controlling a robot arm with joint angles), high-dimensional action spaces, and problems requiring long-horizon planning. For these, policy gradient methods (the subject of the next lesson) are more appropriate.</div>

### Beyond Atari

DQN's success on Atari was just the beginning. Deep RL has since been applied to:
- **Board games**: AlphaGo (2016) defeated the world champion in Go — a game long considered beyond AI's reach. We will discuss this in Lesson 6.
- **Dexterous manipulation**: Robotic hands learning to solve Rubik's Cubes, manipulate objects, and perform precise assembly.
- **Autonomous driving**: Learning driving policies from simulation, then transferring to real vehicles.
- **Chip design**: DeepMind's AlphaChip uses RL to design efficient computer chip layouts.
- **Scientific discovery**: RL agents discovering new algorithms, optimizing chemical reactions, and designing novel materials.

The leap from tabular methods to deep RL did not just scale up existing approaches — it opened entirely new problem domains that were previously inaccessible.
`
		},
		{
			slug: 'policy-gradient-methods',
			title: 'Policy Gradient Methods',
			estimatedMinutes: 18,
			xpReward: 15,
			content: `
## Policy Gradient Methods

Q-learning and DQN learn a **value function** and derive a policy indirectly (pick the action with the highest Q-value). This works well for discrete action spaces, but what if you need to control a robot arm with continuous joint angles? You cannot compute max_a Q(s, a) over an infinite number of continuous actions.

**Policy gradient methods** take a fundamentally different approach: they directly learn the policy itself — a parameterized function (typically a neural network) that maps states to actions. Instead of learning "how valuable is each action?" they learn "what action should I take?"

### Direct Policy Optimization

A policy gradient method maintains a parameterized policy pi_theta(a|s) — a neural network with parameters theta that takes a state s and outputs a probability distribution over actions. For continuous actions, this might be a Gaussian distribution parameterized by a learned mean and standard deviation. For discrete actions, it is a softmax over action probabilities.

The objective is to find the parameters theta that maximize the expected cumulative reward:

J(theta) = E[sum of gamma^t * r_t | pi_theta]

We want to compute the gradient of J with respect to theta and follow it upward (gradient ascent, since we are maximizing rather than minimizing).

### The REINFORCE Algorithm

**REINFORCE** (Williams, 1992) is the simplest policy gradient algorithm. The key insight, known as the **policy gradient theorem**, is that the gradient of the expected return can be estimated from sampled trajectories:

gradient of J(theta) = E[sum_t (gradient of log pi_theta(a_t | s_t)) * G_t]

Where G_t is the return (total discounted reward) from time step t onward.

In words: the gradient is the direction that increases the log-probability of actions proportionally to how much total reward followed them. Actions that led to high reward become more likely; actions that led to low reward become less likely.

<div class="callout callout-example"><div class="callout-title">Intuition</div>Imagine a basketball player practicing free throws. REINFORCE says: "If you tried shooting with your elbow slightly higher and scored more baskets, do more of that. If you tried shooting with a flatter arc and missed more, do less of that." The player does not learn a value function for every possible shooting form — they directly adjust their shooting policy based on outcomes.</div>

The REINFORCE algorithm in practice:
1. Run the policy for a full episode, recording all (state, action, reward) tuples.
2. Compute the return G_t for each timestep.
3. Compute the policy gradient and update theta.
4. Repeat.

### The Variance Problem

REINFORCE has a critical weakness: **high variance**. Because it uses complete episode returns, and episodes can be highly variable (sometimes you get lucky, sometimes you don't), the gradient estimates are noisy. This noise slows learning dramatically — the agent needs many episodes before the signal emerges from the noise.

**Baselines** reduce variance. Instead of weighting actions by the raw return G_t, we subtract a **baseline** b(s_t) — typically an estimate of the state's value V(s_t):

gradient of J(theta) = E[sum_t (gradient of log pi_theta(a_t | s_t)) * (G_t - b(s_t))]

The quantity (G_t - V(s_t)) is called the **advantage**: it measures how much better the actual return was compared to what was expected. Actions that are better than expected get reinforced; actions that are worse than expected get discouraged. This centering dramatically reduces variance without introducing bias.

### Actor-Critic Methods

The natural extension of using a baseline is to learn it with another neural network. This gives us the **actor-critic** architecture:

- **Actor**: The policy network pi_theta(a|s) — decides what to do.
- **Critic**: The value network V_phi(s) — evaluates how good the current state is.

The actor generates actions. The critic evaluates them. The actor is updated using the advantage (actual return minus the critic's value estimate). The critic is updated to be a better predictor of value (using standard TD learning).

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>Actor-critic combines the best of both worlds: the actor directly optimizes the policy (handling continuous actions naturally), while the critic provides a low-variance baseline that stabilizes training. Most modern RL algorithms are actor-critic methods.</div>

### A3C: Asynchronous Advantage Actor-Critic

**A3C** (Mnih et al., 2016) was a major step forward. Instead of using a single agent with an experience replay buffer (like DQN), A3C runs **many agents in parallel**, each in its own copy of the environment. Each agent collects experience independently and asynchronously updates a shared set of parameters.

The parallelism provides natural decorrelation (different agents are in different states) and dramatically accelerates learning. A3C achieved strong results on Atari games and continuous control tasks.

### PPO: Proximal Policy Optimization

**PPO** (Schulman et al., 2017) is arguably the most important RL algorithm in current practice. It is used for robotics, game playing, and — critically — the RLHF step that aligns large language models.

PPO addresses a fundamental tension in policy gradient methods: if you take too large a policy update, performance can collapse catastrophically (the policy becomes terrible and may never recover). If you take too small an update, learning is inefficiently slow.

PPO solves this with a **clipped objective** that prevents the policy from changing too much in a single update. The objective function uses a ratio r_t(theta) = pi_theta(a_t|s_t) / pi_old(a_t|s_t) — how much more or less likely the new policy makes the action compared to the old policy.

\`\`\`
L_clip = min(r_t * A_t, clip(r_t, 1-epsilon, 1+epsilon) * A_t)
\`\`\`

Where A_t is the advantage and epsilon is typically 0.2. This clipping ensures that:
- If the advantage is positive (good action), the ratio is capped at 1+epsilon — the action's probability can increase, but not by too much.
- If the advantage is negative (bad action), the ratio is capped at 1-epsilon — the action's probability can decrease, but not by too much.

<div class="callout callout-think"><div class="callout-title">Think About It</div>Why not use a simple learning rate to control update size? Because in policy gradient methods, the relationship between parameter change and policy change is highly nonlinear. A small parameter change might cause a huge behavior change if it pushes a softmax past a tipping point. PPO directly constrains the policy change rather than the parameter change, which is a much more meaningful constraint.</div>

### Why PPO Is So Popular

PPO has become the default RL algorithm for many applications because:

1. **Simplicity**: It is easy to implement (much simpler than TRPO, its predecessor).
2. **Stability**: The clipping mechanism prevents catastrophic policy changes.
3. **Generality**: It works for both discrete and continuous action spaces.
4. **Sample efficiency**: It makes multiple gradient updates from the same batch of data (unlike REINFORCE, which uses each sample once).
5. **Scalability**: It parallelizes naturally and works well at scale.
6. **Proven track record**: PPO powers RLHF for ChatGPT and Claude, OpenAI Five (Dota 2), and many robotics applications.

### Policy Gradients vs. Q-Learning: When to Use What

| Feature | Q-Learning (DQN) | Policy Gradient (PPO) |
|---------|------------------|--------------------|
| Action space | Discrete (small) | Discrete or continuous |
| Sample efficiency | Higher (replay buffer) | Lower (on-policy) |
| Stability | Can be unstable (overestimation) | More stable (PPO clipping) |
| Convergence | May oscillate | Monotonic improvement |
| Best for | Games, discrete decisions | Robotics, continuous control, RLHF |

In practice, PPO and its variants are the most widely used RL algorithms today. But Q-learning variants remain relevant for sample-efficient learning in discrete domains.
`
		},
		{
			slug: 'rl-frontiers',
			title: 'RL Frontiers',
			estimatedMinutes: 16,
			xpReward: 15,
			content: `
## RL Frontiers

Reinforcement learning has produced some of the most dramatic achievements in AI history — and its influence extends far beyond game playing. In this lesson, we explore the frontier applications and research directions that are shaping the future of RL.

### AlphaGo and AlphaZero

**AlphaGo** (Silver et al., 2016) was the AI achievement that captured the world's attention. The ancient board game of Go has approximately 10^170 legal positions — more than the number of atoms in the observable universe. For decades, Go was considered far beyond the reach of AI, because brute-force search (which had conquered chess) was impossible at this scale.

AlphaGo combined three ideas:

1. **Monte Carlo Tree Search (MCTS)**: A search algorithm that randomly simulates games from the current position, using the outcomes to estimate the value of different moves. MCTS does not try to explore the full game tree; it focuses on the most promising branches.

2. **Policy network**: A convolutional neural network trained on human expert games to predict which moves a professional player would make. This guides MCTS toward promising moves, massively reducing the search space.

3. **Value network**: Another neural network that evaluates board positions — estimating who is winning from any given state. This allows MCTS to cut its simulations short, using the value network's estimate instead of playing to the end.

4. **Self-play reinforcement learning**: After initial training on human games, AlphaGo played millions of games against itself, using RL (policy gradient methods) to improve beyond human-level play.

In March 2016, AlphaGo defeated Lee Sedol, one of the world's greatest Go players, 4-1. The victory was a landmark moment for AI.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>AlphaGo's famous "Move 37" in Game 2 against Lee Sedol was a move that no human expert would have played — a shoulder hit on the fifth line that violated conventional wisdom. Yet it proved to be a brilliant move that shifted the game's trajectory. The AI had discovered a strategy that 3,000 years of human Go expertise had missed. This demonstrated that RL agents can genuinely create novel knowledge, not just recombine human patterns.</div>

**AlphaZero** (Silver et al., 2017) went further: it eliminated human expert data entirely. Starting from random play and learning solely through self-play RL, AlphaZero mastered Go, chess, and shogi (Japanese chess) — achieving superhuman performance in all three games within hours of training. A single algorithm, with no game-specific knowledge beyond the rules, surpassed the best specialized engines in all three games.

**MuZero** (Schrittwieser et al., 2020) pushed the boundary again: it learned to master games without even knowing the rules. MuZero learns a model of the environment (predicting rewards and state transitions) and uses this learned model for planning. This is a step toward general-purpose planning agents that can learn to interact with any environment.

### Multi-Agent RL

Most RL research considers a single agent in a static environment. But the real world is full of **multiple agents** interacting simultaneously:

- **Cooperative**: Teams of robots coordinating to achieve a shared goal. Autonomous vehicles negotiating intersections.
- **Competitive**: Game-playing agents. Adversarial security scenarios.
- **Mixed**: Negotiation, economic markets, social dilemmas where agents have both aligned and conflicting incentives.

Multi-agent RL introduces new challenges:
- **Non-stationarity**: Each agent's environment includes the other agents, whose policies are changing during training. The environment is literally moving as you try to learn in it.
- **Credit assignment**: In a team, which agent's actions led to success or failure?
- **Emergent behavior**: Complex, unexpected strategies can arise from the interaction of simple agents.

**OpenAI Five** (2019) demonstrated multi-agent RL at scale: five neural network agents learned to play Dota 2 (a complex team-based video game) cooperatively, eventually defeating professional human teams. Each agent had to learn individual skills *and* team coordination — a remarkable achievement.

### Offline RL

Standard RL requires an agent to interact with the environment during training — taking actions, observing outcomes, and updating its policy. But in many real-world scenarios, **interacting with the environment is expensive, dangerous, or impossible**:

- **Healthcare**: You cannot experiment with patient treatments to collect RL training data.
- **Autonomous driving**: Random exploration on real roads is unsafe.
- **Industrial control**: Exploring bad policies in a factory could damage expensive equipment.

**Offline RL** (also called batch RL) learns from a pre-collected, fixed dataset of interactions — without any additional environment interaction. The dataset might come from human demonstrations, previous policies, or logged historical data.

The challenge: the agent must learn a good policy from data collected by a *different* policy. If the dataset was collected by a mediocre policy, the agent has limited information about what would happen if it took different actions. Naive application of standard RL algorithms to offline data leads to severe overestimation of unseen actions and policy collapse.

Recent algorithms like **Conservative Q-Learning (CQL)** and **Decision Transformer** address this by constraining the learned policy to stay close to the data distribution or by treating RL as a sequence modeling problem.

<div class="callout callout-think"><div class="callout-title">Think About It</div>The Decision Transformer (Chen et al., 2021) takes a radical approach: instead of using Bellman equations or policy gradients, it treats RL as a sequence prediction problem. It inputs a desired return, the history of states, actions, and rewards, and predicts the next action using a transformer architecture. This connects RL directly to the language modeling paradigm, suggesting that the boundary between RL and sequence modeling is blurring.</div>

### RLHF: The Bridge to Language Models

We have already encountered RLHF (Reinforcement Learning from Human Feedback) in the LLM module, but it is worth revisiting from the RL perspective, because RLHF is currently the single most impactful application of reinforcement learning in the world.

In RLHF for language models:
- **Agent**: The language model.
- **Environment**: The conversation context.
- **State**: The prompt and conversation history.
- **Action**: The next token (or full response) generated.
- **Reward**: A scalar score from the reward model, which is trained to predict human preferences.
- **Algorithm**: PPO (typically), with a KL penalty to prevent the policy from diverging too far from the base model.

This framing reveals something profound: every time you interact with ChatGPT, Claude, or any aligned LLM, you are interacting with an RL agent. The model's behavior has been shaped by the same fundamental principles — reward maximization, policy optimization, exploration-exploitation — that govern a robot learning to walk or an agent playing Atari.

<div class="callout callout-warning"><div class="callout-title">The Reward Model Problem</div>RLHF inherits all of RL's challenges with reward design. The reward model is a proxy for human preferences, not a perfect oracle. If the reward model has biases or blind spots, the LLM will exploit them — producing responses that score highly on the proxy reward while not actually being what humans want. This is reward hacking in the LLM context, and it is an active area of alignment research.</div>

### Sim-to-Real Transfer

Training RL agents in the real world is slow, expensive, and dangerous. Training in simulation is fast, cheap, and safe. The challenge: policies trained in simulation often fail when deployed in the real world, because the simulation does not perfectly capture real-world physics, sensing, and variability. This gap is called the **sim-to-real gap**.

Techniques for closing this gap:
- **Domain randomization**: Randomize visual and physical parameters in simulation (lighting, colors, friction, mass) during training, forcing the agent to learn policies robust to these variations.
- **System identification**: Measure real-world physical parameters and calibrate the simulation to match.
- **Progressive fine-tuning**: Train in simulation, then briefly fine-tune on real-world data.

Notable successes include OpenAI's Rubik's Cube-solving robotic hand (2019), trained entirely in simulation using massive domain randomization, and various legged robot locomotion policies that transfer from simulation to real hardware.

### Robotics

Robotics is perhaps the most natural domain for RL — robots must make sequential decisions in physical environments, exactly the MDP framework. Recent successes include:

- **Locomotion**: Quadrupedal robots (like those from Boston Dynamics and others) learning agile locomotion — running, jumping, climbing stairs — through RL.
- **Manipulation**: Robotic arms learning to grasp, manipulate, and assemble objects with dexterity approaching (and sometimes exceeding) human capability.
- **Foundation models for robotics**: RT-2 (Google) and similar systems use vision-language models as policies for robot control, bridging the gap between language understanding and physical action.

### The Future of RL

RL's influence is expanding, not contracting. The convergence of RL with large-scale foundation models — using transformers as policy networks, using language models for reward specification, using RL to align AI systems — suggests that RL will remain central to the development of increasingly capable AI.

Key open challenges:
- **Sample efficiency**: RL agents still require enormous amounts of experience. Improving efficiency is critical for real-world deployment.
- **Reward specification**: Designing reward functions that capture what we actually want, without loopholes, remains deeply challenging.
- **Safety**: Ensuring RL agents behave safely during exploration and deployment — especially in high-stakes domains like healthcare, finance, and autonomous vehicles.
- **Generalization**: Training agents that generalize to new environments, tasks, and conditions rather than overfitting to their training environment.

Reinforcement learning started as a theory of animal learning, became a mathematical framework, evolved into a practical algorithm, and is now a central pillar of the AI systems that are reshaping the world. Understanding RL is not just about solving games — it is about understanding the fundamental principles of intelligent, adaptive behavior.
`
		}
	],
	quiz: {
		questions: [
			{
				type: 'multiple-choice',
				id: 'rl-q1',
				question:
					'What are the four key elements of the reinforcement learning framework?',
				options: [
					'Input, Output, Weight, Bias',
					'Agent, Environment, State/Action, Reward',
					'Encoder, Decoder, Attention, Loss',
					'Training, Validation, Testing, Deployment'
				],
				correctIndex: 1,
				explanation:
					'The RL framework consists of an Agent that interacts with an Environment by observing States, taking Actions, and receiving Rewards. The agent learns a policy that maximizes cumulative reward over time.'
			},
			{
				type: 'fill-in',
				id: 'rl-q2',
				question:
					'The _____ property states that the future depends only on the current state, not the history of how you got there.',
				acceptedAnswers: ['Markov', 'markov'],
				explanation:
					'The Markov property means P(s_{t+1} | s_t, a_t) = P(s_{t+1} | s_t, a_t, s_{t-1}, ..., s_0). The current state contains all information needed for future decisions, making history irrelevant. This is the key assumption underlying MDPs.'
			},
			{
				type: 'multiple-choice',
				id: 'rl-q3',
				question:
					'In Q-learning, what does the TD (temporal difference) error represent?',
				options: [
					'The total reward received in an episode',
					'The difference between the target (r + gamma * max Q) and the current Q-value estimate',
					'The number of steps until the episode terminates',
					'The difference between the policy and a random baseline'
				],
				correctIndex: 1,
				explanation:
					'The TD error is (r + gamma * max_a Q(s\', a\')) - Q(s, a). It measures how "surprised" the agent is: if the actual outcome (immediate reward plus estimated future value) exceeds the current estimate, the TD error is positive and the Q-value should increase.'
			},
			{
				type: 'multiple-choice',
				id: 'rl-q4',
				question:
					'What problem does experience replay solve in DQN?',
				options: [
					'It reduces the number of parameters in the network',
					'It breaks temporal correlations between consecutive experiences and enables data reuse',
					'It eliminates the need for a reward function',
					'It makes the environment deterministic'
				],
				correctIndex: 1,
				explanation:
					'Consecutive RL experiences are highly correlated (similar states, similar actions). Training a neural network on correlated data causes poor generalization and instability. Experience replay stores transitions in a buffer and samples random mini-batches, breaking correlations and allowing each experience to be used multiple times.'
			},
			{
				type: 'ordering',
				id: 'rl-q5',
				question:
					'Order the evolution of game-playing RL agents from earliest to latest:',
				items: [
					'AlphaZero (self-play, no human data)',
					'DQN (Atari games from pixels)',
					'AlphaGo (human games + self-play)',
					'MuZero (learns rules and plans)'
				],
				correctOrder: [1, 2, 0, 3],
				explanation:
					'DQN (2013/2015) played Atari games from raw pixels. AlphaGo (2016) used human expert data and self-play for Go. AlphaZero (2017) learned solely from self-play without human data. MuZero (2020) learned without even knowing the rules, learning a model of the environment.'
			},
			{
				type: 'multiple-choice',
				id: 'rl-q6',
				question:
					'What is the key advantage of policy gradient methods over Q-learning?',
				options: [
					'Policy gradient methods are always faster',
					'Policy gradient methods naturally handle continuous action spaces',
					'Policy gradient methods do not need a reward signal',
					'Policy gradient methods are more sample efficient'
				],
				correctIndex: 1,
				explanation:
					'Q-learning requires computing max_a Q(s,a) over all actions, which is intractable for continuous action spaces (infinite actions). Policy gradient methods directly parameterize the policy as a probability distribution over actions, naturally handling continuous actions by outputting distribution parameters (e.g., mean and variance of a Gaussian).'
			},
			{
				type: 'fill-in',
				id: 'rl-q7',
				question:
					'PPO stands for _____ Policy Optimization.',
				acceptedAnswers: ['Proximal', 'proximal'],
				explanation:
					'Proximal Policy Optimization constrains each policy update to be "proximal" (close) to the previous policy, preventing catastrophic performance collapse from overly large updates. It uses a clipped objective function to enforce this constraint.'
			},
			{
				type: 'multiple-choice',
				id: 'rl-q8',
				question:
					'In the actor-critic architecture, what are the roles of the actor and the critic?',
				options: [
					'Actor generates data, critic filters bad data',
					'Actor selects actions (policy), critic estimates state values (baseline)',
					'Actor processes states, critic processes actions',
					'Actor trains first, then the critic fine-tunes'
				],
				correctIndex: 1,
				explanation:
					'The actor is the policy network that decides which actions to take. The critic is the value network that estimates how good the current state is. The critic provides a baseline for the policy gradient, reducing variance and stabilizing training.'
			},
			{
				type: 'multiple-choice',
				id: 'rl-q9',
				question:
					'What is the "sim-to-real gap" in robotics RL?',
				options: [
					'The difference in training speed between simulation and real world',
					'The discrepancy between simulation and reality that causes trained policies to fail when deployed on real hardware',
					'The gap between simulated and real reward functions',
					'The time delay between simulation training and real-world deployment'
				],
				correctIndex: 1,
				explanation:
					'Simulation cannot perfectly replicate real-world physics, sensing, and variability. Policies trained in simulation may rely on aspects of the simulation that differ from reality, causing them to fail on real hardware. Techniques like domain randomization help bridge this gap.'
			},
			{
				type: 'multiple-choice',
				id: 'rl-q10',
				question:
					'How does RLHF connect reinforcement learning to large language models?',
				options: [
					'It uses LLMs to write RL code automatically',
					'It treats the LLM as an RL agent, using a reward model trained on human preferences to optimize the model\'s response policy via PPO',
					'It replaces RL algorithms with language model predictions',
					'It uses RL to pre-train language models from scratch'
				],
				correctIndex: 1,
				explanation:
					'In RLHF, the LLM is the agent, the prompt/conversation is the state, generating a response is the action, and a reward model (trained on human preference rankings) provides the reward signal. PPO optimizes the LLM\'s policy to produce responses that the reward model scores highly.'
			}
		],
		passingScore: 7
	}
};

export default reinforcementLearning;
