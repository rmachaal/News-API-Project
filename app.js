const express = require("express");
const { getTopics, getEndpoints } = require("./controllers/app.controller");

const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.all("*", (req, res, next) => {
  res.status(400).send({ message: "Invalid request" });
});

module.exports = app;
