import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});


function toUser(row) {
  return {
    id: row.id,
    username: row.username,
    passwordHash: row.password_hash,
    consent: row.consent,
  };
}

async function findByUsername(username) {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE username = $1 LIMIT 1",
    [username.trim().toLowerCase()]
  );
  return rows.length ? toUser(rows[0]) : null;
}

async function createUser(username, passwordHash, consent) {
  const { rows } = await pool.query(
    "INSERT INTO users (username, password_hash, consent) VALUES ($1, $2, $3) RETURNING *",
    [username.trim().toLowerCase(), passwordHash, !!consent]
  );
  return toUser(rows[0]);
}

async function deleteUser(id) {
  const { rowCount } = await pool.query(
    "DELETE FROM users WHERE id = $1",
    [Number(id)]
  );
  return rowCount > 0;
}

async function updatePassword(id, newPasswordHash) {
  const { rowCount } = await pool.query(
    "UPDATE users SET password_hash = $1 WHERE id = $2",
    [newPasswordHash, Number(id)]
  );
  return rowCount > 0;
}

export default { findByUsername, createUser, deleteUser, updatePassword };
