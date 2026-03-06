import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { userXP } from '$lib/server/db/schema';
import { eq, sum } from 'drizzle-orm';

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.auth?.();

	let totalXP = 0;
	if (session?.user?.id) {
		const result = db
			.select({ total: sum(userXP.amount) })
			.from(userXP)
			.where(eq(userXP.userId, session.user.id))
			.get();
		totalXP = Number(result?.total) || 0;
	}

	return {
		session,
		totalXP
	};
};
