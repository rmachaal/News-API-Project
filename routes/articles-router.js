const articlesRouter = require("express").Router();

const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postComment,
  patchArticle,
  postArticle
} = require("../controllers/app.controller");

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComment);

module.exports = articlesRouter;
