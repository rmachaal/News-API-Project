const {
  getTopicsModel,
  getArticleByIdModel,
  getArticlesModel,
  readCommentsByArticleId,
  checksArticleExists,
  addsComment,
  updatesArticle,
  deleteCommentModel,
  getUsersModel,
  getUserModel,
  patchCommentModel
} = require("../models/app.model");
const endpointData = require("../endpoints.json");

function getTopics(req, res, next) {
  getTopicsModel().then((topics) => {
    res.status(200).send({ topics });
  });
}

function getEndpoints(req, res, next) {
  res.status(200).send({ endpointData });
}

function getArticles(req, res, next) {
  const { topic, sort_by, order } = req.query;
  getArticlesModel(topic, sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
}

function getArticleById(req, res, next) {
  const { article_id } = req.params;
  getArticleByIdModel(article_id)
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
  deleteCommentModel(comment_id)
    .then((deleted) => {
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).send({ message: "Comment not found." });
      }
    })
    .catch(next);
}

function getUsers(req, res, next) {
  getUsersModel().then((users) => {
    res.status(200).send({ users });
  });
}

function getUser(req, res, next) {
  const { username } = req.params;
  getUserModel(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
}

function patchComment(req, res, next) {
  const { comment_id } = req.params
  const {inc_votes} = req.body
  patchCommentModel(comment_id, inc_votes).then((updatedComment) => {
    res.status(201).send({ updatedComment });
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
  getUsers,
  getUser,
  patchComment,
};
