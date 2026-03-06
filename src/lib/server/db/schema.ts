import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import type { AdapterAccountType } from '@auth/core/adapters';

// ─── Auth.js Required Tables ───

export const users = sqliteTable('user', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name'),
	email: text('email'),
	emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
	image: text('image')
});

export const accounts = sqliteTable(
	'account',
	{
		userId: text('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: text('type').$type<AdapterAccountType>().notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state')
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId]
		})
	})
);

export const sessions = sqliteTable('session', {
	sessionToken: text('sessionToken').primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires: integer('expires', { mode: 'timestamp_ms' }).notNull()
});

export const verificationTokens = sqliteTable(
	'verificationToken',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: integer('expires', { mode: 'timestamp_ms' }).notNull()
	},
	(vt) => ({
		compoundKey: primaryKey({ columns: [vt.identifier, vt.token] })
	})
);

// ─── App Tables ───

export const progress = sqliteTable('progress', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	trackSlug: text('trackSlug').notNull(),
	moduleSlug: text('moduleSlug').notNull(),
	lessonSlug: text('lessonSlug').notNull(),
	completed: integer('completed', { mode: 'boolean' }).default(false),
	completedAt: integer('completedAt', { mode: 'timestamp_ms' })
});

export const quizResults = sqliteTable('quiz_result', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	moduleSlug: text('moduleSlug').notNull(),
	score: integer('score').notNull(),
	totalQuestions: integer('totalQuestions').notNull(),
	passed: integer('passed', { mode: 'boolean' }).default(false),
	completedAt: integer('completedAt', { mode: 'timestamp_ms' })
});

export const userXP = sqliteTable('user_xp', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	amount: integer('amount').notNull(),
	source: text('source').notNull(),
	sourceId: text('sourceId'),
	earnedAt: integer('earnedAt', { mode: 'timestamp_ms' })
});

export const userAchievements = sqliteTable('user_achievement', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	achievementId: text('achievementId').notNull(),
	unlockedAt: integer('unlockedAt', { mode: 'timestamp_ms' })
});

export const userStreaks = sqliteTable('user_streak', {
	userId: text('userId')
		.primaryKey()
		.references(() => users.id, { onDelete: 'cascade' }),
	currentStreak: integer('currentStreak').default(0),
	longestStreak: integer('longestStreak').default(0),
	lastActivityDate: text('lastActivityDate')
});
