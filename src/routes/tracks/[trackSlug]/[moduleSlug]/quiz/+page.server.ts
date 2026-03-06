import type { PageServerLoad } from './$types';
import { getTrack } from '$lib/content/tracks';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { quizResults } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals }) => {
	const track = getTrack(params.trackSlug);
	if (!track) throw error(404, 'Track not found');

	const moduleMeta = track.modules.find((m) => m.slug === params.moduleSlug);
	if (!moduleMeta) throw error(404, 'Module not found');

	let moduleContent;
	try {
		const imported = await import(`$lib/content/modules/${params.moduleSlug}.ts`);
		moduleContent = imported.default;
	} catch {
		throw error(404, 'Module content not found');
	}

	const session = await locals.auth?.();
	let bestResult: { score: number; totalQuestions: number; passed: boolean } | null = null;

	if (session?.user?.id) {
		const results = db
			.select()
			.from(quizResults)
			.where(
				and(
					eq(quizResults.userId, session.user.id),
					eq(quizResults.moduleSlug, params.moduleSlug)
				)
			)
			.all();

		if (results.length > 0) {
			const best = results.reduce((a, b) => (a.score > b.score ? a : b));
			bestResult = {
				score: best.score,
				totalQuestions: best.totalQuestions,
				passed: !!best.passed
			};
		}
	}

	return {
		track,
		module: moduleContent,
		moduleMeta,
		bestResult
	};
};
