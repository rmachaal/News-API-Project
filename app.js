const express = require("express");
const { getTopics } = require("./controllers/app.controller");
const endpointData = require("./endpoints.json");
const e = require("express");

const app = express();

app.use(express.json());

app.get("/api", (req, res, next) => {
  res.status(200).send(endpointData);
});

app.get("/api/topics", getTopics);

app.all("*", (req, res, next) => {
  res.status(400).send({ message: "Invalid request" });
});

module.exports = app;
