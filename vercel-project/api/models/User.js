// api/models/User.js
// User model using PostgreSQL via the 'pg' driver (compatible with Neon serverless).
// DATABASE_URL is set as an environment variable — locally via .env, on Vercel via dashboard.

import pg from 'pg';
const { Pool } = pg;

// Create a connection pool.
// On Neon, SSL is required — rejectUnauthorized:false works for trusted cloud hosts.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost')
    ? false
    : { rejectUnauthorized: false },
});

// ── Auto-create the users table if it doesn't exist ──────────────────────────
// This runs once when the module is first imported.
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id       SERIAL PRIMARY KEY,
        email         TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('[User.js] users table ready');
  } catch (err) {
    console.error('[User.js] Error creating users table:', err.message);
  }
})();

// ── Model methods ─────────────────────────────────────────────────────────────

/**
 * Create a new user row.
 * @param {string} email
 * @param {string} passwordHash  bcrypt hash
 * @returns {{ user_id, email, created_at }}
 */
export async function createUser(email, passwordHash) {
  const res = await pool.query(
    `INSERT INTO users (email, password_hash)
     VALUES ($1, $2)
     RETURNING user_id, email, created_at`,
    [email.toLowerCase().trim(), passwordHash]
  );
  return res.rows[0];
}

/**
 * Find a user by email (case-insensitive).
 * @param {string} email
 * @returns {object|undefined}
 */
export async function findUserByEmail(email) {
  const res = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email.toLowerCase().trim()]
  );
  return res.rows[0];
}

/**
 * Find a user by primary key.
 * @param {number} id
 * @returns {object|undefined}
 */
export async function getUserById(id) {
  const res = await pool.query(
    'SELECT user_id, email, created_at FROM users WHERE user_id = $1',
    [id]
  );
  return res.rows[0];
}

export default pool;
