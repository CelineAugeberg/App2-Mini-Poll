
const express = require("express");
const validatePoll = require("./server/middleware/validatePoll.js");


const app = express();
const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:1234");
  next();
});

app.get("/polls", (req, res) => {
  res.json({status: "running"});
});

app.post("/polls", validatePoll, (req, res) => {
  res.json({ message: "Poll accepted (scaffold)" });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
