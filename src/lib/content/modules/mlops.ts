import type { Module } from '../types';

const mlops: Module = {
	slug: 'mlops',
	title: 'MLOps: From Lab to Production',
	description:
		'Master the practices and tools for deploying, monitoring, and maintaining machine learning systems in production environments.',
	estimatedMinutes: 85,
	xpReward: 75,
	quizXpReward: 50,
	lessons: [
		{
			slug: 'the-mlops-challenge',
			title: 'The MLOps Challenge',
			content: `# The MLOps Challenge

There is a running joke in the machine learning community: "Most ML projects never make it to production." It is not really a joke. By various industry estimates, 60-90% of ML models that show promising results in research or prototyping never get deployed in a way that delivers business value. The gap between a working Jupyter notebook and a reliable production system is vast, and MLOps exists to bridge it.

## Why ML in Production Is Different from Research

In a research environment, success means a good score on a benchmark dataset. In production, success means delivering reliable value to users around the clock, for months or years, while the world changes around you.

Here is what changes:

**Data is not static.** In research, you download a dataset and it stays the same. In production, data flows continuously. Customer behavior changes, new products launch, external events shift patterns. The data your model sees next month may look nothing like the data it trained on.

**The model is not the product.** A deployed model is embedded in a larger system: data pipelines, APIs, user interfaces, monitoring dashboards, fallback mechanisms. The model might be 5% of the code but 95% of the complexity.

**Failures are costly.** A model that misclassifies a benchmark image loses a point on a leaderboard. A model that misclassifies a transaction as non-fraudulent loses real money. A model that misdiagnoses a medical condition endangers a life.

**Many stakeholders.** Research involves researchers. Production involves data engineers, software engineers, DevOps, product managers, legal teams, and executives. Each has different requirements and speaks a different language.

## The MLOps Lifecycle

MLOps (Machine Learning Operations) adapts DevOps principles for ML systems. The lifecycle is a continuous loop:

1. **Data collection and preparation** -- Gather, clean, and validate training data.
2. **Feature engineering** -- Transform raw data into features the model can use.
3. **Model training** -- Train and tune models using experiments tracked systematically.
4. **Model evaluation** -- Validate against business metrics, not just ML metrics.
5. **Model deployment** -- Serve the model to users via APIs, batch jobs, or embedded systems.
6. **Monitoring** -- Track model performance, data quality, and system health in production.
7. **Retraining** -- When performance degrades, update the model with fresh data and redeploy.

This loop runs continuously. A model deployed today may need retraining in weeks or months as the world changes. The infrastructure must support this iteration efficiently and reliably.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>MLOps is not about any single tool -- it is about establishing a discipline of reproducibility, automation, and monitoring for ML systems. The best MLOps setup is the one your team can actually maintain. Start simple, automate the painful parts, and add complexity only when the pain justifies it.</div>

## Technical Debt in ML Systems

A landmark 2015 Google paper titled "Hidden Technical Debt in Machine Learning Systems" identified unique sources of technical debt in ML:

- **Data dependencies**: Your model depends not just on code but on data that changes. A change in an upstream data source can silently break your model. Unlike code dependencies, data dependencies are often undeclared and invisible.
- **Feedback loops**: In recommendation systems, the model's predictions influence user behavior, which becomes future training data. The model trains on data it partially generated. This can create self-reinforcing biases that are hard to detect and harder to fix.
- **Configuration debt**: ML systems have many knobs -- learning rates, feature selections, data preprocessing steps, serving thresholds. These configurations often live outside version control and are poorly documented.
- **Entanglement**: Changing one feature can affect the behavior of all features (CACE principle: Changing Anything Changes Everything). You cannot isolate and fix one input without potentially affecting all outputs.
- **Undeclared consumers**: Other systems may start depending on your model's output without your knowledge. Changing your model can break downstream systems you didn't know existed.

<div class="callout callout-warning"><div class="callout-title">Warning</div>Technical debt in ML systems is often invisible because the system continues to function -- it just produces subtly worse results. Unlike a software bug that crashes the application, a degraded model silently serves bad predictions. By the time you notice, the damage may already be significant.</div>

## The "Last Mile" Problem

Getting a model from "it works on my machine" to "it works reliably in production" is the last mile problem. It encompasses:

- **Environment differences**: The model was developed on a data scientist's laptop with specific library versions. Production runs on different hardware with different software stacks.
- **Scale**: The model was tested on thousands of examples. Production serves millions of requests per day.
- **Latency requirements**: The model took 2 seconds to make a prediction in the notebook. The API has a 100ms latency budget.
- **Error handling**: What happens when the model receives malformed input? What happens when a dependency fails? What happens when the model is uncertain?
- **Regulatory compliance**: Can you explain why the model made a specific decision? Can you prove it treats all demographic groups fairly? Can you show an audit trail?

MLOps is the discipline that solves these problems systematically. Over the next lessons, we will explore the tools and practices that make reliable ML production systems possible.`,
			estimatedMinutes: 16,
			xpReward: 15
		},
		{
			slug: 'data-pipelines',
			title: 'Data Pipelines',
			content: `# Data Pipelines

Models are only as good as their data. In production, data doesn't just sit in a CSV file -- it flows through complex pipelines that collect, clean, transform, validate, and deliver it. Building reliable data pipelines is arguably the most important (and least glamorous) part of MLOps.

## Data Versioning

In software engineering, you version your code with Git. In ML, you also need to version your data. Why?

- **Reproducibility**: If you can't recreate the exact dataset a model was trained on, you can't reproduce or debug its behavior.
- **Rollback**: If new training data causes model degradation, you need to revert to the previous dataset.
- **Comparison**: Understanding why Model v2 performs differently from Model v1 often requires comparing their training data.

**DVC (Data Version Control)** is the most popular tool for data versioning. It works alongside Git: Git tracks code and DVC configuration files, while DVC tracks large data files and stores them in remote storage (S3, GCS, Azure Blob). A \`.dvc\` file in your Git repo acts as a pointer to the actual data, so you can check out any historical version of your code and automatically get the matching data.

Other approaches include:
- **Delta Lake / LakeFS**: Git-like versioning for data lakes.
- **Pachyderm**: Combines data versioning with pipeline orchestration.
- **Database snapshots**: Periodic snapshots of production databases used for training.

<div class="callout callout-example"><div class="callout-title">Example</div>A fraud detection team discovers their model's precision dropped last week. Using DVC, they compare the current training dataset with the previous version and discover that a data pipeline change introduced a new transaction type that wasn't labeled correctly. Without data versioning, this debugging process would take days instead of hours.</div>

## Feature Stores

A **feature store** is a centralized repository for storing, managing, and serving features for ML models. Instead of each model team independently computing features from raw data (leading to duplicated work, inconsistent definitions, and training-serving skew), a feature store provides a single source of truth.

Key components of a feature store:
- **Feature definitions**: Code that transforms raw data into features, versioned and documented.
- **Offline store**: Historical feature values for training. Supports point-in-time queries (what were this user's features on March 1st?) to prevent data leakage.
- **Online store**: Low-latency access to current feature values for real-time serving.
- **Feature registry**: Catalog of available features with metadata, ownership, and lineage.

Popular feature stores include **Feast** (open-source), **Tecton**, **Hopsworks**, and managed options from cloud providers. Major tech companies (Uber's Michelangelo, Airbnb's Zipline, Spotify's feature store) built custom solutions long before open-source alternatives existed.

## Data Validation and Monitoring

Data in production can go wrong in countless ways:
- An upstream system changes its schema, adding or removing columns.
- A sensor malfunctions and sends constant zero values.
- A third-party data provider changes their formatting.
- A software bug introduces null values where there were none before.

**Data validation** catches these issues before they corrupt your model. Tools like **Great Expectations** and **TensorFlow Data Validation** let you define expectations about your data:

- Column types and ranges (age should be 0-120, not -1 or 999).
- Distributions (the mean of feature X should be within 2 standard deviations of its historical mean).
- Completeness (no more than 1% null values in critical columns).
- Schema (exactly these columns should exist with these types).

Validation should run automatically on every data pipeline execution. When a check fails, the pipeline halts and alerts the team rather than silently feeding bad data to the model.

## ETL for ML

**ETL (Extract, Transform, Load)** pipelines for ML have specific requirements beyond traditional data engineering:

- **Feature computation**: Aggregating raw events into features (e.g., "number of purchases in the last 30 days" from a stream of purchase events).
- **Point-in-time correctness**: When constructing training data, you must use only features that were available at the time the label was generated. Using future data (data leakage) produces misleadingly optimistic results that don't hold in production.
- **Reproducibility**: The same pipeline run on the same input data must produce identical output. Non-deterministic transformations (random sampling, timestamps) must be controlled.

Pipeline orchestration tools like **Apache Airflow**, **Prefect**, **Dagster**, and **Kubeflow Pipelines** manage the execution of multi-step pipelines, handling scheduling, dependencies, retries, and monitoring.

## Streaming vs. Batch Data

ML systems must handle two fundamentally different data patterns:

**Batch processing** collects data over a period (hourly, daily, weekly) and processes it all at once. Training data preparation is almost always batch: collect a dataset, process it, train a model. Batch processing is simpler, more debuggable, and handles large volumes efficiently.

**Stream processing** handles data as it arrives, event by event. Real-time features (a user's activity in the last 5 minutes) require stream processing. Technologies like **Apache Kafka**, **Apache Flink**, and **Apache Spark Streaming** enable feature computation on data streams.

The challenge is maintaining consistency between batch-computed features for training and stream-computed features for serving. If training uses a 30-day rolling average computed in batch, but serving computes it slightly differently in a stream, the model encounters a distribution mismatch. This **training-serving skew** is one of the most common and insidious bugs in production ML systems.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>The most common cause of model failures in production is not the model itself -- it is data issues. Bad data, stale data, missing data, data with changed semantics. Investing in robust data pipelines with validation, versioning, and monitoring pays dividends far larger than any model architecture improvement.</div>`,
			estimatedMinutes: 18,
			xpReward: 15
		},
		{
			slug: 'model-training-infrastructure',
			title: 'Model Training Infrastructure',
			content: `# Model Training Infrastructure

Research-stage training is informal: run a script, check the results, tweak parameters, repeat. Production-stage training must be systematic, reproducible, and efficient. This lesson covers the infrastructure that makes professional model training possible.

## Experiment Tracking

Data scientists run dozens or hundreds of experiments while developing a model. Without systematic tracking, you end up with a file system full of model checkpoints named \`model_v2_final_FINAL_really_final.pkl\` and no idea which hyperparameters produced which results.

**Experiment tracking tools** solve this by automatically logging:
- **Parameters**: Learning rate, batch size, model architecture, feature set, data version.
- **Metrics**: Training loss, validation accuracy, F1 score, AUC -- tracked over time.
- **Artifacts**: Trained model files, evaluation plots, confusion matrices.
- **Environment**: Python version, library versions, GPU type, random seeds.
- **Code version**: Git commit hash.

**MLflow** is the most widely adopted open-source experiment tracker. Its Tracking API logs experiments to a central server with a web UI for comparing runs. You can filter, sort, and visualize experiments to identify the best-performing configurations.

**Weights & Biases (W&B)** is a popular commercial alternative with a polished UI, real-time experiment dashboards, and collaborative features. It excels at visualization -- loss curves, parameter importance plots, and interactive tables of experiment results.

Other options include **Neptune**, **Comet ML**, and **TensorBoard** (focused on visualization rather than full experiment management).

<div class="callout callout-example"><div class="callout-title">Example</div>A team training a recommendation model runs 200 experiments over two weeks, varying the embedding dimension, learning rate, number of layers, and training data window. With MLflow, they can instantly filter to experiments with validation AUC above 0.85, sort by training time, and identify that a specific combination of parameters achieves the best tradeoff between accuracy and efficiency. Without tracking, this analysis would require manually reading log files and spreadsheets.</div>

## Distributed Training

Modern models can be too large or too slow to train on a single GPU. **Distributed training** spreads the computation across multiple GPUs or machines.

### Data Parallelism

The most common strategy. Each GPU holds a complete copy of the model. The training batch is split across GPUs, each computes gradients on its portion, and gradients are averaged before updating the model weights. Frameworks like PyTorch's DistributedDataParallel and TensorFlow's MirroredStrategy make this relatively straightforward.

Data parallelism scales well but has limits: each GPU must hold the entire model in memory. For models with billions of parameters, this becomes impossible.

### Model Parallelism

When the model itself doesn't fit on a single GPU, split it across devices. Different layers (or different parts of layers) run on different GPUs. This is more complex to implement and requires careful engineering to minimize communication overhead between devices.

### Pipeline Parallelism

Combines model parallelism with pipelining: while GPU 1 processes the forward pass of microbatch 2, GPU 2 processes the forward pass of microbatch 1. This keeps all GPUs busy, reducing the idle time inherent in naive model parallelism.

Libraries like **DeepSpeed** (Microsoft), **FSDP** (Fully Sharded Data Parallel, PyTorch), and **Megatron-LM** (NVIDIA) provide production-ready implementations of these strategies. Training large language models typically combines all three approaches.

## GPU/TPU Management

Training hardware is expensive and scarce. Managing it efficiently matters:

- **GPU clusters**: Organizations run shared GPU clusters where teams submit training jobs. Resource managers like **SLURM** or **Kubernetes** allocate GPUs to jobs based on priority and availability.
- **Cloud GPUs**: AWS, GCP, and Azure offer GPU instances on demand. **Spot/preemptible instances** offer 60-90% discounts but can be interrupted at any time -- training code must support checkpointing and resumption.
- **TPUs**: Google's Tensor Processing Units are custom chips optimized for ML workloads. They offer excellent performance-per-dollar for certain model architectures, particularly those with large matrix multiplications. TPUs are available through Google Cloud.
- **Mixed precision training**: Using 16-bit (half precision) instead of 32-bit (full precision) floating point numbers approximately doubles throughput and halves memory usage with minimal accuracy impact. Most modern training uses mixed precision by default.

## Reproducibility

"I can't reproduce the results from last month's best model" is a terrifyingly common statement. Reproducibility requires controlling every source of non-determinism:

- **Random seeds**: Set seeds for Python, NumPy, PyTorch/TensorFlow, and CUDA. Note that some GPU operations are inherently non-deterministic; full reproducibility may require enabling deterministic mode at a performance cost.
- **Data ordering**: Shuffling order must be controlled by the seed.
- **Library versions**: Pin exact versions of all dependencies. A minor version bump in a library can change model behavior.
- **Hardware**: Results can differ between GPU architectures (V100 vs A100) due to different floating-point implementations.
- **Environment**: Use containers (Docker) to freeze the entire software environment.

<div class="callout callout-warning"><div class="callout-title">Warning</div>Perfect reproducibility across different hardware is often impossible due to floating-point arithmetic differences. Aim for "close reproducibility" -- results within a small tolerance -- and document the exact hardware and software environment for any result that matters.</div>

## Configuration Management

ML experiments have many moving parts: model architecture, hyperparameters, data paths, preprocessing steps, training schedules. Managing these configurations is critical.

**Hydra** (by Facebook) is a popular configuration framework that lets you compose configurations from modular YAML files, override them from the command line, and sweep over parameter combinations. Instead of hardcoding \`learning_rate = 0.001\` in your training script, you define it in a config file that is versioned, composable, and overridable.

The principle is simple: every aspect of your training run should be specified in configuration (not code), version-controlled, and logged alongside the experiment results. If you can't recreate an experiment from its logged configuration, your tracking is incomplete.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>The goal of training infrastructure is not to make individual experiments faster (though that helps). It is to make the entire experimentation loop -- hypothesize, implement, run, analyze, iterate -- as efficient and reliable as possible. The team that can run and analyze 100 well-tracked experiments per week will consistently outperform the team that runs 10 ad-hoc experiments per week, regardless of the cleverness of any individual experiment.</div>`,
			estimatedMinutes: 17,
			xpReward: 15
		},
		{
			slug: 'model-deployment',
			title: 'Model Deployment',
			content: `# Model Deployment

You have trained a model. It performs well on validation data. Now what? Getting it in front of users -- serving predictions reliably, efficiently, and safely -- is a discipline unto itself.

## Serving Patterns

Different applications require different serving strategies:

### Batch Serving

Compute predictions for a large dataset at regular intervals. A recommendation engine might recompute product recommendations for all users every night. A risk model might score all loan applications accumulated during the day.

**Advantages**: Simple infrastructure (just a script and a scheduler). Can use large, slow models. Easy to debug (rerun the batch). Cost-efficient (compute only when needed).

**Disadvantages**: Results are stale between batch runs. Cannot handle real-time requests. Not suitable for interactive applications.

### Real-Time Serving

The model runs as an always-on service that responds to individual requests in milliseconds. A fraud detection model that evaluates every credit card transaction as it happens. A search ranking model that scores results for every query.

**Advantages**: Fresh predictions. Enables interactive applications. Predictions use the latest available data.

**Disadvantages**: Requires low-latency infrastructure. Must handle load spikes. Requires high availability. More expensive to operate.

### Streaming Serving

A hybrid approach where the model processes a continuous stream of events. As each event arrives, the model makes a prediction and publishes it downstream. Used in IoT applications, network monitoring, and real-time analytics.

## Model Serialization

Before deployment, the model must be serialized -- converted from an in-memory Python object to a portable file format:

- **ONNX (Open Neural Network Exchange)**: Framework-agnostic format. Train in PyTorch, deploy with ONNX Runtime (which is optimized for inference speed). Supports a wide range of operators and is well-suited for production deployment.
- **TorchScript**: PyTorch's format for serializing models, enabling deployment without Python.
- **SavedModel**: TensorFlow's standard export format, used by TensorFlow Serving.
- **Pickle/Joblib**: Common for scikit-learn models. Simple but Python-specific and version-sensitive.

Model optimization during serialization can dramatically improve serving performance:
- **Quantization**: Convert 32-bit float weights to 8-bit integers. 4x smaller model, 2-4x faster inference, with typically less than 1% accuracy loss.
- **Pruning**: Remove near-zero weights from the model, reducing size and computation.
- **Graph optimization**: Fuse operations, eliminate redundant computations, optimize memory layout.

## Containerization

**Docker** containers package the model, its dependencies, and the serving code into a self-contained, reproducible unit. The container that works on your laptop works identically on the production server.

A typical ML serving container includes:
- The serialized model file.
- A web server (Flask, FastAPI, or a specialized serving framework).
- All Python dependencies at pinned versions.
- Any system-level dependencies (CUDA libraries for GPU inference).

**Kubernetes** orchestrates these containers in production: scaling up when traffic increases, restarting containers that crash, rolling out updates without downtime, and distributing load across servers.

<div class="callout callout-example"><div class="callout-title">Example</div>A production ML serving setup: FastAPI web server in a Docker container, deployed on Kubernetes with 3 replicas behind a load balancer. Horizontal pod autoscaler adds replicas when CPU usage exceeds 70%. Readiness probes ensure traffic is only routed to containers that have finished loading the model. Rolling updates deploy new model versions without any downtime.</div>

## API Design for ML

ML serving APIs have unique design considerations:

- **Input validation**: Validate that input features are within expected ranges and have correct types before running inference. A null value in a critical feature should return an informative error, not a garbage prediction.
- **Confidence scores**: Return prediction confidence alongside the prediction itself. Downstream systems can set thresholds appropriate for their risk tolerance.
- **Versioning**: Support multiple model versions simultaneously. This enables A/B testing and gradual rollouts.
- **Latency budgets**: Document expected latency. If the model's prediction latency exceeds an SLA, return a fallback response rather than timing out.
- **Batch endpoints**: For bulk prediction use cases, provide a batch endpoint that processes multiple inputs efficiently in a single request.

## A/B Testing

How do you know the new model is actually better in production? Run an **A/B test**: route a fraction of traffic to the new model (treatment) and the rest to the current model (control). Compare business metrics (revenue, engagement, customer satisfaction), not just ML metrics (accuracy, AUC).

Critical A/B testing principles for ML:
- **Statistical significance**: Run the test long enough to reach significance. Premature decisions based on noisy early results are a common mistake.
- **Business metrics**: A model with higher accuracy might reduce revenue if it changes user behavior in unexpected ways. Measure what matters.
- **Population effects**: Ensure treatment and control groups are comparable. Random assignment helps, but verify that key demographics are balanced.

## Shadow Deployment

Before A/B testing, **shadow deployment** (also called dark launching) runs the new model in parallel with the current model. Both models receive the same production traffic, but only the current model's predictions are served to users. The new model's predictions are logged and compared offline.

Shadow deployment lets you:
- Evaluate real-world performance without any risk to users.
- Measure latency and resource usage under production load.
- Identify edge cases that didn't appear in offline evaluation.
- Build confidence before routing any live traffic to the new model.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>Deployment is not an event -- it is a process. The typical progression is: offline evaluation, shadow deployment, A/B test with small traffic share, gradual rollout, full deployment. Each stage provides different information and different risk levels. Skipping stages is tempting when you're confident, but production surprises are guaranteed eventually, and having a staged rollout process is what saves you.</div>`,
			estimatedMinutes: 18,
			xpReward: 15
		},
		{
			slug: 'monitoring-and-maintenance',
			title: 'Monitoring and Maintenance',
			content: `# Monitoring and Maintenance

Deploying a model is not the finish line -- it is the starting line. Models degrade over time. Data shifts. The world changes. Without monitoring, a model that was 95% accurate at deployment might silently drop to 70% accuracy over months while continuing to serve predictions with full confidence.

## Data Drift

**Data drift** occurs when the statistical properties of the input data change over time. The data the model sees in production diverges from the data it was trained on.

Types of data drift:

- **Covariate shift**: The distribution of input features changes, but the relationship between features and labels stays the same. Example: a model trained on customer data from urban areas is deployed to rural areas where income distributions and purchasing patterns differ.
- **Prior probability shift**: The distribution of the target variable changes. Example: a fraud detection model trained when 1% of transactions were fraudulent now operates in an environment where 5% are fraudulent.
- **Concept drift**: The relationship between inputs and outputs changes. Example: customer preferences shift -- products that were popular become unfashionable. The same customer features now predict different purchasing behavior.

Detecting data drift:
- **Statistical tests**: Compare distributions of incoming data to training data using tests like Kolmogorov-Smirnov (for continuous features) or chi-squared (for categorical features).
- **Population Stability Index (PSI)**: Measures how much a distribution has shifted. PSI below 0.1 is insignificant; 0.1-0.25 is moderate; above 0.25 indicates significant drift.
- **Feature distribution monitoring**: Track histograms, means, standard deviations, and percentiles of each feature over time. Significant deviations trigger alerts.

<div class="callout callout-example"><div class="callout-title">Example</div>During COVID-19, virtually every production ML model experienced massive data drift simultaneously. Consumer behavior changed overnight: e-commerce surged, travel collapsed, spending patterns reversed. Fraud patterns shifted as stimulus checks created new transaction types. Models trained on pre-pandemic data became unreliable within weeks. Companies with robust drift detection caught the issue quickly; those without monitoring discovered it months later in declining business metrics.</div>

## Concept Drift

Concept drift is the most insidious form of model degradation because the inputs may look normal while the underlying relationships change.

Examples of concept drift:
- A spam filter trained on current spam patterns becomes less effective as spammers evolve their tactics.
- A sentiment analysis model trained on pre-2020 language struggles with new slang and evolving word usage.
- A credit scoring model trained during economic expansion performs poorly during a recession.

Detecting concept drift requires labeled data from production -- you need to know the true outcomes, not just the model's predictions. For many applications, labels arrive with a delay (you don't know if a loan defaults until months later), making real-time concept drift detection challenging.

Approaches to handling concept drift:
- **Periodic retraining**: Retrain on a regular schedule (weekly, monthly) to incorporate recent data.
- **Triggered retraining**: Retrain when drift detectors indicate a significant shift.
- **Online learning**: Continuously update the model as new labeled data arrives. This keeps the model perpetually current but introduces risks of instability and catastrophic forgetting.
- **Ensemble methods**: Maintain multiple models trained on different time windows and weight their predictions based on recent performance.

## Model Performance Monitoring

Beyond data drift, track the model's actual predictive performance:

- **Prediction distribution**: Are predictions shifting? If a binary classifier suddenly predicts 90% positive when it historically predicted 60% positive, something has changed.
- **Latency**: Is inference time increasing? Latency spikes can indicate infrastructure issues or input data anomalies (e.g., unusually long text inputs).
- **Error rates**: Track prediction errors, broken down by segments (customer type, geography, time of day). A model might maintain overall accuracy while failing catastrophically for a specific subgroup.
- **Business metrics**: The ultimate measure. Revenue, engagement, customer satisfaction, conversion rates. If these metrics decline, investigate whether the model is the cause.

<!-- interactive:OverfittingDemo -->

## Retraining Strategies

When monitoring indicates model degradation, retraining is necessary. But how?

- **Full retraining**: Train a new model from scratch on all available data. Most reliable but most expensive.
- **Incremental training**: Continue training the existing model on new data. Faster but risks catastrophic forgetting (the model forgets patterns from old data while learning new ones).
- **Sliding window**: Train only on the most recent N months of data. This handles concept drift well but discards potentially valuable historical patterns.
- **Fine-tuning**: Lightly adjust the model on recent data with a small learning rate. A middle ground between full retraining and incremental learning.

Regardless of strategy, always evaluate the retrained model against the current production model before deployment. Automated retraining pipelines should include validation gates that prevent deployment if the new model underperforms.

<div class="callout callout-warning"><div class="callout-title">Warning</div>Automated retraining without validation gates is dangerous. If a data pipeline bug introduces corrupted data, an automated system might train a terrible model on that data and deploy it to production. Always include human-in-the-loop checkpoints or automated quality gates in your retraining pipeline.</div>

## Alerting

Monitoring without alerting is logging into the void. Define clear alert thresholds:

- **Critical alerts** (pages on-call engineers): Model serving is down. Prediction latency exceeds SLA. Feature pipeline has failed for 2+ hours.
- **Warning alerts** (reviewed next business day): Data drift exceeds threshold. Model accuracy has dropped below target. Feature null rates have increased.
- **Informational alerts** (weekly review): Gradual performance trends. Retraining job completed. New model version deployed.

Avoid alert fatigue. Too many false alarms cause engineers to ignore all alerts. Each alert should be actionable -- if the recipient can't do anything about it, it shouldn't be an alert.

## The Feedback Loop

The most powerful monitoring systems close the loop: production outcomes feed back into model improvement.

1. Model makes predictions in production.
2. Over time, true outcomes are observed (the customer did churn; the transaction was legitimate; the patient recovered).
3. These labeled examples are added to the training dataset.
4. The model is retrained on enriched data.
5. The improved model is deployed.

This virtuous cycle means the model continuously improves from its own production experience. But it requires infrastructure to capture outcomes, join them with predictions, and feed them into the training pipeline. Building this feedback loop is one of the highest-value investments in MLOps.

<div class="callout callout-insight"><div class="callout-title">Key Insight</div>MLOps maturity is often measured by the speed and reliability of this feedback loop. Level 0: manual everything. Level 1: automated training pipeline. Level 2: automated retraining with monitoring. Level 3: fully automated feedback loop with continuous improvement. Most organizations are at Level 0 or 1. Getting to Level 2 is where the real production value starts to compound.</div>`,
			estimatedMinutes: 16,
			xpReward: 15
		}
	],
	quiz: {
		questions: [
			{
				type: 'multiple-choice',
				id: 'mlops-q1',
				question:
					'According to the Google paper on ML technical debt, what is the CACE principle?',
				options: [
					'Continuous Automated Continuous Engineering',
					'Changing Anything Changes Everything -- altering one feature can affect all outputs',
					'Code And Configuration are Equal in importance',
					'Centralized Access Controls Everything in ML systems'
				],
				correctIndex: 1,
				explanation:
					'CACE (Changing Anything Changes Everything) describes how ML models entangle their inputs: changing one feature can unpredictably affect the model\'s behavior on all inputs. This makes isolated changes and testing much harder than in traditional software.'
			},
			{
				type: 'fill-in',
				id: 'mlops-q2',
				question:
					'The open-source tool that works alongside Git to version large datasets and model files is called ____.',
				acceptedAnswers: ['DVC', 'dvc', 'Data Version Control'],
				explanation:
					'DVC (Data Version Control) extends Git to handle large data files and ML models. It stores lightweight pointer files (.dvc) in Git while the actual data lives in remote storage (S3, GCS, etc.), enabling full data versioning alongside code versioning.'
			},
			{
				type: 'multiple-choice',
				id: 'mlops-q3',
				question: 'What is training-serving skew?',
				options: [
					'When training takes longer than serving',
					'When the model is biased toward certain classes',
					'When features are computed differently during training and serving, causing a distribution mismatch',
					'When the training data is larger than the serving data'
				],
				correctIndex: 2,
				explanation:
					'Training-serving skew occurs when features are computed differently during training (often in batch) and serving (often in real-time streams). Even subtle differences in computation can cause the model to encounter data distributions it was not trained on.'
			},
			{
				type: 'multiple-choice',
				id: 'mlops-q4',
				question:
					'What is the purpose of shadow deployment (dark launching)?',
				options: [
					'To deploy the model only during nighttime hours',
					'To run a new model alongside the current one, logging predictions without serving them to users',
					'To hide the model\'s predictions from competitors',
					'To deploy models without version control'
				],
				correctIndex: 1,
				explanation:
					'Shadow deployment runs the new model in parallel with the current production model. Both receive real traffic, but only the current model serves predictions to users. The new model\'s predictions are logged for comparison, enabling risk-free evaluation under production conditions.'
			},
			{
				type: 'ordering',
				id: 'mlops-q5',
				question:
					'Order the typical model deployment progression from least to most user-facing:',
				items: [
					'A/B test with small traffic share',
					'Full production deployment',
					'Offline evaluation on test set',
					'Shadow deployment'
				],
				correctOrder: [2, 3, 0, 1],
				explanation:
					'The safe deployment progression is: offline evaluation (no production traffic), shadow deployment (production traffic, no user impact), A/B test (small share of users see new model), then full deployment. Each stage increases risk and provides different validation.'
			},
			{
				type: 'multiple-choice',
				id: 'mlops-q6',
				question:
					'What is concept drift?',
				options: [
					'When the model\'s code drifts from its original design',
					'When the relationship between input features and target outcomes changes over time',
					'When the model gradually uses more memory',
					'When new concepts are added to the training vocabulary'
				],
				correctIndex: 1,
				explanation:
					'Concept drift occurs when the underlying relationship between inputs and outputs changes. Unlike data drift (where input distributions change), concept drift means the same inputs should now produce different outputs because the world has changed.'
			},
			{
				type: 'multiple-choice',
				id: 'mlops-q7',
				question:
					'Why is model quantization useful for deployment?',
				options: [
					'It increases model accuracy significantly',
					'It converts weights from 32-bit to 8-bit, reducing size and increasing speed with minimal accuracy loss',
					'It adds more parameters to the model',
					'It encrypts the model for security'
				],
				correctIndex: 1,
				explanation:
					'Quantization converts model weights from 32-bit floating point to 8-bit integers, producing a model that is approximately 4x smaller and 2-4x faster with typically less than 1% accuracy loss. This is crucial for deploying models on edge devices and reducing serving costs.'
			},
			{
				type: 'multiple-choice',
				id: 'mlops-q8',
				question:
					'What is a feature store?',
				options: [
					'A marketplace for buying and selling ML features',
					'A centralized repository for storing, managing, and serving ML features consistently across training and serving',
					'A database for storing model weights',
					'A user interface for visualizing feature importance'
				],
				correctIndex: 1,
				explanation:
					'A feature store is a centralized system that stores, manages, and serves ML features. It provides consistent feature definitions across training and serving, prevents training-serving skew, enables feature reuse across teams, and supports point-in-time queries for training data construction.'
			}
		],
		passingScore: 6
	}
};

export default mlops;
