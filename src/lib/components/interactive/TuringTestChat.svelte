<script lang="ts">
	interface Message {
		role: 'user' | 'system';
		text: string;
	}

	let messages = $state<Message[]>([
		{ role: 'system', text: "Hello! I'm ready to chat. Ask me anything and try to determine: am I a human or an AI? You have 5 questions." }
	]);
	let input = $state('');
	let questionsLeft = $state(5);
	let guess = $state<'human' | 'ai' | null>(null);
	let revealed = $state(false);

	// This bot is AI but gives slightly evasive, human-like answers
	const responses = [
		"That's an interesting question. I'd say I think about it the same way most people do — sometimes it's hard to put into words exactly what goes through your mind, you know?",
		"Hmm, honestly I'm not sure I have a definitive answer for that. I think about it sometimes but I don't always reach a clear conclusion.",
		"Ha, that's a tricky one. I guess I'd say I have my own perspective on things, though I'm sure other people would disagree with me.",
		"Good question! I think I'd need more context to give you a really good answer. Can you be more specific about what you mean?",
		"You know, I was just thinking about something similar the other day. I'd say my view is that it really depends on the situation.",
		"That's something I've gone back and forth on. Some days I lean one way, some days the other. I think that's pretty normal though, right?",
		"Interesting... I think the honest answer is that I don't think about it as much as I probably should. Life gets busy.",
		"Wow, that's deep. I'd say I generally try to be thoughtful about these things but I'm definitely not perfect at it.",
		"I appreciate you asking that. I think most people would say something predictable here, but I try to actually think it through.",
		"That reminds me of a conversation I had recently — the conclusion I came to was that there's rarely a simple answer to the important questions."
	];

	let responseIndex = 0;

	function send() {
		if (!input.trim() || questionsLeft <= 0) return;

		messages = [...messages, { role: 'user', text: input.trim() }];
		questionsLeft--;

		// Simulate typing delay
		const response = responses[responseIndex % responses.length];
		responseIndex++;

		setTimeout(() => {
			messages = [...messages, { role: 'system', text: response }];

			if (questionsLeft === 0) {
				setTimeout(() => {
					messages = [...messages, {
						role: 'system',
						text: "That was your last question! Now, what do you think — am I a human or an AI? Make your guess below."
					}];
				}, 500);
			}
		}, 800 + Math.random() * 1200);

		input = '';
	}

	function makeGuess(g: 'human' | 'ai') {
		guess = g;
		revealed = true;
		const correct = g === 'ai';
		messages = [...messages, {
			role: 'system',
			text: correct
				? "You're right — I'm an AI! I was designed to give human-like responses. The Turing Test asks: if a machine can fool you into thinking it's human, does that count as intelligence? What do you think now?"
				: "Actually, I'm an AI! I was generating pre-written responses designed to sound human. This is exactly what the Turing Test explores — the line between genuine understanding and convincing imitation can be surprisingly blurry."
		}];
	}

	function restart() {
		messages = [{ role: 'system', text: "Hello! I'm ready to chat. Ask me anything and try to determine: am I a human or an AI? You have 5 questions." }];
		questionsLeft = 5;
		guess = null;
		revealed = false;
		responseIndex = 0;
	}
</script>

<div>
	<div class="rounded-xl border border-border bg-bg-elevated overflow-hidden">
		<!-- Chat header -->
		<div class="flex items-center justify-between border-b border-border px-4 py-2">
			<div class="flex items-center gap-2">
				<div class="h-2.5 w-2.5 rounded-full bg-success animate-pulse"></div>
				<span class="text-sm font-medium">Mystery Conversant</span>
			</div>
			<span class="text-xs text-text-dim">{questionsLeft} question{questionsLeft !== 1 ? 's' : ''} left</span>
		</div>

		<!-- Messages -->
		<div class="h-64 overflow-y-auto p-4 space-y-3">
			{#each messages as msg}
				<div class="flex {msg.role === 'user' ? 'justify-end' : 'justify-start'}">
					<div class="max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed {msg.role === 'user' ? 'bg-primary text-white rounded-br-md' : 'bg-bg-card border border-border text-text rounded-bl-md'}">
						{msg.text}
					</div>
				</div>
			{/each}
		</div>

		<!-- Input / Guess -->
		{#if !revealed}
			{#if questionsLeft > 0}
				<form onsubmit={(e) => { e.preventDefault(); send(); }} class="flex border-t border-border">
					<input
						type="text"
						bind:value={input}
						placeholder="Type your question..."
						class="flex-1 bg-transparent px-4 py-3 text-sm outline-none"
					/>
					<button type="submit" class="px-4 text-primary hover:text-primary-light" disabled={!input.trim()}>
						<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
						</svg>
					</button>
				</form>
			{:else if !guess}
				<div class="border-t border-border p-4">
					<p class="text-sm text-text-muted mb-3">Time to decide — human or AI?</p>
					<div class="flex gap-3">
						<button onclick={() => makeGuess('human')} class="flex-1 rounded-lg bg-accent-blue px-4 py-2 text-sm font-medium text-white hover:opacity-90">
							Human
						</button>
						<button onclick={() => makeGuess('ai')} class="flex-1 rounded-lg bg-accent-purple px-4 py-2 text-sm font-medium text-white hover:opacity-90">
							AI
						</button>
					</div>
				</div>
			{/if}
		{:else}
			<div class="border-t border-border p-4 text-center">
				<div class="text-sm {guess === 'ai' ? 'text-success' : 'text-warning'} font-medium mb-2">
					{guess === 'ai' ? 'Correct!' : 'Fooled!'} — It was an AI all along.
				</div>
				<button onclick={restart} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
					Try Again
				</button>
			</div>
		{/if}
	</div>
</div>
