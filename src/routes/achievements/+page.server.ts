import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { userAchievements } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { achievements } from '$lib/content/achievements';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth?.();
	if (!session?.user?.id) throw redirect(302, '/auth/signin');

	const unlocked = db
		.select()
		.from(userAchievements)
		.where(eq(userAchievements.userId, session.user.id))
		.all();

	const unlockedIds = new Set(unlocked.map((a) => a.achievementId));

	return {
		achievements: achievements.map((a) => ({
			...a,
			unlocked: unlockedIds.has(a.id),
			unlockedAt: unlocked.find((u) => u.achievementId === a.id)?.unlockedAt
		}))
	};
};
