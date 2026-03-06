import type { Module } from '../types';

const module: Module = {
	slug: 'programming-for-ai',
	title: 'Programming for AI',
	description:
		'Set up your AI development toolkit. Learn Python, NumPy, Pandas, and visualization — the practical skills that bring AI concepts to life in code.',
	estimatedMinutes: 70,
	xpReward: 75,
	quizXpReward: 50,
	lessons: [
		{
			slug: 'python-the-language-of-ai',
			title: 'Python: The Language of AI',
			content: `# Python: The Language of AI

If AI has a native language, it's Python. Not because Python is the fastest language (it isn't), or the most elegant (that's debatable), or the most powerful (every general-purpose language is theoretically equivalent). Python dominates AI because it hits a sweet spot of **readability**, **ecosystem**, and **community** that no other language matches.

## Why Python Won

In the early 2000s, AI researchers used a variety of languages: MATLAB for prototyping, C++ for performance, Java for enterprise systems, R for statistics. Python was a minor player. So what changed?

**Readability**: Python code reads almost like English. Compare printing "Hello" in Java (\`public static void main(String[] args) { System.out.println("Hello"); }\`) versus Python (\`print("Hello")\`). When your primary concern is expressing mathematical and algorithmic ideas clearly, Python's clean syntax is a massive advantage. Researchers spend their time thinking about AI, not fighting their language.

**NumPy and SciPy**: In 2005-2006, the NumPy library stabilized, giving Python efficient numerical computing. Suddenly, Python could do fast matrix math — the core operation of machine learning. This was the turning point.

**scikit-learn**: Released in 2010, this library made machine learning accessible. With a few lines of Python, you could train and evaluate dozens of ML algorithms. Researchers and students flocked to it.

**TensorFlow and PyTorch**: Google's TensorFlow (2015) and Facebook's PyTorch (2016) provided deep learning frameworks in Python. These frameworks made it possible to build and train neural networks with just a few dozen lines of code — including automatic differentiation (backpropagation computed automatically).

**Jupyter notebooks**: The interactive notebook format let researchers write code, see results, and add explanations all in one document. This became the standard medium for AI research and education.

The result is a self-reinforcing cycle: because the best AI tools are in Python, the best AI researchers use Python, which means the best new AI tools are written in Python, and so on.

<div class="callout callout-insight">
<div class="callout-title">Key Insight</div>
Python's dominance illustrates an important principle: in technology, ecosystem often matters more than raw capability. Python isn't the best language on any single dimension, but it's "good enough" on every dimension and has the best ecosystem for AI by a wide margin. When choosing tools for AI, prioritize ecosystem richness and community support over theoretical elegance.
</div>

## Python Essentials: A Quick Tour

If you already know Python, consider this a refresher. If you're new, this will give you the essential vocabulary.

### Variables and Types

Python is **dynamically typed** — you don't declare types; Python figures them out:

\`\`\`python
x = 42              # int
pi = 3.14159         # float
name = "Claude"      # string
is_ai = True         # boolean
scores = [95, 87, 92]  # list
\`\`\`

### Control Flow

\`\`\`python
# Conditional
if temperature > 100:
    print("Too hot!")
elif temperature < 0:
    print("Too cold!")
else:
    print("Just right")

# For loop
for i in range(10):
    print(i)  # prints 0 through 9

# While loop
while not converged:
    train_one_step()
\`\`\`

Note: Python uses **indentation** to define code blocks, not curly braces. This enforces readable code — you can't write sloppy Python the way you can write sloppy C or Java.

### Functions

\`\`\`python
def compute_loss(predictions, targets):
    """Compute mean squared error loss."""
    errors = [(p - t) ** 2 for p in zip(predictions, targets)]
    return sum(errors) / len(errors)

# Call it
loss = compute_loss([1.0, 2.0, 3.0], [1.1, 2.2, 2.8])
\`\`\`

Functions are first-class objects in Python — you can pass them as arguments, return them from other functions, and store them in data structures. This is important for AI frameworks where you often pass loss functions or activation functions as parameters.

### Classes

\`\`\`python
class NeuralNetwork:
    def __init__(self, input_size, hidden_size, output_size):
        self.weights1 = initialize_weights(input_size, hidden_size)
        self.weights2 = initialize_weights(hidden_size, output_size)

    def forward(self, x):
        hidden = activate(x @ self.weights1)
        output = activate(hidden @ self.weights2)
        return output

    def train(self, data, labels, epochs=100):
        for epoch in range(epochs):
            predictions = self.forward(data)
            loss = compute_loss(predictions, labels)
            self.update_weights(loss)
\`\`\`

AI frameworks like PyTorch use classes extensively. Your models, datasets, and training loops are typically defined as classes.

### List Comprehensions and Generators

Python's list comprehensions are a concise way to create lists:

\`\`\`python
# Instead of:
squares = []
for x in range(10):
    squares.append(x ** 2)

# Write:
squares = [x ** 2 for x in range(10)]

# With a filter:
even_squares = [x ** 2 for x in range(10) if x % 2 == 0]
\`\`\`

**Generators** are like lazy lists — they produce values one at a time instead of storing them all in memory. This is crucial for AI, where datasets are often too large to fit in memory:

\`\`\`python
def data_generator(file_path, batch_size=32):
    data = load_data(file_path)
    for i in range(0, len(data), batch_size):
        yield data[i:i + batch_size]

# Use it
for batch in data_generator("training_data.csv"):
    train_on_batch(batch)
\`\`\`

<div class="callout callout-think">
<div class="callout-title">Think About It</div>
Python is often criticized for being slow — 10-100x slower than C or C++ for raw computation. So how can it be the language of AI, where performance is critical? The answer: Python is the "glue" language. The actual number-crunching happens in optimized C/C++/CUDA libraries (NumPy, PyTorch, TensorFlow) that Python calls into. Python handles the high-level logic (defining the model, managing the training loop), while the low-level math runs at near-hardware speed. You get the readability of Python with the performance of C.
</div>

## The Python Ecosystem for AI

The Python AI ecosystem is vast. Here are the key libraries you'll encounter:

| Library | Purpose | You'll Use It For |
|---|---|---|
| **NumPy** | Numerical computing | Array operations, linear algebra |
| **Pandas** | Data manipulation | Loading, cleaning, exploring datasets |
| **Matplotlib / Seaborn** | Visualization | Charts, plots, data exploration |
| **scikit-learn** | Classical ML | Regression, classification, clustering |
| **PyTorch** | Deep learning | Building and training neural networks |
| **TensorFlow / Keras** | Deep learning | Alternative to PyTorch |
| **Hugging Face Transformers** | Pre-trained models | Using and fine-tuning LLMs |
| **Jupyter** | Interactive notebooks | Experimentation and prototyping |

We'll explore the most important of these in the coming lessons. By the end of this module, you'll have a working toolkit for hands-on AI development.`,
			estimatedMinutes: 14,
			xpReward: 15
		},
		{
			slug: 'numpy-thinking-in-arrays',
			title: 'NumPy: Thinking in Arrays',
			content: `# NumPy: Thinking in Arrays

NumPy (Numerical Python) is the foundation of virtually all numerical and scientific computing in Python. It provides a single core concept — the **ndarray** (n-dimensional array) — and a vast collection of operations for working with arrays efficiently. Understanding NumPy is understanding the computational backbone of AI.

## Why Loops Are the Enemy

Consider a simple task: multiply each element in a list of 1 million numbers by 2.

\`\`\`python
# The Python way (slow)
result = []
for x in my_list:
    result.append(x * 2)
\`\`\`

This loop processes numbers one at a time, with Python's interpreter overhead on every iteration. For 1 million numbers, it might take several seconds.

\`\`\`python
# The NumPy way (fast)
import numpy as np
result = my_array * 2
\`\`\`

This single line operates on the entire array at once. Under the hood, NumPy calls optimized C code that processes the data in bulk, exploiting CPU cache, SIMD instructions, and other hardware features. The speedup is typically **50-100x**.

This principle — replacing explicit Python loops with array-level operations — is called **vectorization**, and it's the most important concept in NumPy. When you find yourself writing a for-loop over array elements, stop and ask: "Is there a NumPy operation that does this?"

<div class="callout callout-insight">
<div class="callout-title">Key Insight</div>
Vectorization isn't just about speed — it's about a way of thinking. Instead of thinking "for each pixel, multiply by 0.5," think "multiply the entire image by 0.5." Instead of "for each sample, compute the dot product," think "multiply the matrix of samples by the weight vector." This shift from element-level to array-level thinking is crucial for writing effective AI code.
</div>

<!-- interactive:MatrixMultiplier -->

## Creating Arrays

\`\`\`python
import numpy as np

# From a Python list
a = np.array([1, 2, 3, 4, 5])

# Multi-dimensional
matrix = np.array([[1, 2, 3],
                   [4, 5, 6]])

# Common initializations
zeros = np.zeros((3, 4))        # 3x4 matrix of zeros
ones = np.ones((2, 3))          # 2x3 matrix of ones
identity = np.eye(4)            # 4x4 identity matrix
random = np.random.randn(3, 3)  # 3x3 matrix of random normal values
sequence = np.arange(0, 10, 0.5)  # [0, 0.5, 1.0, ..., 9.5]
linspace = np.linspace(0, 1, 100)  # 100 evenly spaced points from 0 to 1
\`\`\`

Every NumPy array has key attributes:
- **shape**: The dimensions — \`(3, 4)\` means 3 rows and 4 columns
- **dtype**: The data type — \`float64\`, \`int32\`, \`bool\`, etc.
- **ndim**: The number of dimensions — 1 for a vector, 2 for a matrix, etc.

## Element-wise Operations

Basic arithmetic operates element by element:

\`\`\`python
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

a + b    # [5, 7, 9]
a * b    # [4, 10, 18]
a ** 2   # [1, 4, 9]
np.sqrt(a)  # [1.0, 1.414, 1.732]
np.exp(a)   # [2.718, 7.389, 20.086]
\`\`\`

These operations are all vectorized — they apply to every element simultaneously, without a Python loop.

## Broadcasting: The Magic Rule

What happens when you operate on arrays of different sizes?

\`\`\`python
a = np.array([[1, 2, 3],
              [4, 5, 6]])  # shape: (2, 3)

b = np.array([10, 20, 30])  # shape: (3,)

a + b  # Works! Result:
       # [[11, 22, 33],
       #  [14, 25, 36]]
\`\`\`

NumPy **broadcasts** the smaller array across the larger one. The 1D array \`b\` is "stretched" to match the 2D array \`a\` — each row of \`a\` gets the corresponding element of \`b\` added to it.

Broadcasting follows specific rules:
1. Arrays are compared dimension by dimension, starting from the right
2. Dimensions are compatible if they're equal or one of them is 1
3. Missing dimensions are treated as 1

Broadcasting is extremely powerful for AI. When you subtract the mean from every sample, normalize features, or add a bias to every neuron's output, broadcasting handles it elegantly:

\`\`\`python
# Normalize features (subtract mean, divide by std)
# data shape: (1000, 50) — 1000 samples, 50 features
mean = data.mean(axis=0)  # shape: (50,) — mean of each feature
std = data.std(axis=0)    # shape: (50,)
normalized = (data - mean) / std  # Broadcasting handles it!
\`\`\`

## Matrix Operations

\`\`\`python
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

# Matrix multiplication (NOT element-wise!)
C = A @ B     # or np.dot(A, B)
# [[19, 22],
#  [43, 50]]

# Transpose
A.T  # [[1, 3], [2, 4]]

# Inverse (if it exists)
np.linalg.inv(A)

# Eigenvalues and eigenvectors
eigenvalues, eigenvectors = np.linalg.eig(A)
\`\`\`

The \`@\` operator for matrix multiplication is used constantly in AI code. A single forward pass through a neural network layer is:

\`\`\`python
output = activation(input @ weights + bias)
\`\`\`

That's it. That's a neural network layer. The weights matrix transforms the input vector, bias is added via broadcasting, and the activation function (like ReLU) is applied element-wise.

<div class="callout callout-think">
<div class="callout-title">Think About It</div>
A neural network with 3 hidden layers, each with 256 neurons, processing 784-dimensional input (like a 28x28 image) involves matrix multiplications of sizes: (784 x 256), (256 x 256), (256 x 256), and (256 x 10) for a 10-class output. Each of these matrices is full of learnable weights. The total number of weights is about 267,000. That's what the model learns. And all the computation is matrix multiplication — the operation NumPy was born to perform.
</div>

## Reshaping and Indexing

\`\`\`python
# Reshape — change dimensions without changing data
a = np.arange(12)          # [0, 1, 2, ..., 11], shape (12,)
b = a.reshape(3, 4)        # 3 rows, 4 columns
c = a.reshape(2, 2, 3)     # 2 blocks of 2 rows and 3 columns

# Flatten — convert any shape to 1D
c.flatten()                 # Back to [0, 1, 2, ..., 11]

# Slicing
matrix = np.arange(20).reshape(4, 5)
matrix[0, :]    # First row
matrix[:, 0]    # First column
matrix[1:3, 2:4]  # Sub-matrix: rows 1-2, columns 2-3
\`\`\`

Reshaping is essential in AI because data often needs to be reorganized. An image might be stored as a 3D array (height x width x channels) but a neural network might need it as a 1D vector (height * width * channels). Reshaping handles this without copying data.

## Random Number Generation

AI relies heavily on randomness: initializing weights, shuffling training data, sampling from distributions, adding noise.

\`\`\`python
np.random.seed(42)  # For reproducibility

# Uniform random numbers between 0 and 1
np.random.rand(3, 3)

# Normal (Gaussian) random numbers (mean=0, std=1)
np.random.randn(3, 3)

# Random integers
np.random.randint(0, 10, size=(5,))

# Shuffle an array
np.random.shuffle(data)

# Sample from a list
choices = np.random.choice(['a', 'b', 'c'], size=10, p=[0.5, 0.3, 0.2])
\`\`\`

<div class="callout callout-warning">
<div class="callout-title">Common Misconception</div>
Computer-generated random numbers aren't truly random — they're "pseudorandom," produced by deterministic algorithms that create sequences that *appear* random. Setting a random seed (like \`np.random.seed(42)\`) makes the sequence reproducible — you'll get the same "random" numbers every time. This is crucial for reproducibility in AI experiments. If your results depend on the random seed, they might not be as robust as they appear.
</div>

## Aggregation Operations

\`\`\`python
data = np.random.randn(1000, 50)  # 1000 samples, 50 features

data.sum()          # Sum of all elements
data.mean()         # Mean of all elements
data.std()          # Standard deviation
data.min()          # Minimum value
data.max()          # Maximum value
data.argmax()       # Index of the maximum value

# Along a specific axis
data.mean(axis=0)   # Mean of each feature (result: shape (50,))
data.mean(axis=1)   # Mean of each sample (result: shape (1000,))
\`\`\`

The \`axis\` parameter is critical. \`axis=0\` operates "down" (across samples), \`axis=1\` operates "across" (across features). Getting this right is essential for data normalization, batch statistics, and many other AI operations.

## NumPy in the AI Pipeline

NumPy is the foundation that everything else builds on:

- **PyTorch tensors** and **TensorFlow tensors** are essentially GPU-accelerated NumPy arrays with automatic differentiation
- **Pandas DataFrames** use NumPy arrays internally
- **scikit-learn** models accept NumPy arrays as input
- **Matplotlib** plots NumPy arrays

When you learn NumPy, you're learning the universal data format of Python AI. The concepts of vectorization, broadcasting, and array-level thinking transfer directly to every framework and library you'll use.`,
			estimatedMinutes: 16,
			xpReward: 15
		},
		{
			slug: 'working-with-data',
			title: 'Working with Data',
			content: `# Working with Data

In AI, data is everything. The most sophisticated algorithm in the world is useless without good data, and the simplest algorithm can produce stunning results with enough high-quality data. The saying in the field is: **"Garbage in, garbage out."** Before you can train a model, you need to understand, clean, and prepare your data.

**Pandas** is Python's premier library for data manipulation. Named after "panel data" (a term from statistics), Pandas provides the **DataFrame** — a powerful, flexible data structure that makes working with structured data intuitive and efficient.

## The DataFrame: Your Data's Home

A DataFrame is essentially a table — like a spreadsheet or SQL table — with labeled rows and columns:

\`\`\`python
import pandas as pd

# Create from a dictionary
df = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Carol', 'Dave'],
    'age': [25, 30, 35, 28],
    'score': [92, 85, 78, 95],
    'passed': [True, True, False, True]
})
\`\`\`

This creates:

\`\`\`
   name  age  score  passed
0  Alice   25     92    True
1    Bob   30     85    True
2  Carol   35     78   False
3   Dave   28     95    True
\`\`\`

Each column is a **Series** (essentially a labeled NumPy array), and the DataFrame is a collection of Series that share the same index.

<!-- interactive:TokenizerDemo -->

## Loading Data

In practice, you'll rarely create DataFrames by hand. You'll load data from files:

\`\`\`python
# CSV (most common)
df = pd.read_csv('data/training_data.csv')

# Excel
df = pd.read_excel('data/results.xlsx')

# JSON
df = pd.read_json('data/api_response.json')

# From a URL
df = pd.read_csv('https://example.com/dataset.csv')

# SQL database
import sqlite3
conn = sqlite3.connect('database.db')
df = pd.read_sql('SELECT * FROM experiments', conn)
\`\`\`

## Inspecting Your Data

The first thing you should do with any dataset is *look at it*. Pandas provides several tools for quick inspection:

\`\`\`python
df.head()           # First 5 rows
df.tail(10)         # Last 10 rows
df.shape            # (rows, columns)
df.dtypes           # Data type of each column
df.describe()       # Statistical summary (mean, std, min, max, etc.)
df.info()           # Concise summary including non-null counts
df.columns          # List of column names
df.nunique()        # Number of unique values per column
\`\`\`

\`df.describe()\` is particularly valuable — it gives you an instant statistical portrait of your numerical data:

\`\`\`
         age     score
count   4.00      4.00
mean   29.50     87.50
std     4.20      7.59
min    25.00     78.00
25%    27.25     83.25
50%    29.00     88.50
75%    31.25     92.75
max    35.00     95.00
\`\`\`

<div class="callout callout-insight">
<div class="callout-title">Key Insight</div>
Always, always, always look at your data before training a model. The number of AI projects that have gone wrong because someone didn't inspect their data is staggering. Look for: unexpected column types (numbers stored as strings), missing values, outliers, duplicates, and data that doesn't make sense (negative ages, dates in the future, etc.). Thirty minutes of data inspection can save you weeks of debugging a model that "isn't learning."
</div>

## Selecting and Filtering

\`\`\`python
# Select a column
df['name']              # Returns a Series
df[['name', 'score']]   # Returns a DataFrame with two columns

# Filter rows
df[df['age'] > 28]                     # People older than 28
df[df['passed'] == True]               # People who passed
df[(df['age'] > 25) & (df['score'] > 80)]  # Both conditions

# Using query (often more readable)
df.query('age > 28 and score > 80')
\`\`\`

## Handling Missing Values

Real-world data is messy. Values are often missing — sensors malfunction, users skip fields, records are incomplete. Pandas represents missing values as \`NaN\` (Not a Number).

\`\`\`python
# Check for missing values
df.isnull().sum()          # Count of missing values per column
df.isnull().sum().sum()    # Total missing values

# Strategy 1: Remove rows with missing values
df_clean = df.dropna()

# Strategy 2: Fill with a specific value
df['score'] = df['score'].fillna(0)

# Strategy 3: Fill with the mean/median
df['score'] = df['score'].fillna(df['score'].mean())

# Strategy 4: Forward fill (use the previous value)
df['temperature'] = df['temperature'].fillna(method='ffill')
\`\`\`

The right strategy depends on context. Dropping rows is simple but loses data. Filling with the mean preserves the distribution's center but reduces variance. Forward filling makes sense for time-series data where values change gradually.

<div class="callout callout-warning">
<div class="callout-title">Common Misconception</div>
Many beginners just drop all rows with missing values. This can be disastrous if missingness is not random. For example, if survey respondents with low income tend to skip the income question, dropping those rows will bias your dataset toward higher incomes. Always think about *why* data is missing before deciding how to handle it. The field of handling missing data is surprisingly deep and important.
</div>

## Grouping and Aggregation

\`\`\`python
# Group by a column and compute statistics
df.groupby('department')['salary'].mean()
df.groupby('category').agg({
    'price': ['mean', 'median', 'std'],
    'quantity': 'sum'
})

# Value counts — frequency of each unique value
df['category'].value_counts()
\`\`\`

Grouping is essential for understanding your data. In an AI context, you might group by class label to check for **class imbalance** — if 95% of your training examples are "not spam" and only 5% are "spam," your model might learn to just predict "not spam" every time and still achieve 95% accuracy while being completely useless.

## Data Types and Conversion

\`\`\`python
# Check types
df.dtypes

# Convert types
df['age'] = df['age'].astype(float)
df['date'] = pd.to_datetime(df['date'])
df['category'] = df['category'].astype('category')

# Encoding categorical variables for ML
df_encoded = pd.get_dummies(df, columns=['color', 'size'])
\`\`\`

Machine learning models need numerical input. Categorical variables ("red," "blue," "green") must be converted to numbers. **One-hot encoding** (\`pd.get_dummies\`) creates a binary column for each category — the "color" column becomes "color_red," "color_blue," "color_green," each containing 0 or 1.

## The Basic Data Analysis Workflow

Here's a typical workflow you'll follow for any AI project:

\`\`\`python
import pandas as pd
import numpy as np

# 1. Load
df = pd.read_csv('dataset.csv')

# 2. Inspect
print(df.shape)
print(df.head())
print(df.describe())
print(df.isnull().sum())

# 3. Clean
df = df.dropna(subset=['target'])  # Must have labels
df['feature_x'] = df['feature_x'].fillna(df['feature_x'].median())

# 4. Transform
df['log_price'] = np.log1p(df['price'])  # Log transform skewed features
df = pd.get_dummies(df, columns=['category'])

# 5. Split
from sklearn.model_selection import train_test_split
X = df.drop('target', axis=1)
y = df['target']
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 6. Ready for modeling!
\`\`\`

<div class="callout callout-think">
<div class="callout-title">Think About It</div>
Data scientists often say they spend 80% of their time on data preparation and only 20% on actual modeling. This ratio surprises beginners, who expect the "AI part" to be the hard part. In practice, getting clean, well-structured, representative data is usually the biggest challenge. The best model in the world can't fix fundamentally flawed data.
</div>

## Pandas Performance Tips

For large datasets (millions of rows), keep these tips in mind:

- **Use appropriate dtypes**: Converting a column from \`float64\` to \`float32\` halves its memory usage
- **Read only needed columns**: \`pd.read_csv('data.csv', usecols=['col1', 'col2'])\`
- **Use chunked reading for huge files**: \`pd.read_csv('huge.csv', chunksize=10000)\`
- **Avoid iterating with for-loops**: Use vectorized operations (same principle as NumPy)
- **Consider alternatives for very large data**: Apache Spark, Dask, or Polars for datasets that don't fit in memory`,
			estimatedMinutes: 15,
			xpReward: 15
		},
		{
			slug: 'visualization-and-exploration',
			title: 'Visualization and Exploration',
			content: `# Visualization and Exploration

Humans are visual creatures. We can spot patterns in a chart that would be invisible in a table of numbers. Visualization is not just a nice-to-have in AI — it's an essential tool for understanding data, diagnosing problems, and communicating results.

As the statistician John Tukey said: *"The greatest value of a picture is when it forces us to notice what we never expected to see."*

## Matplotlib: The Foundation

**Matplotlib** is Python's foundational plotting library. It's not the prettiest or most modern, but it's the most flexible and widely used. Nearly every other Python visualization library builds on top of Matplotlib.

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

# Basic line plot
x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.figure(figsize=(10, 6))
plt.plot(x, y, label='sin(x)', color='blue', linewidth=2)
plt.xlabel('x')
plt.ylabel('y')
plt.title('A Simple Sine Wave')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()
\`\`\`

The basic pattern is always the same: create a figure, add elements (lines, points, bars), add labels and formatting, then display or save.

## Choosing the Right Chart

Different data types and questions call for different visualizations:

### Scatter Plot — Relationships Between Variables
\`\`\`python
plt.scatter(df['feature_1'], df['feature_2'],
            c=df['label'], cmap='viridis', alpha=0.6)
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')
plt.colorbar(label='Class')
plt.title('Feature Relationship by Class')
\`\`\`

Use scatter plots to see **relationships** between two continuous variables. In AI, scatter plots are invaluable for visualizing clusters, decision boundaries, and feature correlations. Color-coding by class label reveals whether features are useful for classification.

### Histogram — Distribution of a Single Variable
\`\`\`python
plt.hist(df['age'], bins=30, edgecolor='black', alpha=0.7)
plt.xlabel('Age')
plt.ylabel('Count')
plt.title('Age Distribution')
\`\`\`

Use histograms to understand the **shape** of your data. Is it normally distributed? Skewed? Bimodal? Are there outliers? These insights inform preprocessing decisions (log transforms for skewed data, outlier removal, etc.).

### Box Plot — Comparing Distributions Across Groups
\`\`\`python
df.boxplot(column='score', by='department')
plt.title('Score Distribution by Department')
\`\`\`

Box plots show the median, quartiles, and outliers for each group. They're excellent for comparing distributions across categories and spotting outliers.

### Heatmap — Correlation Matrices
\`\`\`python
import seaborn as sns

correlation = df.corr()
sns.heatmap(correlation, annot=True, cmap='coolwarm', center=0)
plt.title('Feature Correlations')
\`\`\`

Correlation heatmaps reveal which features move together. Highly correlated features may be redundant (you might drop one). Features strongly correlated with the target variable are likely to be useful for prediction.

<div class="callout callout-insight">
<div class="callout-title">Key Insight</div>
Visualization is not just for final presentations — it's a critical part of the modeling process. Before training, visualize your data to check for issues. During training, plot the loss curve to see if the model is learning. After training, visualize predictions vs. actuals to understand where the model succeeds and fails. The best AI practitioners are relentless visualizers.
</div>

## Exploratory Data Analysis (EDA)

**Exploratory Data Analysis** is the process of systematically examining your data before building a model. It answers questions like:

- What does the data look like? (distributions, ranges, types)
- Are there missing values? How many?
- Are there outliers? Are they errors or genuine extreme values?
- How are features related to each other? (correlations)
- How are features related to the target variable?
- Is the target variable balanced? (equal numbers of each class)

A typical EDA workflow:

\`\`\`python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load and inspect
df = pd.read_csv('dataset.csv')
print(df.shape)
print(df.info())
print(df.describe())

# Distribution of each numeric feature
df.hist(figsize=(15, 10), bins=30)
plt.tight_layout()
plt.show()

# Missing values
missing = df.isnull().sum().sort_values(ascending=False)
missing = missing[missing > 0]
missing.plot(kind='bar')
plt.title('Missing Values by Column')
plt.show()

# Correlations
plt.figure(figsize=(12, 8))
sns.heatmap(df.corr(), annot=True, cmap='coolwarm', center=0)
plt.title('Feature Correlations')
plt.show()

# Target distribution
df['target'].value_counts().plot(kind='bar')
plt.title('Target Class Distribution')
plt.show()

# Pairwise relationships (for small feature sets)
sns.pairplot(df, hue='target', diag_kind='hist')
plt.show()
\`\`\`

<div class="callout callout-think">
<div class="callout-title">Think About It</div>
One of the most famous examples of why EDA matters is **Anscombe's Quartet** — four datasets that have identical statistical properties (same mean, variance, correlation, and regression line) but look completely different when plotted. One is a clean linear relationship, one is a parabola, one has an outlier, and one has leverage point. Without visualization, you'd think they were the same data. Always plot your data.
</div>

## Seaborn: Statistical Visualization Made Beautiful

**Seaborn** builds on Matplotlib and provides higher-level, more attractive statistical visualizations:

\`\`\`python
import seaborn as sns

# Distribution plot with kernel density estimation
sns.histplot(df['score'], kde=True)

# Categorical comparisons
sns.violinplot(x='department', y='salary', data=df)

# Joint distributions
sns.jointplot(x='height', y='weight', data=df, kind='hex')

# Pair plots for multi-feature exploration
sns.pairplot(df, hue='species')
\`\`\`

Seaborn's strength is that it's designed for *statistical* visualization — it automatically adds useful statistical annotations and handles common data science plotting patterns elegantly.

## Telling Stories with Data

Visualization isn't just about making charts — it's about communicating insights. A great visualization tells a story. Here are principles for effective data storytelling:

**1. Start with a question.** Don't just make random plots. Ask: "Is the model performing better on recent data?" or "Which features are most important?" Then make the visualization that answers that specific question.

**2. Remove clutter.** Every element in your chart should serve a purpose. Remove grid lines that don't help, simplify legends, use white space. Edward Tufte calls unnecessary visual elements "chartjunk."

**3. Use color meaningfully.** Use color to encode information (red for errors, green for successes), not for decoration. Consider colorblind-friendly palettes (\`sns.color_palette("colorblind")\`).

**4. Label everything.** Axes, titles, units, legends. If someone can't understand your chart without asking you questions, it needs better labels.

**5. Highlight the insight.** If there's a key finding (a spike, a trend, an anomaly), make it visually prominent. Add an annotation, use a contrasting color, or draw attention to it explicitly.

## Common AI-Specific Visualizations

Beyond standard charts, AI projects have their own visualization needs:

**Training curves**: Plot loss and accuracy over training epochs to diagnose learning problems. A loss that decreases then plateaus suggests convergence. A training loss that keeps decreasing while validation loss increases signals overfitting.

**Confusion matrices**: For classification tasks, show which classes the model confuses. A confusion matrix immediately reveals whether the model is systematically misclassifying certain categories.

\`\`\`python
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay

cm = confusion_matrix(y_true, y_pred)
disp = ConfusionMatrixDisplay(cm, display_labels=class_names)
disp.plot(cmap='Blues')
\`\`\`

**ROC curves**: Plot true positive rate vs. false positive rate at different classification thresholds. The area under this curve (AUC) is a popular metric for binary classification.

**Feature importance plots**: Show which features the model relies on most for its predictions.

<div class="callout callout-warning">
<div class="callout-title">Common Misconception</div>
Beautiful visualizations can be misleading. A chart with truncated axes can make small differences look enormous. A chart with logarithmic axes can hide dramatic changes. Cherry-picking which data to include can tell any story you want. Always check: Does the y-axis start at zero? Are the axes linear or logarithmic? What data was included or excluded? Critical chart reading is as important as chart making.
</div>`,
			estimatedMinutes: 14,
			xpReward: 15
		},
		{
			slug: 'ai-development-environment',
			title: 'Your AI Development Environment',
			content: `# Your AI Development Environment

Having the right tools set up correctly is the difference between a smooth development experience and hours of frustrating debugging. In this lesson, we'll walk through the essential components of a professional AI development environment.

## Jupyter Notebooks

**Jupyter notebooks** (.ipynb files) are the standard working environment for AI research and exploration. A notebook is a document that interleaves:

- **Code cells** — executable Python code
- **Markdown cells** — formatted text, equations, and explanations
- **Output cells** — results, charts, tables, and visualizations

This combination is uniquely powerful for AI work because you can:
1. Write code to load and explore data
2. See the results immediately below the code
3. Add explanations of what you're doing and why
4. Iterate quickly — change one cell and re-run it without re-running everything

### Running Jupyter

\`\`\`bash
# Install
pip install jupyter

# Launch
jupyter notebook

# Or use JupyterLab (newer, more feature-rich)
pip install jupyterlab
jupyter lab
\`\`\`

This opens a browser-based interface where you can create and edit notebooks.

### Best Practices for Notebooks

- **Restart and Run All** before sharing — make sure cells run in order (a common gotcha is cells that depend on variables defined in a now-deleted cell)
- **Keep cells small** — each cell should do one thing
- **Add markdown explanations** between code cells
- **Don't use notebooks for production code** — they're for exploration and prototyping. Move finalized code to .py files
- **Version control is tricky** — notebook files contain output data, which creates noisy diffs. Consider using tools like \`nbstripout\` to strip outputs before committing

<div class="callout callout-think">
<div class="callout-title">Think About It</div>
There's an ongoing debate in the AI community about notebooks vs. scripts. Notebooks are great for exploration and communication but can lead to messy, non-reproducible workflows. Scripts (.py files) are better for production code and version control but lack the interactivity of notebooks. The best practice is to use notebooks for exploration and prototyping, then refactor working code into scripts and modules for production use.
</div>

### Google Colab

**Google Colaboratory** (Colab) is a free, cloud-based Jupyter environment that runs on Google's servers. Its killer feature: **free GPU access**. For beginners, Colab is often the easiest way to start doing AI because:

- No local setup required — it runs in your browser
- Free GPU (NVIDIA T4) and sometimes TPU access
- Pre-installed AI libraries (PyTorch, TensorFlow, etc.)
- Easy sharing via Google Drive

The downside: sessions time out after idle periods, and you're limited in how much compute you can use for free. For serious projects, you'll eventually want a local setup or a cloud provider.

## Virtual Environments: Isolation Is Key

AI projects often require specific versions of libraries. Project A might need PyTorch 1.13, while Project B needs PyTorch 2.0. Without isolation, these projects would conflict.

**Virtual environments** solve this by creating isolated Python installations for each project.

### venv (Built-in)

\`\`\`bash
# Create a virtual environment
python -m venv my_ai_project

# Activate it
source my_ai_project/bin/activate  # macOS/Linux
my_ai_project\\Scripts\\activate     # Windows

# Install packages (they go into the virtual environment, not globally)
pip install numpy pandas scikit-learn torch

# Deactivate when done
deactivate
\`\`\`

### Conda (Recommended for AI)

**Conda** (via Anaconda or Miniconda) is a more powerful package manager that handles both Python packages and system-level dependencies. It's particularly popular for AI because some AI libraries have complex binary dependencies that pip struggles with.

\`\`\`bash
# Create an environment
conda create -n my_ai_project python=3.11

# Activate it
conda activate my_ai_project

# Install packages
conda install numpy pandas scikit-learn
conda install pytorch torchvision -c pytorch

# List environments
conda env list

# Export for reproducibility
conda env export > environment.yml

# Recreate from export
conda env create -f environment.yml
\`\`\`

<div class="callout callout-warning">
<div class="callout-title">Common Misconception</div>
Many beginners install packages globally (without a virtual environment) and then wonder why things break when they update a library. Global installation means all projects share the same library versions, and updating one project's dependencies can break another. Always use virtual environments. Always. This advice alone will save you countless hours of debugging.
</div>

## Package Management

### pip

\`\`\`bash
# Install a specific version
pip install numpy==1.24.0

# Install from a requirements file
pip install -r requirements.txt

# Save current environment
pip freeze > requirements.txt
\`\`\`

A **requirements.txt** file lists all your project's dependencies with version numbers, ensuring that anyone can recreate your exact environment:

\`\`\`
numpy==1.24.0
pandas==2.0.1
scikit-learn==1.2.2
torch==2.0.0
matplotlib==3.7.1
\`\`\`

## Git Basics for ML Projects

**Git** is essential for any software project, but ML projects have special considerations.

\`\`\`bash
# Initialize a repository
git init

# Stage and commit
git add model.py data_prep.py
git commit -m "Initial model implementation"

# Create a branch for experiments
git checkout -b experiment/larger-model

# If the experiment works, merge it back
git checkout main
git merge experiment/larger-model
\`\`\`

### ML-Specific Git Considerations

**Don't commit large files.** Training data, model checkpoints, and datasets can be gigabytes or terabytes. Use **.gitignore** to exclude them:

\`\`\`
# .gitignore for ML projects
data/
models/
checkpoints/
*.h5
*.pt
*.pkl
__pycache__/
*.ipynb_checkpoints/
.env
wandb/
\`\`\`

**Use Git LFS or DVC for data versioning.** **DVC** (Data Version Control) is like Git for data — it tracks your datasets and model files without storing them directly in Git. This lets you version your data alongside your code.

**Commit meaningful experiments.** Don't just commit "updated model." Commit "Increased hidden size from 256 to 512, validation accuracy improved from 0.85 to 0.87." Your future self will thank you.

## Reproducibility

Reproducibility is one of the biggest challenges in AI. A model that gets 95% accuracy on your machine might get 90% on someone else's — or even different results on the same machine on a different day.

Key practices for reproducibility:

**Set random seeds everywhere:**
\`\`\`python
import numpy as np
import torch
import random

def set_seed(seed=42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    # For full determinism (may slow things down):
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False
\`\`\`

**Track your environment:** Save \`requirements.txt\` or \`environment.yml\` with exact version numbers.

**Log your experiments:** Use tools like **Weights & Biases (wandb)**, **MLflow**, or **TensorBoard** to automatically log hyperparameters, metrics, and results for every experiment.

**Version your data:** Use DVC or a similar tool to track exactly which version of the dataset was used for each experiment.

<div class="callout callout-insight">
<div class="callout-title">Key Insight</div>
Reproducibility isn't just good practice — it's how you build trust in your results. If you can't reproduce your own results, how can you trust them? If nobody else can reproduce them, how can the field build on them? The reproducibility crisis in AI research (where many published results can't be replicated) has led to increased emphasis on these practices. Start building good habits now.
</div>

## Putting It All Together

A well-organized AI project looks like this:

\`\`\`
my_ai_project/
|-- data/
|   |-- raw/              # Original, unmodified data
|   |-- processed/         # Cleaned, transformed data
|-- notebooks/
|   |-- 01_exploration.ipynb
|   |-- 02_modeling.ipynb
|-- src/
|   |-- data_prep.py       # Data loading and preprocessing
|   |-- model.py           # Model definition
|   |-- train.py           # Training loop
|   |-- evaluate.py        # Evaluation metrics
|   |-- utils.py           # Helper functions
|-- models/                # Saved model checkpoints
|-- results/               # Experiment results, plots
|-- requirements.txt       # Python dependencies
|-- .gitignore
|-- README.md
\`\`\`

This structure separates exploration (notebooks) from production code (src), raw data from processed data, and keeps everything organized and reproducible.

You now have the full toolkit: Python for the language, NumPy for numerical computing, Pandas for data manipulation, Matplotlib/Seaborn for visualization, and a professional development environment for reproducible work. You're ready to build AI.`,
			estimatedMinutes: 11,
			xpReward: 15
		}
	],
	quiz: {
		questions: [
			{
				type: 'multiple-choice',
				id: 'prog-q1',
				question: 'Why does Python dominate AI despite being slower than languages like C++?',
				options: [
					'Python is actually faster than C++ for numerical computation',
					'AI doesn\'t require much computation',
					'Python serves as the "glue" language while actual computation happens in optimized C/CUDA libraries',
					'Python was specifically designed for AI'
				],
				correctIndex: 2,
				explanation:
					'Python is the "glue" language in AI. The high-level logic (defining models, managing training) is written in readable Python, but the intensive number-crunching happens in optimized C/C++/CUDA libraries like NumPy, PyTorch, and TensorFlow. This gives you Python\'s readability with near-hardware-speed computation.'
			},
			{
				type: 'multiple-choice',
				id: 'prog-q2',
				question: 'What is "vectorization" in the context of NumPy?',
				options: [
					'Converting data to vector format',
					'Replacing explicit Python loops with array-level operations that run in optimized C code',
					'Creating vector graphics',
					'Compressing data into vectors'
				],
				correctIndex: 1,
				explanation:
					'Vectorization means replacing Python loops over individual elements with single operations on entire arrays. Instead of looping through a million numbers to multiply each by 2, you write `array * 2` and NumPy handles all elements at once in optimized C code. This is typically 50-100x faster than Python loops.'
			},
			{
				type: 'fill-in',
				id: 'prog-q3',
				question:
					'In a Pandas DataFrame, missing values are represented as ___.',
				acceptedAnswers: ['NaN', 'nan', 'NAN', 'np.nan'],
				explanation:
					'Pandas uses NaN (Not a Number) to represent missing values. You can check for them with df.isnull() or df.isna(), and handle them with methods like dropna(), fillna(), or more sophisticated imputation techniques.'
			},
			{
				type: 'multiple-choice',
				id: 'prog-q4',
				question: 'Why should you always use virtual environments for AI projects?',
				options: [
					'They make Python code run faster',
					'They prevent different projects from conflicting over library versions',
					'They are required by Python',
					'They automatically install all needed libraries'
				],
				correctIndex: 1,
				explanation:
					'Virtual environments create isolated Python installations for each project, preventing version conflicts. Project A might need PyTorch 1.13 while Project B needs PyTorch 2.0 — without isolation, installing one would break the other. This is especially important in AI, where libraries are updated frequently and have complex dependencies.'
			},
			{
				type: 'ordering',
				id: 'prog-q5',
				question:
					'Put these steps of a typical data analysis workflow in the correct order:',
				items: [
					'Load the data',
					'Inspect and explore (shape, describe, head)',
					'Clean (handle missing values, fix types)',
					'Transform (encode categories, normalize features)',
					'Split into train/test sets'
				],
				correctOrder: [0, 1, 2, 3, 4],
				explanation:
					'The standard workflow is: (1) Load data from files or databases, (2) Inspect it to understand structure, types, and issues, (3) Clean it by handling missing values and fixing errors, (4) Transform it by encoding categories and normalizing features, (5) Split into training and test sets. Skipping steps — especially inspection — is a common source of problems.'
			},
			{
				type: 'multiple-choice',
				id: 'prog-q6',
				question:
					'What does NumPy broadcasting do?',
				options: [
					'Sends data to multiple GPUs',
					'Automatically stretches smaller arrays to match larger ones for element-wise operations',
					'Broadcasts computation results to multiple processes',
					'Converts arrays to a standard format'
				],
				correctIndex: 1,
				explanation:
					'Broadcasting is NumPy\'s mechanism for performing operations on arrays of different shapes. When you add a 1D array of shape (3,) to a 2D array of shape (4, 3), NumPy automatically "stretches" the 1D array to match, adding it to each row. This eliminates the need for explicit loops and is crucial for efficient AI computation.'
			},
			{
				type: 'multiple-choice',
				id: 'prog-q7',
				question: 'Which visualization would best reveal whether your classification dataset has a class imbalance problem?',
				options: [
					'A scatter plot of two features',
					'A bar chart of target class value counts',
					'A line plot of feature values',
					'A heatmap of feature correlations'
				],
				correctIndex: 1,
				explanation:
					'A bar chart of value_counts() for the target variable immediately shows whether classes are balanced or imbalanced. If 95% of samples belong to one class, the model might learn to always predict that class. Detecting this early allows you to apply techniques like oversampling, undersampling, or class weighting.'
			},
			{
				type: 'fill-in',
				id: 'prog-q8',
				question:
					'The Python library that provides free cloud-based Jupyter notebooks with GPU access is Google ________.',
				acceptedAnswers: ['Colab', 'colab', 'Colaboratory', 'colaboratory', 'COLAB'],
				explanation:
					'Google Colaboratory (Colab) provides free cloud-based Jupyter notebooks with GPU and sometimes TPU access. It requires no local setup and comes with AI libraries pre-installed, making it the easiest way for beginners to start running AI code.'
			}
		],
		passingScore: 6
	}
};

export default module;
