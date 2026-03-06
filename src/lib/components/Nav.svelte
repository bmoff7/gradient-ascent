<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getLevelForXP } from '$lib/content/types';
	import { progressStore, totalXP, userName, isSignedIn } from '$lib/stores/progress';

	let mobileMenuOpen = $state(false);
	let level = $derived(getLevelForXP($totalXP));

	const navLinks = [
		{ href: '/tracks', label: 'Tracks' },
		{ href: '/dashboard', label: 'Dashboard' },
		{ href: '/achievements', label: 'Achievements' }
	];

	function handleSignOut() {
		progressStore.signOut();
		goto('/');
	}
</script>

<nav class="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/90 backdrop-blur-md">
	<div class="mx-auto max-w-6xl px-5 sm:px-8">
		<div class="flex h-14 items-center justify-between">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-2.5">
				<svg class="h-7 w-7" viewBox="0 0 32 32">
					<rect width="32" height="32" rx="6" fill="#c9553d"/>
					<path d="M8 24 L16 8 L24 24" fill="none" stroke="#e8e4dc" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M11 19 L16 11 L21 19" fill="none" stroke="#e8e4dc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
				</svg>
				<span class="display-serif text-base font-semibold tracking-tight hidden sm:inline">Gradient Ascent</span>
			</a>

			<!-- Desktop nav -->
			<div class="hidden items-center gap-0.5 md:flex">
				{#each navLinks as link}
					<a
						href={link.href}
						class="px-3 py-1.5 text-[13px] font-medium transition-colors {$page.url.pathname.startsWith(link.href)
							? 'text-text'
							: 'text-text-dim hover:text-text'}"
					>
						{link.label}
					</a>
				{/each}
			</div>

			<!-- Right side -->
			<div class="flex items-center gap-3">
				{#if $isSignedIn}
					<div class="hidden items-center gap-3 text-[13px] sm:flex">
						<span class="text-xp font-medium">{$totalXP} XP</span>
						<span class="text-border-light">/</span>
						<span class="text-text-dim">{level.name}</span>
					</div>

					<div class="flex items-center gap-2">
						<div class="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
							{($userName || 'U')[0]}
						</div>
						<button
							onclick={handleSignOut}
							class="hidden text-[13px] text-text-dim transition-colors hover:text-text md:inline"
						>
							Sign out
						</button>
					</div>
				{:else}
					<a
						href="/auth/signin"
						class="rounded-md bg-primary px-3.5 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-primary-dark"
					>
						Sign in
					</a>
				{/if}

				<!-- Mobile menu button -->
				<button
					onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
					class="flex h-8 w-8 items-center justify-center text-text-muted md:hidden"
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
						{#if mobileMenuOpen}
							<path d="M6 18L18 6M6 6l12 12" />
						{:else}
							<path d="M4 6h16M4 12h16M4 18h16" />
						{/if}
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile menu -->
	{#if mobileMenuOpen}
		<div class="border-t border-border bg-bg md:hidden">
			<div class="space-y-0.5 px-5 py-3">
				{#each navLinks as link}
					<a
						href={link.href}
						onclick={() => (mobileMenuOpen = false)}
						class="block rounded-md px-3 py-2 text-sm {$page.url.pathname.startsWith(link.href)
							? 'text-text font-medium'
							: 'text-text-muted'}"
					>
						{link.label}
					</a>
				{/each}
				{#if $isSignedIn}
					<div class="px-3 py-2 text-sm text-xp">
						{level.name} — {$totalXP} XP
					</div>
				{/if}
			</div>
		</div>
	{/if}
</nav>
