
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import validatePoll from "./middleware/validatePoll.js";
import usersStore from "./storage/usersStore.js";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


const PORT = process.env.PORT || 3000;
const SUPER_SECRET_KEY = process.env.TOKEN_KEY || "TransparantWindowsFlyingDonkeys";


app.use(express.json());


app.use(express.static(path.join(__dirname, "../public/client")));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:1234");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-access-auth");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH, OPTIONS");
  next();
});


app.options(/.*/, (req, res) => res.sendStatus(204));


app.get("/polls", (req, res) => res.json({ status: "running" }));
app.post("/polls", validatePoll, (req, res) =>
  res.json({ message: "Poll accepted (scaffold)" })
);


app.post("/users", async (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");
  const consent = !!req.body.consent;

  if (!username || !password || !consent) return res.sendStatus(400);

  const exists = await usersStore.findUserByUsername(username);
  if (exists) return res.sendStatus(409);

  const hash = await bcrypt.hash(password, 10);
  const user = await usersStore.createUser(username, hash, true);

  return res.status(201).json({ id: user.id, username: user.username });
});


app.post("/auth/login", async (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");

  if (!username || !password) return res.sendStatus(400);

  const user = await usersStore.findUserByUsername(username);
  if (!user) return res.sendStatus(401);

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.sendStatus(401);

  const token = jwt.sign({ id: user.id, username: user.username }, SUPER_SECRET_KEY);
  return res.json({ auth: token, user: { id: user.id, username: user.username } });
});


function validateAuth(req, res, next) {
  const token = req.headers["x-access-auth"];
  if (!token) return res.sendStatus(401);

  try {
    req.token = jwt.verify(token, SUPER_SECRET_KEY);
    return next();
  } catch {
    return res.sendStatus(401);
  }
}


app.delete("/users/me", validateAuth, async (req, res) => {
  const ok = await usersStore.deleteUserById(req.token.id);
  if (!ok) return res.sendStatus(404);
  return res.sendStatus(204);
});

app.patch("/users/me", validateAuth, async (req, res) => {
  const newPassword = String(req.body.password || "");

  if (!newPassword) return res.sendStatus(400);

  const hash = await bcrypt.hash(newPassword, 10);
  const ok = await usersStore.updateUserPassword(req.token.id, hash);

  if (!ok) return res.sendStatus(404);
  return res.sendStatus(200);
});


app.listen(PORT, () => console.log(`Server running on ${PORT}`));





