const { readTopics, readArticleById, readArticles } = require("../models/app.model");
const endpointData = require("../endpoints.json");

function getTopics(req, res, next) {
  readTopics().then((topics) => {
    res.status(200).send({ topics });
  });
}

function getEndpoints(req, res, next) {
  res.status(200).send({ endpointData });
}

function getArticles(req, res, next) {
  readArticles().then((articles) => {
    res.status(200).send({ articles });
  });
}

function getArticleById(req, res, next) {
  const { article_id } = req.params;
  readArticleById(article_id)
    .then((article) => {
      res.status(200).send({article});
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getTopics, getEndpoints, getArticleById, getArticles };
