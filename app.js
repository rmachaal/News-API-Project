const express = require("express");
const { getTopics } = require("./controllers/app.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.all("*", (req, res, next) => {
  res.status(400).send({ message: "Invalid request" });
});

module.exports = app;
