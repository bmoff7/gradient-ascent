import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { progress, quizResults, userXP, userAchievements, userStreaks } from '$lib/server/db/schema';
import { eq, and, sum, count, desc } from 'drizzle-orm';
import { tracks } from '$lib/content/tracks';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth?.();
	if (!session?.user?.id) throw redirect(302, '/auth/signin');

	const userId = session.user.id;

	// Total XP
	const xpResult = db
		.select({ total: sum(userXP.amount) })
		.from(userXP)
		.where(eq(userXP.userId, userId))
		.get();
	const totalXP = Number(xpResult?.total) || 0;

	// Completed lessons count
	const lessonCount = db
		.select({ count: count() })
		.from(progress)
		.where(eq(progress.userId, userId))
		.get();
	const completedLessons = lessonCount?.count ?? 0;

	// Passed quizzes
	const quizCount = db
		.select({ count: count() })
		.from(quizResults)
		.where(and(eq(quizResults.userId, userId), eq(quizResults.passed, true)))
		.get();
	const completedQuizzes = quizCount?.count ?? 0;

	// Achievements
	const achievementRows = db
		.select()
		.from(userAchievements)
		.where(eq(userAchievements.userId, userId))
		.all();

	// Streak
	const streak = db
		.select()
		.from(userStreaks)
		.where(eq(userStreaks.userId, userId))
		.get();

	// Recent activity (last 10 XP events)
	const recentXP = db
		.select()
		.from(userXP)
		.where(eq(userXP.userId, userId))
		.orderBy(desc(userXP.earnedAt))
		.limit(10)
		.all();

	// Track progress — fixed: filter by module slug
	const trackProgress = tracks.map((track) => {
		let completedModules = 0;
		for (const mod of track.modules) {
			// Count completed lessons for this specific module
			const lessonResult = db
				.select({ count: count() })
				.from(progress)
				.where(
					and(
						eq(progress.userId, userId),
						eq(progress.moduleSlug, mod.slug)
					)
				)
				.get();
			const moduleLessons = lessonResult?.count ?? 0;

			// Check if quiz was passed for this specific module
			const quizResult = db
				.select()
				.from(quizResults)
				.where(
					and(
						eq(quizResults.userId, userId),
						eq(quizResults.moduleSlug, mod.slug),
						eq(quizResults.passed, true)
					)
				)
				.get();

			if (moduleLessons >= mod.lessonsCount && quizResult) {
				completedModules++;
			}
		}
		return {
			slug: track.slug,
			title: track.title,
			icon: track.icon,
			color: track.color,
			totalModules: track.modules.length,
			completedModules
		};
	});

	return {
		totalXP,
		completedLessons,
		completedQuizzes,
		achievements: achievementRows.map((a) => a.achievementId),
		streak: streak ?? { currentStreak: 0, longestStreak: 0 },
		recentXP,
		trackProgress
	};
};
