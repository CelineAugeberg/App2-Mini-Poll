import jwt from "jsonwebtoken";

const SECRET = process.env.TOKEN_KEY || "TransparantWindowsFlyingDonkeys";

export default function validateAuth(req, res, next) {
  const token = req.headers["x-access-auth"];
  if (!token) return res.sendStatus(401);

  try {
    req.token = jwt.verify(token, SECRET);
    return next();
  } catch {
    return res.sendStatus(401);
  }
}
