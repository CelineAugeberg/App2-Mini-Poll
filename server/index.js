import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public/client")));

app.use("/users", usersRouter);
app.use("/auth", authRouter);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
