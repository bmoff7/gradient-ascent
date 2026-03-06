import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { progress, userXP, userStreaks } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { XP_VALUES } from '$lib/content/types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth?.();
	if (!session?.user?.id) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	const { trackSlug, moduleSlug, lessonSlug } = await request.json();
	if (!trackSlug || !moduleSlug || !lessonSlug) {
		return json({ error: 'Missing fields' }, { status: 400 });
	}

	const userId = session.user.id;

	// Check if already completed
	const existing = db
		.select()
		.from(progress)
		.where(
			and(
				eq(progress.userId, userId),
				eq(progress.moduleSlug, moduleSlug),
				eq(progress.lessonSlug, lessonSlug)
			)
		)
		.get();

	if (existing) {
		return json({ success: true, alreadyCompleted: true });
	}

	const now = Date.now();

	// Record progress
	db.insert(progress).values({
		userId,
		trackSlug,
		moduleSlug,
		lessonSlug,
		completed: true,
		completedAt: new Date(now)
	}).run();

	// Award XP
	db.insert(userXP).values({
		userId,
		amount: XP_VALUES.LESSON_COMPLETE,
		source: 'lesson_complete',
		sourceId: `${moduleSlug}/${lessonSlug}`,
		earnedAt: new Date(now)
	}).run();

	// Update streak
	const today = new Date().toISOString().split('T')[0];
	const streak = db
		.select()
		.from(userStreaks)
		.where(eq(userStreaks.userId, userId))
		.get();

	if (streak) {
		if (streak.lastActivityDate !== today) {
			const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
			const newStreak = streak.lastActivityDate === yesterday
				? (streak.currentStreak ?? 0) + 1
				: 1;
			const longestStreak = Math.max(newStreak, streak.longestStreak ?? 0);

			db.update(userStreaks)
				.set({ currentStreak: newStreak, longestStreak, lastActivityDate: today })
				.where(eq(userStreaks.userId, userId))
				.run();
		}
	} else {
		db.insert(userStreaks).values({
			userId,
			currentStreak: 1,
			longestStreak: 1,
			lastActivityDate: today
		}).run();
	}

	return json({
		success: true,
		xpEarned: XP_VALUES.LESSON_COMPLETE
	});
};
