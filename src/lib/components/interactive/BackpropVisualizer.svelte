<script lang="ts">
	// Simple 2-1-1 network for backprop visualization
	let x1 = $state(0.8);
	let x2 = $state(0.4);
	let target = $state(1);
	let learningRate = $state(0.5);

	let w1 = $state(0.5);
	let w2 = $state(-0.3);
	let w3 = $state(0.7);
	let b1 = $state(0.1);
	let b2 = $state(-0.2);

	let currentStep = $state(0);
	let epoch = $state(0);

	function sigmoid(x: number) { return 1 / (1 + Math.exp(-x)); }
	function sigmoidDeriv(x: number) { const s = sigmoid(x); return s * (1 - s); }

	// Forward pass values
	let z1 = $derived(x1 * w1 + x2 * w2 + b1);
	let a1 = $derived(sigmoid(z1));
	let z2 = $derived(a1 * w3 + b2);
	let output = $derived(sigmoid(z2));
	let loss = $derived(0.5 * (target - output) ** 2);

	// Backward pass gradients
	let dLoss_dOutput = $derived(-(target - output));
	let dOutput_dZ2 = $derived(sigmoidDeriv(z2));
	let dZ2_dW3 = $derived(a1);
	let dZ2_dA1 = $derived(w3);
	let dA1_dZ1 = $derived(sigmoidDeriv(z1));
	let dZ1_dW1 = $derived(x1);
	let dZ1_dW2 = $derived(x2);

	let gradW3 = $derived(dLoss_dOutput * dOutput_dZ2 * dZ2_dW3);
	let gradB2 = $derived(dLoss_dOutput * dOutput_dZ2);
	let gradW1 = $derived(dLoss_dOutput * dOutput_dZ2 * dZ2_dA1 * dA1_dZ1 * dZ1_dW1);
	let gradW2 = $derived(dLoss_dOutput * dOutput_dZ2 * dZ2_dA1 * dA1_dZ1 * dZ1_dW2);
	let gradB1 = $derived(dLoss_dOutput * dOutput_dZ2 * dZ2_dA1 * dA1_dZ1);

	const STEPS = [
		'Forward pass',
		'Compute loss',
		'Gradient at output',
		'Gradient through w3',
		'Gradient through hidden',
		'Gradient through w1, w2',
		'Update weights'
	];

	function nextStep() {
		if (currentStep < STEPS.length - 1) {
			currentStep++;
		} else {
			// Apply updates
			w3 -= learningRate * gradW3;
			w1 -= learningRate * gradW1;
			w2 -= learningRate * gradW2;
			b2 -= learningRate * gradB2;
			b1 -= learningRate * gradB1;
			currentStep = 0;
			epoch++;
		}
	}

	function reset() {
		w1 = 0.5; w2 = -0.3; w3 = 0.7; b1 = 0.1; b2 = -0.2;
		currentStep = 0; epoch = 0;
	}

	function trainMultiple() {
		for (let i = 0; i < 10; i++) {
			w3 -= learningRate * gradW3;
			w1 -= learningRate * gradW1;
			w2 -= learningRate * gradW2;
			b2 -= learningRate * gradB2;
			b1 -= learningRate * gradB1;
			epoch++;
		}
		currentStep = 0;
	}
</script>

<div>
	<div class="lab-controls">
		<div class="flex flex-col gap-1">
			<label class="text-xs text-text-muted">LR: {learningRate}</label>
			<input type="range" min="0.01" max="2" step="0.01" bind:value={learningRate} class="w-28" />
		</div>
		<div class="flex flex-col gap-1">
			<label class="text-xs text-text-muted">Target: {target}</label>
			<input type="range" min="0" max="1" step="0.1" bind:value={target} class="w-28" />
		</div>
		<div class="flex items-end gap-2">
			<button onclick={nextStep} class="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark">
				{currentStep < STEPS.length - 1 ? 'Next Step' : 'Update & Restart'}
			</button>
			<button onclick={trainMultiple} class="rounded-lg bg-accent-emerald px-3 py-1.5 text-xs font-medium text-white hover:opacity-90">
				Train x10
			</button>
			<button onclick={reset} class="rounded-lg bg-bg-elevated border border-border px-3 py-1.5 text-xs font-medium text-text-muted">
				Reset
			</button>
		</div>
	</div>

	<!-- Step indicator -->
	<div class="mb-4 flex gap-1">
		{#each STEPS as s, i}
			<div class="h-1.5 flex-1 rounded-full transition-colors {i <= currentStep ? 'bg-primary' : 'bg-bg-elevated'}"></div>
		{/each}
	</div>
	<div class="mb-4 text-sm font-medium text-primary-light">Step {currentStep + 1}: {STEPS[currentStep]}</div>

	<!-- Network diagram -->
	<svg viewBox="0 0 500 220" class="w-full max-w-lg rounded-lg bg-bg/50">
		<!-- Connections -->
		<line x1="80" y1="60" x2="230" y2="110" stroke={currentStep >= 3 ? 'var(--color-accent-amber)' : 'var(--color-border-light)'} stroke-width={currentStep >= 5 ? 2.5 : 1.5} />
		<line x1="80" y1="160" x2="230" y2="110" stroke={currentStep >= 3 ? 'var(--color-accent-amber)' : 'var(--color-border-light)'} stroke-width={currentStep >= 5 ? 2.5 : 1.5} />
		<line x1="270" y1="110" x2="420" y2="110" stroke={currentStep >= 2 ? 'var(--color-accent-amber)' : 'var(--color-border-light)'} stroke-width={currentStep >= 3 ? 2.5 : 1.5} />

		<!-- Weight labels -->
		<text x="140" y="72" text-anchor="middle" fill="var(--color-text-dim)" font-size="10">w1={w1.toFixed(3)}</text>
		{#if currentStep >= 5}<text x="140" y="85" text-anchor="middle" fill="var(--color-accent-amber)" font-size="9">∇={gradW1.toFixed(4)}</text>{/if}

		<text x="140" y="160" text-anchor="middle" fill="var(--color-text-dim)" font-size="10">w2={w2.toFixed(3)}</text>
		{#if currentStep >= 5}<text x="140" y="173" text-anchor="middle" fill="var(--color-accent-amber)" font-size="9">∇={gradW2.toFixed(4)}</text>{/if}

		<text x="345" y="98" text-anchor="middle" fill="var(--color-text-dim)" font-size="10">w3={w3.toFixed(3)}</text>
		{#if currentStep >= 3}<text x="345" y="83" text-anchor="middle" fill="var(--color-accent-amber)" font-size="9">∇={gradW3.toFixed(4)}</text>{/if}

		<!-- Input nodes -->
		<circle cx="80" cy="60" r="22" fill="var(--color-bg-elevated)" stroke="var(--color-accent-blue)" stroke-width="2" />
		<text x="80" y="57" text-anchor="middle" fill="var(--color-text)" font-size="10" font-weight="600">x1</text>
		<text x="80" y="69" text-anchor="middle" fill="var(--color-accent-blue)" font-size="9">{x1}</text>

		<circle cx="80" cy="160" r="22" fill="var(--color-bg-elevated)" stroke="var(--color-accent-blue)" stroke-width="2" />
		<text x="80" y="157" text-anchor="middle" fill="var(--color-text)" font-size="10" font-weight="600">x2</text>
		<text x="80" y="169" text-anchor="middle" fill="var(--color-accent-blue)" font-size="9">{x2}</text>

		<!-- Hidden node -->
		<circle cx="250" cy="110" r="22" fill={currentStep >= 4 ? 'rgba(168,85,247,0.15)' : 'var(--color-bg-elevated)'} stroke="var(--color-secondary)" stroke-width="2" />
		<text x="250" y="107" text-anchor="middle" fill="var(--color-text)" font-size="10" font-weight="600">h</text>
		{#if currentStep >= 0}
			<text x="250" y="119" text-anchor="middle" fill="var(--color-secondary)" font-size="9">{a1.toFixed(3)}</text>
		{/if}

		<!-- Output node -->
		<circle cx="420" cy="110" r="22" fill={currentStep >= 1 ? 'rgba(16,185,129,0.15)' : 'var(--color-bg-elevated)'} stroke="var(--color-accent-emerald)" stroke-width="2" />
		<text x="420" y="107" text-anchor="middle" fill="var(--color-text)" font-size="10" font-weight="600">out</text>
		{#if currentStep >= 0}
			<text x="420" y="119" text-anchor="middle" fill="var(--color-accent-emerald)" font-size="9">{output.toFixed(3)}</text>
		{/if}

		<!-- Target -->
		<text x="420" y="155" text-anchor="middle" fill="var(--color-text-dim)" font-size="10">target: {target}</text>
		{#if currentStep >= 1}
			<text x="420" y="170" text-anchor="middle" fill="var(--color-accent-amber)" font-size="10">loss: {loss.toFixed(4)}</text>
		{/if}

		<!-- Gradient flow arrows (backward) -->
		{#if currentStep >= 2}
			<path d="M415,90 Q400,70 380,80" fill="none" stroke="var(--color-accent-amber)" stroke-width="1.5" marker-end="url(#bparrow)" />
			<text x="390" y="68" fill="var(--color-accent-amber)" font-size="8">δ={dLoss_dOutput.toFixed(3)}</text>
		{/if}
		{#if currentStep >= 4}
			<path d="M230,95 Q210,70 190,80" fill="none" stroke="var(--color-accent-amber)" stroke-width="1.5" marker-end="url(#bparrow)" />
		{/if}

		<defs>
			<marker id="bparrow" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
				<polygon points="0 0, 6 2, 0 4" fill="var(--color-accent-amber)" />
			</marker>
		</defs>
	</svg>

	<div class="mt-3 grid grid-cols-2 gap-2 text-xs">
		<div class="rounded-lg bg-bg-elevated border border-border p-2">
			<span class="text-text-dim">Epoch:</span> <span class="font-semibold">{epoch}</span>
		</div>
		<div class="rounded-lg bg-bg-elevated border border-border p-2">
			<span class="text-text-dim">Loss:</span> <span class="font-semibold text-accent-amber">{loss.toFixed(6)}</span>
		</div>
	</div>
</div>
