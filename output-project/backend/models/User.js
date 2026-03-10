// backend/models/User.js
// User model using SQLite via better-sqlite3 (zero-config, file-based DB)
// Each user row: user_id, email, password_hash, created_at

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Resolve DB path relative to this file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR = path.join(__dirname, '../data');
const DB_PATH = path.join(DB_DIR, 'app.db');

// Ensure the data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Open (or create) the SQLite database
const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// ── Create users table if it doesn't exist ──────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    user_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    email     TEXT    NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT   NOT NULL DEFAULT (datetime('now'))
  );
`);

// ── Model methods ────────────────────────────────────────────────────────────

/**
 * Create a new user record.
 * @param {string} email
 * @param {string} passwordHash  bcrypt hash
 * @returns {{ user_id, email, created_at }}
 */
export function createUser(email, passwordHash) {
  const stmt = db.prepare(
    'INSERT INTO users (email, password_hash) VALUES (?, ?)'
  );
  const result = stmt.run(email.toLowerCase().trim(), passwordHash);
  return getUserById(result.lastInsertRowid);
}

/**
 * Find a user by email (case-insensitive).
 * @param {string} email
 * @returns {object|undefined}
 */
export function findUserByEmail(email) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email.toLowerCase().trim());
}

/**
 * Find a user by their primary key.
 * @param {number} id
 * @returns {object|undefined}
 */
export function getUserById(id) {
  const stmt = db.prepare(
    'SELECT user_id, email, created_at FROM users WHERE user_id = ?'
  );
  return stmt.get(id);
}

export default db;
