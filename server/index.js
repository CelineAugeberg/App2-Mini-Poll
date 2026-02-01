const express = require("express");
const validatePoll = require("./middleware/validatePoll");

const bcrypt = require("bcrypt");
const validateUserCreate = require("./middleware/validateUserCreate");
const usersStore = require("./storage/usersStore");
const app = express();
const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:1234");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-access-auth");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  next();
});

// Handle preflight for CORS
app.options(/.*/, (req, res) => {
  res.status(204).end();
});

app.get("/polls", (req, res) => {
  res.json({ status: "running" });
});

app.post("/polls", validatePoll, (req, res) => {
  res.json({ message: "Poll accepted (scaffold)" });
});


app.post("/users", validateUserCreate, async (req, res) => {
  const { username, password, consent } = req.body;

  const existing = await usersStore.findUserByUsername(username);
  if (existing) {
    return res.status(409).json({ error: "username already in use" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const created = await usersStore.createUser(username, passwordHash, consent);
  if (!created) {
    return res.status(409).json({ error: "username already in use" });
  }

  res.status(201).json({
    id: created.id,
    username: created.username,
    createdAt: created.createdAt
  });
});


app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

