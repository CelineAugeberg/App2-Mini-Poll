import { Router } from "express";
import bcrypt from "bcrypt";

import usersStore from "../storage/usersStore.js";
import validateAuth from "../middleware/validateAuth.js";

const router = Router();


router.post("/", async (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");
  const consent = !!req.body.consent;

  if (!username || !password) return res.sendStatus(400);
  if (!consent) return res.status(400).json({ message: "Consent to ToS is required." });

  const exists = await usersStore.findByUsername(username);
  if (exists) return res.sendStatus(409);

  const hash = await bcrypt.hash(password, 10);
  const user = await usersStore.createUser(username, hash, true);

  return res.status(201).json({ id: user.id, username: user.username });
});


router.delete("/me", validateAuth, async (req, res) => {
  const ok = await usersStore.deleteUser(req.token.id);
  if (!ok) return res.sendStatus(404);
  return res.sendStatus(204);
});


router.patch("/me", validateAuth, async (req, res) => {
  const newPassword = String(req.body.password || "");
  if (!newPassword) return res.sendStatus(400);

  const hash = await bcrypt.hash(newPassword, 10);
  const ok = await usersStore.updatePassword(req.token.id, hash);

  if (!ok) return res.sendStatus(404);
  return res.sendStatus(200);
});

export default router;
