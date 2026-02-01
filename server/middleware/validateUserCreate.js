// server/middleware/validateUserCreate.js

module.exports = function validateUserCreate(req, res, next) {
  const { username, password, consent } = req.body;

  // username
  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "username is required and must be a string" });
  }
  if (username.trim().length < 3) {
    return res.status(400).json({ error: "username must be at least 3 characters" });
  }

  // password
  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "password is required and must be a string" });
  }
  if (password.trim().length < 8) {
    return res.status(400).json({ error: "password must be at least 8 characters" });
  }

  // consent
  if (!consent || typeof consent !== "object") {
    return res.status(400).json({ error: "consent is required" });
  }
  if (consent.acceptedTos !== true) {
    return res.status(400).json({ error: "Terms of Service must be accepted" });
  }
  if (consent.acceptedPrivacy !== true) {
    return res.status(400).json({ error: "Privacy Policy must be accepted" });
  }

  if (!consent.version || typeof consent.version !== "string") {
    return res.status(400).json({ error: "consent.version is required" });
  }

  next();
};

