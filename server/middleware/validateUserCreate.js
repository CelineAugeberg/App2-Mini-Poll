import { msg } from "../i18n/messages.js";

export default function validateUserCreate(req, res, next) {
  const { username, password, consent } = req.body;

  if (!username || typeof username !== "string")
    return res.status(400).json(msg(req, "usernameRequired"));
  if (username.trim().length < 3)
    return res.status(400).json(msg(req, "usernameTooShort"));

  if (!password || typeof password !== "string")
    return res.status(400).json(msg(req, "passwordRequired"));
  if (password.length < 8)
    return res.status(400).json(msg(req, "passwordTooShort"));

  if (!consent || typeof consent !== "object")
    return res.status(400).json(msg(req, "consentRequired"));
  if (consent.acceptedTos !== true)
    return res.status(400).json(msg(req, "tosRequired"));
  if (consent.acceptedPrivacy !== true)
    return res.status(400).json(msg(req, "privacyRequired"));
  if (!consent.version || typeof consent.version !== "string")
    return res.status(400).json(msg(req, "consentVersionRequired"));

  next();
}
