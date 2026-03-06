<script lang="ts">
	import type { Quiz, QuizQuestion } from '$lib/content/types';

	let { quiz, onComplete }: { quiz: Quiz; onComplete: (score: number, total: number, passed: boolean) => void } = $props();

	let currentIndex = $state(0);
	let answers = $state<Record<string, any>>({});
	let showResult = $state(false);
	let showExplanation = $state(false);
	let submitted = $state(false);
	let score = $state(0);

	let currentQuestion = $derived(quiz.questions[currentIndex]);
	let totalQuestions = $derived(quiz.questions.length);
	let isLastQuestion = $derived(currentIndex === totalQuestions - 1);

	let dragItems = $state<string[]>([]);
	let dragIndex = $state<number | null>(null);

	$effect(() => {
		if (currentQuestion?.type === 'ordering') {
			dragItems = [...currentQuestion.items];
		}
	});

	function selectAnswer(questionId: string, value: any) {
		answers[questionId] = value;
	}

	function checkAnswer(q: QuizQuestion): boolean {
		const answer = answers[q.id];
		if (!answer && answer !== 0) return false;

		if (q.type === 'multiple-choice') {
			return answer === q.correctIndex;
		} else if (q.type === 'ordering') {
			const currentOrder = dragItems.map((item) => q.items.indexOf(item));
			return JSON.stringify(currentOrder) === JSON.stringify(q.correctOrder);
		} else if (q.type === 'fill-in') {
			return q.acceptedAnswers.some(
				(a) => a.toLowerCase().trim() === String(answer).toLowerCase().trim()
			);
		}
		return false;
	}

	function submitAnswer() {
		showExplanation = true;
	}

	function nextQuestion() {
		showExplanation = false;
		if (isLastQuestion) {
			let correct = 0;
			for (const q of quiz.questions) {
				if (checkAnswer(q)) correct++;
			}
			score = correct;
			submitted = true;
			showResult = true;
			const passed = (correct / totalQuestions) * 100 >= quiz.passingScore;
			onComplete(correct, totalQuestions, passed);
		} else {
			currentIndex++;
		}
	}

	function retakeQuiz() {
		currentIndex = 0;
		answers = {};
		showResult = false;
		showExplanation = false;
		submitted = false;
		score = 0;
	}

	function handleDragStart(index: number) {
		dragIndex = index;
	}

	function handleDragOver(e: DragEvent, index: number) {
		e.preventDefault();
		if (dragIndex === null || dragIndex === index) return;
		const items = [...dragItems];
		const [removed] = items.splice(dragIndex, 1);
		items.splice(index, 0, removed);
		dragItems = items;
		dragIndex = index;
		answers[currentQuestion.id] = dragItems;
	}

	function handleDragEnd() {
		dragIndex = null;
	}
</script>

{#if showResult}
	<div class="mx-auto max-w-lg text-center">
		<div class="rounded-lg border border-border bg-bg-card p-8">
			{#if (score / totalQuestions) * 100 >= quiz.passingScore}
				<h2 class="display-serif mb-2 text-xl font-semibold text-success">Quiz Passed</h2>
			{:else}
				<h2 class="display-serif mb-2 text-xl font-semibold text-warning">Keep Learning</h2>
			{/if}

			<p class="mb-6 text-text-muted">
				You scored <span class="font-semibold text-text">{score}/{totalQuestions}</span>
				({Math.round((score / totalQuestions) * 100)}%)
			</p>

			<div class="mb-4 h-1.5 overflow-hidden rounded-full bg-bg-elevated">
				<div
					class="h-full rounded-full transition-all duration-1000 {(score / totalQuestions) * 100 >= quiz.passingScore ? 'bg-success' : 'bg-warning'}"
					style="width: {(score / totalQuestions) * 100}%"
				></div>
			</div>

			<p class="mb-6 text-[12px] text-text-dim">
				Passing score: {quiz.passingScore}%
			</p>

			{#if (score / totalQuestions) * 100 < quiz.passingScore}
				<button
					onclick={retakeQuiz}
					class="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
				>
					Try Again
				</button>
			{/if}
		</div>
	</div>
{:else}
	<div class="mx-auto max-w-2xl">
		<div class="mb-6 flex items-center justify-between text-[13px] text-text-muted">
			<span>Question {currentIndex + 1} of {totalQuestions}</span>
			<span>{Math.round(((currentIndex) / totalQuestions) * 100)}%</span>
		</div>
		<div class="mb-8 h-1 overflow-hidden rounded-full bg-bg-elevated">
			<div
				class="h-full rounded-full bg-primary transition-all duration-300"
				style="width: {((currentIndex) / totalQuestions) * 100}%"
			></div>
		</div>

		<div class="rounded-lg border border-border bg-bg-card p-6 sm:p-8">
			<h3 class="mb-6 text-base font-semibold leading-relaxed">{currentQuestion.question}</h3>

			{#if currentQuestion.type === 'multiple-choice'}
				<div class="space-y-2">
					{#each currentQuestion.options as option, i}
						<button
							onclick={() => selectAnswer(currentQuestion.id, i)}
							disabled={showExplanation}
							class="w-full rounded-md border p-3.5 text-left text-sm transition-all
								{answers[currentQuestion.id] === i
									? showExplanation
										? i === currentQuestion.correctIndex
											? 'border-success bg-success/8 text-success'
											: 'border-error bg-error/8 text-error'
										: 'border-primary bg-primary/8'
									: showExplanation && i === currentQuestion.correctIndex
										? 'border-success bg-success/8 text-success'
										: 'border-border hover:border-border-light hover:bg-bg-hover'
								}"
						>
							<div class="flex items-center gap-3">
								<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[11px] font-medium border
									{answers[currentQuestion.id] === i ? 'border-current' : 'border-border'}">
									{String.fromCharCode(65 + i)}
								</div>
								<span>{option}</span>
							</div>
						</button>
					{/each}
				</div>

			{:else if currentQuestion.type === 'ordering'}
				<p class="mb-3 text-[13px] text-text-muted">Drag to reorder:</p>
				<div class="space-y-2">
					{#each dragItems as item, i}
						<div
							draggable="true"
							ondragstart={() => handleDragStart(i)}
							ondragover={(e) => handleDragOver(e, i)}
							ondragend={handleDragEnd}
							role="listitem"
							class="flex cursor-grab items-center gap-3 rounded-md border border-border bg-bg-elevated p-3 text-sm active:cursor-grabbing
								{dragIndex === i ? 'opacity-50' : ''}"
						>
							<svg class="h-4 w-4 shrink-0 text-text-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path d="M4 8h16M4 16h16" />
							</svg>
							<span>{item}</span>
						</div>
					{/each}
				</div>

			{:else if currentQuestion.type === 'fill-in'}
				<input
					type="text"
					placeholder="Type your answer..."
					value={answers[currentQuestion.id] || ''}
					oninput={(e) => selectAnswer(currentQuestion.id, e.currentTarget.value)}
					disabled={showExplanation}
					class="w-full rounded-md border border-border bg-bg-elevated px-4 py-3 text-sm outline-none transition-colors focus:border-primary
						{showExplanation
							? checkAnswer(currentQuestion)
								? 'border-success bg-success/8'
								: 'border-error bg-error/8'
							: ''}"
				/>
			{/if}

			{#if showExplanation}
				<div class="mt-6 rounded-md border border-border bg-bg-elevated p-4">
					<div class="mb-1 text-sm font-semibold {checkAnswer(currentQuestion) ? 'text-success' : 'text-error'}">
						{checkAnswer(currentQuestion) ? 'Correct.' : 'Not quite.'}
					</div>
					<p class="text-[13px] text-text-muted">{currentQuestion.explanation}</p>
				</div>
			{/if}

			<div class="mt-6 flex justify-end gap-3">
				{#if !showExplanation}
					<button
						onclick={submitAnswer}
						disabled={answers[currentQuestion.id] === undefined}
						class="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed"
					>
						Check Answer
					</button>
				{:else}
					<button
						onclick={nextQuestion}
						class="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
					>
						{isLastQuestion ? 'See Results' : 'Next Question'}
					</button>
				{/if}
			</div>
		</div>
	</div>
{/if}
