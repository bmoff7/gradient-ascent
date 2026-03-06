import type { Module } from '../types';

const supervisedLearning: Module = {
	slug: 'supervised-learning',
	title: 'Supervised Learning',
	description:
		'Master the algorithms that learn from labeled data -- from linear regression to support vector machines -- and understand how to choose, train, and compare models.',
	estimatedMinutes: 140,
	xpReward: 105,
	quizXpReward: 50,
	lessons: [
		{
			slug: 'learning-with-labels',
			title: 'Learning with Labels',
			estimatedMinutes: 16,
			xpReward: 15,
			content: `
# Learning with Labels

Supervised learning is the workhorse of modern machine learning. It powers the spam filters in your inbox, the recommendation engines on streaming platforms, the voice assistants on your phone, and the diagnostic tools in hospitals. At its core, supervised learning is remarkably simple: you show an algorithm examples of inputs paired with correct outputs, and it learns a function that maps one to the other.

## What Does "Supervision" Mean?

The word "supervised" comes from the role that labeled data plays -- it acts as a teacher or supervisor. Every training example says: "Given this input, the correct answer is this output." The algorithm's job is to generalize from these examples so it can produce correct outputs for inputs it has never seen before.

Think of it like teaching a child to identify animals. You point to a picture and say "that's a dog." You point to another and say "that's a cat." After enough examples, the child doesn't just memorize the specific pictures -- they learn abstract features (floppy ears, whiskers, body shape) that let them identify dogs and cats they've never seen before. That's generalization, and it's the entire point.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>The "supervised" in supervised learning refers to the labels acting as supervision, not to human oversight of the algorithm. The labels are the teacher; the algorithm is the student. The quality of the labels directly determines the ceiling of what the algorithm can learn.</div>

## The Two Fundamental Tasks: Regression and Classification

Every supervised learning problem falls into one of two categories based on the nature of the output:

### Classification

The output is a **discrete category** or class label. The model assigns each input to one of a predefined set of categories.

**Binary classification** -- two possible outputs:
- Spam or not spam
- Fraudulent or legitimate
- Malignant or benign

**Multi-class classification** -- more than two possible outputs:
- Which digit (0-9) is in this image?
- What species of flower is this?
- What language is this text written in?

**Multi-label classification** -- multiple labels can apply simultaneously:
- What tags describe this blog post? (could be "technology," "AI," and "tutorial" all at once)
- What objects are in this photo? (could contain "car," "tree," and "person")

### Regression

The output is a **continuous number**. The model predicts a numerical value.

- What price will this house sell for? ($342,500)
- What temperature will it be tomorrow? (72.3 degrees F)
- How many minutes will this delivery take? (34.7 minutes)

<div class="callout callout-think"><div class="callout-title">Think About It</div>The line between classification and regression can sometimes be blurry. Predicting whether a customer will churn (yes/no) is classification. But predicting the *probability* that a customer will churn (0.73) is regression. Many classification models actually output probabilities internally, and the discrete class label comes from applying a threshold to that probability.</div>

## Feature Vectors and Target Variables

To make supervised learning precise, we need clear vocabulary:

**Features** (also called inputs, predictors, independent variables, or attributes) are the measurable properties of each example that the model uses to make predictions. For a house price prediction model, features might include square footage, number of bedrooms, lot size, zip code, and year built.

A **feature vector** is the collection of all features for a single example, represented as a vector of numbers. If a house has 1,500 sqft, 3 bedrooms, and was built in 1995, its feature vector might be [1500, 3, 1995]. We typically denote a feature vector as **x** and the full dataset of feature vectors as **X** (a matrix where each row is one example).

The **target variable** (also called the output, response, dependent variable, or label) is what you're trying to predict. We denote it as **y** for a single example and **Y** for the full set of targets.

A training dataset is a collection of (x, y) pairs: input feature vectors paired with their known target values.

**Example -- Predicting Exam Scores:**

| Hours Studied (x1) | Hours Slept (x2) | Previous GPA (x3) | Exam Score (y) |
|---|---|---|---|
| 5 | 8 | 3.5 | 85 |
| 2 | 6 | 2.8 | 62 |
| 8 | 7 | 3.9 | 95 |
| 1 | 4 | 2.1 | 45 |

Each row is one example. The first three columns form the feature vector **x** = [hours_studied, hours_slept, previous_gpa]. The last column is the target **y** = exam_score. The model's goal is to learn a function that takes any feature vector and produces a good prediction of the exam score.

## The Hypothesis Function

The core of supervised learning is learning a **hypothesis function** (also called a model or mapping function):

**h: X -> Y**

This function takes a feature vector as input and produces a prediction as output. The term "hypothesis" reflects the fact that the function is our best guess at the true relationship between inputs and outputs.

Different algorithms define different forms for this hypothesis function:

- **Linear regression:** h(x) = w1*x1 + w2*x2 + ... + wn*xn + b (a weighted sum of features plus a bias term)
- **Logistic regression:** h(x) = sigmoid(w1*x1 + w2*x2 + ... + wn*xn + b) (the same weighted sum, squeezed through a sigmoid to produce a probability)
- **Decision tree:** h(x) = a series of if/then rules organized as a tree
- **Neural network:** h(x) = a composition of many simple functions organized in layers

The specific form constrains what patterns the model can learn -- a linear function can only represent straight-line relationships, while a neural network can represent almost any function given enough capacity.

## The Learning Process

How does the algorithm learn the hypothesis function? Through a process that mirrors how you might solve a jigsaw puzzle:

1. **Start with a guess.** Initialize the function parameters (weights) randomly or with simple defaults.
2. **Make predictions.** Run the current function on training examples.
3. **Measure error.** Compare predictions to actual targets using a **loss function** (also called a cost function or objective function). The loss function quantifies how wrong the predictions are.
4. **Adjust.** Update the function parameters to reduce the error. The most common method is **gradient descent**, which we'll study in detail soon.
5. **Repeat.** Steps 2-4 are repeated many times (epochs) until the error is sufficiently low or stops improving.

<div class="callout callout-example"><div class="callout-title">Example</div>Imagine adjusting the position of a projector to align an image on a screen. You start with a rough position (initialization), notice the image is shifted left and tilted (error measurement), adjust the projector slightly to the right and straighten it (parameter update), and check again. Each adjustment brings the image closer to perfect alignment. This iterative refinement is exactly what training a supervised learning model does with its parameters.</div>

## The Generalization Goal

The ultimate goal of supervised learning is not to memorize the training data -- it's to **generalize** to new, unseen data. A model that perfectly predicts every training example but fails on new data is useless (that's overfitting, which we covered earlier).

Generalization is why we split data into training and test sets, why we use regularization, and why we carefully monitor the gap between training and test performance. Everything in supervised learning serves this one master: will the model work on data it hasn't seen?

The remarkable thing is that it often does. With enough diverse training examples, well-chosen features, and an appropriate model complexity, supervised learning algorithms can learn patterns that generalize beautifully to new situations. This is what makes the field so powerful and so practically useful.
`
		},
		{
			slug: 'linear-regression',
			title: 'Linear Regression: Drawing the Best Line',
			estimatedMinutes: 22,
			xpReward: 15,
			content: `
# Linear Regression: Drawing the Best Line

Linear regression is the "Hello, World" of machine learning -- the simplest, most interpretable, and most foundational algorithm in the field. If you understand linear regression deeply, you have a scaffold for understanding nearly every other supervised learning algorithm. The concepts of cost functions, gradient descent, and optimization that we develop here will appear again and again throughout your ML journey.

## The Intuition: Fitting a Line to Data

Suppose you have data on house sizes and their sale prices:

| Size (sqft) | Price ($) |
|---|---|
| 1000 | 200,000 |
| 1500 | 280,000 |
| 2000 | 370,000 |
| 2500 | 450,000 |

If you plot these points, they roughly fall along a line. Linear regression finds the "best" line through these points -- the line that best captures the relationship between size and price. Once you have that line, you can predict the price of any house given its size, even sizes you haven't seen in the training data.

The equation of a line is: **y = mx + b**, where:
- **m** is the slope (how much price increases per additional square foot)
- **b** is the y-intercept (the theoretical price at zero square feet -- usually doesn't have physical meaning, but the math needs it)

In ML notation, we write: **h(x) = wx + b** (or equivalently, theta_0 + theta_1 * x), where **w** is the weight and **b** is the bias.

## The Cost Function: Measuring "Best"

But what makes one line "better" than another? We need a precise, mathematical definition of "best." This is where the **cost function** enters.

The most common cost function for linear regression is **Mean Squared Error (MSE)**:

**J(w, b) = (1/n) * sum_i (y_i - h(x_i))^2**

For each training example, we compute the difference between the actual value (y_i) and our prediction (h(x_i)). This difference is called the **residual**. We square it (to make all errors positive and to penalize large errors more than small ones), then average across all examples.

The cost function takes the model's parameters (w, b) as input and returns a single number representing how wrong the model is. Our goal is to find the values of w and b that *minimize* this cost function.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>The cost function transforms the vague goal of "fit the data well" into a precise optimization problem: "find the parameters that minimize this specific mathematical expression." This transformation from an informal goal to a formal optimization is a pattern you'll see in virtually every ML algorithm.</div>

## Gradient Descent: Finding the Minimum

Imagine you're blindfolded on a hilly landscape, and you need to find the lowest valley. What would you do? You'd feel the slope of the ground beneath your feet and take a step downhill. Then you'd feel the slope again and take another step downhill. Repeat until the ground is flat -- you've found a valley.

That's gradient descent. The "landscape" is the cost function, the "ground slope" is the gradient (partial derivatives), and each "step" is an update to the model parameters.

**The algorithm:**

1. Initialize w and b to random values (or zeros)
2. Compute the gradient of J with respect to w and b (the direction of steepest increase)
3. Update parameters in the opposite direction of the gradient:
   - w = w - alpha * (dJ/dw)
   - b = b - alpha * (dJ/db)
4. Repeat until convergence

The **learning rate** (alpha) controls the step size. Too large and you overshoot the minimum, bouncing wildly. Too small and you crawl toward the minimum, taking forever. Finding the right learning rate is one of the most important practical considerations in training.

For MSE with linear regression, the gradients work out to:

- dJ/dw = (2/n) * sum_i (h(x_i) - y_i) * x_i
- dJ/db = (2/n) * sum_i (h(x_i) - y_i)

Each gradient is an average over all training examples of the prediction error multiplied by the input (for the weight gradient) or just the error (for the bias gradient).

<!-- interactive:GradientDescentLab -->

<div class="callout callout-think"><div class="callout-title">Think About It</div>Why does the gradient point in the direction of steepest increase rather than decrease? Think of it mathematically: the gradient tells you how the cost function changes as you increase each parameter. If the gradient is positive, increasing the parameter increases the cost -- so you should decrease the parameter to reduce the cost. That's why we subtract the gradient.</div>

## Gradient Descent Variants

The basic algorithm described above is called **batch gradient descent** -- it computes the gradient using all training examples before each update. There are faster variants:

**Stochastic Gradient Descent (SGD):** Update parameters after each individual training example. Much noisier but much faster per iteration. The noise can actually help escape local minima.

**Mini-batch Gradient Descent:** Compromise between batch and stochastic. Compute the gradient using a random subset (mini-batch) of training examples (typically 32-256). This is the standard approach in practice because it balances noise reduction with computational efficiency and works well with GPU parallel processing.

## Multiple Linear Regression

Real-world problems have multiple features. Predicting house prices from size alone ignores bedrooms, bathrooms, location, age, and dozens of other factors. Multiple linear regression extends the model to handle many features:

**h(x) = w1*x1 + w2*x2 + w3*x3 + ... + wn*xn + b**

Or in vector notation: **h(x) = w^T * x + b**

The same cost function and gradient descent apply, just with more parameters to optimize. Each weight w_i represents the effect of feature x_i on the prediction, holding all other features constant. If w_bedrooms = 15,000, it means each additional bedroom adds roughly $15,000 to the predicted price, all else being equal.

## Polynomial Features: Capturing Non-Linear Relationships

"Linear" regression seems limited to straight lines. But here's a clever trick: you can create new features that are powers or products of existing features. If your feature is x, you can create x^2, x^3, or even x1*x2 (interaction terms).

For example, with a single feature x, you could create the feature vector [x, x^2, x^3]:

**h(x) = w1*x + w2*x^2 + w3*x^3 + b**

This is still "linear" regression because it's linear *in the parameters* (w1, w2, w3, b) -- the hypothesis is a weighted sum of features. But it can fit curved relationships because the features themselves are nonlinear transformations of the original input.

<div class="callout callout-warning"><div class="callout-title">Warning</div>Polynomial features can lead to overfitting, especially with high degrees. A degree-20 polynomial might fit training data perfectly but produce wild predictions between data points. This is a perfect example of the bias-variance tradeoff: more polynomial features reduce bias but increase variance. Regularization becomes essential as you add polynomial features.</div>

## Assumptions of Linear Regression

Linear regression makes several assumptions about the data. Violating these doesn't necessarily break the algorithm, but it can degrade performance and make coefficient interpretations unreliable:

1. **Linearity:** The relationship between features and target is (approximately) linear. If the true relationship is highly nonlinear, linear regression will underfit.

2. **Independence:** Training examples are independent of each other. Time series data often violates this (today's stock price depends on yesterday's).

3. **Homoscedasticity:** The variance of errors is constant across all levels of the features. If prediction errors are much larger for expensive houses than cheap ones, this assumption is violated.

4. **No multicollinearity:** Features should not be highly correlated with each other. If square footage and number of rooms are very correlated, the model has trouble determining which one actually drives the price, leading to unstable coefficients.

5. **Normality of residuals:** For statistical inference (confidence intervals, hypothesis tests), residuals should be approximately normally distributed. This matters less for pure prediction.

## The Closed-Form Solution

For linear regression specifically, there's actually a direct mathematical formula -- the **normal equation** -- that gives the optimal parameters without iterative optimization:

**w = (X^T * X)^(-1) * X^T * y**

This computes the exact minimum of the MSE cost function in one step. It's elegant and exact. So why bother with gradient descent?

The normal equation requires inverting a matrix, which has O(n^3) computational complexity where n is the number of features. For datasets with millions of features (common in NLP and genomics), this is prohibitively expensive. Gradient descent scales much better. Additionally, gradient descent generalizes to cost functions where no closed-form solution exists, which is the case for nearly every other ML algorithm.

## Practical Tips

- **Scale your features.** If one feature ranges from 0-1 and another from 0-1,000,000, gradient descent will oscillate inefficiently. Standardize features to have zero mean and unit variance.
- **Check residual plots.** Plot residuals (actual - predicted) against predicted values. Patterns in the residuals suggest the model is missing something -- perhaps a nonlinear relationship or a missing feature.
- **Start with linear regression as a baseline.** Even if you plan to use a more complex model, linear regression gives you a sensible baseline to compare against. If a neural network only slightly outperforms linear regression, the simpler model might be preferable.
`
		},
		{
			slug: 'logistic-regression',
			title: 'Logistic Regression: Predicting Categories',
			estimatedMinutes: 20,
			xpReward: 15,
			content: `
# Logistic Regression: Predicting Categories

Despite its name, logistic regression is not a regression algorithm -- it's a **classification** algorithm. The name is historical: it uses a regression-like framework (weighted sum of features) but applies a transformation that makes it suitable for predicting categories rather than continuous values. Understanding why that name stuck, and what makes it different from linear regression, illuminates a beautiful bridge between regression and classification.

## Why Linear Regression Fails for Classification

Suppose you want to predict whether a student passes an exam (1) or fails (0) based on hours studied. You might try linear regression: fit a line to the data and use the predicted value as a probability.

The problem? Linear regression outputs any real number. Study 0 hours and the model might predict -0.3 (a negative probability -- nonsensical). Study 20 hours and it might predict 1.4 (a probability over 100% -- equally nonsensical). We need a function that constrains the output to the range [0, 1] so it can be interpreted as a probability.

## The Sigmoid Function: Squashing Outputs to Probabilities

Enter the **sigmoid function** (also called the logistic function, hence "logistic" regression):

**sigmoid(z) = 1 / (1 + e^(-z))**

This S-shaped curve takes any real number and squashes it into the range (0, 1):
- When z is very negative, sigmoid(z) approaches 0
- When z = 0, sigmoid(z) = 0.5
- When z is very positive, sigmoid(z) approaches 1

The transition happens smoothly, creating a gradual ramp from 0 to 1. This is exactly what we need for probabilities.

Logistic regression combines a linear function with the sigmoid:

**h(x) = sigmoid(w^T * x + b) = 1 / (1 + e^(-(w^T * x + b)))**

The output h(x) is interpreted as the probability that the input belongs to the positive class: P(y = 1 | x).

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>Logistic regression is a linear model wrapped in a nonlinear transformation. The linear part (w^T * x + b) creates a weighted combination of features, and the sigmoid squashes this into a probability. The decision boundary -- the set of points where the model is equally uncertain (P = 0.5) -- is always a straight line (or hyperplane in higher dimensions), making logistic regression a linear classifier even though the output is nonlinear.</div>

## Log-Odds: The Linear Part

There's an elegant interpretation of the linear component. The **odds** of an event with probability p are p/(1-p). The **log-odds** (or logit) is log(p/(1-p)).

It turns out that in logistic regression, the linear function w^T * x + b directly models the log-odds:

**log(P(y=1) / P(y=0)) = w^T * x + b**

Each weight w_i represents the change in log-odds for a one-unit increase in feature x_i. If w_hours_studied = 0.5, each additional hour of studying increases the log-odds of passing by 0.5 (which corresponds to multiplying the odds by e^0.5 = 1.65, roughly a 65% increase in odds).

This interpretation makes logistic regression coefficients meaningful and interpretable -- a crucial advantage in domains like medicine and finance where understanding *why* a prediction was made is as important as the prediction itself.

## The Cost Function: Cross-Entropy Loss

We can't use MSE for logistic regression because the sigmoid function makes the MSE surface non-convex (full of local minima that gradient descent could get stuck in). Instead, we use **binary cross-entropy loss** (also called log loss):

**J(w, b) = -(1/n) * sum_i [y_i * log(h(x_i)) + (1 - y_i) * log(1 - h(x_i))]**

This looks complex, but the intuition is simple:

- When the true label y_i = 1: the loss is -log(h(x_i)). If the model predicts h(x_i) close to 1 (confident and correct), -log(1) = 0 (no penalty). If it predicts close to 0 (confident and wrong), -log(0) approaches infinity (huge penalty).
- When the true label y_i = 0: the loss is -log(1 - h(x_i)). Same logic in reverse.

Cross-entropy loss has a beautiful property: it creates a convex optimization surface for logistic regression, meaning gradient descent is guaranteed to find the global minimum. No local minima to worry about.

## The Decision Boundary

To make a binary classification (pass/fail, spam/not-spam), we apply a threshold to the predicted probability:

- If h(x) >= 0.5: predict class 1 (positive)
- If h(x) < 0.5: predict class 0 (negative)

The **decision boundary** is the set of points where h(x) = 0.5, which occurs when w^T * x + b = 0 (because sigmoid(0) = 0.5). In 2D feature space, this is a straight line. In 3D, a plane. In higher dimensions, a hyperplane.

The threshold of 0.5 is a default, not a requirement. In medical diagnosis, you might lower the threshold to 0.3 to catch more positive cases (higher recall at the cost of lower precision). In spam filtering, you might raise it to 0.8 to avoid blocking legitimate emails (higher precision at the cost of lower recall).

<div class="callout callout-example"><div class="callout-title">Example</div>Imagine a logistic regression model predicting whether to approve a loan, using two features: income and credit score. The decision boundary might be a line in the income-credit score plane. Points above and to the right of the line (high income, high credit score) get approved. Points below and to the left get denied. The exact position and angle of this line are determined by the learned weights.</div>

## Multi-Class Classification

Binary classification handles two classes. But what about problems with more than two? There are two main strategies:

### One-vs-Rest (OvR)

Train K separate binary classifiers, one for each class. Each classifier answers "is this class K or not?" For a new input, run all K classifiers and pick the class with the highest predicted probability.

For digit recognition (0-9), you'd train 10 classifiers: "is this a 0 or not?", "is this a 1 or not?", etc. The classifier with the highest confidence determines the prediction.

### Softmax Regression (Multinomial Logistic Regression)

Instead of training separate classifiers, generalize the sigmoid to the **softmax function**, which handles all classes simultaneously:

**P(y = k | x) = e^(w_k^T * x + b_k) / sum_j e^(w_j^T * x + b_j)**

The softmax function takes a vector of K real numbers and turns it into K probabilities that sum to 1. It's the multi-class generalization of the sigmoid, and it's used as the output layer of virtually every classification neural network.

<div class="callout callout-warning"><div class="callout-title">Warning</div>Don't let the name fool you. "Logistic regression" is classification, not regression. It was named before the terminology was standardized. The "regression" part refers to the fact that it regresses the log-odds on the features. In job interviews and conversations, this distinction matters -- confusing regression with classification signals a lack of fundamental understanding.</div>

## When to Use Logistic Regression

Despite its simplicity, logistic regression is surprisingly powerful and remains a go-to algorithm in many domains:

**Strengths:**
- Fast to train, even on large datasets
- Outputs well-calibrated probabilities (not just class labels)
- Coefficients are interpretable (important in healthcare, finance, law)
- Works well when the decision boundary is approximately linear
- Low variance -- unlikely to overfit with proper regularization
- Solid baseline for any classification problem

**Weaknesses:**
- Cannot capture nonlinear decision boundaries without feature engineering
- Assumes features contribute independently (no interactions unless explicitly added)
- Sensitive to correlated features (multicollinearity)
- May underfit complex problems

In practice, logistic regression is often the first model you should try for any classification problem. If it performs well, you have a fast, interpretable solution. If it doesn't, its performance sets a baseline that more complex models must beat to justify their complexity.
`
		},
		{
			slug: 'decision-trees-random-forests',
			title: 'Decision Trees and Random Forests',
			estimatedMinutes: 22,
			xpReward: 15,
			content: `
# Decision Trees and Random Forests

Decision trees are perhaps the most intuitive machine learning algorithm because they mirror how humans actually make decisions. When you decide what to wear in the morning, you might think: "Is it raining? If yes, grab a jacket. If no, is it above 70 degrees? If yes, shorts. If no, long pants." That chain of yes/no questions is a decision tree.

## How Decision Trees Work

A decision tree splits the data into progressively smaller groups based on feature values. At each internal node, the tree asks a question about one feature ("Is age > 30?"). Based on the answer, you follow one branch or another. This continues until you reach a **leaf node**, which gives the final prediction (a class label for classification or a value for regression).

**Building a tree is about choosing the best questions to ask, in the best order.**

Consider predicting whether someone will buy a product based on age, income, and browsing history. The tree might first ask "Is income > $50,000?" because this question best separates buyers from non-buyers. Then, for the high-income group, it might ask "Did they view the product page more than twice?" while for the low-income group, it might ask "Is the item on sale?"

The key insight is that the tree learns which questions to ask and what thresholds to use entirely from the training data. No human specifies the rules.

## Entropy and Information Gain

How does the algorithm decide which feature to split on at each node? It uses the concept of **information gain**, which is based on **entropy** from information theory.

**Entropy** measures the disorder or impurity of a set. For a binary classification with proportion p of positive examples:

**H = -p * log2(p) - (1-p) * log2(1-p)**

- If all examples are the same class (p=0 or p=1): entropy = 0 (pure, no disorder)
- If examples are evenly split (p=0.5): entropy = 1 (maximum disorder)

<div class="callout callout-example"><div class="callout-title">Example</div>Imagine a bag of marbles. If all marbles are red, entropy is 0 -- you know exactly what color you'll draw. If half are red and half are blue, entropy is maximum -- you're maximally uncertain. Entropy quantifies your surprise or uncertainty about the outcome.</div>

**Information gain** measures how much a split reduces entropy:

**Information Gain = H(parent) - weighted_average(H(children))**

At each node, the algorithm evaluates every possible split (every feature, every threshold) and chooses the one with the highest information gain -- the split that most reduces uncertainty about the target variable.

## Gini Impurity: An Alternative Criterion

Many implementations (including scikit-learn's default) use **Gini impurity** instead of entropy:

**Gini = 1 - sum_k (p_k)^2**

where p_k is the proportion of class k in the node. Gini impurity ranges from 0 (pure) to 0.5 (for binary, maximally impure). In practice, Gini and entropy produce very similar trees. Gini is slightly faster to compute because it doesn't involve logarithms.

## Building a Tree: Step by Step

1. **Start with all training data at the root node**
2. **For each feature and each possible threshold:** compute the information gain (or Gini reduction) of splitting the data
3. **Select the split with the highest gain**
4. **Create two child nodes** containing the data points that fall on each side of the split
5. **Recurse:** repeat steps 2-4 for each child node
6. **Stop when:** a stopping criterion is met (max depth reached, minimum samples per leaf, no further information gain)

<!-- interactive:DecisionTreeBuilder -->

## The Problem: Overfitting

Left unconstrained, a decision tree will keep splitting until every leaf node contains examples from only one class. This produces a perfect training accuracy -- and terrible test accuracy. The tree has memorized the training data, including noise.

<div class="callout callout-warning"><div class="callout-title">Warning</div>An unpruned decision tree is one of the easiest models to overfit. With enough depth, it will achieve 100% training accuracy on any dataset -- which is precisely why it will generalize poorly. Always constrain tree growth.</div>

### Pruning Strategies

**Pre-pruning (early stopping):** Stop growing the tree before it perfectly fits the training data.
- Set a maximum depth
- Require a minimum number of samples to split a node
- Require a minimum information gain to make a split

**Post-pruning:** Grow the full tree, then cut back branches that don't improve validation performance. The most common approach is **cost-complexity pruning**, which adds a penalty for the number of leaves.

## Random Forests: The Wisdom of the Crowd

Here's the brilliant idea behind random forests: instead of building one tree and hoping it's good, **build hundreds of trees and let them vote.**

Each tree in a random forest is deliberately different from the others, trained on different random subsets of the data and features. Any individual tree might be mediocre, but the collective decision of hundreds of diverse trees is remarkably robust.

This is the principle of **ensemble learning** -- combining multiple weak models to create a strong one. It's like asking 500 people to estimate the number of jelly beans in a jar. Any individual guess might be wildly off, but the average of 500 guesses is usually very close to the true number.

### How Random Forests Achieve Diversity

Two sources of randomness make each tree unique:

**1. Bagging (Bootstrap Aggregating):** Each tree is trained on a random sample of the training data, drawn with replacement. About 63% of the original data appears in each bootstrap sample, and the remaining 37% is left out (called "out-of-bag" data, which can be used for evaluation).

**2. Random feature subsets:** At each split, instead of considering all features, only a random subset of features is considered. For a dataset with n features, typically sqrt(n) features are sampled for classification and n/3 for regression. This prevents all trees from splitting on the same dominant features.

### Making Predictions

For classification, each tree votes for a class, and the majority wins. For regression, predictions are averaged across all trees. The more trees, the more stable the predictions -- though returns diminish beyond a few hundred trees.

### Feature Importance

Random forests provide a natural measure of **feature importance**. For each feature, you can measure how much the forest's performance degrades when that feature's values are randomly shuffled (permutation importance) or how much total information gain the feature contributed across all trees (impurity-based importance). This is invaluable for understanding which features actually drive predictions.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>Random forests reduce variance (overfitting) dramatically while keeping bias low. Each individual tree has low bias (trees can fit complex patterns) but high variance (sensitive to training data). By averaging many such trees, the variance cancels out while the low bias is preserved. This is why random forests are one of the most reliable off-the-shelf algorithms in machine learning.</div>

## Decision Trees vs. Random Forests in Practice

| Aspect | Decision Tree | Random Forest |
|---|---|---|
| Interpretability | High (you can visualize and trace the logic) | Low (hundreds of trees are hard to interpret) |
| Overfitting risk | High | Low |
| Training speed | Fast | Slower (train many trees) |
| Prediction speed | Very fast | Slower (aggregate many trees) |
| Accuracy | Moderate | High |
| Hyperparameters | Few | More (number of trees, max features, etc.) |

When interpretability is paramount (medical diagnosis, legal compliance), a pruned decision tree might be preferred. When prediction accuracy matters most, random forests are usually the better choice. In Kaggle competitions and practical applications, random forests (and their cousin, gradient boosted trees) are among the top-performing algorithms for tabular data.

## Beyond Random Forests: Gradient Boosting

A brief preview of an important related idea: instead of building trees independently and averaging them (bagging), **gradient boosting** builds trees sequentially. Each new tree focuses on the examples that previous trees got wrong. This creates a more focused ensemble that often achieves even better accuracy. Algorithms like XGBoost, LightGBM, and CatBoost are gradient boosting implementations that dominate machine learning competitions on tabular data.
`
		},
		{
			slug: 'support-vector-machines',
			title: 'Support Vector Machines',
			estimatedMinutes: 20,
			xpReward: 15,
			content: `
# Support Vector Machines

Support Vector Machines (SVMs) approach classification from a geometric perspective that is both elegant and powerful. While logistic regression asks "what probability does this point belong to each class?", SVMs ask "what is the widest possible highway I can build between the two classes?" This geometric intuition leads to surprisingly robust classifiers, especially in high-dimensional spaces.

## Maximum Margin Classifiers

Imagine two groups of points on a 2D plane -- red circles and blue squares -- that can be separated by a straight line. There are infinitely many lines that could separate them. Which one should you choose?

Logistic regression would find a line that maximizes the likelihood of the data. An SVM finds the line that maximizes the **margin** -- the distance between the line and the nearest data points from each class.

Think of it this way: if you're building a wall between two feuding kingdoms, you don't build it right next to one kingdom's territory. You build it right in the middle, maximizing the buffer zone on each side. That wall is the SVM's **decision boundary**, and the buffer zone is the **margin**.

**Why maximize the margin?** Intuition and theory agree: a larger margin means more room for error. If a new data point is slightly misplaced (due to noise or measurement error), a large-margin classifier is more likely to classify it correctly. Formally, statistical learning theory shows that maximum margin classifiers have better generalization bounds.

### Support Vectors

The data points that sit exactly on the edge of the margin -- the closest points to the decision boundary from each class -- are called **support vectors**. These are the critical data points that define the boundary. If you removed any non-support-vector point from the training set, the decision boundary wouldn't change at all. Only the support vectors matter.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>The name "Support Vector Machine" comes from the support vectors -- the handful of training points that "support" (define) the decision boundary. This means SVMs are inherently sparse: the model depends on only a small subset of training points, making it memory-efficient and robust to outliers far from the boundary.</div>

## Soft Margin: Handling Non-Separable Data

Real-world data is rarely perfectly separable by a straight line. Some points from one class might land on the wrong side. A **soft margin** SVM allows some misclassifications by introducing **slack variables** that let points violate the margin.

The key hyperparameter **C** controls the tradeoff:

- **Large C:** The model tries hard to classify every training point correctly (small margin, potential overfitting)
- **Small C:** The model allows more misclassifications in exchange for a wider margin (more regularization, potential underfitting)

This is yet another manifestation of the bias-variance tradeoff: C controls model complexity.

## The Kernel Trick: The Most Beautiful Idea in ML

Here's where SVMs become truly powerful. What if the data can't be separated by *any* straight line, no matter where you draw it? Consider two classes arranged in concentric circles -- the inner circle is class A, the outer ring is class B. No line can separate them.

The kernel trick solves this with a deceptively simple idea: **map the data to a higher-dimensional space where it becomes linearly separable, then find the maximum-margin hyperplane in that space.**

<div class="callout callout-example"><div class="callout-title">Example</div>Imagine you have red and blue marbles mixed together on a table (2D), and no straight line can separate them. Now imagine lifting all the red marbles slightly off the table (adding a 3rd dimension). Suddenly, a flat plane can separate the floating red marbles from the blue ones on the table. The kernel trick does something analogous: it maps data to a higher-dimensional space where linear separation becomes possible.</div>

The genius of the kernel trick is that you **don't actually have to compute the coordinates in the higher-dimensional space**. You just need to compute dot products between data points in that space, and a kernel function does this directly. The computation happens implicitly, saving enormous computational cost.

### Common Kernels

**Linear kernel:** K(x, z) = x^T * z. No mapping -- just a regular linear SVM. Use when data is linearly separable or you have very many features.

**Polynomial kernel:** K(x, z) = (x^T * z + c)^d. Maps to a space of polynomial feature combinations. Degree d controls complexity.

**Radial Basis Function (RBF) kernel:** K(x, z) = exp(-gamma * ||x - z||^2). The most popular nonlinear kernel. Maps data to an *infinite-dimensional* space (yes, really). Creates smooth, flexible decision boundaries. The parameter gamma controls how far the influence of each training example reaches:
- Large gamma: each point influences only its immediate neighborhood (complex, wiggly boundary)
- Small gamma: each point has far-reaching influence (smooth boundary)

<div class="callout callout-think"><div class="callout-title">Think About It</div>The RBF kernel can be understood intuitively as placing a bell curve (Gaussian) centered on each support vector. Each support vector creates a "bump" of influence. The decision boundary forms where the positive bumps and negative bumps balance out. Gamma controls how wide or narrow each bump is.</div>

## SVMs in Practice

### Strengths

- **Effective in high-dimensional spaces:** SVMs work well even when the number of features exceeds the number of training examples (common in text classification and genomics)
- **Memory efficient:** Only support vectors are stored (typically a small fraction of training data)
- **Versatile:** Different kernels make SVMs applicable to a wide range of problems
- **Strong theoretical foundations:** Generalization bounds from statistical learning theory

### Weaknesses

- **Scalability:** Training time grows between O(n^2) and O(n^3) with the number of samples. For datasets with millions of examples, SVMs become impractical. Use linear SVMs or switch to other algorithms.
- **No probabilistic outputs by default:** SVMs output class labels, not probabilities. Probability estimates require additional calibration (Platt scaling).
- **Sensitive to feature scaling:** Features must be standardized. An unscaled feature with a large range will dominate the distance calculations.
- **Kernel and hyperparameter selection:** Choosing the right kernel and tuning C and gamma requires careful cross-validation.

### When to Choose SVMs

- Text classification (high-dimensional, sparse feature vectors)
- Image classification with handcrafted features (before deep learning took over)
- Small to medium datasets where you need a strong nonlinear classifier
- Problems where the margin interpretation is valuable

For large-scale problems or when you need probability outputs, logistic regression or tree-based methods are often more practical. For unstructured data (images, text, audio), deep learning has largely superseded SVMs. But for many tabular data problems with moderate sample sizes, SVMs with RBF kernels remain competitive and are worth trying.

## The Geometric Beauty

SVMs are worth understanding not just for their practical utility but for the elegant mathematical ideas they embody. The maximum margin principle connects geometry to generalization. The kernel trick shows that you can operate in infinite-dimensional spaces without ever computing coordinates there. And the dual formulation reveals that the solution depends on only a sparse subset of training points. These ideas appear again and again in advanced machine learning.
`
		},
		{
			slug: 'k-nearest-neighbors',
			title: 'K-Nearest Neighbors',
			estimatedMinutes: 18,
			xpReward: 15,
			content: `
# K-Nearest Neighbors

K-Nearest Neighbors (KNN) is the most intuitive classification algorithm you'll ever encounter. Its logic can be summarized in a single sentence: **to classify a new point, find the K closest points in the training data and let them vote.** There's no training phase, no weight optimization, no gradient descent. The algorithm simply remembers all the training data and uses it directly at prediction time.

## The Core Idea: You Are the Company You Keep

Imagine you've moved to a new city and want to find a good restaurant. You don't study restaurant theory or build a mathematical model of food quality. You ask the people nearest to you -- your neighbors -- where they like to eat. If three out of five nearby residents recommend the Italian place, you go there. That's KNN.

More formally:

1. **Store** all training examples (feature vectors and labels)
2. **Given a new point**, compute its distance to every training example
3. **Find the K nearest** training examples
4. **Vote:** For classification, return the majority class among the K neighbors. For regression, return the average of the K neighbors' values.

That's the entire algorithm. No learning, no parameters to optimize, no training time. The simplicity is both a strength and a weakness.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>KNN is called a "lazy" or "instance-based" learning algorithm because it does no work during training -- it just stores the data. All computation happens at prediction time. This is the opposite of "eager" learners like logistic regression, which do all the work upfront (training) so that predictions are fast. KNN trades training speed for prediction speed.</div>

## Distance Metrics: Defining "Nearest"

The meaning of "nearest" depends entirely on how you measure distance. The choice of distance metric can dramatically affect performance.

### Euclidean Distance

The straight-line distance between two points in space:

**d(a, b) = sqrt(sum_i (a_i - b_i)^2)**

This is the most common choice and works well when features have similar scales and meaning.

### Manhattan Distance

The sum of absolute differences along each dimension -- like walking along city blocks:

**d(a, b) = sum_i |a_i - b_i|**

More robust to outliers than Euclidean distance because differences aren't squared.

### Minkowski Distance

A generalization that includes both Euclidean (p=2) and Manhattan (p=1) as special cases:

**d(a, b) = (sum_i |a_i - b_i|^p)^(1/p)**

### Cosine Similarity

Measures the angle between two vectors rather than their distance. Particularly useful for text data where the magnitude of feature vectors (document length) is less informative than their direction (topic).

<div class="callout callout-warning"><div class="callout-title">Warning</div>Feature scaling is absolutely critical for KNN. If one feature ranges from 0 to 1 (say, a probability) and another ranges from 0 to 100,000 (say, income in dollars), the income feature will dominate the distance calculation, making the probability feature effectively invisible. Always standardize or normalize features before applying KNN.</div>

## Choosing K: The Critical Hyperparameter

The choice of K profoundly affects the model's behavior:

**K = 1:** The model assigns each point the class of its single nearest neighbor. This creates a very complex decision boundary that perfectly separates training data but is extremely sensitive to noise. A single mislabeled training point creates a pocket of wrong predictions around it. High variance, low bias.

**K = n (all training data):** The model assigns every point the majority class of the entire dataset, regardless of position. The decision boundary is trivial -- everything gets the same label. Low variance, high bias.

**The sweet spot** is somewhere in between. Common practice:

- Try odd values of K (to avoid ties in binary classification): 3, 5, 7, 11, 21
- Use cross-validation to find the best K
- A common heuristic: K = sqrt(n), where n is the number of training examples
- Larger K provides more smoothing but risks blurring the boundary between classes

<div class="callout callout-example"><div class="callout-title">Example</div>Imagine classifying animals in a zoo based on their location. With K=1, a parrot sitting near the monkey exhibit would be classified as a primate. With K=5, the surrounding monkeys might outvote other nearby birds, still misclassifying the parrot. With K=50, you'd incorporate animals from many exhibits, getting a less localized but potentially more robust classification. The right K depends on how noisy your data is and how complex the true boundaries are.</div>

## The Curse of Dimensionality

KNN has an Achilles' heel that becomes devastating in high-dimensional spaces. As the number of dimensions (features) increases, something counterintuitive happens: **all points become approximately equidistant from each other.**

In 1D, data fills a line. In 2D, data fills a plane. In 100D, data fills a 100-dimensional hypercube. The volume of this space grows exponentially with the number of dimensions, but your training data stays the same size. The data becomes increasingly sparse, with vast empty regions between points.

Here's a concrete illustration: in 1D, 10 evenly spaced points cover 10% of the range each. In 10D, to achieve the same density, you'd need 10^10 (10 billion) points. In 100D, 10^100 points -- more than the number of atoms in the universe.

The practical consequence: the concept of "nearest neighbor" becomes meaningless when all neighbors are roughly equally far away. The distance to the nearest neighbor and the distance to the farthest neighbor converge, making it impossible to distinguish between truly close points and merely far ones.

**Mitigation strategies:**

- **Feature selection:** Remove irrelevant features to reduce dimensionality
- **Dimensionality reduction:** Use PCA or other techniques to project data into a lower-dimensional space before applying KNN
- **Feature weighting:** Weight informative features more heavily in the distance calculation

## Weighted KNN

Standard KNN gives equal vote to all K neighbors, but not all neighbors are equally informative. A neighbor at distance 0.1 should have more influence than one at distance 5.0.

**Distance-weighted KNN** weights each neighbor's vote by the inverse of its distance:

**weight_i = 1 / d(query, neighbor_i)**

Closer neighbors have larger weights and more influence on the prediction. This simple modification often improves performance, especially when K is large and some neighbors are quite distant.

## Practical Considerations

### Strengths

- **No training phase:** Predictions can start immediately. Great for prototype systems.
- **Naturally handles multi-class problems:** No modification needed.
- **Non-parametric:** Makes no assumptions about the underlying data distribution. Can capture arbitrarily complex decision boundaries.
- **Easy to understand and implement:** The algorithm is trivially simple.
- **Dynamic updates:** Adding new training data doesn't require retraining -- just add the point to the stored data.

### Weaknesses

- **Slow predictions:** Computing distances to every training point for every prediction is O(n*d) where n is training set size and d is dimensionality. For large datasets, this is prohibitively slow.
- **High memory usage:** The entire training set must be stored.
- **Sensitive to irrelevant features and feature scaling**
- **Curse of dimensionality** degrades performance in high-dimensional spaces
- **No model interpretability:** There are no learned parameters to inspect.

### Speed Improvements

For large datasets, brute-force distance computation is too slow. Data structures like **KD-trees** and **Ball trees** organize the training data spatially, enabling faster nearest-neighbor queries (O(log n) in favorable cases). **Approximate nearest neighbor** algorithms trade a small amount of accuracy for dramatic speed improvements, making KNN practical even for datasets with millions of points.

## When to Use KNN

KNN shines when:
- The dataset is small to medium-sized
- Features are low-dimensional and meaningful
- The decision boundary is irregular and hard to parameterize
- You need a quick baseline or prototype
- The data distribution changes frequently (just update the stored data)

KNN struggles when:
- The dataset is very large (slow predictions)
- Features are high-dimensional (curse of dimensionality)
- Features have very different scales or include irrelevant ones
- You need to deploy a model with low-latency predictions

Despite its simplicity, KNN's non-parametric nature allows it to capture complex patterns that simpler models miss. It's a valuable tool in your ML toolkit, especially as a baseline or for problems where the data structure doesn't fit the assumptions of parametric models.
`
		},
		{
			slug: 'model-selection-comparison',
			title: 'Model Selection and Comparison',
			estimatedMinutes: 22,
			xpReward: 15,
			content: `
# Model Selection and Comparison

You've now learned about linear regression, logistic regression, decision trees, random forests, SVMs, and KNN. Each has different strengths, assumptions, and failure modes. So when faced with a new problem, which algorithm should you choose? How do you compare them fairly? And how do you tune their hyperparameters to extract the best performance?

## The No Free Lunch Theorem

Let's start with a humbling truth. The **No Free Lunch (NFL) theorem** states that no single algorithm is universally better than all others across all possible problems. Averaged over all possible data distributions, every algorithm performs equally well (or equally poorly).

In other words, there is no "best" algorithm. There is only the best algorithm *for your specific problem, with your specific data.*

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>The No Free Lunch theorem doesn't mean all algorithms are equally good in practice. It means that the superiority of any algorithm is contingent on the data. An algorithm that excels on image data might fail on tabular data. The theorem motivates you to try multiple algorithms on your specific problem rather than assuming one will always win.</div>

This might seem discouraging, but it's actually liberating. It means model selection is an empirical question -- you try things and see what works. There's no substitute for experimentation.

## Parameters vs. Hyperparameters

Before diving into tuning, let's clarify an important distinction:

**Parameters** are learned from data during training. The weights in linear regression, the split thresholds in a decision tree, the support vectors in an SVM -- these are all parameters. You don't set them; the algorithm discovers them.

**Hyperparameters** are set *before* training and control the learning process. The learning rate in gradient descent, K in KNN, C and gamma in SVM, the maximum depth of a decision tree -- these are hyperparameters. They're your knobs and dials for controlling model behavior.

Finding the right hyperparameters can be the difference between a mediocre model and an excellent one. A random forest with 10 trees and max depth 3 will behave very differently from one with 500 trees and max depth 30.

## Hyperparameter Tuning Strategies

### Grid Search

The brute-force approach: define a grid of hyperparameter values and try every combination.

For an SVM, you might search over:
- C: [0.01, 0.1, 1, 10, 100]
- gamma: [0.001, 0.01, 0.1, 1]

This creates 5 x 4 = 20 combinations. For each, train the model and evaluate using cross-validation. Pick the combination with the best cross-validation score.

**Pros:** Thorough, guarantees you've tried every combination in the grid.
**Cons:** Computational cost grows exponentially with the number of hyperparameters. Three hyperparameters with 10 values each = 1,000 combinations. With 5-fold cross-validation, that's 5,000 model trainings.

### Random Search

Instead of trying every combination, sample random combinations from the hyperparameter space.

This sounds like it should be worse than grid search, but research by Bergstra and Bengio (2012) showed that random search is often *more efficient*. Why? Because in most problems, only one or two hyperparameters matter significantly. Grid search wastes effort exhaustively searching dimensions that don't affect performance, while random search explores more unique values of the important dimensions.

<div class="callout callout-example"><div class="callout-title">Example</div>Suppose only the learning rate matters and the regularization strength doesn't. A 10x10 grid search tries 10 unique learning rates (100 total combinations, but only 10 unique values for the important parameter). Random search with 100 samples tries approximately 100 unique learning rates -- 10x more exploration of the dimension that matters. That's why random search often finds better hyperparameters with the same computational budget.</div>

### Bayesian Optimization

A more sophisticated approach that builds a probabilistic model of how hyperparameters relate to performance. After each evaluation, it updates the model and intelligently chooses the next combination to try, balancing exploration (trying uncertain regions) with exploitation (trying regions expected to perform well).

Libraries like Optuna, Hyperopt, and scikit-optimize implement this. Bayesian optimization typically finds good hyperparameters faster than random search, especially when evaluations are expensive.

### Practical Hyperparameter Tuning Tips

1. **Start with defaults.** Most well-implemented algorithms have sensible defaults. Try those first.
2. **Tune the most important hyperparameters first.** For random forests: number of trees and max depth. For SVMs: C and kernel choice. For gradient boosting: learning rate, number of trees, and max depth.
3. **Use logarithmic scales** for hyperparameters that span orders of magnitude (C: 0.01 to 100, learning rate: 0.0001 to 0.1).
4. **Use random search over grid search** unless you have very few hyperparameters.
5. **Always use cross-validation** to evaluate each combination, not a single validation split.

## Comparing Models Fairly

### The Importance of Consistent Evaluation

To compare models fairly, you must:

1. **Use the same data splits.** All models should be evaluated on exactly the same test data. Even better, use the same cross-validation folds for all models.
2. **Use the same metric.** Don't compare one model's accuracy against another's F1 score.
3. **Tune each model properly.** Comparing an untuned SVM to a well-tuned random forest isn't fair.
4. **Consider the full pipeline.** Some models require feature scaling; others don't. Include preprocessing in your comparison.

### Statistical Significance

If Model A achieves 92.3% accuracy and Model B achieves 92.1%, is A actually better? Maybe, maybe not. The difference could be within the noise of your evaluation. With k-fold cross-validation, you can compute the standard deviation of your scores. If the confidence intervals overlap, the difference might not be meaningful.

For a more rigorous test, you can use paired statistical tests (like the paired t-test or Wilcoxon signed-rank test) on the fold-by-fold scores to determine whether one model is statistically significantly better than another.

<div class="callout callout-warning"><div class="callout-title">Warning</div>A small difference in cross-validation accuracy doesn't necessarily justify choosing a more complex model. If logistic regression achieves 91.5% and a neural network achieves 92.0%, the logistic regression model might be the better practical choice because it's faster, more interpretable, and easier to deploy. The marginal improvement must justify the added complexity.</div>

## Practical Model Selection Guidelines

Here's a framework for choosing algorithms, based on decades of collective practitioner experience:

### Start Simple

1. **Logistic/Linear Regression:** Always try this first. It's fast, interpretable, and provides a strong baseline. If it works well enough, stop.
2. **Random Forest:** The next step up. Handles nonlinear relationships, requires minimal preprocessing, and is hard to mess up. Very few hyperparameters to tune.
3. **Gradient Boosted Trees (XGBoost/LightGBM):** Often the best performer on tabular data. Requires more tuning than random forests but typically achieves higher accuracy.
4. **SVM with RBF kernel:** Good for small-to-medium datasets, especially with high-dimensional features.
5. **KNN:** Quick baseline for small datasets. Use as a sanity check.

### Consider the Data

| Characteristic | Recommended Algorithms |
|---|---|
| Small dataset (<1,000 samples) | SVM, KNN, logistic regression |
| Large dataset (>100,000 samples) | Gradient boosting, random forest, logistic regression (SVMs become slow) |
| High-dimensional features | Linear SVM, logistic regression with regularization, random forests |
| Need interpretability | Logistic regression, decision tree, linear models |
| Tabular data | Gradient boosting, random forests |
| Non-linear relationships | Random forests, SVM with RBF, gradient boosting |

### The Pragmatic Approach

In practice, experienced ML practitioners often follow this workflow:

1. Establish a baseline with logistic regression or a simple decision tree
2. Try a random forest with default hyperparameters
3. Try gradient boosted trees (XGBoost or LightGBM) with light tuning
4. If the problem demands it, explore SVMs or other specialized algorithms
5. Pick the simplest model that meets the performance requirement
6. Report results on the held-out test set

<div class="callout callout-think"><div class="callout-title">Think About It</div>In machine learning competitions (Kaggle, etc.), winners often use complex ensembles of many models. But in production systems, simplicity wins. A model that's 0.5% less accurate but 100x faster to serve, easier to debug, and simpler to maintain is usually the better choice. Always consider the full lifecycle: development, deployment, monitoring, and maintenance.</div>

## Ensembling: Combining Models

If you've tuned several models and they perform similarly, you can often get a boost by combining them:

- **Voting:** Each model votes; majority wins (classification) or average (regression)
- **Stacking:** Use a meta-model that takes the predictions of base models as input and learns the best combination
- **Blending:** Similar to stacking but uses a holdout set instead of cross-validation

Ensembles work best when the base models make different types of errors (they're "diverse"). Combining five logistic regression models won't help much because they'll all make the same mistakes. But combining logistic regression, a random forest, and an SVM can yield meaningful improvements because each algorithm approaches the problem differently.

The art of model selection isn't about finding the "best" algorithm -- it's about finding the right algorithm for your specific problem, data, constraints, and requirements. And that almost always comes down to disciplined experimentation.
`
		}
	],
	quiz: {
		questions: [
			{
				type: 'multiple-choice',
				id: 'supervised-q1',
				question: 'What distinguishes supervised learning from unsupervised learning?',
				options: [
					'Supervised learning is always more accurate',
					'Supervised learning uses labeled data with known input-output pairs',
					'Supervised learning requires more computational power',
					'Supervised learning works only with numerical data'
				],
				correctIndex: 1,
				explanation:
					'Supervised learning is defined by the presence of labels -- each training example has a known input-output pair. The algorithm learns to map inputs to outputs from these labeled examples. Unsupervised learning works with unlabeled data.'
			},
			{
				type: 'multiple-choice',
				id: 'supervised-q2',
				question: 'In gradient descent, what happens if the learning rate is set too high?',
				options: [
					'The model converges faster to the optimal solution',
					'The model may overshoot the minimum and diverge, failing to converge',
					'The model will always find the global minimum',
					'The learning rate has no effect on convergence'
				],
				correctIndex: 1,
				explanation:
					'A learning rate that is too high causes the parameter updates to overshoot the minimum of the cost function. Instead of converging, the cost may oscillate wildly or even increase without bound (diverge). The learning rate must be carefully tuned.'
			},
			{
				type: 'fill-in',
				id: 'supervised-q3',
				question:
					'The function used in logistic regression to squash outputs to the range (0, 1) is called the ___ function.',
				acceptedAnswers: ['sigmoid', 'Sigmoid', 'logistic', 'Logistic'],
				explanation:
					'The sigmoid function (also called the logistic function) maps any real number to the range (0, 1), making it suitable for representing probabilities. Its formula is sigmoid(z) = 1 / (1 + e^(-z)).'
			},
			{
				type: 'multiple-choice',
				id: 'supervised-q4',
				question: 'What is the "kernel trick" in Support Vector Machines?',
				options: [
					'A technique to speed up training on large datasets',
					'A method to reduce the number of features',
					'A way to implicitly map data to a higher-dimensional space where it becomes linearly separable',
					'A pruning strategy for decision trees'
				],
				correctIndex: 2,
				explanation:
					'The kernel trick allows SVMs to operate in a higher-dimensional feature space without explicitly computing the coordinates in that space. It computes dot products in the transformed space via a kernel function, enabling nonlinear decision boundaries while remaining computationally tractable.'
			},
			{
				type: 'ordering',
				id: 'supervised-q5',
				question:
					'Order these K values for KNN from highest variance (most overfitting) to lowest variance (most smoothing):',
				items: ['K = 1', 'K = 5', 'K = 50', 'K = n (all data)'],
				correctOrder: [0, 1, 2, 3],
				explanation:
					'K=1 has the highest variance because the prediction depends on a single neighbor (very sensitive to noise). As K increases, more neighbors vote, smoothing out noise and reducing variance. At K=n, every prediction is the majority class of the entire dataset -- maximum smoothing, minimum variance, but high bias.'
			},
			{
				type: 'multiple-choice',
				id: 'supervised-q6',
				question:
					'In a random forest, what two sources of randomness create diversity among trees?',
				options: [
					'Random learning rates and random activation functions',
					'Bootstrap sampling of data and random subsets of features at each split',
					'Random initialization of weights and random training order',
					'Random pruning and random depth limits'
				],
				correctIndex: 1,
				explanation:
					'Random forests create diversity through (1) bagging -- each tree is trained on a random bootstrap sample of the training data, and (2) random feature selection -- at each split, only a random subset of features is considered. This ensures each tree is different, and their collective vote is more robust than any individual tree.'
			},
			{
				type: 'multiple-choice',
				id: 'supervised-q7',
				question:
					'Why does the No Free Lunch theorem matter for model selection?',
				options: [
					'It proves that neural networks are always the best choice',
					'It shows that no single algorithm is best for all problems, motivating empirical comparison',
					'It means all algorithms have the same accuracy',
					'It proves that simple models are always preferred'
				],
				correctIndex: 1,
				explanation:
					'The No Free Lunch theorem states that no algorithm dominates all others across all possible problems. This means you should try multiple algorithms on your specific problem rather than assuming one is universally best. Model selection is an empirical question.'
			},
			{
				type: 'multiple-choice',
				id: 'supervised-q8',
				question:
					'What does entropy measure in the context of decision trees?',
				options: [
					'The depth of the tree',
					'The number of features considered at each split',
					'The impurity or disorder of a set of examples',
					'The total number of leaf nodes'
				],
				correctIndex: 2,
				explanation:
					'Entropy measures the impurity (disorder) of a set of examples. A set where all examples belong to one class has entropy 0 (pure). A set evenly split between classes has maximum entropy. Decision trees choose splits that maximize information gain -- the reduction in entropy.'
			},
			{
				type: 'multiple-choice',
				id: 'supervised-q9',
				question:
					'Why is random search often more efficient than grid search for hyperparameter tuning?',
				options: [
					'Random search is always faster to compute',
					'Random search explores more unique values of each important hyperparameter for the same budget',
					'Grid search cannot handle continuous hyperparameters',
					'Random search guarantees finding the global optimum'
				],
				correctIndex: 1,
				explanation:
					'When only one or two hyperparameters matter significantly, grid search wastes effort exhaustively varying the unimportant ones. Random search explores more unique values of each dimension, making it more likely to find good values of the important hyperparameters. Research by Bergstra and Bengio (2012) demonstrated this advantage.'
			},
			{
				type: 'fill-in',
				id: 'supervised-q10',
				question:
					'The cost function used in linear regression, which averages the squared differences between predictions and actual values, is called Mean ___ Error (abbreviated MSE).',
				acceptedAnswers: ['Squared', 'squared', 'SQUARED'],
				explanation:
					'Mean Squared Error (MSE) computes the average of the squared residuals (differences between predicted and actual values). Squaring ensures all errors are positive and penalizes larger errors disproportionately.'
			}
		],
		passingScore: 7
	}
};

export default supervisedLearning;
