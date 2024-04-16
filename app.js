const express = require("express");
const {
  getTopics,
  getEndpoints,
    getArticleById,
  getArticles
} = require("./controllers/app.controller");

const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById);

app.all("*", (req, res, next) => {
  res.status(400).send({ message: "Invalid request" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request." });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
});

module.exports = app;
