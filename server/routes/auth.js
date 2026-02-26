import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import usersStore from "../storage/usersStore.js";

const router = Router();
const SECRET = process.env.TOKEN_KEY || "TransparantWindowsFlyingDonkeys";


router.post("/login", async (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");

  if (!username || !password) return res.sendStatus(400);

  const user = await usersStore.findByUsername(username);
  if (!user) return res.sendStatus(401);

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.sendStatus(401);

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET);
  return res.json({ auth: token, user: { id: user.id, username: user.username } });
});

export default router;
