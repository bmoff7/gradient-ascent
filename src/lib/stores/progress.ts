import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { supabase } from '$lib/supabase';
import { XP_VALUES } from '$lib/content/types';
import { tracks } from '$lib/content/tracks';
import { achievements } from '$lib/content/achievements';
import type { User } from '@supabase/supabase-js';

interface XPEvent {
	amount: number;
	source: string;
	sourceId: string;
	earnedAt: string;
}

interface QuizResult {
	score: number;
	totalQuestions: number;
	passed: boolean;
	completedAt: string;
}

interface StreakData {
	currentStreak: number;
	longestStreak: number;
	lastActivityDate: string | null;
}

interface ProgressData {
	user: User | null;
	completedLessons: Record<string, string[]>;
	quizResults: Record<string, QuizResult[]>;
	xpLog: XPEvent[];
	unlockedAchievements: string[];
	streak: StreakData;
	loading: boolean;
}

const defaultData: ProgressData = {
	user: null,
	completedLessons: {},
	quizResults: {},
	xpLog: [],
	unlockedAchievements: [],
	streak: { currentStreak: 0, longestStreak: 0, lastActivityDate: null },
	loading: true
};

function createProgressStore() {
	const store = writable<ProgressData>(defaultData);

	function update(fn: (data: ProgressData) => ProgressData) {
		store.update(fn);
	}

	async function fetchAllData(userId: string) {
		const [progressRes, quizRes, xpRes, achRes, streakRes] = await Promise.all([
			supabase.from('progress').select('*').eq('user_id', userId),
			supabase.from('quiz_results').select('*').eq('user_id', userId),
			supabase.from('xp_log').select('*').eq('user_id', userId).order('earned_at', { ascending: true }),
			supabase.from('achievements').select('*').eq('user_id', userId),
			supabase.from('streaks').select('*').eq('user_id', userId).single()
		]);

		// Build completedLessons map
		const completedLessons: Record<string, string[]> = {};
		for (const row of progressRes.data ?? []) {
			const mod = row.module_slug;
			if (!completedLessons[mod]) completedLessons[mod] = [];
			completedLessons[mod].push(row.lesson_slug);
		}

		// Build quizResults map
		const quizResults: Record<string, QuizResult[]> = {};
		for (const row of quizRes.data ?? []) {
			const mod = row.module_slug;
			if (!quizResults[mod]) quizResults[mod] = [];
			quizResults[mod].push({
				score: row.score,
				totalQuestions: row.total_questions,
				passed: row.passed,
				completedAt: row.completed_at
			});
		}

		// Build xpLog
		const xpLog: XPEvent[] = (xpRes.data ?? []).map((row) => ({
			amount: row.amount,
			source: row.source,
			sourceId: row.source_id,
			earnedAt: row.earned_at
		}));

		// Achievements
		const unlockedAchievements = (achRes.data ?? []).map((row) => row.achievement_id);

		// Streak
		const streakRow = streakRes.data;
		const streak: StreakData = streakRow
			? {
					currentStreak: streakRow.current_streak,
					longestStreak: streakRow.longest_streak,
					lastActivityDate: streakRow.last_activity_date
				}
			: { currentStreak: 0, longestStreak: 0, lastActivityDate: null };

		return { completedLessons, quizResults, xpLog, unlockedAchievements, streak };
	}

	return {
		subscribe: store.subscribe,

		async init() {
			if (!browser) return;

			// Listen for auth state changes
			supabase.auth.onAuthStateChange(async (event, session) => {
				if (session?.user) {
					const data = await fetchAllData(session.user.id);
					store.set({ ...data, user: session.user, loading: false });
				} else {
					store.set({ ...defaultData, loading: false });
				}
			});

			// Check initial session
			const { data: { session } } = await supabase.auth.getSession();
			if (session?.user) {
				const data = await fetchAllData(session.user.id);
				store.set({ ...data, user: session.user, loading: false });
			} else {
				store.set({ ...defaultData, loading: false });
			}
		},

		async signUp(email: string, password: string, displayName: string) {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: { data: { display_name: displayName } }
			});
			if (error) throw error;
			return data;
		},

		async signIn(email: string, password: string) {
			const { data, error } = await supabase.auth.signInWithPassword({ email, password });
			if (error) throw error;
			return data;
		},

		async signOut() {
			await supabase.auth.signOut();
			store.set({ ...defaultData, loading: false });
		},

		async completeLesson(trackSlug: string, moduleSlug: string, lessonSlug: string) {
			let userId = '';
			store.update((d) => {
				userId = d.user?.id ?? '';
				return d;
			});
			if (!userId) return;

			// Check if already completed locally
			let alreadyDone = false;
			store.update((d) => {
				const lessons = d.completedLessons[moduleSlug] ?? [];
				if (lessons.includes(lessonSlug)) {
					alreadyDone = true;
					return d;
				}
				// Optimistic update
				return {
					...d,
					completedLessons: { ...d.completedLessons, [moduleSlug]: [...lessons, lessonSlug] }
				};
			});
			if (alreadyDone) return;

			const now = new Date().toISOString();
			const today = now.split('T')[0];

			// Write to Supabase in parallel
			const [, , streakResult] = await Promise.all([
				supabase.from('progress').insert({
					user_id: userId,
					track_slug: trackSlug,
					module_slug: moduleSlug,
					lesson_slug: lessonSlug
				}),
				supabase.from('xp_log').insert({
					user_id: userId,
					amount: XP_VALUES.LESSON_COMPLETE,
					source: 'lesson_complete',
					source_id: `${moduleSlug}/${lessonSlug}`
				}),
				updateStreakInDB(userId, today)
			]);

			// Update local xp + streak
			update((d) => {
				const newXP: XPEvent = {
					amount: XP_VALUES.LESSON_COMPLETE,
					source: 'lesson_complete',
					sourceId: `${moduleSlug}/${lessonSlug}`,
					earnedAt: now
				};
				return {
					...d,
					xpLog: [...d.xpLog, newXP],
					streak: streakResult
				};
			});

			// Check and award achievements
			await checkAndAwardAchievements(userId);
		},

		async submitQuiz(moduleSlug: string, score: number, totalQuestions: number, passed: boolean) {
			let userId = '';
			store.update((d) => {
				userId = d.user?.id ?? '';
				return d;
			});
			if (!userId) return;

			const now = new Date().toISOString();
			const today = now.split('T')[0];
			const result: QuizResult = { score, totalQuestions, passed, completedAt: now };

			// Optimistic update
			update((d) => {
				const existing = d.quizResults[moduleSlug] ?? [];
				return {
					...d,
					quizResults: { ...d.quizResults, [moduleSlug]: [...existing, result] }
				};
			});

			// Write quiz result
			await supabase.from('quiz_results').insert({
				user_id: userId,
				module_slug: moduleSlug,
				score,
				total_questions: totalQuestions,
				passed
			});

			// Award XP if passed
			if (passed) {
				const isPerfect = score === totalQuestions;
				const xpAmount = isPerfect ? XP_VALUES.QUIZ_PERFECT : XP_VALUES.QUIZ_PASS;
				const xpSource = isPerfect ? 'quiz_perfect' : 'quiz_pass';

				await supabase.from('xp_log').insert({
					user_id: userId,
					amount: xpAmount,
					source: xpSource,
					source_id: moduleSlug
				});

				update((d) => ({
					...d,
					xpLog: [...d.xpLog, { amount: xpAmount, source: xpSource, sourceId: moduleSlug, earnedAt: now }]
				}));
			}

			// Update streak
			const streakResult = await updateStreakInDB(userId, today);
			update((d) => ({ ...d, streak: streakResult }));

			// Check achievements
			await checkAndAwardAchievements(userId);
		}
	};

	async function updateStreakInDB(userId: string, today: string): Promise<StreakData> {
		// Get current streak
		const { data: existing } = await supabase
			.from('streaks')
			.select('*')
			.eq('user_id', userId)
			.single();

		if (!existing) {
			await supabase.from('streaks').insert({
				user_id: userId,
				current_streak: 1,
				longest_streak: 1,
				last_activity_date: today
			});
			return { currentStreak: 1, longestStreak: 1, lastActivityDate: today };
		}

		if (existing.last_activity_date === today) {
			return {
				currentStreak: existing.current_streak,
				longestStreak: existing.longest_streak,
				lastActivityDate: existing.last_activity_date
			};
		}

		const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
		const newCurrent = existing.last_activity_date === yesterday ? existing.current_streak + 1 : 1;
		const newLongest = Math.max(newCurrent, existing.longest_streak);

		await supabase
			.from('streaks')
			.update({ current_streak: newCurrent, longest_streak: newLongest, last_activity_date: today })
			.eq('user_id', userId);

		return { currentStreak: newCurrent, longestStreak: newLongest, lastActivityDate: today };
	}

	async function checkAndAwardAchievements(userId: string) {
		let currentData: ProgressData = defaultData;
		store.update((d) => {
			currentData = d;
			return d;
		});

		const unlocked = new Set(currentData.unlockedAchievements);
		const newAchievements: string[] = [];

		function check(id: string) {
			if (unlocked.has(id)) return;
			unlocked.add(id);
			newAchievements.push(id);
		}

		// Total lessons
		const totalLessons = Object.values(currentData.completedLessons).reduce(
			(sum, arr) => sum + arr.length, 0
		);
		if (totalLessons >= 1) check('first-lesson');
		if (totalLessons >= 10) check('lessons-10');
		if (totalLessons >= 25) check('lessons-25');
		if (totalLessons >= 50) check('lessons-50');
		if (totalLessons >= 100) check('lessons-100');

		// Quiz achievements
		const allQuizResults = Object.values(currentData.quizResults).flat();
		const passedQuizzes = allQuizResults.filter((r) => r.passed);
		const perfectQuizzes = allQuizResults.filter((r) => r.passed && r.score === r.totalQuestions);

		if (passedQuizzes.length >= 1) check('first-quiz');
		if (perfectQuizzes.length >= 1) check('first-perfect');
		if (perfectQuizzes.length >= 5) check('perfect-5');
		if (perfectQuizzes.length >= 10) check('perfect-10');

		// Streak
		if (currentData.streak.currentStreak >= 3) check('streak-3');
		if (currentData.streak.currentStreak >= 7) check('streak-7');
		if (currentData.streak.currentStreak >= 30) check('streak-30');

		// Track completions
		let allTracksComplete = true;
		for (const track of tracks) {
			let trackComplete = true;
			for (const mod of track.modules) {
				const lessons = currentData.completedLessons[mod.slug] ?? [];
				const quizPassed = (currentData.quizResults[mod.slug] ?? []).some((r) => r.passed);
				if (lessons.length < mod.lessonsCount || !quizPassed) {
					trackComplete = false;
					break;
				}
			}
			if (trackComplete) check(`track-${track.slug}`);
			else allTracksComplete = false;
		}
		if (allTracksComplete) check('all-tracks');

		// XP milestones
		const totalXPAmount = currentData.xpLog.reduce((sum, e) => sum + e.amount, 0);
		if (totalXPAmount >= 1000) check('xp-1000');
		if (totalXPAmount >= 5000) check('xp-5000');
		if (totalXPAmount >= 10000) check('xp-10000');

		// Special
		const historyLessons = currentData.completedLessons['history-of-ai'] ?? [];
		const historyModule = tracks.flatMap((t) => t.modules).find((m) => m.slug === 'history-of-ai');
		if (historyModule && historyLessons.length >= historyModule.lessonsCount) check('history-buff');

		const mathQuiz = (currentData.quizResults['math-for-ai'] ?? []).find(
			(r) => r.passed && r.score === r.totalQuestions
		);
		if (mathQuiz) check('math-whiz');

		const nnLessons = currentData.completedLessons['neural-networks'] ?? [];
		const nnModule = tracks.flatMap((t) => t.modules).find((m) => m.slug === 'neural-networks');
		if (nnModule && nnLessons.length >= nnModule.lessonsCount) check('deep-diver');

		if (newAchievements.length === 0) return;

		// Write new achievements + XP to Supabase
		const now = new Date().toISOString();
		const achInserts = newAchievements.map((achId) => ({
			user_id: userId,
			achievement_id: achId
		}));
		const xpInserts = newAchievements.map((achId) => {
			const ach = achievements.find((a) => a.id === achId);
			return {
				user_id: userId,
				amount: ach?.xpReward ?? 50,
				source: 'achievement',
				source_id: achId
			};
		});

		await Promise.all([
			supabase.from('achievements').insert(achInserts),
			supabase.from('xp_log').insert(xpInserts)
		]);

		// Update local store
		update((d) => ({
			...d,
			unlockedAchievements: Array.from(unlocked),
			xpLog: [
				...d.xpLog,
				...newAchievements.map((achId) => {
					const ach = achievements.find((a) => a.id === achId);
					return {
						amount: ach?.xpReward ?? 50,
						source: 'achievement',
						sourceId: achId,
						earnedAt: now
					};
				})
			]
		}));
	}
}

export const progressStore = createProgressStore();

export const totalXP = derived(progressStore, (pd) =>
	pd.xpLog.reduce((sum, e) => sum + e.amount, 0)
);

export const userName = derived(progressStore, (pd) =>
	pd.user?.user_metadata?.display_name ?? pd.user?.email ?? null
);

export const isSignedIn = derived(progressStore, (pd) => !!pd.user);

export const isLoading = derived(progressStore, (pd) => pd.loading);
