import type { PageLoad } from './$types';
import { getTrack } from '$lib/content/tracks';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
	const track = getTrack(params.trackSlug);
	if (!track) throw error(404, 'Track not found');
	return { track };
};
