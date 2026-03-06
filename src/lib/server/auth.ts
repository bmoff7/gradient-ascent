import { SvelteKitAuth } from '@auth/sveltekit';
import Credentials from '@auth/sveltekit/providers/credentials';
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [
		Credentials({
			name: 'Sign In',
			credentials: {
				name: { label: 'Display Name', type: 'text' }
			},
			async authorize(credentials) {
				const name = (credentials?.name as string)?.trim();
				if (!name || name.length < 1) return null;

				// Find existing user by name, or create one
				let user = db
					.select()
					.from(users)
					.where(eq(users.name, name))
					.get();

				if (!user) {
					const id = crypto.randomUUID();
					db.insert(users)
						.values({ id, name })
						.run();
					user = { id, name, email: null, emailVerified: null, image: null };
				}

				return { id: user.id, name: user.name };
			}
		})
	],
	session: { strategy: 'jwt' },
	callbacks: {
		jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.name = user.name;
			}
			return token;
		},
		session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
				session.user.name = token.name as string;
			}
			return session;
		}
	},
	pages: {
		signIn: '/auth/signin'
	},
	trustHost: true
});
