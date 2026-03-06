export interface Track {
	slug: string;
	title: string;
	subtitle: string;
	description: string;
	color: string;
	colorTo: string;
	icon: string;
	order: number;
	modules: ModuleMeta[];
}

export interface ModuleMeta {
	slug: string;
	title: string;
	description: string;
	estimatedMinutes: number;
	lessonsCount: number;
	xpReward: number;
}

export interface LessonMeta {
	slug: string;
	title: string;
	estimatedMinutes: number;
	xpReward: number;
}

export interface Lesson {
	slug: string;
	title: string;
	content: string;
	estimatedMinutes: number;
	xpReward: number;
}

export interface Module {
	slug: string;
	title: string;
	description: string;
	estimatedMinutes: number;
	xpReward: number;
	quizXpReward: number;
	lessons: Lesson[];
	quiz: Quiz;
}

export interface Quiz {
	questions: QuizQuestion[];
	passingScore: number;
}

export type QuizQuestion = MultipleChoiceQuestion | OrderingQuestion | FillInQuestion;

export interface MultipleChoiceQuestion {
	type: 'multiple-choice';
	id: string;
	question: string;
	options: string[];
	correctIndex: number;
	explanation: string;
}

export interface OrderingQuestion {
	type: 'ordering';
	id: string;
	question: string;
	items: string[];
	correctOrder: number[];
	explanation: string;
}

export interface FillInQuestion {
	type: 'fill-in';
	id: string;
	question: string;
	acceptedAnswers: string[];
	explanation: string;
}

export interface Achievement {
	id: string;
	title: string;
	description: string;
	icon: string;
	xpReward: number;
}

export const XP_VALUES = {
	LESSON_COMPLETE: 15,
	QUIZ_PASS: 50,
	QUIZ_PERFECT: 100,
	STREAK_BONUS_3: 25,
	STREAK_BONUS_7: 75,
	STREAK_BONUS_30: 250,
	TRACK_COMPLETE: 200,
	ACHIEVEMENT_UNLOCK: 50
} as const;

export const LEVELS = [
	{ name: 'Novice', minXP: 0, icon: '🌱' },
	{ name: 'Apprentice', minXP: 200, icon: '🌿' },
	{ name: 'Practitioner', minXP: 750, icon: '🌳' },
	{ name: 'Specialist', minXP: 2000, icon: '⚡' },
	{ name: 'Expert', minXP: 4000, icon: '🔥' },
	{ name: 'Master', minXP: 7500, icon: '💎' },
	{ name: 'Architect', minXP: 12000, icon: '🏔️' },
	{ name: 'Visionary', minXP: 20000, icon: '✨' }
] as const;

export function getLevelForXP(xp: number) {
	let level = LEVELS[0];
	for (const l of LEVELS) {
		if (xp >= l.minXP) level = l;
		else break;
	}
	const currentIndex = LEVELS.indexOf(level);
	const nextLevel = LEVELS[currentIndex + 1];
	const progressToNext = nextLevel
		? (xp - level.minXP) / (nextLevel.minXP - level.minXP)
		: 1;
	return { ...level, index: currentIndex, progressToNext, totalXP: xp, nextLevel };
}
