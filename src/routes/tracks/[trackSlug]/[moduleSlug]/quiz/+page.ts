import type { PageLoad } from './$types';
import { getTrack } from '$lib/content/tracks';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
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

	return {
		track,
		module: moduleContent,
		moduleMeta
	};
};
