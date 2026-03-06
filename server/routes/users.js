import { Router } from "express";
import bcrypt from "bcrypt";

import usersStore from "../storage/usersStore.js";
import validateAuth from "../middleware/validateAuth.js";
import validateUserCreate from "../middleware/validateUserCreate.js";
import { msg } from "../i18n/messages.js";

const router = Router();

router.post("/", validateUserCreate, async (req, res) => {
  const username = String(req.body.username).trim();
  const password = String(req.body.password);
  const consent = req.body.consent;

  const exists = await usersStore.findByUsername(username);
  if (exists) return res.status(409).json(msg(req, "usernameTaken"));

  const hash = await bcrypt.hash(password, 10);
  const user = await usersStore.createUser(username, hash, consent);

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
