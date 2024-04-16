const {
  readTopics,
  readArticleById,
  readArticles,
  readCommentsByArticleId,
  checksArticleExists,
  addsComment,
} = require("../models/app.model");
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
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

function getCommentsByArticleId(req, res, next) {
  const { article_id } = req.params;
  Promise.all([
    readCommentsByArticleId(article_id),
    checksArticleExists(article_id),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
}

function postComment(req, res, next) {
  const { article_id } = req.params;
  const newComment = req.body;
  addsComment(article_id, newComment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
}

module.exports = {
  getTopics,
  getEndpoints,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postComment,
};
