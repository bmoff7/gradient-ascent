import type { PageServerLoad } from './$types';
import { getTrack, getAdjacentModules } from '$lib/content/tracks';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { progress } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals }) => {
	const track = getTrack(params.trackSlug);
	if (!track) throw error(404, 'Track not found');

	const moduleMeta = track.modules.find((m) => m.slug === params.moduleSlug);
	if (!moduleMeta) throw error(404, 'Module not found');

	// Dynamic import of module content
	let moduleContent;
	try {
		const imported = await import(`$lib/content/modules/${params.moduleSlug}.ts`);
		moduleContent = imported.default;
	} catch {
		throw error(404, 'Module content not found');
	}

	const session = await locals.auth?.();
	let completedLessons: string[] = [];

	if (session?.user?.id) {
		const rows = db
			.select()
			.from(progress)
			.where(
				and(
					eq(progress.userId, session.user.id),
					eq(progress.moduleSlug, params.moduleSlug),
					eq(progress.completed, true)
				)
			)
			.all();
		completedLessons = rows.map((r) => r.lessonSlug);
	}

	const adjacent = getAdjacentModules(params.trackSlug, params.moduleSlug);

	return {
		track,
		module: moduleContent,
		moduleMeta,
		completedLessons,
		adjacentModules: adjacent
	};
};
