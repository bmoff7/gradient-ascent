<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
	import { tracks } from '$lib/content/tracks';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const totalModules = tracks.reduce((s, t) => s + t.modules.length, 0);
	const totalLessons = tracks.reduce((s, t) => s + t.modules.reduce((s2, m) => s2 + m.lessonsCount, 0), 0);
</script>

<svelte:head>
	<title>Gradient Ascent — Learn AI from the ground up</title>
	<meta name="description" content="A free, deeply detailed AI curriculum. From the nature of intelligence to building transformers. Interactive labs, quizzes, and progress tracking." />
</svelte:head>

<!-- Hero -->
<section class="topo-bg overflow-hidden border-b border-border">
	<div class="mx-auto max-w-6xl px-5 sm:px-8">
		<div class="grid gap-8 py-20 sm:py-28 lg:grid-cols-[1fr,340px] lg:items-center lg:gap-16 lg:py-36">
			<div>
				<p class="mb-4 text-[13px] font-medium uppercase tracking-widest text-primary-light">Free and open curriculum</p>
				<h1 class="display-serif text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
					Learn artificial intelligence from the ground up.
				</h1>
				<p class="mt-6 max-w-lg text-base leading-relaxed text-text-muted sm:text-lg">
					A deeply detailed, interactive curriculum that takes you from "what is intelligence?" to building transformers and beyond. {tracks.length} tracks, {totalModules} modules, {totalLessons}+ lessons.
				</p>

				<div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
					{#if data.session?.user}
						<a
							href="/dashboard"
							class="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
						>
							Continue Learning
						</a>
					{:else}
						<button
							onclick={() => signIn()}
							class="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
						>
							Start Learning — Free
						</button>
					{/if}
					<a
						href="/tracks"
						class="inline-flex items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-medium text-text-muted transition-colors hover:text-text hover:border-border-light"
					>
						Browse Curriculum
					</a>
				</div>
			</div>

			<!-- Elevation profile illustration -->
			<div class="hidden lg:block">
				<svg viewBox="0 0 300 280" class="w-full opacity-60">
					<!-- Contour lines suggesting mountain/elevation -->
					<path d="M20 260 Q60 240 100 220 Q140 180 170 140 Q200 100 230 80 Q260 60 280 40" fill="none" stroke="var(--color-primary)" stroke-width="1.5" opacity="0.4"/>
					<path d="M20 260 Q70 245 110 230 Q150 200 180 165 Q210 130 240 110 Q265 95 280 80" fill="none" stroke="var(--color-accent-ochre)" stroke-width="1" opacity="0.3"/>
					<path d="M20 260 Q80 250 120 240 Q160 215 190 185 Q220 155 250 140 Q270 130 280 120" fill="none" stroke="var(--color-accent-gold)" stroke-width="1" opacity="0.25"/>
					<path d="M20 260 Q90 252 130 248 Q170 230 200 210 Q230 185 260 170 Q275 162 280 155" fill="none" stroke="var(--color-accent-sage)" stroke-width="1" opacity="0.2"/>
					<path d="M20 260 Q100 255 140 253 Q180 242 210 228 Q240 210 265 198 Q278 192 280 188" fill="none" stroke="var(--color-secondary)" stroke-width="1" opacity="0.15"/>

					<!-- Track markers on the ascent line -->
					{#each tracks as track, i}
						{@const progress = i / (tracks.length - 1)}
						{@const cx = 20 + progress * 260}
						{@const cy = 260 - progress * 220}
						<circle cx={cx} cy={cy} r="4" fill={track.color} opacity="0.8"/>
						<text x={cx + 8} y={cy + 3} fill="var(--color-text-dim)" font-size="8" font-family="var(--font-sans)">{track.icon}</text>
					{/each}
				</svg>
			</div>
		</div>
	</div>
</section>

<!-- The Journey -->
<section class="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
	<div class="mb-12">
		<p class="mb-2 text-[13px] font-medium uppercase tracking-widest text-text-dim">The Journey</p>
		<h2 class="display-serif text-2xl font-semibold tracking-tight sm:text-3xl">Six tracks from foundations to frontier</h2>
	</div>

	<div class="space-y-0">
		{#each tracks as track, i}
			<a
				href="/tracks/{track.slug}"
				class="group flex gap-5 border-t border-border py-6 transition-colors hover:bg-bg-card/50 sm:gap-8 sm:px-4"
			>
				<!-- Track number -->
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-xs font-semibold text-white/90"
					style="background: {track.color}"
				>
					{track.icon}
				</div>

				<div class="flex-1 min-w-0">
					<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
						<h3 class="display-serif text-lg font-semibold group-hover:text-primary-light transition-colors">{track.title}</h3>
						<span class="text-[12px] font-medium text-text-dim uppercase tracking-wider">{track.subtitle}</span>
					</div>
					<p class="mt-1 text-sm text-text-muted leading-relaxed line-clamp-2">{track.description}</p>
					<div class="mt-2 flex gap-4 text-[12px] text-text-dim">
						<span>{track.modules.length} modules</span>
						<span>{track.modules.reduce((s, m) => s + m.lessonsCount, 0)} lessons</span>
						<span>~{Math.round(track.modules.reduce((s, m) => s + m.estimatedMinutes, 0) / 60)}h</span>
					</div>
				</div>

				<!-- Arrow -->
				<svg class="mt-1 h-5 w-5 shrink-0 text-text-dim transition-colors group-hover:text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
					<path d="M9 5l7 7-7 7" />
				</svg>
			</a>
		{/each}
		<div class="border-t border-border"></div>
	</div>
</section>

<!-- What's different -->
<section class="border-t border-border bg-bg-card/30">
	<div class="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
		<div class="mb-12">
			<p class="mb-2 text-[13px] font-medium uppercase tracking-widest text-text-dim">Why this exists</p>
			<h2 class="display-serif text-2xl font-semibold tracking-tight sm:text-3xl">Built for depth, not just breadth</h2>
		</div>

		<div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
			<div>
				<div class="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-secondary/10">
					<svg class="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
					</svg>
				</div>
				<h3 class="mb-1.5 text-sm font-semibold">Interactive labs</h3>
				<p class="text-sm leading-relaxed text-text-muted">Train neural networks, visualize gradient descent, explore attention mechanisms — hands-on tools embedded in every lesson.</p>
			</div>
			<div>
				<div class="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-accent-gold/10">
					<svg class="h-4 w-4 text-accent-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path d="M13 10V3L4 14h7v7l9-11h-7z" />
					</svg>
				</div>
				<h3 class="mb-1.5 text-sm font-semibold">XP and achievements</h3>
				<p class="text-sm leading-relaxed text-text-muted">Earn XP for lessons and quizzes. Level up from Novice to Visionary. Unlock achievements as you progress.</p>
			</div>
			<div>
				<div class="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-accent-sage/10">
					<svg class="h-4 w-4 text-accent-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
					</svg>
				</div>
				<h3 class="mb-1.5 text-sm font-semibold">Quizzes and assessments</h3>
				<p class="text-sm leading-relaxed text-text-muted">Multiple choice, ordering, and fill-in questions after every module. Track what you've actually retained.</p>
			</div>
			<div>
				<div class="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
					<svg class="h-4 w-4 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
					</svg>
				</div>
				<h3 class="mb-1.5 text-sm font-semibold">Textbook-quality writing</h3>
				<p class="text-sm leading-relaxed text-text-muted">Not surface-level overviews. Real depth with analogies, worked examples, and historical context throughout.</p>
			</div>
			<div>
				<div class="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-accent-violet/10">
					<svg class="h-4 w-4 text-accent-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
				</div>
				<h3 class="mb-1.5 text-sm font-semibold">Progress tracking</h3>
				<p class="text-sm leading-relaxed text-text-muted">Pick up where you left off. Track completion across all tracks, modules, and lessons. Keep a daily streak.</p>
			</div>
			<div>
				<div class="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-accent-ochre/10">
					<svg class="h-4 w-4 text-accent-ochre" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<h3 class="mb-1.5 text-sm font-semibold">Beginner to expert</h3>
				<p class="text-sm leading-relaxed text-text-muted">Six progressive tracks that build on each other. Start with what intelligence means, end at the frontier of AGI research.</p>
			</div>
		</div>
	</div>
</section>

<!-- CTA -->
<section class="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
	<div class="max-w-lg">
		<h2 class="display-serif text-2xl font-semibold tracking-tight sm:text-3xl">Start climbing.</h2>
		<p class="mt-3 text-text-muted">Sign in to track your progress, or browse the curriculum freely.</p>
		<div class="mt-6 flex flex-col gap-3 sm:flex-row">
			{#if data.session?.user}
				<a
					href="/tracks"
					class="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
				>
					Go to Tracks
				</a>
			{:else}
				<button
					onclick={() => signIn()}
					class="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
				>
					Get Started Free
				</button>
			{/if}
		</div>
	</div>
</section>

<!-- Footer -->
<footer class="border-t border-border px-5 py-6 sm:px-8">
	<div class="mx-auto max-w-6xl flex items-center justify-between text-[12px] text-text-dim">
		<span class="display-serif">Gradient Ascent</span>
		<span>Open AI Education</span>
	</div>
</footer>
