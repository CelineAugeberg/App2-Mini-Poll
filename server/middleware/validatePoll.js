// server/middleware/validatePoll.js

export default function validatePoll(req, res, next) {
  const { question, options } = req.body;

  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "Poll must have a question" });
  }

  if (!Array.isArray(options) || options.length < 2) {
    return res.status(400).json({ error: "Poll must have at least 2 options" });
  }

  next();
}
