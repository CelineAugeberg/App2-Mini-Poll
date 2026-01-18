const express = require("express");

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


app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
