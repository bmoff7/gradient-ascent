import type { Achievement } from './types';

export const achievements: Achievement[] = [
	// First steps
	{
		id: 'first-lesson',
		title: 'First Steps',
		description: 'Complete your first lesson',
		icon: '👣',
		xpReward: 25
	},
	{
		id: 'first-quiz',
		title: 'Quiz Taker',
		description: 'Complete your first quiz',
		icon: '📝',
		xpReward: 25
	},
	{
		id: 'first-perfect',
		title: 'Perfectionist',
		description: 'Score 100% on a quiz',
		icon: '💯',
		xpReward: 50
	},

	// Lesson milestones
	{
		id: 'lessons-10',
		title: 'Getting Warmed Up',
		description: 'Complete 10 lessons',
		icon: '🔥',
		xpReward: 50
	},
	{
		id: 'lessons-25',
		title: 'Dedicated Learner',
		description: 'Complete 25 lessons',
		icon: '📚',
		xpReward: 100
	},
	{
		id: 'lessons-50',
		title: 'Knowledge Seeker',
		description: 'Complete 50 lessons',
		icon: '🧠',
		xpReward: 150
	},
	{
		id: 'lessons-100',
		title: 'Century Club',
		description: 'Complete 100 lessons',
		icon: '🏆',
		xpReward: 300
	},

	// Track completions
	{
		id: 'track-base-camp',
		title: 'Base Camp Conquered',
		description: 'Complete all modules in Base Camp',
		icon: '⛺',
		xpReward: 200
	},
	{
		id: 'track-the-ascent',
		title: 'Ascent Complete',
		description: 'Complete all modules in The Ascent',
		icon: '🧗',
		xpReward: 200
	},
	{
		id: 'track-the-steep-climb',
		title: 'Steep Climb Conquered',
		description: 'Complete all modules in The Steep Climb',
		icon: '⛰️',
		xpReward: 200
	},
	{
		id: 'track-the-summit',
		title: 'Summit Reached',
		description: 'Complete all modules in The Summit',
		icon: '🏔️',
		xpReward: 200
	},
	{
		id: 'track-the-ridge',
		title: 'Ridge Runner',
		description: 'Complete all modules in The Ridge',
		icon: '🌄',
		xpReward: 200
	},
	{
		id: 'track-beyond-the-peak',
		title: 'Beyond the Peak',
		description: 'Complete all modules in Beyond the Peak',
		icon: '🚀',
		xpReward: 200
	},

	// Streak achievements
	{
		id: 'streak-3',
		title: 'Consistent',
		description: 'Maintain a 3-day learning streak',
		icon: '⚡',
		xpReward: 25
	},
	{
		id: 'streak-7',
		title: 'Week Warrior',
		description: 'Maintain a 7-day learning streak',
		icon: '🗓️',
		xpReward: 75
	},
	{
		id: 'streak-30',
		title: 'Monthly Master',
		description: 'Maintain a 30-day learning streak',
		icon: '👑',
		xpReward: 250
	},

	// Quiz perfection
	{
		id: 'perfect-5',
		title: 'Sharp Mind',
		description: 'Score 100% on 5 different quizzes',
		icon: '🎯',
		xpReward: 100
	},
	{
		id: 'perfect-10',
		title: 'Quiz Master',
		description: 'Score 100% on 10 different quizzes',
		icon: '🌟',
		xpReward: 200
	},

	// XP milestones
	{
		id: 'xp-1000',
		title: 'Breaking Through',
		description: 'Earn 1,000 total XP',
		icon: '💪',
		xpReward: 50
	},
	{
		id: 'xp-5000',
		title: 'Power Player',
		description: 'Earn 5,000 total XP',
		icon: '⚡',
		xpReward: 100
	},
	{
		id: 'xp-10000',
		title: 'XP Legend',
		description: 'Earn 10,000 total XP',
		icon: '✨',
		xpReward: 200
	},

	// Special
	{
		id: 'all-tracks',
		title: 'AI Architect',
		description: 'Complete every track in Gradient Ascent',
		icon: '🏗️',
		xpReward: 500
	},
	{
		id: 'history-buff',
		title: 'History Buff',
		description: 'Complete the entire History of AI module',
		icon: '📜',
		xpReward: 75
	},
	{
		id: 'math-whiz',
		title: 'Math Whiz',
		description: 'Score 100% on the Mathematics for AI quiz',
		icon: '🧮',
		xpReward: 75
	},
	{
		id: 'deep-diver',
		title: 'Deep Diver',
		description: 'Complete the Neural Networks from Scratch module',
		icon: '🤿',
		xpReward: 75
	}
];

export function getAchievement(id: string): Achievement | undefined {
	return achievements.find((a) => a.id === id);
}
