import client from './db.js';

export async function createRequest(userId, type) {
  const check = await client.query(`SELECT * FROM requests WHERE user_id = $1`, [userId]);
  if (check.rows.length > 0) throw new Error("Request already exists");

  const result = await client.query(
    `INSERT INTO requests (user_id, type) VALUES ($1, $2) RETURNING *`,
    [userId, type]
  );
  return result.rows[0];
}

export async function getPendingRequests() {
  const res = await client.query(`
    SELECT r.*, u.name, u.username 
    FROM requests r JOIN users u ON r.user_id = u.id 
    WHERE r.status = 'Pending'
  `);
  return res.rows;
}

export async function approveRequest(requestId) {
  const res = await client.query(`SELECT * FROM requests WHERE id = $1`, [requestId]);
  const request = res.rows[0];
  if (!request) throw new Error("Request not found");
  if (request.status !== 'Pending') throw new Error("Already processed");

  const newStatus = request.type === 'out' ? 'Out' : 'In Campus';

  await client.query('BEGIN');
  await client.query(`UPDATE requests SET status = 'Approved', reviewed_at = CURRENT_TIMESTAMP WHERE id = $1`, [requestId]);
  await client.query(`UPDATE users SET status = $1 WHERE id = $2`, [newStatus, request.user_id]);
  await client.query('COMMIT');
  return { message: "Approved" };
}

export async function rejectRequest(requestId) {
  await client.query(`UPDATE requests SET status = 'Rejected', reviewed_at = CURRENT_TIMESTAMP WHERE id = $1 AND status = 'Pending'`, [requestId]);
  return { message: "Rejected" };
}

export async function clearRequest(userId) {
  await client.query(`DELETE FROM requests WHERE user_id = $1`, [userId]);
}
