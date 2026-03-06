import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

const sqlite = new Database('local.db');
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite, { schema });

// Auto-create tables on first run
sqlite.exec(`
	CREATE TABLE IF NOT EXISTS user (
		id TEXT PRIMARY KEY,
		name TEXT,
		email TEXT,
		emailVerified INTEGER,
		image TEXT
	);
	CREATE TABLE IF NOT EXISTS account (
		userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
		type TEXT NOT NULL,
		provider TEXT NOT NULL,
		providerAccountId TEXT NOT NULL,
		refresh_token TEXT,
		access_token TEXT,
		expires_at INTEGER,
		token_type TEXT,
		scope TEXT,
		id_token TEXT,
		session_state TEXT,
		PRIMARY KEY (provider, providerAccountId)
	);
	CREATE TABLE IF NOT EXISTS session (
		sessionToken TEXT PRIMARY KEY,
		userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
		expires INTEGER NOT NULL
	);
	CREATE TABLE IF NOT EXISTS verificationToken (
		identifier TEXT NOT NULL,
		token TEXT NOT NULL,
		expires INTEGER NOT NULL,
		PRIMARY KEY (identifier, token)
	);
	CREATE TABLE IF NOT EXISTS progress (
		id TEXT PRIMARY KEY,
		userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
		trackSlug TEXT NOT NULL,
		moduleSlug TEXT NOT NULL,
		lessonSlug TEXT NOT NULL,
		completed INTEGER DEFAULT 0,
		completedAt INTEGER
	);
	CREATE TABLE IF NOT EXISTS quiz_result (
		id TEXT PRIMARY KEY,
		userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
		moduleSlug TEXT NOT NULL,
		score INTEGER NOT NULL,
		totalQuestions INTEGER NOT NULL,
		passed INTEGER DEFAULT 0,
		completedAt INTEGER
	);
	CREATE TABLE IF NOT EXISTS user_xp (
		id TEXT PRIMARY KEY,
		userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
		amount INTEGER NOT NULL,
		source TEXT NOT NULL,
		sourceId TEXT,
		earnedAt INTEGER
	);
	CREATE TABLE IF NOT EXISTS user_achievement (
		id TEXT PRIMARY KEY,
		userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
		achievementId TEXT NOT NULL,
		unlockedAt INTEGER
	);
	CREATE TABLE IF NOT EXISTS user_streak (
		userId TEXT PRIMARY KEY REFERENCES user(id) ON DELETE CASCADE,
		currentStreak INTEGER DEFAULT 0,
		longestStreak INTEGER DEFAULT 0,
		lastActivityDate TEXT
	);
	CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(userId);
	CREATE INDEX IF NOT EXISTS idx_progress_module ON progress(moduleSlug);
	CREATE INDEX IF NOT EXISTS idx_quiz_user ON quiz_result(userId);
	CREATE INDEX IF NOT EXISTS idx_xp_user ON user_xp(userId);
	CREATE INDEX IF NOT EXISTS idx_achievement_user ON user_achievement(userId);
`);
