import type { Module } from '../types';

const featureEngineering: Module = {
	slug: 'feature-engineering',
	title: 'Feature Engineering and Data',
	description:
		'Learn the art and science of transforming raw data into features that make machine learning algorithms shine -- from cleaning and preprocessing to selection and handling imbalanced data.',
	estimatedMinutes: 95,
	xpReward: 75,
	quizXpReward: 50,
	lessons: [
		{
			slug: 'the-art-of-feature-engineering',
			title: 'The Art of Feature Engineering',
			estimatedMinutes: 18,
			xpReward: 15,
			content: `
# The Art of Feature Engineering

There's a saying among seasoned data scientists that cuts through all the hype about fancy algorithms: **"Applied machine learning is basically feature engineering."** This quote, attributed to Andrew Ng, captures a truth that surprises many beginners. The choice of algorithm matters far less than the quality of the features you feed it.

## Why Features Matter More Than Algorithms

Consider this experiment: take a complex problem like predicting house prices. Give one team raw data and the most sophisticated algorithm available. Give another team the same raw data, a simple linear regression, and a domain expert who understands real estate. Nine times out of ten, the team with the domain expert and simple model will win.

Why? Because the domain expert knows that "price per square foot in the neighborhood" is more predictive than raw square footage alone. They know that "years since last renovation" matters more than "year built." They know that proximity to good schools drives prices in family neighborhoods but not in downtown areas. These **engineered features** encode domain knowledge that no algorithm can discover on its own from raw data.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>Features are the language you use to communicate with your model. Raw data is like a foreign language -- the model might eventually figure some things out, but it's slow and error-prone. Well-engineered features are like a clear, native-language explanation of the problem -- the model understands immediately and can learn efficiently.</div>

## The Machine Learning Hierarchy of Needs

Think of ML performance as a pyramid:

1. **Data quality (foundation):** Clean, accurate, representative data
2. **Feature engineering:** Transforming raw data into informative inputs
3. **Model selection:** Choosing appropriate algorithms
4. **Hyperparameter tuning:** Optimizing model settings
5. **Ensemble methods (top):** Combining multiple models

Most people start at the top, obsessing over model architectures and ensemble strategies. But each layer is constrained by the ones below it. A neural network trained on garbage features will produce garbage predictions, no matter how many layers it has. Invest your time from the bottom up.

## Domain Knowledge: The Unfair Advantage

The best features come from understanding the problem domain, not from statistical techniques. Here's why:

A machine learning algorithm sees your data as a matrix of numbers. It doesn't know that column 3 is "temperature in Celsius" or that column 7 is "customer tenure in months." It doesn't know that temperature and humidity together determine the "feels like" temperature, or that customer tenure interacts with contract type to predict churn.

**You** know these things. Or rather, a domain expert does. Feature engineering is the process of encoding that human knowledge into the data so the algorithm can leverage it.

<div class="callout callout-example"><div class="callout-title">Example</div>In fraud detection, raw transaction data includes timestamp, amount, merchant, and location. A data scientist unfamiliar with fraud might feed these directly to a model. A fraud domain expert would engineer features like: "number of transactions in the last hour" (velocity), "distance from last transaction" (travel anomaly), "ratio of this amount to average for this merchant category" (spending pattern), and "is this the first transaction with this merchant" (novelty). These engineered features make fraud patterns visible to even simple algorithms.</div>

## Feature Engineering as Creative Problem Solving

Feature engineering is one of the most creative aspects of machine learning. Unlike model selection (which is largely systematic) or hyperparameter tuning (which can be automated), feature engineering requires imagination, intuition, and deep thinking about the problem.

**Temporal features from timestamps:**
- Hour of day, day of week, month of year
- Is it a holiday? A weekend? Tax season?
- Days since last event (last purchase, last login, last complaint)
- Rolling averages (7-day moving average of sales)

**Geospatial features from coordinates:**
- Distance to nearest city center, school, hospital
- Population density of the area
- Average income of the zip code

**Text features from natural language:**
- Word count, sentence count, average word length
- Sentiment score
- Presence of specific keywords
- TF-IDF vectors

**Interaction features:**
- Price per square foot (price / area) -- more informative than either alone
- BMI from height and weight
- Revenue per employee (company revenue / number of employees)

<div class="callout callout-think"><div class="callout-title">Think About It</div>Consider predicting whether a flight will be delayed. Raw features: departure airport, arrival airport, airline, scheduled departure time, aircraft type. Now think about what actually causes delays: weather, airport congestion, cascading delays from previous flights. You'd want features like: "current weather at departure airport," "number of flights scheduled to depart within the same hour," "was the incoming aircraft delayed?" These features get at the *causal mechanisms* of delays, which is far more powerful than surface-level correlations.</div>

## Automated Feature Engineering

While domain-driven features are the gold standard, several tools can generate features automatically:

- **Featuretools:** A Python library that automatically generates features from relational datasets using "deep feature synthesis"
- **tsfresh:** Automatically extracts hundreds of features from time series data
- **Category Encoders:** Provides many sophisticated encoding strategies for categorical variables

These tools complement (but don't replace) domain expertise. They might generate hundreds of features, many of which are noise. Domain knowledge helps you identify which generated features make sense and which are spurious.

## The Feature Engineering Mindset

Developing strong feature engineering skills requires a shift in thinking:

1. **Think about the target variable.** What factors *cause* or *predict* the outcome? Work backward from the prediction to the features.

2. **Think about what the model can't see.** The model only sees the features you give it. If the relevant information isn't represented, the model can't learn it.

3. **Think about what makes examples different.** What distinguishes a positive case from a negative case? The best features capture exactly these differences.

4. **Iterate relentlessly.** Feature engineering is never "done." Each model evaluation reveals what the current features capture and what they miss. Use error analysis to guide the next round of feature creation.

5. **Look at the data.** Explore it visually. Compute summary statistics. Read individual examples. You can't engineer good features from a dataset you haven't looked at.

The gap between a beginner and an expert in machine learning isn't about knowing more algorithms. It's about the ability to look at a problem and imagine the features that would make it easy for a model to solve. That ability comes from practice, domain knowledge, and a relentless curiosity about what drives the outcome you're trying to predict.
`
		},
		{
			slug: 'data-cleaning-preprocessing',
			title: 'Data Cleaning and Preprocessing',
			estimatedMinutes: 20,
			xpReward: 15,
			content: `
# Data Cleaning and Preprocessing

There's a famous saying in data science: "garbage in, garbage out." It's a cliche because it's profoundly true. The most sophisticated algorithm in the world cannot overcome fundamentally flawed data. Data cleaning and preprocessing is where you ensure the foundation is solid before building anything on top.

In practice, data scientists spend 60-80% of their time on data preparation. It's the least glamorous part of the job -- no one writes blog posts about how they fixed inconsistent date formats -- but it's where the real value is created.

## The Landscape of Data Quality Issues

Real-world data is messy in predictable ways. Understanding the common failure modes helps you know what to look for:

### Missing Data

Missing values are nearly universal. They arise from:

- **Sensor failures:** A weather station's thermometer was offline for three hours
- **Survey non-response:** A respondent skipped the income question
- **Data integration:** Merging databases with different schemas
- **Natural absence:** A patient who never had a blood test has no results to record

**The critical question is *why* the data is missing, because the mechanism determines the appropriate handling strategy.**

**Missing Completely at Random (MCAR):** The probability of missingness is unrelated to any variable. Example: a lab sample was accidentally dropped. This is the most benign case -- the missing data is a random subset, so any handling strategy works.

**Missing at Random (MAR):** The probability of missingness depends on observed variables but not the missing value itself. Example: older patients are less likely to complete online surveys, so age predicts missingness but the missing survey responses aren't systematically different after accounting for age.

**Missing Not at Random (MNAR):** The probability of missingness depends on the missing value itself. Example: people with high incomes are less likely to report their income. This is the most problematic case because the missing data is systematically different from the observed data.

<div class="callout callout-warning"><div class="callout-title">Warning</div>Simply deleting rows with missing values (listwise deletion) is only safe when data is MCAR and you have plenty of data. If missingness is informative (MNAR), deletion introduces bias. A model trained on only the complete cases may learn patterns that don't generalize to the full population.</div>

<!-- interactive:OverfittingDemo -->

### Strategies for Handling Missing Data

**Deletion approaches:**
- **Listwise deletion:** Remove any row with a missing value. Simple but wasteful -- if 10 features each have 5% missing, you might lose 40% of your data.
- **Feature deletion:** Remove features that have too many missing values (e.g., >50% missing). Sometimes the right call if the feature isn't important.

**Imputation approaches (filling in the blanks):**
- **Mean/median/mode imputation:** Replace missing values with the column's mean (numerical) or mode (categorical). Simple but reduces variance and distorts relationships between features.
- **Forward/backward fill:** For time series, use the last known value (forward fill) or next known value (backward fill). Assumes values change slowly.
- **K-nearest neighbors imputation:** Impute using the average of the K most similar complete cases. Preserves relationships between features better than mean imputation.
- **Model-based imputation (MICE):** Multiple Imputation by Chained Equations. Iteratively predicts each missing feature from the others using a model. The gold standard for serious analysis.

**Indicator approach:**
- Create a binary feature "is_feature_X_missing" in addition to imputing the value. This lets the model learn whether missingness itself is informative. For example, if patients who didn't get a blood test are generally healthier (the doctor didn't order one), the missingness indicator captures this.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>The pattern of missingness is often informative. A customer who leaves the phone number field blank on a sign-up form might behave differently from one who provides it. Creating "is_missing" indicator features lets your model learn from the missingness pattern, not just the imputed values.</div>

## Outlier Detection and Handling

Outliers are data points that deviate significantly from the rest. They can be legitimate extreme values (a billionaire in an income dataset) or errors (a negative age, a temperature of 999 degrees).

### Detection Methods

**Statistical methods:**
- **Z-score:** Points more than 3 standard deviations from the mean. Assumes normal distribution.
- **IQR (Interquartile Range):** Points below Q1 - 1.5*IQR or above Q3 + 1.5*IQR. More robust to non-normal distributions.
- **Modified Z-score using MAD:** Uses median absolute deviation instead of standard deviation. Very robust.

**Visual methods:**
- Box plots, scatter plots, histograms
- Often the most effective first step -- your eyes are excellent anomaly detectors

**Model-based methods:**
- Isolation forests, DBSCAN (points labeled as noise)
- Useful for multivariate outliers that aren't extreme in any single feature

### Handling Strategies

**Remove:** If outliers are clearly errors (negative ages, impossible values), remove them.

**Cap/winsorize:** Replace extreme values with the 1st/99th percentile value. Preserves the point while reducing its influence.

**Transform:** Log transform or square root transform can reduce the impact of extreme values by compressing the scale.

**Keep:** If outliers are legitimate (that billionaire really exists), keep them. Some algorithms (linear regression) are very sensitive to outliers; others (tree-based methods, robust regression) handle them naturally.

<div class="callout callout-think"><div class="callout-title">Think About It</div>Before removing any outlier, ask: "Is this a data error or a genuine extreme observation?" Removing genuine extreme values biases your model toward the center of the distribution. A fraud detection system that removes all extreme transactions during training will never learn to detect large-scale fraud. Context matters enormously.</div>

## Data Validation

Systematic validation catches issues before they corrupt your model:

**Schema validation:**
- Are all expected columns present?
- Are data types correct (numbers aren't stored as strings)?
- Are categorical values within expected sets?

**Range checks:**
- Age should be between 0 and 120
- Percentages should be between 0 and 100
- Dates should be in a reasonable range

**Consistency checks:**
- End date should be after start date
- Total should equal sum of components
- Categorical relationships should hold (if country is "USA," state should be a US state)

**Duplicate detection:**
- Exact duplicates (identical rows)
- Near-duplicates (same entity with slight variations in name spelling)
- These can bias models by overweighting duplicated examples

## Common Data Quality Nightmares

Based on real-world experience, here are issues that trip up even experienced practitioners:

**Inconsistent encoding:** "Male," "male," "M," "m," "1," and "MALE" all meaning the same thing in a gender column.

**Mixed units:** Heights recorded in both inches and centimeters in the same column. Temperatures in both Fahrenheit and Celsius.

**Time zones:** Timestamps without timezone information. A transaction at "2024-03-15 14:00:00" means something very different in New York versus Tokyo.

**Data leakage from the future:** A feature that was computed using information that wouldn't be available at prediction time. For example, using "average customer rating" to predict first-purchase behavior -- but the average includes future ratings.

**Changed semantics:** A feature's meaning changes over time. "Product category = Electronics" might include smartphones in 2024 data but not in 2014 data (when that category didn't exist).

**Survivorship bias:** Your dataset only includes entities that survived some selection process. Training a model to predict startup success using only data from companies that lasted 5 years ignores all the companies that failed in year 1 -- dramatically biasing your conclusions.

<div class="callout callout-example"><div class="callout-title">Example</div>A financial institution built a credit scoring model that performed brilliantly on historical data but failed in production. The issue: the training data only included people who were *approved* for credit in the past. People who were denied (and might have been good borrowers) were absent. The model learned to distinguish good borrowers from bad borrowers among people who looked creditworthy enough to be approved -- a very different task from distinguishing among all applicants.</div>

## A Preprocessing Checklist

For every new dataset, work through this checklist:

1. **Understand the data:** What does each column represent? What are the units? How was it collected?
2. **Check data types:** Ensure columns are parsed correctly (dates as dates, numbers as numbers)
3. **Assess missing values:** How much? In which columns? What's the mechanism?
4. **Handle missing data:** Choose an appropriate strategy for each column
5. **Check for duplicates:** Remove exact duplicates; investigate near-duplicates
6. **Validate ranges:** Flag impossible or implausible values
7. **Standardize formats:** Consistent categories, units, date formats
8. **Examine distributions:** Plot histograms, look for outliers, check for skewness
9. **Check for target leakage:** Ensure no feature uses information from the future
10. **Document everything:** Record every transformation so results are reproducible

This methodical approach catches the vast majority of data quality issues before they silently corrupt your model.
`
		},
		{
			slug: 'feature-transformation',
			title: 'Feature Transformation',
			estimatedMinutes: 20,
			xpReward: 15,
			content: `
# Feature Transformation

Raw features are rarely in the optimal form for machine learning algorithms. A feature measured in dollars and one measured in kilometers have vastly different scales. A categorical feature like "country" can't be directly fed to a mathematical model. A highly skewed feature might obscure important patterns.

Feature transformation is the process of converting raw features into a form that algorithms can work with effectively. The right transformations can dramatically improve model performance -- sometimes more than switching algorithms.

## Scaling: Putting Features on Equal Footing

### Why Scaling Matters

Many algorithms compute distances between data points (KNN, SVM, K-Means) or use gradient-based optimization (linear regression, logistic regression, neural networks). When features have different scales, the large-scale features dominate.

Consider predicting apartment rent using two features: number of bedrooms (1-5) and square footage (200-5000). Without scaling, the distance between apartments is almost entirely determined by square footage because its range is 1000x larger. The number of bedrooms, despite being highly relevant, is effectively ignored.

<div class="callout callout-example"><div class="callout-title">Example</div>Imagine measuring similarity between people using two features: height in millimeters (1500-2000) and weight in kilograms (50-120). Without scaling, a height difference of 100mm (4 inches) contributes more to the distance than a weight difference of 50kg (110 lbs), even though the weight difference is far more significant. Scaling prevents this absurdity.</div>

<!-- interactive:ScatterPlotClassifier -->

### Standardization (Z-Score Scaling)

**x_scaled = (x - mean) / std_dev**

Transforms each feature to have mean = 0 and standard deviation = 1. After standardization, 68% of values fall between -1 and 1, and 95% between -2 and 2.

**When to use:** The default choice for most algorithms. Particularly important for algorithms that assume features are centered at zero (PCA, SVM, logistic regression). Handles outliers better than min-max scaling because it doesn't bound the range.

### Min-Max Normalization

**x_scaled = (x - min) / (max - min)**

Scales each feature to the range [0, 1] (or any desired range).

**When to use:** When you need bounded outputs (e.g., neural networks with sigmoid activations expect inputs in a specific range). When the feature has a known minimum and maximum. When outliers should be preserved relative to each other.

**Drawback:** A single extreme outlier compresses all other values into a tiny range. If your feature ranges from 1 to 100 but has one outlier at 10,000, after min-max scaling, 99.9% of your values will be between 0 and 0.01.

### Robust Scaling

**x_scaled = (x - median) / IQR**

Uses the median and interquartile range instead of mean and standard deviation. Much more robust to outliers because the median and IQR are resistant to extreme values.

**When to use:** When your data has significant outliers that you don't want to remove.

<div class="callout callout-warning"><div class="callout-title">Warning</div>Always fit the scaler on the training data only, then apply the same transformation to validation and test data. If you scale using statistics (mean, std, min, max) computed on the full dataset including the test set, you've leaked information from the test set into the training process. This is a form of data leakage that leads to overly optimistic performance estimates.</div>

### When Scaling Isn't Needed

Tree-based algorithms (decision trees, random forests, gradient boosting) are **invariant to monotonic feature transformations**. They split on threshold values and don't compute distances, so scaling doesn't affect them. This is one of the practical advantages of tree-based methods.

## Encoding Categorical Variables

Machine learning algorithms work with numbers, but many real-world features are categorical: country, product type, day of the week, blood type. These must be converted to numerical representations.

### One-Hot Encoding

Create a new binary column for each category. A "color" feature with values {red, green, blue} becomes three columns: is_red, is_green, is_blue. Each row has exactly one 1 and the rest 0.

**When to use:** The default for nominal categories (no natural ordering). Works well with most algorithms.

**Drawback:** High-cardinality features (e.g., zip code with 43,000 values) create 43,000 new columns, which is computationally expensive and can cause overfitting. For high cardinality, consider other encoding methods.

<div class="callout callout-think"><div class="callout-title">Think About It</div>One-hot encoding treats each category as equally different from every other. "New York" is as different from "New Jersey" as it is from "Tokyo." But geography tells us that New York and New Jersey are far more similar to each other than either is to Tokyo. One-hot encoding can't capture this. When similarity structure matters, consider embeddings or target encoding instead.</div>

### Ordinal Encoding

Assign integers based on a meaningful order. For education level: high school = 1, bachelor's = 2, master's = 3, PhD = 4. This preserves the ordering information.

**When to use:** When the categories have a natural, meaningful order. Rating scales (low/medium/high), education levels, satisfaction scores.

**Danger:** Don't use ordinal encoding for nominal categories. Assigning USA=1, France=2, Japan=3 implies that France is "between" USA and Japan, which is meaningless and misleading to the model.

### Target Encoding (Mean Encoding)

Replace each category with the average target value for that category. If average house price in zip code 10001 is $1.2M, replace all instances of zip code 10001 with 1.2M.

**When to use:** High-cardinality categorical features where one-hot encoding creates too many columns. Particularly effective for tree-based models.

**Danger:** Target encoding uses the target variable to create features, which creates a risk of **data leakage** and overfitting. Always use cross-validation or leave-one-out schemes to compute the target encoding, never the raw per-category mean from the full training set. A smoothed version (blending category mean with global mean, weighted by sample size) reduces overfitting for rare categories.

### Binary and Hash Encoding

**Binary encoding** represents categories as binary numbers. 10 categories need only 4 binary columns (since 2^4 = 16 > 10). This dramatically reduces dimensionality compared to one-hot encoding.

**Hash encoding** applies a hash function to category names and maps them to a fixed number of columns. Simple and handles unseen categories at prediction time, but collisions (different categories mapped to the same column) introduce noise.

## Log Transforms: Taming Skewed Distributions

Many real-world features have highly skewed distributions -- a long tail of extreme values. Income, house prices, word frequencies, and population sizes all follow roughly log-normal distributions.

**x_transformed = log(x + 1)** (the +1 handles zero values)

Log transformation compresses the scale of large values and expands the scale of small values, pulling the distribution toward normality.

**Why it helps:**

- Linear models assume (or work best when) features and residuals are roughly normally distributed. Log-transforming a skewed feature helps meet this assumption.
- It reduces the influence of extreme values without removing them (unlike outlier deletion).
- It makes multiplicative relationships additive: if doubling square footage doubles the price (multiplicative), log(price) vs log(sqft) becomes a linear relationship.

<div class="callout callout-example"><div class="callout-title">Example</div>House prices range from $50,000 to $50,000,000 -- a 1000x range. A linear model struggles with this because a $10,000 error matters a lot for a $50,000 house but is trivial for a $50M mansion. After log-transforming prices, the model works in "percentage error space," where a 10% error is equally penalized regardless of the absolute price. This is usually what we want.</div>

## Polynomial Features

Sometimes the relationship between features and the target isn't linear. Polynomial features let linear models capture nonlinear patterns.

From a single feature x, you can create: x^2, x^3, sqrt(x), 1/x

From two features x1 and x2, you can create interaction terms: x1*x2, x1^2, x2^2, x1^2*x2, etc.

**When to use:** When you suspect nonlinear relationships but want to stay within the linear modeling framework. When exploratory data analysis reveals curved patterns in scatter plots.

<div class="callout callout-warning"><div class="callout-title">Warning</div>Polynomial features grow combinatorially. With 10 original features and degree 3, you'd generate over 200 features. With 100 original features, you'd get millions. This creates a serious overfitting risk and computational burden. Use polynomial features sparingly, combined with regularization or feature selection.</div>

## Binning (Discretization)

Converting continuous features into discrete bins: age -> {young, middle-aged, senior}. This can capture non-linear effects with linear models and reduces the impact of outliers.

**Equal-width bins:** Fixed-width intervals (0-20, 20-40, 40-60). Simple but uneven distribution of points per bin.

**Equal-frequency bins (quantile binning):** Each bin has roughly the same number of data points. Better for skewed distributions.

**Custom bins based on domain knowledge:** Tax brackets, BMI categories, credit score ranges. Often the most meaningful approach.

**Trade-off:** Binning discards information (the difference between age 21 and 39 is lost if both are "young"). Use it when the discontinuity at bin boundaries is more meaningful than the continuous value, or when you need to discretize for a specific algorithm.

## Choosing the Right Transformations

The right transformation depends on your algorithm and your data:

| Algorithm | Scaling | Encoding | Log Transform |
|---|---|---|---|
| Linear/Logistic Regression | Required | One-hot or target | Often helpful |
| Decision Trees / Random Forest | Not needed | Ordinal or target | Not needed |
| Gradient Boosting | Not needed | Ordinal or target | Sometimes helpful |
| SVM | Required | One-hot | Often helpful |
| KNN | Required | One-hot | Sometimes helpful |
| Neural Networks | Required | One-hot or embeddings | Often helpful |

Remember: feature transformation is not a one-size-fits-all process. Each transformation embodies assumptions about the data and the algorithm. Understanding these assumptions -- and when they hold -- is what separates effective feature engineering from mechanical preprocessing.
`
		},
		{
			slug: 'feature-selection',
			title: 'Feature Selection',
			estimatedMinutes: 18,
			xpReward: 15,
			content: `
# Feature Selection

More features doesn't always mean better predictions. In fact, adding irrelevant or redundant features can *hurt* model performance through increased overfitting, slower training, and degraded interpretability. Feature selection is the process of identifying which features actually contribute to prediction and removing those that don't.

## Why Select Features?

**Curse of dimensionality:** As we've discussed, high-dimensional spaces are sparse. More features require exponentially more data to maintain the same statistical power.

**Overfitting reduction:** Every additional feature gives the model another dimension in which to find spurious patterns in the training data. Removing uninformative features reduces this risk.

**Faster training and inference:** Fewer features mean smaller matrices, faster computation, and lower memory usage. This matters in production systems handling millions of predictions per day.

**Improved interpretability:** A model with 10 meaningful features is far easier to understand and explain than one with 500 features, most of which contribute nothing.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>Feature selection is different from dimensionality reduction (PCA, UMAP). Feature selection keeps a subset of the original features -- they retain their names and interpretability. Dimensionality reduction creates new synthetic features (linear combinations of originals) -- they may be effective but are harder to interpret. Use feature selection when interpretability matters; use dimensionality reduction when it doesn't.</div>

## Filter Methods: Cheap and Fast Screening

Filter methods evaluate each feature independently (or in pairs) using statistical measures, without involving any machine learning model. They're fast, scalable, and model-agnostic.

### Correlation with the Target

For numerical features and a numerical target, compute the **Pearson correlation coefficient** between each feature and the target. Features with near-zero correlation are candidates for removal.

For categorical features, use the **chi-squared test** or **ANOVA F-test** to assess the association between each feature and the target.

**Strengths:** Very fast. Easy to understand. Good for removing clearly irrelevant features.

**Limitation:** Measures only linear, pairwise relationships. A feature might have zero correlation with the target individually but be highly predictive in combination with another feature (interaction effects). Filter methods miss these.

### Mutual Information

**Mutual information** measures how much knowing one variable tells you about another. Unlike correlation, it captures nonlinear relationships.

**I(X; Y) = 0:** X and Y are completely independent (knowing X tells you nothing about Y)
**I(X; Y) > 0:** X and Y share information (knowing X reduces uncertainty about Y)

Mutual information is more general than correlation but also more computationally expensive and requires choosing estimation parameters (number of neighbors for continuous variables).

<div class="callout callout-example"><div class="callout-title">Example</div>Consider predicting whether it will rain. The feature "humidity" has high mutual information with rain (they're strongly related). The feature "day of the week" has near-zero mutual information (rain doesn't care what day it is). But "barometric pressure change" might have low correlation with rain (it can go up or down) while having high mutual information (large changes in either direction predict rain). Mutual information captures this V-shaped relationship that correlation misses.</div>

### Variance Threshold

Remove features with very low variance. A feature that has the same value for 99% of examples provides almost no information. This is a simple preprocessing step that removes clearly useless features.

## Wrapper Methods: Let the Model Decide

Wrapper methods use a machine learning model's performance as the criterion for feature selection. They evaluate subsets of features by training a model and measuring its performance.

### Forward Selection

1. Start with no features
2. Add the feature that most improves model performance
3. Repeat until no further improvement is gained (or a desired number of features is reached)

At each step, you're asking: "Given the features I already have, which additional feature helps the most?"

### Backward Elimination

1. Start with all features
2. Remove the feature whose removal causes the least decrease (or most increase) in model performance
3. Repeat until performance drops below a threshold

At each step, you're asking: "Which feature can I remove with the least damage?"

### Recursive Feature Elimination (RFE)

A popular variant of backward elimination:

1. Train a model on all features
2. Rank features by importance (using model-specific measures like coefficient magnitude for linear models or feature importance for trees)
3. Remove the least important feature(s)
4. Repeat until the desired number of features is reached

RFE with cross-validation (RFECV) automatically determines the optimal number of features by evaluating performance at each step.

<div class="callout callout-warning"><div class="callout-title">Warning</div>Wrapper methods are computationally expensive. Forward selection with d features requires training d + (d-1) + (d-2) + ... = O(d^2) models. With cross-validation, this becomes O(d^2 * k) model trainings. For datasets with thousands of features, this can be prohibitively slow. Use filter methods for initial screening, then wrapper methods on the reduced feature set.</div>

## Embedded Methods: Selection During Training

Embedded methods perform feature selection as part of the model training process. They're more efficient than wrapper methods because selection happens in a single training run.

### L1 Regularization (Lasso)

L1 regularization adds the sum of absolute coefficient values as a penalty to the loss function:

**Loss = Original Loss + lambda * sum |w_i|**

The key property: L1 drives many coefficients to **exactly zero**. Features with zero coefficients are effectively removed. The regularization strength (lambda) controls how many features are zeroed out -- higher lambda means more aggressive selection.

This is one of the most elegant feature selection methods because it simultaneously trains the model and selects features. The features that survive with non-zero coefficients are the ones the model deems important.

### Tree-Based Feature Importance

Decision trees, random forests, and gradient boosting models provide natural measures of feature importance:

**Impurity-based importance:** How much each feature reduces impurity (Gini or entropy) across all splits in the tree (or averaged across all trees in an ensemble). Features that appear in more splits and closer to the root are more important.

**Permutation importance:** Randomly shuffle a feature's values and measure how much model performance degrades. If shuffling a feature doesn't hurt performance, it's not important. This method is model-agnostic (it works with any model) and more reliable than impurity-based importance.

<div class="callout callout-think"><div class="callout-title">Think About It</div>Impurity-based feature importance has a known bias: it favors high-cardinality features (features with many unique values). A random ID column would appear "important" because it can split data into many pure groups (each ID maps to one example). Permutation importance doesn't have this bias because shuffling a useless feature, regardless of cardinality, won't affect predictions on test data. When in doubt, use permutation importance.</div>

### ElasticNet: Best of Both Worlds

ElasticNet combines L1 and L2 regularization:

**Loss = Original Loss + lambda1 * sum |w_i| + lambda2 * sum w_i^2**

This gives you L1's feature selection (driving some coefficients to zero) with L2's ability to handle correlated features (L1 arbitrarily picks one from a group of correlated features; L2 shrinks them all). ElasticNet is the default choice when you want regularization-based feature selection with correlated features.

## A Practical Feature Selection Pipeline

1. **Remove zero-variance and near-zero-variance features** (filter -- fast and obvious)
2. **Remove highly correlated feature pairs** (if two features have correlation > 0.95, remove one -- they carry redundant information)
3. **Apply mutual information or chi-squared screening** to remove clearly irrelevant features (filter)
4. **Train a model with L1 regularization** and note which features survive (embedded)
5. **Use permutation importance** from a tree-based model to rank remaining features (embedded)
6. **Optionally apply RFE** for final fine-grained selection (wrapper)

This pipeline moves from fast, cheap methods to slower, more precise ones -- using each stage to narrow the feature set before applying more expensive methods.

## The Feature Selection - Performance Relationship

As you add features (from most to least informative), model performance typically follows this pattern:

1. **Rapid improvement:** The first few highly informative features dramatically improve predictions
2. **Diminishing returns:** Additional features help less and less
3. **Peak performance:** The optimal subset is reached
4. **Degradation:** Adding irrelevant features causes overfitting, hurting test performance

The goal of feature selection is to identify the peak -- the subset that maximizes test performance. In practice, a good approach is to be aggressive about removing features. The simplicity and robustness gained from a smaller feature set usually outweigh the marginal information lost.
`
		},
		{
			slug: 'handling-imbalanced-data',
			title: 'Handling Imbalanced Data',
			estimatedMinutes: 19,
			xpReward: 15,
			content: `
# Handling Imbalanced Data

You've built a fraud detection model and it achieves 99.5% accuracy. Your manager is thrilled. Then someone asks: "How many actual fraud cases did it catch?" The answer: zero. The model simply predicts "not fraud" for everything, and since only 0.5% of transactions are fraudulent, it's "correct" 99.5% of the time.

This is the class imbalance problem, and it's one of the most common and insidious challenges in real-world machine learning.

## Why Imbalance Matters

Class imbalance occurs when one class (the majority class) vastly outnumbers another (the minority class). Examples are everywhere:

- **Fraud detection:** 0.1-1% of transactions are fraudulent
- **Medical diagnosis:** Rare diseases affect 0.01% of the population
- **Manufacturing defects:** 0.5% of products are defective
- **Customer churn:** 5% of customers leave per month
- **Network intrusions:** 0.001% of connections are attacks

Standard ML algorithms are designed to minimize overall error. When 99% of examples are class A, predicting everything as class A achieves 99% accuracy. The algorithm learns the "correct" strategy -- but it's utterly useless for the minority class that you actually care about.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>Imbalanced data isn't just a technical nuisance -- it reflects a fundamental asymmetry in the real world. The minority class is almost always the one you care about most: the fraudulent transactions, the defective products, the sick patients. The majority class is the "boring" default. Your ML system must be specifically designed to handle this asymmetry.</div>

## The Fundamental Problem

Most ML algorithms optimize a loss function that treats all examples equally. When you compute cross-entropy loss or squared error, each training example contributes equally. With 1,000 normal examples and 10 fraud examples, the loss from the 1,000 normal examples completely overwhelms the 10 fraud examples. The algorithm learns to predict "normal" because that's what minimizes total loss.

The decision boundary gets pushed away from the majority class and into the minority class territory, making the model very conservative about predicting the minority class. Even examples that are clearly fraud get classified as normal because the model has been punished so many times for false positives on normal transactions.

## Resampling Approaches

### Oversampling the Minority Class

Create additional examples of the minority class to balance the dataset.

**Random oversampling:** Randomly duplicate minority class examples until the classes are balanced. Simple but risky -- exact duplicates can cause the model to overfit to specific minority examples rather than learning general patterns.

**SMOTE (Synthetic Minority Over-sampling Technique):** Instead of duplicating existing examples, SMOTE creates *new* synthetic examples by interpolating between existing minority examples:

1. For each minority example, find its K nearest minority neighbors
2. Randomly choose one neighbor
3. Create a new synthetic example at a random point on the line between the original and the chosen neighbor

<div class="callout callout-example"><div class="callout-title">Example</div>Imagine two fraudulent transactions: one for $150 at a gas station at 2 AM, another for $200 at a gas station at 3 AM. SMOTE might create a synthetic fraud example: $175 at a gas station at 2:30 AM. This is a plausible fraud pattern that adds diversity to the training data without just copying existing examples.</div>

**SMOTE variants:**

- **Borderline-SMOTE:** Only oversamples minority examples near the decision boundary (where they're most useful for the classifier)
- **ADASYN:** Generates more synthetic examples in regions where the minority class is harder to classify
- **SMOTE-ENN:** Applies SMOTE then cleans up with Edited Nearest Neighbors, removing ambiguous examples from both classes

<div class="callout callout-warning"><div class="callout-title">Warning</div>SMOTE operates in feature space, creating synthetic examples by linear interpolation. This assumes the feature space between two minority examples is meaningful. For high-dimensional sparse data (like text), this assumption often fails -- interpolating between two document vectors might produce a meaningless "document." Use SMOTE carefully and always evaluate whether the synthetic examples make sense.</div>

### Undersampling the Majority Class

Remove examples from the majority class to balance the dataset.

**Random undersampling:** Randomly remove majority class examples. Simple but discards potentially useful data. If you undersample from 10,000 majority examples to 100 (to match 100 minority examples), you've thrown away 99% of your majority data.

**Tomek Links:** Remove majority examples that form "Tomek links" -- pairs where a majority example and a minority example are each other's nearest neighbor. These are the most ambiguous majority examples that confuse the decision boundary. Removing them clarifies the boundary.

**Cluster-based undersampling:** Cluster the majority class and sample from each cluster proportionally. This preserves the diversity of the majority class even after reducing its size.

### Combined Approaches

The most effective resampling strategies often combine oversampling and undersampling:

- **SMOTE + Tomek Links:** Oversample minority with SMOTE, then clean up by removing Tomek links from the majority class
- **SMOTE + ENN:** Oversample with SMOTE, then remove any example (from either class) that is misclassified by its 3 nearest neighbors

## Algorithmic Approaches

### Class Weights

Instead of changing the data, change the algorithm. Most ML implementations support **class weights** that increase the penalty for misclassifying minority examples.

If fraud is 1% of the data, set class_weight = {normal: 1, fraud: 100}. Now the loss from one misclassified fraud example is equivalent to 100 misclassified normal examples. This forces the algorithm to take the minority class seriously.

In scikit-learn, most classifiers accept a class_weight parameter. Setting class_weight='balanced' automatically adjusts weights inversely proportional to class frequencies.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>Class weights are mathematically equivalent to oversampling the minority class in many cases (particularly for linear models). But they're more memory-efficient (no need to create synthetic data) and don't risk overfitting to specific duplicated examples. Class weights should be your first attempt at handling imbalance -- they're simple, effective, and available in almost every ML library.</div>

### Threshold Adjustment

Most classifiers output a probability (or score), and the class label comes from applying a threshold: predict positive if P > 0.5. But 0.5 is an arbitrary default that assumes balanced classes.

For imbalanced data, lower the threshold: predict fraud if P > 0.1. This catches more fraud (higher recall) at the cost of more false alarms (lower precision). The optimal threshold depends on the relative costs of false positives and false negatives.

Use the **precision-recall curve** to find the threshold that best matches your cost structure. The PR curve is more informative than the ROC curve for imbalanced data because the ROC's false positive rate is diluted by the large number of true negatives.

### Specialized Algorithms

Some algorithms are specifically designed for imbalanced data:

- **Balanced Random Forest:** Each tree is trained on a bootstrap sample where the majority class is undersampled to match the minority class
- **EasyEnsemble:** Trains multiple weak classifiers on different undersampled subsets and combines them
- **Cost-sensitive learning:** Explicitly models the different costs of different types of errors

## Evaluation Metrics for Imbalanced Data

Accuracy is meaningless for imbalanced data. Use these metrics instead:

**Precision-Recall AUC (PR-AUC):** Unlike ROC-AUC, PR-AUC focuses on the minority class and is sensitive to the imbalance ratio. It's the most informative single metric for imbalanced classification.

**F1 Score (or F-beta):** The harmonic mean of precision and recall. F-beta lets you weight recall more than precision (beta > 1) or vice versa (beta < 1). F2 is common in medical diagnosis where missing a positive is worse than a false alarm.

**Cohen's Kappa:** Measures agreement between predictions and actual labels, adjusted for chance agreement. Unlike accuracy, it accounts for the expected accuracy of a random classifier on imbalanced data.

**Matthews Correlation Coefficient (MCC):** Ranges from -1 to +1, with +1 being perfect, 0 being random, and -1 being perfectly wrong. Considered by many statisticians to be the most balanced metric for binary classification, even with imbalanced data.

<div class="callout callout-think"><div class="callout-title">Think About It</div>The "best" metric depends on the cost of errors in your domain. In medical screening, a false negative (missing a cancer) is far worse than a false positive (an unnecessary biopsy). In spam filtering, a false positive (blocking a legitimate email) might be worse than a false negative (letting some spam through). Quantify these costs before choosing your metric and threshold.</div>

## Practical Strategy for Imbalanced Data

Here's a battle-tested workflow:

1. **Don't panic.** Mild imbalance (60/40 or even 80/20) often doesn't need special treatment. Significant imbalance (95/5 or worse) does.

2. **Start with class weights.** Set class_weight='balanced' in your classifier. This is the simplest and most robust intervention.

3. **Use appropriate metrics.** Switch from accuracy to PR-AUC, F1, or MCC from the very beginning.

4. **Try SMOTE.** If class weights alone don't achieve sufficient minority class recall, apply SMOTE to the training data (never to the test data!).

5. **Tune the threshold.** Adjust the classification threshold based on the precision-recall curve and your domain's cost structure.

6. **Evaluate on original distribution.** Always evaluate on a test set with the original (imbalanced) class distribution. Resampling is only for training -- your test set must reflect reality.

7. **Use stratified splits.** When splitting data into train/test/validation, use stratified sampling to ensure each split has the same class proportions.

<div class="callout callout-warning"><div class="callout-title">Warning</div>Never apply resampling (SMOTE, oversampling, undersampling) to the test set. The test set must reflect the true data distribution to give honest performance estimates. Resampling is a training-time technique only. If you include resampling in a cross-validation pipeline, it must happen inside each fold, after the train/test split, not before.</div>

Handling imbalanced data is both an art and a science. The right approach depends on the degree of imbalance, the cost structure of errors, the amount of available data, and the algorithm you're using. But by combining class weights, appropriate metrics, and careful resampling, you can build models that perform well on the minority class that matters most.
`
		}
	],
	quiz: {
		questions: [
			{
				type: 'multiple-choice',
				id: 'feature-eng-q1',
				question: 'Why is feature engineering often more impactful than algorithm selection?',
				options: [
					'Because algorithms are all the same',
					'Because features encode domain knowledge that algorithms cannot discover from raw data alone',
					'Because feature engineering is faster than model training',
					'Because advanced algorithms are too complex to use'
				],
				correctIndex: 1,
				explanation:
					'Features are the language you use to communicate with your model. Well-engineered features encode domain knowledge about what factors drive the prediction, making the problem easier for any algorithm to solve. A simple model with great features almost always outperforms a complex model with poor features.'
			},
			{
				type: 'multiple-choice',
				id: 'feature-eng-q2',
				question:
					'When data is Missing Not at Random (MNAR), what is the key risk of simply deleting rows with missing values?',
				options: [
					'It makes the dataset too small',
					'It introduces systematic bias because the missing data is related to the missing values themselves',
					'It slows down training',
					'It changes the feature types'
				],
				correctIndex: 1,
				explanation:
					'When data is MNAR, the missingness is related to the unobserved values themselves (e.g., high earners not reporting income). Deleting these rows removes a systematically different subset of the population, biasing the remaining data and any models trained on it.'
			},
			{
				type: 'fill-in',
				id: 'feature-eng-q3',
				question:
					'The feature scaling technique that transforms features to have a mean of 0 and a standard deviation of 1 is called ___.',
				acceptedAnswers: [
					'standardization',
					'Standardization',
					'z-score scaling',
					'Z-score scaling',
					'standard scaling',
					'StandardScaler'
				],
				explanation:
					'Standardization (also called Z-score scaling) subtracts the mean and divides by the standard deviation: x_scaled = (x - mean) / std. This centers the feature at zero with unit variance, making it suitable for algorithms that are sensitive to feature scale.'
			},
			{
				type: 'multiple-choice',
				id: 'feature-eng-q4',
				question:
					'Why is one-hot encoding problematic for high-cardinality categorical features?',
				options: [
					'It cannot represent more than 10 categories',
					'It creates a very large number of new columns, increasing computational cost and overfitting risk',
					'It only works with numerical features',
					'It requires the categories to have a natural ordering'
				],
				correctIndex: 1,
				explanation:
					'One-hot encoding creates one binary column per category. A zip code feature with 43,000 values creates 43,000 columns, which is computationally expensive and increases overfitting risk due to the explosion in dimensionality. Target encoding or hash encoding are better alternatives for high-cardinality features.'
			},
			{
				type: 'multiple-choice',
				id: 'feature-eng-q5',
				question:
					'What distinguishes L1 regularization (Lasso) as a feature selection method?',
				options: [
					'It always selects the best features',
					'It drives many feature coefficients to exactly zero, effectively removing them from the model',
					'It increases the number of features',
					'It only works with tree-based models'
				],
				correctIndex: 1,
				explanation:
					'L1 regularization adds the sum of absolute coefficient values as a penalty. The mathematical properties of the L1 norm cause many coefficients to be driven to exactly zero during optimization, effectively removing those features from the model. This makes L1 an embedded feature selection method.'
			},
			{
				type: 'multiple-choice',
				id: 'feature-eng-q6',
				question: 'What does SMOTE (Synthetic Minority Over-sampling Technique) do?',
				options: [
					'Removes examples from the majority class',
					'Duplicates existing minority class examples exactly',
					'Creates new synthetic minority examples by interpolating between existing minority examples',
					'Adjusts the loss function to penalize minority misclassification more'
				],
				correctIndex: 2,
				explanation:
					'SMOTE creates synthetic minority examples by finding nearest neighbors within the minority class and generating new examples at random points along the line connecting a minority example to its neighbors. This adds diversity to the minority class without just duplicating existing examples.'
			},
			{
				type: 'multiple-choice',
				id: 'feature-eng-q7',
				question:
					'Which feature importance method is biased toward high-cardinality features and should be used with caution?',
				options: [
					'Permutation importance',
					'Impurity-based (Gini) importance from tree models',
					'L1 regularization coefficients',
					'Mutual information'
				],
				correctIndex: 1,
				explanation:
					'Impurity-based feature importance (using Gini or entropy) favors features with many unique values because they can create more pure splits. A random ID column would appear "important" by this measure. Permutation importance is more reliable because it measures actual impact on prediction performance.'
			},
			{
				type: 'multiple-choice',
				id: 'feature-eng-q8',
				question:
					'When handling imbalanced data, when should resampling techniques (like SMOTE) be applied?',
				options: [
					'To the entire dataset before any splitting',
					'Only to the training set, never to the validation or test sets',
					'Only to the test set to ensure fair evaluation',
					'Equally to all splits to maintain consistency'
				],
				correctIndex: 1,
				explanation:
					'Resampling must only be applied to the training data. The validation and test sets must reflect the true data distribution to provide honest performance estimates. If using cross-validation, resampling must happen inside each fold after the train/test split. Applying SMOTE before splitting leaks information and gives overly optimistic results.'
			}
		],
		passingScore: 6
	}
};

export default featureEngineering;
