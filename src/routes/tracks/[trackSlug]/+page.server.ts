import type { PageServerLoad } from './$types';
import { getTrack } from '$lib/content/tracks';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { progress, quizResults } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals }) => {
	const track = getTrack(params.trackSlug);
	if (!track) throw error(404, 'Track not found');

	const session = await locals.auth?.();
	let moduleProgress: Record<string, { completedLessons: number; quizPassed: boolean }> = {};

	if (session?.user?.id) {
		for (const mod of track.modules) {
			const lessons = db
				.select()
				.from(progress)
				.where(
					and(
						eq(progress.userId, session.user.id),
						eq(progress.moduleSlug, mod.slug),
						eq(progress.completed, true)
					)
				)
				.all();

			const quiz = db
				.select()
				.from(quizResults)
				.where(
					and(
						eq(quizResults.userId, session.user.id),
						eq(quizResults.moduleSlug, mod.slug),
						eq(quizResults.passed, true)
					)
				)
				.get();

			moduleProgress[mod.slug] = {
				completedLessons: lessons.length,
				quizPassed: !!quiz
			};
		}
	}

	return { track, moduleProgress };
};
