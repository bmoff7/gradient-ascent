<script lang="ts">
	import { goto } from '$app/navigation';
	import { progressStore } from '$lib/stores/progress';

	let mode = $state<'signin' | 'signup'>('signup');
	let email = $state('');
	let password = $state('');
	let displayName = $state('');
	let loading = $state(false);
	let error = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';

		if (!email.trim() || !password.trim()) {
			error = 'Email and password are required.';
			return;
		}
		if (mode === 'signup' && !displayName.trim()) {
			error = 'Display name is required.';
			return;
		}
		if (password.length < 6) {
			error = 'Password must be at least 6 characters.';
			return;
		}

		loading = true;
		try {
			if (mode === 'signup') {
				await progressStore.signUp(email.trim(), password, displayName.trim());
			} else {
				await progressStore.signIn(email.trim(), password);
			}
			goto('/dashboard');
		} catch (err: any) {
			error = err.message || 'Something went wrong. Try again.';
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>{mode === 'signup' ? 'Sign Up' : 'Sign In'} — Gradient Ascent</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-5">
	<div class="w-full max-w-sm">
		<div class="mb-8">
			<svg class="h-10 w-10 mb-4" viewBox="0 0 32 32">
				<rect width="32" height="32" rx="6" fill="#c9553d"/>
				<path d="M8 24 L16 8 L24 24" fill="none" stroke="#e8e4dc" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M11 19 L16 11 L21 19" fill="none" stroke="#e8e4dc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
			</svg>
			<h1 class="display-serif text-xl font-semibold">
				{mode === 'signup' ? 'Create an account' : 'Welcome back'}
			</h1>
			<p class="mt-1 text-sm text-text-muted">
				{mode === 'signup'
					? 'Sign up to track your progress across devices.'
					: 'Sign in to continue learning.'}
			</p>
		</div>

		<form onsubmit={handleSubmit} class="space-y-4">
			{#if mode === 'signup'}
				<div>
					<label for="displayName" class="block text-[13px] text-text-muted mb-1.5">Display Name</label>
					<input
						id="displayName"
						type="text"
						bind:value={displayName}
						placeholder="e.g. Ada Lovelace"
						autocomplete="name"
						class="w-full rounded-md border border-border bg-bg-elevated px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary placeholder:text-text-dim"
					/>
				</div>
			{/if}

			<div>
				<label for="email" class="block text-[13px] text-text-muted mb-1.5">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					placeholder="you@example.com"
					autocomplete="email"
					class="w-full rounded-md border border-border bg-bg-elevated px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary placeholder:text-text-dim"
				/>
			</div>

			<div>
				<label for="password" class="block text-[13px] text-text-muted mb-1.5">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					placeholder="At least 6 characters"
					autocomplete={mode === 'signup' ? 'new-password' : 'current-password'}
					class="w-full rounded-md border border-border bg-bg-elevated px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary placeholder:text-text-dim"
				/>
			</div>

			{#if error}
				<p class="text-[13px] text-error">{error}</p>
			{/if}

			<button
				type="submit"
				disabled={loading}
				class="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
			>
				{loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
			</button>
		</form>

		<p class="mt-6 text-[13px] text-text-dim">
			{#if mode === 'signup'}
				Already have an account?
				<button onclick={() => { mode = 'signin'; error = ''; }} class="text-secondary-light hover:text-secondary underline underline-offset-2">
					Sign in
				</button>
			{:else}
				Don't have an account?
				<button onclick={() => { mode = 'signup'; error = ''; }} class="text-secondary-light hover:text-secondary underline underline-offset-2">
					Sign up
				</button>
			{/if}
			<span class="mx-1.5 text-border-light">|</span>
			<a href="/tracks" class="text-secondary-light hover:text-secondary underline underline-offset-2">Browse without an account</a>
		</p>
	</div>
</div>
