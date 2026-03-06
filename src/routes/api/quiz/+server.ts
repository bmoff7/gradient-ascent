import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { quizResults, userXP } from '$lib/server/db/schema';
import { XP_VALUES } from '$lib/content/types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth?.();
	if (!session?.user?.id) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	const { moduleSlug, score, totalQuestions, passed } = await request.json();
	if (!moduleSlug || score === undefined || !totalQuestions) {
		return json({ error: 'Missing fields' }, { status: 400 });
	}

	const userId = session.user.id;
	const now = Date.now();

	// Record quiz result
	db.insert(quizResults).values({
		userId,
		moduleSlug,
		score,
		totalQuestions,
		passed,
		completedAt: new Date(now)
	}).run();

	// Award XP
	let xpEarned = 0;
	if (passed) {
		const isPerfect = score === totalQuestions;
		xpEarned = isPerfect ? XP_VALUES.QUIZ_PERFECT : XP_VALUES.QUIZ_PASS;

		db.insert(userXP).values({
			userId,
			amount: xpEarned,
			source: isPerfect ? 'quiz_perfect' : 'quiz_pass',
			sourceId: moduleSlug,
			earnedAt: new Date(now)
		}).run();
	}

	return json({
		success: true,
		passed,
		xpEarned,
		score,
		totalQuestions
	});
};
