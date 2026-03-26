import { Router } from "express";
import pool from "../db.js";
import validateAuth from "../middleware/validateAuth.js";

const router = Router();

async function getVoteCounts(pollId) {
  const { rows } = await pool.query(
    "SELECT option_index, COUNT(*)::int AS count FROM votes WHERE poll_id = $1 GROUP BY option_index",
    [pollId]
  );
  return rows;
}

function toApiPoll(row, voteCounts = []) {
  const options = (row.options || []).map((text, i) => ({
    text,
    votes: voteCounts.find((v) => v.option_index === i)?.count ?? 0,
  }));
  return { id: row.id, question: row.question, options, createdAt: row.created_at, createdBy: row.created_by };
}


router.get("/", validateAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM polls WHERE created_by = $1 ORDER BY created_at DESC",
      [req.token.id]
    );
    const polls = await Promise.all(
      rows.map(async (row) => toApiPoll(row, await getVoteCounts(row.id)))
    );
    res.json(polls);
  } catch (err) {
    console.error("GET /polls error:", err);
    res.status(500).json({ error: "Could not fetch polls." });
  }
});


router.post("/", validateAuth, async (req, res) => {
  const { question, options } = req.body;

  if (!question || typeof question !== "string" || !question.trim())
    return res.status(400).json({ error: "Question is required." });
  if (!Array.isArray(options) || options.length < 2)
    return res.status(400).json({ error: "At least 2 options are required." });

  const cleanOptions = options.map((o) => String(o).trim()).filter(Boolean);
  if (cleanOptions.length < 2)
    return res.status(400).json({ error: "At least 2 non-empty options are required." });

  try {
    const { rows } = await pool.query(
      "INSERT INTO polls (question, options, created_by) VALUES ($1, $2, $3) RETURNING *",
      [question.trim(), JSON.stringify(cleanOptions), req.token.id]
    );
    res.status(201).json(toApiPoll(rows[0]));
  } catch (err) {
    console.error("POST /polls error:", err);
    res.status(500).json({ error: "Could not create poll." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM polls WHERE id = $1", [req.params.id]);
    if (!rows.length) return res.sendStatus(404);
    const votes = await getVoteCounts(req.params.id);
    res.json(toApiPoll(rows[0], votes));
  } catch (err) {
    console.error("GET /polls/:id error:", err);
    res.status(500).json({ error: "Could not fetch poll." });
  }
});

router.post("/:id/vote", async (req, res) => {
  const { optionIndex } = req.body;
  try {
    const { rows } = await pool.query("SELECT * FROM polls WHERE id = $1", [req.params.id]);
    if (!rows.length) return res.sendStatus(404);

    const options = rows[0].options;
    if (typeof optionIndex !== "number" || optionIndex < 0 || optionIndex >= options.length)
      return res.status(400).json({ error: "Invalid option." });

    await pool.query("INSERT INTO votes (poll_id, option_index) VALUES ($1, $2)", [
      req.params.id,
      optionIndex,
    ]);
    const votes = await getVoteCounts(req.params.id);
    res.json(toApiPoll(rows[0], votes));
  } catch (err) {
    console.error("POST /polls/:id/vote error:", err);
    res.status(500).json({ error: "Could not register vote." });
  }
});

router.put("/:id", validateAuth, async (req, res) => {
  const { question, options } = req.body;

  if (!question || typeof question !== "string" || !question.trim())
    return res.status(400).json({ error: "Question is required." });
  if (!Array.isArray(options) || options.length < 2)
    return res.status(400).json({ error: "At least 2 options are required." });

  const cleanOptions = options.map((o) => String(o).trim()).filter(Boolean);
  if (cleanOptions.length < 2)
    return res.status(400).json({ error: "At least 2 non-empty options are required." });

  try {
    const { rows } = await pool.query("SELECT * FROM polls WHERE id = $1", [req.params.id]);
    if (!rows.length) return res.sendStatus(404);
    if (rows[0].created_by !== req.token.id) return res.sendStatus(403);

    const { rows: updated } = await pool.query(
      "UPDATE polls SET question = $1, options = $2 WHERE id = $3 RETURNING *",
      [question.trim(), JSON.stringify(cleanOptions), req.params.id]
    );
    const votes = await getVoteCounts(req.params.id);
    res.json(toApiPoll(updated[0], votes));
  } catch (err) {
    console.error("PUT /polls/:id error:", err);
    res.status(500).json({ error: "Could not update poll." });
  }
});

router.delete("/:id", validateAuth, async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM polls WHERE id = $1", [req.params.id]);
    if (!rows.length) return res.sendStatus(404);
    if (rows[0].created_by !== req.token.id) return res.sendStatus(403);

    await pool.query("DELETE FROM polls WHERE id = $1", [req.params.id]);
    res.sendStatus(204);
  } catch (err) {
    console.error("DELETE /polls/:id error:", err);
    res.status(500).json({ error: "Could not delete poll." });
  }
});

export default router;
