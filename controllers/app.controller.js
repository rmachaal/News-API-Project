const {
  readTopics,
  readArticleById,
  readArticles,
  readCommentsByArticleId,
  checksArticleExists,
  addsComment,
  updatesArticle,
  deleteCommentModel,
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

function patchArticle(req, res, next) {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updatesArticle(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
}

function deleteComment(req, res, next) {
  const { comment_id } = req.params;
  deleteCommentModel(comment_id).then((deleted) => {
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).send({ message: "Comment not found." });
    }
  })
  .catch(next)
}

module.exports = {
  getTopics,
  getEndpoints,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postComment,
  patchArticle,
  deleteComment,
};
