import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { XP_VALUES } from '$lib/content/types';
import { tracks } from '$lib/content/tracks';
import { achievements } from '$lib/content/achievements';

const STORAGE_KEY = 'gradient-ascent';

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
	name: string | null;
	completedLessons: Record<string, string[]>; // moduleSlug -> lessonSlug[]
	quizResults: Record<string, QuizResult[]>; // moduleSlug -> results[]
	xpLog: XPEvent[];
	unlockedAchievements: string[];
	streak: StreakData;
}

const defaultData: ProgressData = {
	name: null,
	completedLessons: {},
	quizResults: {},
	xpLog: [],
	unlockedAchievements: [],
	streak: { currentStreak: 0, longestStreak: 0, lastActivityDate: null }
};

function loadFromStorage(): ProgressData {
	if (!browser) return defaultData;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) return { ...defaultData, ...JSON.parse(raw) };
	} catch {}
	return defaultData;
}

function saveToStorage(data: ProgressData) {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	} catch {}
}

function createProgressStore() {
	const store = writable<ProgressData>(loadFromStorage());

	// Auto-save on changes
	if (browser) {
		store.subscribe((data) => saveToStorage(data));
	}

	function update(fn: (data: ProgressData) => ProgressData) {
		store.update(fn);
	}

	return {
		subscribe: store.subscribe,

		init() {
			store.set(loadFromStorage());
		},

		setName(name: string) {
			update((d) => ({ ...d, name }));
		},

		signOut() {
			store.set(defaultData);
			if (browser) localStorage.removeItem(STORAGE_KEY);
		},

		completeLesson(trackSlug: string, moduleSlug: string, lessonSlug: string) {
			update((d) => {
				const lessons = d.completedLessons[moduleSlug] ?? [];
				if (lessons.includes(lessonSlug)) return d;

				const newLessons = { ...d.completedLessons, [moduleSlug]: [...lessons, lessonSlug] };
				const now = new Date().toISOString();

				// Add XP
				const newXP: XPEvent = {
					amount: XP_VALUES.LESSON_COMPLETE,
					source: 'lesson_complete',
					sourceId: `${moduleSlug}/${lessonSlug}`,
					earnedAt: now
				};

				// Update streak
				const today = now.split('T')[0];
				const newStreak = updateStreak(d.streak, today);

				const newData = {
					...d,
					completedLessons: newLessons,
					xpLog: [...d.xpLog, newXP],
					streak: newStreak
				};

				// Check achievements
				return checkAchievements(newData);
			});
		},

		submitQuiz(moduleSlug: string, score: number, totalQuestions: number, passed: boolean) {
			update((d) => {
				const now = new Date().toISOString();
				const result: QuizResult = { score, totalQuestions, passed, completedAt: now };
				const existing = d.quizResults[moduleSlug] ?? [];
				const newResults = { ...d.quizResults, [moduleSlug]: [...existing, result] };

				let xpEvents = [...d.xpLog];
				if (passed) {
					const isPerfect = score === totalQuestions;
					xpEvents.push({
						amount: isPerfect ? XP_VALUES.QUIZ_PERFECT : XP_VALUES.QUIZ_PASS,
						source: isPerfect ? 'quiz_perfect' : 'quiz_pass',
						sourceId: moduleSlug,
						earnedAt: now
					});
				}

				const today = now.split('T')[0];
				const newStreak = updateStreak(d.streak, today);

				const newData = {
					...d,
					quizResults: newResults,
					xpLog: xpEvents,
					streak: newStreak
				};

				return checkAchievements(newData);
			});
		},

		getCompletedLessons(moduleSlug: string): string[] {
			return get(store).completedLessons[moduleSlug] ?? [];
		},

		getBestQuizResult(moduleSlug: string): QuizResult | null {
			const results = get(store).quizResults[moduleSlug];
			if (!results || results.length === 0) return null;
			return results.reduce((a, b) => (a.score > b.score ? a : b));
		},

		getModuleProgress(moduleSlug: string) {
			const data = get(store);
			const lessons = data.completedLessons[moduleSlug] ?? [];
			const quizResults = data.quizResults[moduleSlug] ?? [];
			const quizPassed = quizResults.some((r) => r.passed);
			return { completedLessons: lessons.length, quizPassed };
		}
	};
}

function updateStreak(streak: StreakData, today: string): StreakData {
	if (streak.lastActivityDate === today) return streak;

	const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
	const newCurrent = streak.lastActivityDate === yesterday ? streak.currentStreak + 1 : 1;
	const newLongest = Math.max(newCurrent, streak.longestStreak);

	return { currentStreak: newCurrent, longestStreak: newLongest, lastActivityDate: today };
}

function checkAchievements(data: ProgressData): ProgressData {
	const unlocked = new Set(data.unlockedAchievements);
	const newXP = [...data.xpLog];
	let changed = false;

	function unlock(id: string) {
		if (unlocked.has(id)) return;
		const ach = achievements.find((a) => a.id === id);
		if (!ach) return;
		unlocked.add(id);
		newXP.push({
			amount: ach.xpReward,
			source: 'achievement',
			sourceId: id,
			earnedAt: new Date().toISOString()
		});
		changed = true;
	}

	// Count total completed lessons
	const totalLessons = Object.values(data.completedLessons).reduce(
		(sum, arr) => sum + arr.length,
		0
	);

	// First lesson
	if (totalLessons >= 1) unlock('first-lesson');
	if (totalLessons >= 10) unlock('lessons-10');
	if (totalLessons >= 25) unlock('lessons-25');
	if (totalLessons >= 50) unlock('lessons-50');
	if (totalLessons >= 100) unlock('lessons-100');

	// Quiz achievements
	const allQuizResults = Object.values(data.quizResults).flat();
	const passedQuizzes = allQuizResults.filter((r) => r.passed);
	const perfectQuizzes = allQuizResults.filter(
		(r) => r.passed && r.score === r.totalQuestions
	);

	if (passedQuizzes.length >= 1) unlock('first-quiz');
	if (perfectQuizzes.length >= 1) unlock('first-perfect');
	if (perfectQuizzes.length >= 5) unlock('perfect-5');
	if (perfectQuizzes.length >= 10) unlock('perfect-10');

	// Streak
	if (data.streak.currentStreak >= 3) unlock('streak-3');
	if (data.streak.currentStreak >= 7) unlock('streak-7');
	if (data.streak.currentStreak >= 30) unlock('streak-30');

	// Track completions
	let allTracksComplete = true;
	for (const track of tracks) {
		let trackComplete = true;
		for (const mod of track.modules) {
			const lessons = data.completedLessons[mod.slug] ?? [];
			const quizPassed = (data.quizResults[mod.slug] ?? []).some((r) => r.passed);
			if (lessons.length < mod.lessonsCount || !quizPassed) {
				trackComplete = false;
				break;
			}
		}
		if (trackComplete) {
			unlock(`track-${track.slug}`);
		} else {
			allTracksComplete = false;
		}
	}
	if (allTracksComplete) unlock('all-tracks');

	// XP milestones
	const totalXP = newXP.reduce((sum, e) => sum + e.amount, 0);
	if (totalXP >= 1000) unlock('xp-1000');
	if (totalXP >= 5000) unlock('xp-5000');
	if (totalXP >= 10000) unlock('xp-10000');

	// Special achievements
	const historyLessons = data.completedLessons['history-of-ai'] ?? [];
	const historyModule = tracks
		.flatMap((t) => t.modules)
		.find((m) => m.slug === 'history-of-ai');
	if (historyModule && historyLessons.length >= historyModule.lessonsCount) {
		unlock('history-buff');
	}

	const mathQuiz = (data.quizResults['math-for-ai'] ?? []).find(
		(r) => r.passed && r.score === r.totalQuestions
	);
	if (mathQuiz) unlock('math-whiz');

	const nnLessons = data.completedLessons['neural-networks'] ?? [];
	const nnModule = tracks
		.flatMap((t) => t.modules)
		.find((m) => m.slug === 'neural-networks');
	if (nnModule && nnLessons.length >= nnModule.lessonsCount) {
		unlock('deep-diver');
	}

	if (!changed) return data;

	return {
		...data,
		unlockedAchievements: Array.from(unlocked),
		xpLog: newXP
	};
}

export const progressStore = createProgressStore();

export const totalXP = derived(progressStore, ($p) =>
	$p.xpLog.reduce((sum, e) => sum + e.amount, 0)
);

export const userName = derived(progressStore, ($p) => $p.name);

export const isSignedIn = derived(progressStore, ($p) => !!$p.name);
