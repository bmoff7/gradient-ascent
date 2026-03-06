import type { Module } from '../types';

const unsupervisedLearning: Module = {
	slug: 'unsupervised-learning',
	title: 'Unsupervised Learning',
	description:
		'Explore algorithms that discover hidden patterns in unlabeled data -- from clustering to dimensionality reduction to anomaly detection.',
	estimatedMinutes: 100,
	xpReward: 75,
	quizXpReward: 50,
	lessons: [
		{
			slug: 'finding-hidden-structure',
			title: 'Finding Hidden Structure',
			estimatedMinutes: 16,
			xpReward: 15,
			content: `
# Finding Hidden Structure

In supervised learning, every training example comes with a label -- a teacher telling the algorithm the right answer. Unsupervised learning has no such luxury. There are no labels, no correct answers, no teacher. Just raw data and the question: *what structure is hiding in here?*

This might sound like a weakness, but it's actually a superpower. The vast majority of the world's data is unlabeled. Every photo ever taken, every sensor reading, every financial transaction, every line of text on the internet -- almost none of it comes with neat labels attached. Unsupervised learning lets us extract value from this ocean of unlabeled data.

## What Does Unsupervised Learning Discover?

Without labels to guide it, unsupervised learning algorithms search for inherent patterns in the data itself. They answer questions like:

**"Are there natural groups in this data?"** -- Clustering. Customer segments, gene expression groups, document topics, social network communities.

**"Can I represent this data more compactly?"** -- Dimensionality reduction. Compressing 10,000 gene expression values into 50 latent factors, or visualizing 100-dimensional data in 2D.

**"What doesn't fit?"** -- Anomaly detection. Fraudulent transactions, manufacturing defects, network intrusions, equipment failures.

**"What goes together?"** -- Association rules. Products frequently bought together, symptoms that co-occur, actions that precede an event.

<div class="callout callout-example"><div class="callout-title">Example</div>Imagine you're an archaeologist who has unearthed thousands of pottery fragments. No one has classified these fragments before. You might naturally start grouping them by color, texture, thickness, and decorative pattern. You might notice that certain styles cluster together geographically or temporally. You might find that one fragment doesn't match any group -- perhaps it's from a different civilization entirely. That's unsupervised learning: discovering structure without anyone telling you what to look for.</div>

## The Fundamental Challenge: No Ground Truth

In supervised learning, you know when your model is right because you have labels to compare against. In unsupervised learning, how do you evaluate whether the discovered structure is meaningful?

This is the central philosophical and practical challenge of unsupervised learning. A clustering algorithm will always produce clusters -- even for completely random data. How do you know whether those clusters represent real structure or statistical noise?

Several approaches help:

- **Internal validation metrics:** Measure cluster quality using properties like compactness (how tight are the clusters?) and separation (how distinct are they?). The silhouette score, for example, measures how similar each point is to its own cluster compared to neighboring clusters.

- **External validation:** If you have some labels (even for a subset), you can check whether the discovered clusters align with known categories.

- **Domain expert evaluation:** Show the results to someone who understands the data. Do the customer segments make business sense? Do the gene clusters have biological significance?

- **Downstream utility:** Does the unsupervised representation improve a downstream task? If using cluster assignments as features improves a supervised model, the clusters probably capture real structure.

<div class="callout callout-think"><div class="callout-title">Think About It</div>Consider organizing a music library. An unsupervised algorithm might cluster songs by tempo, key, and spectral features. The resulting clusters might loosely correspond to genres -- but they might also cut across genres in unexpected ways, grouping a jazz piece with an electronic track because they share similar rhythmic patterns. Is this wrong? Not necessarily -- it's a different valid organization that might reveal connections a genre-based system would miss.</div>

## Real-World Applications

Unsupervised learning is everywhere, often working behind the scenes:

### Customer Segmentation
E-commerce companies segment millions of customers into groups based on purchasing behavior, browsing patterns, and demographics. These segments drive personalized marketing, pricing strategies, and product development. No human could manually categorize millions of customers -- but clustering algorithms can, finding segments that humans might never have conceived of.

### Recommendation Systems
Collaborative filtering -- the algorithm behind "customers who bought this also bought..." -- is fundamentally unsupervised. It discovers patterns in user-item interactions without being told what makes a good recommendation. The algorithm learns that users who rate science fiction books highly also tend to enjoy certain video games, even though no one explicitly labeled this connection.

### Genomics and Drug Discovery
Genes with similar expression patterns across different conditions are likely involved in similar biological processes. Clustering gene expression profiles has led to the discovery of cancer subtypes, drug targets, and gene regulatory networks. Dimensionality reduction techniques help researchers visualize and understand high-dimensional genomic data.

### Cybersecurity
Network intrusion detection systems use anomaly detection to identify unusual patterns in network traffic. Since attackers constantly develop new strategies, it's impossible to write rules for every attack. Instead, the system learns what "normal" traffic looks like and flags deviations. This unsupervised approach can catch novel attacks that signature-based systems would miss.

### Natural Language Processing
Topic modeling discovers the underlying themes in large text collections. Given thousands of news articles, an algorithm might discover topics like "technology," "politics," "sports," and "health" -- without being told these categories exist. Word embeddings (Word2Vec, GloVe) use unsupervised learning to discover that "king" is to "queen" as "man" is to "woman" by analyzing patterns of word co-occurrence.

## The Relationship to Supervised Learning

Unsupervised and supervised learning aren't competitors -- they're collaborators. Some of the most powerful ML pipelines use unsupervised learning as a preprocessing step for supervised tasks:

1. **Feature extraction:** Use unsupervised learning to create compact, informative features, then feed those features to a supervised model. Autoencoders, PCA, and clustering assignments all serve as feature extractors.

2. **Data augmentation:** For semi-supervised learning, unsupervised methods can leverage the large pool of unlabeled data to improve supervised models trained on small labeled datasets.

3. **Exploratory data analysis:** Before building any supervised model, clustering and visualization help you understand the data's structure, identify potential problems, and generate hypotheses.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>Unsupervised learning is not "inferior" to supervised learning -- it solves fundamentally different problems. Supervised learning predicts known categories; unsupervised learning discovers unknown structure. Many of the most impactful applications of ML -- from understanding gene function to detecting financial fraud to powering recommendation engines -- rely on unsupervised methods.</div>

## What Lies Ahead

In the following lessons, we'll explore the most important unsupervised learning algorithms:

- **K-Means Clustering:** The simplest and most widely used clustering algorithm
- **Hierarchical and Density-Based Clustering:** More flexible approaches for different data shapes
- **Dimensionality Reduction:** Techniques to compress and visualize high-dimensional data
- **Anomaly Detection and Association:** Finding what doesn't fit and what goes together

Each algorithm embodies a different assumption about what "structure" means in data. Understanding these assumptions -- and when they hold -- is the key to applying unsupervised learning effectively.
`
		},
		{
			slug: 'k-means-clustering',
			title: 'K-Means Clustering',
			estimatedMinutes: 20,
			xpReward: 15,
			content: `
# K-Means Clustering

K-Means is the Swiss Army knife of clustering: simple, fast, and surprisingly effective for a wide range of problems. Its goal is to partition n data points into K clusters, where each point belongs to the cluster with the nearest center. The algorithm is so intuitive that you could explain it to a child, yet it powers applications from customer segmentation to image compression to astronomical survey analysis.

## The Algorithm: Step by Step

The K-Means algorithm alternates between two steps, starting from random initial positions:

**Step 0: Initialization.** Choose K initial cluster centers (centroids). The simplest approach is to randomly select K data points as initial centroids.

**Step 1: Assignment.** For each data point, compute its distance to every centroid. Assign each point to the nearest centroid. This creates K clusters.

**Step 2: Update.** For each cluster, compute the new centroid as the mean (average position) of all points assigned to that cluster.

**Repeat steps 1 and 2** until the centroids stop moving (or move less than some threshold), or until a maximum number of iterations is reached.

That's it. Two alternating steps -- assign and update -- and the algorithm converges to a solution.

<div class="callout callout-example"><div class="callout-title">Example</div>Imagine you're organizing a large conference and need to assign 500 attendees to 5 lunch tables. You randomly pick 5 attendees as "table captains" (initialization). Each attendee sits at the table whose captain shares the most similar interests (assignment). Then each table elects a new captain who best represents the group's average interests (update). People might switch tables to be closer to the new captain. After a few rounds, the tables stabilize into coherent interest groups. That's K-Means.</div>

<!-- interactive:KMeansLab -->

## Why Does It Work?

K-Means is minimizing a specific objective function called the **within-cluster sum of squares (WCSS)** or **inertia**:

**WCSS = sum over all clusters sum over points in cluster ||x_i - centroid_k||^2**

Each assignment step minimizes WCSS with respect to the assignments (assigning each point to the nearest centroid). Each update step minimizes WCSS with respect to the centroid positions (the mean minimizes squared distance). Since each step reduces or maintains WCSS, and WCSS is bounded below by zero, the algorithm is guaranteed to converge.

<div class="callout callout-warning"><div class="callout-title">Warning</div>K-Means is guaranteed to converge, but not to the global optimum. It finds a local minimum of the WCSS, which may or may not be the best possible clustering. Different random initializations can lead to different solutions, some much better than others. Always run K-Means multiple times with different initializations and keep the best result.</div>

## Choosing K: How Many Clusters?

K-Means requires you to specify K upfront -- the number of clusters. But often, you don't know how many natural groups exist in your data. Several methods help:

### The Elbow Method

Run K-Means for K = 1, 2, 3, ..., and plot WCSS against K. WCSS always decreases as K increases (more clusters means smaller distances to centroids). But typically, the decrease is steep at first and then levels off. The "elbow" -- the point where the rate of decrease sharply changes -- suggests a natural K.

Think of it like diminishing returns: going from 1 cluster to 2 dramatically reduces WCSS because you're separating two distinct groups. Going from 50 to 51 hardly helps because you're splitting an already coherent group. The elbow is where meaningful separation stops.

### The Silhouette Method

For each data point, the **silhouette score** measures:

**s(i) = (b(i) - a(i)) / max(a(i), b(i))**

Where a(i) is the average distance to other points in the same cluster (cohesion), and b(i) is the average distance to points in the nearest neighboring cluster (separation). The score ranges from -1 to 1:

- Close to +1: the point is well inside its cluster and far from others (good)
- Close to 0: the point is near a cluster boundary (ambiguous)
- Close to -1: the point is probably in the wrong cluster (bad)

The average silhouette score across all points gives an overall measure of clustering quality. Choose K to maximize this average.

### Domain Knowledge

Sometimes the best answer isn't statistical -- it's practical. If you're segmenting customers for a marketing team that can handle exactly 4 different campaigns, K=4 is the right answer regardless of what the elbow method says. The "right" number of clusters often depends on what's actionable.

## Limitations of K-Means

K-Means makes strong assumptions that limit where it works well:

### Spherical Clusters

K-Means uses Euclidean distance and assumes clusters are roughly spherical (round) and equally sized. It struggles with:

- **Elongated clusters:** A crescent-shaped cluster will be split into multiple round pieces
- **Clusters of different sizes:** K-Means tends to equalize cluster sizes, potentially splitting a large natural cluster into pieces
- **Clusters of different densities:** Dense and sparse clusters are treated equally

<div class="callout callout-think"><div class="callout-title">Think About It</div>Imagine two groups of people standing in a park: one group forms a tight circle and the other spreads out in a long line. K-Means with K=2 might split the line in half rather than separating the circle from the line, because its "nearest centroid" logic doesn't understand elongated shapes. For such data, density-based algorithms like DBSCAN are more appropriate.</div>

### Sensitivity to Initialization

Bad initial centroids can lead to poor clusterings. If two initial centroids land in the same natural cluster, that cluster will be split and another cluster might be merged.

### K-Means++ Initialization

The **K-Means++** algorithm dramatically improves initialization:

1. Choose the first centroid randomly from the data points
2. For each subsequent centroid, choose a data point with probability proportional to its squared distance from the nearest existing centroid
3. Repeat until K centroids are chosen

This spreads initial centroids across the data, making it far less likely that two centroids land in the same natural cluster. K-Means++ is now the default in most implementations and should always be preferred over random initialization.

### Sensitivity to Outliers

A single extreme outlier can pull a centroid far from the actual cluster center, distorting the entire clustering. Consider removing or capping outliers before running K-Means, or use more robust variants like K-Medoids (which uses actual data points as centers rather than means).

## Practical Applications

**Image compression:** Reduce the number of colors in an image by clustering pixels into K color groups and replacing each pixel's color with its cluster centroid. An image with millions of unique colors can be compressed to just K colors with minimal visual quality loss.

**Customer segmentation:** Cluster customers by purchasing behavior (frequency, recency, monetary value -- the "RFM" framework) to create targeted marketing strategies.

**Document clustering:** Represent documents as TF-IDF vectors and cluster them to discover topic groups in a corpus.

**Feature engineering:** Use cluster assignments as features in a supervised model. The "distance to cluster center" for each cluster can capture non-linear patterns.

**Preprocessing for other algorithms:** Use K-Means to create a codebook for bag-of-visual-words models in computer vision, or to initialize more sophisticated algorithms.

## Scaling K-Means

For very large datasets, even K-Means can be slow. **Mini-batch K-Means** updates centroids using small random samples rather than the full dataset at each step. This is much faster and produces results nearly as good as standard K-Means. It's the go-to for datasets with millions or billions of points.

K-Means is often the first clustering algorithm you should try. Its simplicity makes it fast to run and easy to interpret. When it works, it works beautifully. When it doesn't, its failure modes (elongated clusters, unequal sizes) point you toward more sophisticated alternatives, which we'll explore next.
`
		},
		{
			slug: 'hierarchical-density-clustering',
			title: 'Hierarchical and Density-Based Clustering',
			estimatedMinutes: 22,
			xpReward: 15,
			content: `
# Hierarchical and Density-Based Clustering

K-Means is fast and intuitive, but its assumptions -- spherical clusters of similar size -- often don't hold in real data. Natural groupings can be nested, elongated, ring-shaped, or have vastly different densities. This lesson explores two families of algorithms that handle these complexities: hierarchical clustering, which reveals nested structure at multiple scales, and density-based clustering, which finds clusters of arbitrary shape.

## Agglomerative Hierarchical Clustering

Agglomerative clustering takes a bottom-up approach: start with each data point as its own cluster, then repeatedly merge the two most similar clusters until everything belongs to a single cluster.

**The algorithm:**

1. Start: each data point is its own cluster (N clusters for N points)
2. Compute pairwise distances between all clusters
3. Merge the two closest clusters into one
4. Repeat steps 2-3 until only one cluster remains (or until you reach the desired number of clusters)

The result is a tree-like hierarchy of clusters. You can cut the tree at any level to get different numbers of clusters, which is a key advantage over K-Means -- you don't have to specify K upfront.

### Linkage: Defining "Closest" Between Clusters

When a cluster contains multiple points, "distance between clusters" is ambiguous. Different definitions lead to different behaviors:

**Single linkage:** Distance between the closest points of two clusters. Tends to create elongated, chain-like clusters. Can handle non-spherical shapes but is sensitive to noise (a single stray point can bridge two clusters).

**Complete linkage:** Distance between the farthest points of two clusters. Produces compact, spherical clusters. More robust to noise but cannot handle elongated shapes.

**Average linkage:** Average distance between all pairs of points in the two clusters. A compromise between single and complete linkage.

**Ward's linkage:** Minimizes the total within-cluster variance. Tends to produce equally sized, spherical clusters, similar to K-Means. Often the best default choice.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>The choice of linkage method is as important as the algorithm itself. Single linkage finds elongated clusters but is noise-sensitive. Complete linkage is noise-robust but forces spherical shapes. Ward's method is the most commonly used default because it produces interpretable, compact clusters. There is no universally best linkage -- it depends on the shape of your data.</div>

## Dendrograms: Visualizing the Hierarchy

The entire merging history can be visualized as a **dendrogram** -- a tree diagram where:

- Leaves at the bottom represent individual data points
- Branches represent merges
- The height of each merge represents the distance at which the two clusters were joined

To get a specific number of clusters, you "cut" the dendrogram at a chosen height. A horizontal line across the dendrogram at height h intersects branches -- the number of intersections is the number of clusters.

<div class="callout callout-example"><div class="callout-title">Example</div>Imagine a family tree, but for data points instead of people. At the bottom, every point is an individual. Moving up, similar points merge into small groups (like siblings), then small groups merge into larger ones (like extended families), until everything is one big group at the top. Cutting the tree at different heights gives you different levels of granularity: individuals, families, clans, nations.</div>

**Reading a dendrogram:**

- Large vertical gaps between merges suggest natural cluster boundaries (the algorithm had to bridge a large distance)
- Tight clusters that merge at low heights are well-separated groups
- The height at which a merge occurs indicates how dissimilar the merged clusters were

### Advantages of Hierarchical Clustering

- **No need to pre-specify K:** The dendrogram shows all possible numbers of clusters simultaneously
- **Reveals nested structure:** Some natural groupings are hierarchical (species taxonomy, organizational charts)
- **Deterministic:** No random initialization means the same data always produces the same result

### Disadvantages

- **O(n^2) to O(n^3) complexity:** Computing all pairwise distances is expensive. Not practical for datasets with more than ~10,000-50,000 points.
- **No reassignment:** Once two points are merged, they can never be separated. An early bad merge propagates through the entire hierarchy.
- **Sensitive to noise and outliers** (especially with single linkage)

## DBSCAN: Density-Based Spatial Clustering of Applications with Noise

DBSCAN takes a fundamentally different approach to clustering. Instead of measuring distances between cluster centers (K-Means) or building a hierarchy of merges, DBSCAN defines clusters as **dense regions of points separated by sparse regions.**

Think of it like identifying islands: land (dense regions) is separated by water (sparse regions). The shape of each island doesn't matter -- it can be round, elongated, crescent-shaped, or any arbitrary form. What matters is that it's a connected region of high density.

### Key Concepts

DBSCAN uses two parameters:

- **eps (epsilon):** The radius of the neighborhood around each point
- **min_samples:** The minimum number of points within radius eps for a point to be considered "core"

Three types of points:

- **Core points:** Have at least min_samples points within eps distance. These form the interior of clusters.
- **Border points:** Within eps of a core point but don't have min_samples neighbors themselves. They're on the cluster edge.
- **Noise points:** Neither core nor border. These are outliers that don't belong to any cluster.

### The Algorithm

1. Pick an unvisited point
2. Find all points within eps distance
3. If there are at least min_samples points, start a new cluster:
   - Add all points in the neighborhood to the cluster
   - For each core point added, also explore *its* eps-neighborhood, adding new points to the cluster (this is the "density-reachable" expansion)
   - Continue until no more density-reachable points can be found
4. If there are fewer than min_samples points, mark the point as noise (it might later be claimed as a border point by another cluster)
5. Pick the next unvisited point and repeat

<div class="callout callout-think"><div class="callout-title">Think About It</div>DBSCAN is like a forest fire spreading through dry brush. It starts at a point (the ignition), and if there's enough fuel nearby (dense points within eps), the fire spreads. It keeps spreading to any connected dense region, but it cannot jump across sparse gaps (water or clearings). Each connected region of burned area is a cluster. Isolated trees that the fire can't reach are noise.</div>

### Strengths of DBSCAN

- **Arbitrary cluster shapes:** Can find elongated, ring-shaped, or any non-convex cluster
- **Automatic noise detection:** Outliers are explicitly identified as noise points, not forced into a cluster
- **No need to specify K:** The number of clusters is determined by the data and parameters
- **Robust to outliers:** Noise points don't affect cluster shapes

### Weaknesses of DBSCAN

- **Struggles with varying densities:** If one cluster is much denser than another, a single eps value can't capture both. The dense cluster might be merged or the sparse cluster might be entirely classified as noise.
- **Sensitive to eps and min_samples:** Poor parameter choices lead to poor results. Finding good values requires experimentation.
- **High-dimensional data:** Like KNN, distances become less meaningful in very high dimensions.

<div class="callout callout-warning"><div class="callout-title">Warning</div>DBSCAN's performance depends critically on the eps parameter. Too small and most points are noise (no clusters form). Too large and distinct clusters merge into one. A useful technique for choosing eps: plot the sorted k-nearest-neighbor distances for all points. The "elbow" in this plot suggests a good eps value, where k equals min_samples.</div>

## HDBSCAN: The Best of Both Worlds

**Hierarchical DBSCAN (HDBSCAN)** addresses DBSCAN's biggest weakness: sensitivity to the eps parameter and inability to handle clusters of varying density.

HDBSCAN runs DBSCAN across a range of eps values and builds a hierarchy of clusters. It then uses a notion of cluster stability (how long a cluster persists across different eps values) to extract the most meaningful flat clustering. Dense clusters that persist across many scales are kept; transient clusters are merged or classified as noise.

Key advantages over DBSCAN:
- **Handles varying densities:** Different clusters can have different densities
- **Fewer parameters to tune:** The main parameter is min_cluster_size (the minimum number of points in a cluster), which is more intuitive than eps
- **More robust results:** Less sensitive to parameter choices

HDBSCAN has become the go-to density-based clustering algorithm in practice and should generally be preferred over vanilla DBSCAN.

## Comparing Clustering Approaches

| Method | Cluster Shape | K Required? | Handles Noise? | Handles Varying Density? | Scalability |
|---|---|---|---|---|---|
| K-Means | Spherical | Yes | No | Poorly | Excellent |
| Hierarchical | Depends on linkage | Optional (cut dendrogram) | Poorly | Somewhat | Poor (O(n^2+)) |
| DBSCAN | Arbitrary | No | Yes | Poorly | Good |
| HDBSCAN | Arbitrary | No | Yes | Yes | Good |

### Choosing the Right Algorithm

- **K-Means:** Your data has roughly spherical, equally-sized clusters and you know K. Fast and simple.
- **Hierarchical:** You want to explore cluster structure at multiple scales, or your data has natural hierarchical organization. Small to medium datasets.
- **DBSCAN:** Clusters are non-spherical and you expect outliers. Similar density across clusters.
- **HDBSCAN:** The most flexible choice. Handles arbitrary shapes, varying densities, and outliers. The best default for exploratory clustering.

In practice, start with K-Means for a quick baseline (it's fast and gives you something to compare against), then try HDBSCAN if K-Means's assumptions are violated. Use hierarchical clustering when the dendrogram itself is valuable for understanding data structure.
`
		},
		{
			slug: 'dimensionality-reduction',
			title: 'Dimensionality Reduction',
			estimatedMinutes: 22,
			xpReward: 15,
			content: `
# Dimensionality Reduction

Real-world datasets often have many features -- potentially hundreds, thousands, or even millions. A genomics dataset might measure the expression levels of 20,000 genes. A text dataset might have a vocabulary of 100,000 words. A digital image is a vector of millions of pixel values. Working directly with such high-dimensional data is computationally expensive, prone to overfitting, and impossible to visualize.

Dimensionality reduction addresses this by finding a lower-dimensional representation that preserves the important information in the data while discarding noise and redundancy.

## The Curse of Dimensionality

We've encountered this phrase before, but it deserves a deeper treatment. As the number of dimensions increases, several counterintuitive things happen:

**Data becomes sparse.** In 1D, 10 points cover a line segment densely. In 10D, 10 points are lost in a hypercube with 10^10 possible grid positions. To maintain the same density, the number of points must grow exponentially with dimensions.

**Distances become meaningless.** In high dimensions, the distances between all pairs of points converge to approximately the same value. The nearest neighbor and the farthest neighbor are almost equidistant. This breaks distance-based algorithms like KNN, K-Means, and DBSCAN.

**Volume concentrates in shells.** In high dimensions, most of the volume of a hypersphere is concentrated near its surface. This means random data points in a high-dimensional space tend to lie near the surface of any enclosing shape, not spread uniformly throughout.

<div class="callout callout-example"><div class="callout-title">Example</div>Consider a unit hypercube (each side ranges from 0 to 1). The "inner" region where every coordinate is between 0.1 and 0.9 has volume 0.8^d, where d is the number of dimensions. In 1D, this inner region is 80% of the total. In 10D, it's 0.8^10 = 10.7%. In 100D, it's 0.8^100 = practically zero. Almost all points in a high-dimensional cube are near an edge or corner. The "center" is virtually empty.</div>

Dimensionality reduction fights the curse by projecting data into a lower-dimensional space where distances are meaningful, data is dense enough for algorithms to work, and visualization is possible.

## PCA: Finding the Axes of Maximum Variance

**Principal Component Analysis (PCA)** is the most widely used dimensionality reduction technique. Its core idea is elegant: find the directions in which the data varies the most, and project the data onto those directions.

### The Intuition

Imagine a cloud of data points in 3D space that is shaped like a thin, elongated pancake. The pancake is wide in two directions and very thin in the third. If you project this cloud onto the wide plane (discarding the thin dimension), you lose almost no information because the data barely varied in that direction anyway. PCA formalizes this intuition.

### How PCA Works

1. **Center the data:** Subtract the mean of each feature so the data is centered at the origin
2. **Compute the covariance matrix:** This captures how each pair of features varies together
3. **Find eigenvectors and eigenvalues:** The eigenvectors of the covariance matrix are the **principal components** -- the directions of maximum variance. The eigenvalues indicate how much variance each direction captures.
4. **Project:** Choose the top k principal components (those with the largest eigenvalues) and project the data onto these directions

The first principal component (PC1) is the direction of maximum variance. PC2 is the direction of maximum variance orthogonal to PC1. PC3 is orthogonal to both, and so on. Each subsequent component captures less variance.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>PCA answers the question: "If I could only describe my data using k numbers instead of d numbers (where k << d), which k directions would preserve the most information?" The answer is the k principal components with the largest eigenvalues. The total variance explained by these k components, relative to the total variance, tells you how much information you've retained.</div>

### Choosing the Number of Components

Plot the cumulative explained variance ratio against the number of components. If the first 10 components explain 95% of the variance in a 1000-dimensional dataset, you can reduce to 10 dimensions while losing only 5% of the information. The threshold you choose (90%, 95%, 99%) depends on your application.

### Limitations of PCA

- **Linearity:** PCA finds linear combinations of original features. If the important structure is nonlinear (data lies on a curved surface), PCA will miss it.
- **Variance != importance:** PCA maximizes variance, but the direction of maximum variance isn't always the most informative for your task. A feature with huge variance might be noise.
- **Interpretability:** Principal components are linear combinations of all original features, making them hard to interpret. "The first component is 0.3 * gene_A + 0.2 * gene_B - 0.1 * gene_C + ..." isn't as meaningful as individual gene names.

## t-SNE: Visualizing High-Dimensional Data

**t-Distributed Stochastic Neighbor Embedding (t-SNE)** is specifically designed for visualization -- reducing high-dimensional data to 2D or 3D for human inspection.

### How t-SNE Works (Intuitively)

t-SNE tries to preserve the **local neighborhood structure** of the data. Points that are close in high-dimensional space should be close in the low-dimensional embedding, and points that are far apart should stay far apart.

1. In the high-dimensional space, compute pairwise similarities between all points (using a Gaussian kernel -- nearby points have high similarity, distant points have low similarity)
2. In the low-dimensional space, initialize points randomly
3. Iteratively move points in the low-dimensional space to match the high-dimensional similarity structure, using a different distribution (Student's t-distribution, hence the "t" in t-SNE) for computing low-dimensional similarities

The t-distribution has heavier tails than the Gaussian, which helps prevent the "crowding problem" -- in low dimensions, there isn't enough room for moderately distant points, so t-SNE uses the heavier tails to push dissimilar points further apart.

### Reading t-SNE Plots

t-SNE produces beautiful visualizations that often reveal clear cluster structure. But they must be interpreted carefully:

<div class="callout callout-warning"><div class="callout-title">Warning</div>t-SNE has several traps for the unwary. (1) Cluster sizes are meaningless -- t-SNE expands dense clusters and compresses sparse ones. (2) Distances between clusters are not meaningful -- two clusters that appear far apart might be equally similar. (3) Different runs with different random seeds or perplexity values can produce very different visualizations. (4) The perplexity parameter (roughly, the number of neighbors to consider) significantly affects the result. Always try multiple perplexity values (5, 30, 50, 100).</div>

t-SNE is excellent for **exploratory visualization** but should never be used for quantitative analysis. It's a tool for generating hypotheses about data structure, not for confirming them.

## UMAP: A Modern Alternative

**Uniform Manifold Approximation and Projection (UMAP)** is a newer technique that offers several advantages over t-SNE:

- **Faster:** Significantly faster for large datasets, scaling well to millions of points
- **Better global structure preservation:** While t-SNE excels at local structure, UMAP better preserves the relationships between clusters (which clusters are similar to each other)
- **Mathematically principled:** Based on Riemannian geometry and algebraic topology (though you don't need to understand the math to use it)
- **Works for general dimensionality reduction:** Not limited to 2D/3D visualization like t-SNE; UMAP can reduce to any number of dimensions and the results can be used as features in downstream models

UMAP has largely replaced t-SNE as the default visualization tool in many domains, particularly in single-cell genomics, NLP, and computer vision.

### Key Parameters

- **n_neighbors:** Controls the balance between local and global structure. Small values focus on local structure, large values on global structure.
- **min_dist:** Controls how tightly points are packed in the embedding. Smaller values create tighter clusters.

## When and Why to Reduce Dimensions

**Visualization (2-3D):** t-SNE or UMAP for exploration; PCA for quick overview

**Preprocessing for ML (10-100D):** PCA to remove noise, reduce computation, and fight the curse of dimensionality before running other algorithms

**Compression and storage:** PCA to compress data while retaining most information

**Noise reduction:** By keeping only the top principal components, you discard the low-variance directions that often correspond to noise

<div class="callout callout-think"><div class="callout-title">Think About It</div>Dimensionality reduction is an art of deciding what to throw away. PCA throws away directions of low variance. t-SNE throws away global distance information to preserve local neighborhoods. UMAP tries to balance both. The "right" technique depends on what you consider important in your data and what you plan to do with the reduced representation.</div>

The power of dimensionality reduction lies in the observation that most real-world data lies on a low-dimensional manifold embedded in the high-dimensional feature space. A face image might have millions of pixels, but the space of "images that look like faces" is a tiny, curved surface within the space of all possible pixel configurations. Dimensionality reduction finds and parameterizes that surface.
`
		},
		{
			slug: 'anomaly-detection-association',
			title: 'Anomaly Detection and Association',
			estimatedMinutes: 20,
			xpReward: 15,
			content: `
# Anomaly Detection and Association

Not all unsupervised learning is about finding groups or reducing dimensions. Two other important tasks are finding what *doesn't fit* (anomaly detection) and discovering what *goes together* (association rules). These techniques power fraud detection systems, quality control processes, recommendation engines, and more.

## Anomaly Detection: Finding the Oddballs

An **anomaly** (also called an outlier, novelty, or aberration) is a data point that significantly differs from the majority of the data. Anomaly detection is the task of identifying these unusual observations.

The key insight is that you often don't have labeled examples of anomalies. Fraudsters constantly invent new schemes. Manufacturing defects take unexpected forms. Cyberattacks evolve to evade detection. This makes anomaly detection fundamentally unsupervised -- you learn what "normal" looks like and flag deviations.

### Why Anomaly Detection Matters

The consequences of missed anomalies can be severe:

- **Financial fraud:** Billions of dollars in losses annually
- **Medical diagnosis:** Detecting rare conditions before they become critical
- **Manufacturing:** Catching defective products before they reach customers
- **Cybersecurity:** Identifying network intrusions and data breaches
- **Infrastructure monitoring:** Predicting equipment failure before it happens

### Isolation Forests

**Isolation forests** are based on a brilliantly simple observation: anomalies are easier to isolate than normal points.

Think about it this way: if you randomly pick a feature and randomly pick a split value for that feature, how many splits does it take to isolate a single data point? For a normal point deep in a dense cluster, you need many splits to carve away all its neighbors. For an anomaly sitting far from everything else, a single split might isolate it completely.

**The algorithm:**

1. Build many random trees (an "isolation forest"), where each tree randomly selects features and split points
2. For each data point, measure its average path length across all trees (how many splits to isolate it)
3. Points with short average path lengths are anomalies (easily isolated)
4. Points with long average path lengths are normal (hard to isolate)

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>Most anomaly detection methods try to model what "normal" looks like, which is hard in high dimensions. Isolation forests flip the problem: instead of characterizing normal data, they directly identify anomalies by how easy they are to separate. This inversion makes isolation forests fast, scalable, and effective in high-dimensional spaces.</div>

**Advantages:**
- Fast training and prediction (O(n log n))
- Works well in high dimensions
- No need to define or compute distances
- Handles both local and global anomalies

### One-Class SVM

A **one-class SVM** learns a boundary around the normal data in feature space. Points inside the boundary are normal; points outside are anomalies.

The algorithm projects data into a high-dimensional space (using a kernel, typically RBF) and finds the smallest hypersphere that encloses most of the data. The parameter nu controls what fraction of training points are allowed to fall outside the boundary (the expected contamination rate).

<div class="callout callout-example"><div class="callout-title">Example</div>Imagine plotting all normal network traffic patterns on a 2D map. They form an irregular blob. One-class SVM draws a tight boundary around this blob. Any new traffic pattern that falls outside the boundary is flagged as a potential intrusion. The beauty is that you only need examples of normal traffic -- you don't need to have seen every possible type of attack.</div>

**When to use one-class SVM:**
- You have clean training data (mostly normal examples)
- The normal data has a clear boundary in feature space
- The dataset is small to medium-sized (SVMs don't scale well)

### Autoencoders for Anomaly Detection

An **autoencoder** is a neural network that learns to compress data into a compact representation and then reconstruct it. When trained on normal data, the autoencoder learns to reconstruct normal patterns well but fails to reconstruct anomalies (because it's never seen anything like them).

**The approach:**
1. Train an autoencoder on normal data only
2. For each new data point, compute the **reconstruction error** (how different is the output from the input)
3. High reconstruction error indicates an anomaly

This is particularly powerful for complex, high-dimensional data like images, time series, or network traffic. The autoencoder essentially learns a compressed model of "normal" and anything that doesn't fit that model is flagged.

<div class="callout callout-think"><div class="callout-title">Think About It</div>Imagine a musician who has only ever heard classical music. If you play them a classical piece, they can hum it back pretty accurately (low reconstruction error). If you play them death metal, their attempt to reproduce it would be hilariously wrong (high reconstruction error). That high error reveals that the input is anomalous relative to their experience. That's exactly how autoencoders detect anomalies.</div>

### Choosing an Anomaly Detection Method

| Method | Best For | Strengths | Weaknesses |
|---|---|---|---|
| Isolation Forest | General purpose | Fast, scalable, works in high dimensions | Less interpretable |
| One-Class SVM | Small datasets with clear boundaries | Strong theoretical basis | Doesn't scale, sensitive to kernel choice |
| Autoencoder | Complex, high-dimensional data | Handles images, sequences, etc. | Requires more tuning, needs neural network expertise |
| Statistical methods (Z-score, IQR) | Univariate data, simple cases | Simple, interpretable | Only works for low-dimensional data |

## Association Rules: Discovering What Goes Together

Association rule mining discovers interesting relationships between items in transactional databases. The classic application is **market basket analysis** -- understanding what products customers buy together.

### Core Concepts

Given a database of transactions (each containing a set of items), association rules have the form:

**{bread, butter} -> {milk}**

Meaning: customers who buy bread and butter also tend to buy milk.

Three key metrics define the quality of a rule:

**Support:** How frequently the item set appears in all transactions.
- support({bread, butter, milk}) = (transactions containing all three) / (total transactions)
- High support means the pattern is common

**Confidence:** How often the rule is correct.
- confidence({bread, butter} -> {milk}) = support({bread, butter, milk}) / support({bread, butter})
- If confidence is 0.8, then 80% of transactions with bread and butter also include milk

**Lift:** How much more likely the items are bought together compared to independently.
- lift = confidence / support({milk})
- Lift > 1: items are positively associated (bought together more than chance)
- Lift = 1: items are independent
- Lift < 1: items are negatively associated (buying one makes the other less likely)

<div class="callout callout-example"><div class="callout-title">Example</div>A grocery store finds: {diapers} -> {beer} with confidence 0.6 and lift 2.3. This means 60% of diaper buyers also buy beer, and they're 2.3x more likely to buy beer than the average shopper. The store might place beer near the diaper aisle or offer a joint promotion. This famous (possibly apocryphal) example illustrates how association rules can reveal non-obvious patterns that drive business decisions.</div>

### The Apriori Algorithm

Finding all interesting association rules is computationally challenging because the number of possible item combinations grows exponentially. The **Apriori algorithm** makes this tractable using a key observation: **if an item set is infrequent, all its supersets must also be infrequent.**

If {caviar} appears in only 0.01% of transactions, then {caviar, champagne} must appear in at most 0.01% as well. This "anti-monotone" property lets us prune the search space aggressively:

1. Find all individual items with support above the minimum threshold
2. Generate candidate pairs from frequent individuals. Keep only pairs above the threshold.
3. Generate candidate triples from frequent pairs. Keep only triples above the threshold.
4. Continue until no more frequent item sets are found
5. Generate rules from frequent item sets and filter by confidence and lift

At each step, infrequent item sets are pruned, dramatically reducing the search space.

### Modern Alternatives

The **FP-Growth** algorithm improves on Apriori by building a compressed data structure (the FP-tree) that eliminates the need for candidate generation. It's significantly faster and is the preferred algorithm in modern implementations.

### Applications Beyond Market Baskets

Association rules aren't limited to shopping:

- **Medical diagnosis:** Symptoms that frequently co-occur may suggest a common underlying condition
- **Web usage mining:** Sequences of pages commonly visited together can improve website navigation
- **Bioinformatics:** Genes that are frequently co-expressed might be part of the same pathway
- **Recommendation systems:** "Users who liked X also liked Y"

<div class="callout callout-warning"><div class="callout-title">Warning</div>Association rules find correlations, not causation. Just because diapers and beer are frequently purchased together doesn't mean buying diapers causes a craving for beer. The association might be driven by a confounding variable (parents doing the weekly grocery run who happen to buy both). Always apply domain knowledge before acting on association rules.</div>

## Putting It Together

Anomaly detection and association rules might seem like niche techniques, but they're among the most directly actionable outputs of unsupervised learning. A clustering analysis might tell you "here are your customer segments" (interesting but requires further work to act on), while anomaly detection says "this transaction is suspicious -- block it" (immediately actionable) and association rules say "put these products together -- you'll sell more" (directly profitable).

These techniques thrive in the unsupervised setting because their targets -- anomalies and associations -- are defined relative to the data itself, not to external labels. The data contains the signal; the algorithms extract it.
`
		}
	],
	quiz: {
		questions: [
			{
				type: 'multiple-choice',
				id: 'unsupervised-q1',
				question: 'What is the primary difference between supervised and unsupervised learning?',
				options: [
					'Unsupervised learning is always less accurate',
					'Unsupervised learning works with unlabeled data, discovering hidden patterns without target variables',
					'Supervised learning requires more data',
					'Unsupervised learning cannot be used for real-world applications'
				],
				correctIndex: 1,
				explanation:
					'Unsupervised learning works with data that has no labels or target variables. Instead of learning to predict known outputs, it discovers hidden structure, patterns, and groupings in the data itself.'
			},
			{
				type: 'ordering',
				id: 'unsupervised-q2',
				question: 'Put the steps of the K-Means algorithm in the correct order:',
				items: [
					'Assign each point to nearest centroid',
					'Check for convergence',
					'Initialize K centroids',
					'Recompute centroids as cluster means'
				],
				correctOrder: [2, 0, 3, 1],
				explanation:
					'K-Means follows these steps: (1) Initialize K centroids (randomly or with K-Means++), (2) Assign each point to the nearest centroid, (3) Recompute centroids as the mean of assigned points, (4) Check for convergence (repeat 2-4 if not converged).'
			},
			{
				type: 'multiple-choice',
				id: 'unsupervised-q3',
				question:
					'What is the main advantage of DBSCAN over K-Means?',
				options: [
					'DBSCAN is always faster',
					'DBSCAN can find clusters of arbitrary shape and automatically identifies noise points',
					'DBSCAN requires fewer parameters',
					'DBSCAN always produces better clusters'
				],
				correctIndex: 1,
				explanation:
					'DBSCAN defines clusters as dense regions separated by sparse regions, allowing it to find arbitrarily shaped clusters (crescents, rings, elongated shapes) that K-Means cannot handle. It also naturally identifies noise points (outliers) rather than forcing every point into a cluster.'
			},
			{
				type: 'fill-in',
				id: 'unsupervised-q4',
				question:
					'In PCA, the directions of maximum variance in the data are called ___ components.',
				acceptedAnswers: ['principal', 'Principal', 'PRINCIPAL'],
				explanation:
					'Principal Component Analysis (PCA) finds the principal components -- the orthogonal directions along which the data has maximum variance. The first principal component captures the most variance, the second captures the most remaining variance orthogonal to the first, and so on.'
			},
			{
				type: 'multiple-choice',
				id: 'unsupervised-q5',
				question: 'Why should t-SNE visualizations be interpreted with caution?',
				options: [
					't-SNE is always inaccurate',
					'Cluster sizes, distances between clusters, and global structure in t-SNE plots are not meaningful',
					't-SNE can only handle small datasets',
					't-SNE requires labeled data to work properly'
				],
				correctIndex: 1,
				explanation:
					't-SNE preserves local neighborhood structure but distorts global structure. Cluster sizes are equalized (not reflective of true density), distances between clusters are not meaningful, and different random seeds or perplexity values can produce very different visualizations. Use t-SNE for exploration, not quantitative analysis.'
			},
			{
				type: 'multiple-choice',
				id: 'unsupervised-q6',
				question:
					'How do isolation forests detect anomalies?',
				options: [
					'By computing the distance of each point to its nearest neighbor',
					'By measuring how many random splits are needed to isolate each point -- anomalies need fewer splits',
					'By building a neural network to reconstruct the data',
					'By computing the density around each point'
				],
				correctIndex: 1,
				explanation:
					'Isolation forests exploit the fact that anomalies are easier to isolate than normal points. Using random feature selections and random splits, anomalies are isolated in fewer steps (shorter path length) because they are far from normal data concentrations. Points with short average path lengths across many random trees are flagged as anomalies.'
			},
			{
				type: 'multiple-choice',
				id: 'unsupervised-q7',
				question:
					'In association rule mining, what does a lift value greater than 1 indicate?',
				options: [
					'The rule has high confidence',
					'The items are purchased together more often than would be expected by chance',
					'The rule is statistically significant',
					'The items are negatively associated'
				],
				correctIndex: 1,
				explanation:
					'Lift measures how much more likely items are bought together compared to independently. Lift > 1 means positive association (items co-occur more than chance). Lift = 1 means independence. Lift < 1 means negative association (buying one makes the other less likely).'
			},
			{
				type: 'multiple-choice',
				id: 'unsupervised-q8',
				question:
					'Which dimensionality reduction technique is generally best for preserving both local and global structure in the reduced representation?',
				options: ['PCA', 't-SNE', 'UMAP', 'Random projection'],
				correctIndex: 2,
				explanation:
					'UMAP (Uniform Manifold Approximation and Projection) preserves both local neighborhood structure and global relationships between clusters better than t-SNE (which focuses on local structure) or PCA (which is limited to linear structure). UMAP is also faster and can be used for general dimensionality reduction, not just visualization.'
			}
		],
		passingScore: 6
	}
};

export default unsupervisedLearning;
