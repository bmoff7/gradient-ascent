<script lang="ts">
	import { goto } from '$app/navigation';
	import { progressStore } from '$lib/stores/progress';

	let name = $state('');
	let error = $state('');

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!name.trim()) {
			error = 'Please enter a name.';
			return;
		}
		progressStore.setName(name.trim());
		goto('/dashboard');
	}
</script>

<svelte:head>
	<title>Sign In — Gradient Ascent</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-5">
	<div class="w-full max-w-sm">
		<div class="mb-8">
			<svg class="h-10 w-10 mb-4" viewBox="0 0 32 32">
				<rect width="32" height="32" rx="6" fill="#c9553d"/>
				<path d="M8 24 L16 8 L24 24" fill="none" stroke="#e8e4dc" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M11 19 L16 11 L21 19" fill="none" stroke="#e8e4dc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
			</svg>
			<h1 class="display-serif text-xl font-semibold">Sign in to Gradient Ascent</h1>
			<p class="mt-1 text-sm text-text-muted">Enter a display name to track your progress and earn XP.</p>
		</div>

		<form onsubmit={handleSubmit} class="space-y-4">
			<div>
				<label for="name" class="block text-[13px] text-text-muted mb-1.5">Display Name</label>
				<input
					id="name"
					type="text"
					bind:value={name}
					placeholder="e.g. Ada Lovelace"
					autocomplete="name"
					class="w-full rounded-md border border-border bg-bg-elevated px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary placeholder:text-text-dim"
				/>
			</div>

			{#if error}
				<p class="text-[13px] text-error">{error}</p>
			{/if}

			<button
				type="submit"
				class="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
			>
				Continue
			</button>
		</form>

		<p class="mt-6 text-[12px] text-text-dim">
			No account needed — just pick a name. Your progress is saved in your browser. You can also <a href="/tracks" class="text-secondary-light hover:text-secondary underline underline-offset-2">browse without signing in</a>.
		</p>
	</div>
</div>
