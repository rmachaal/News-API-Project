const commentsRouter = require("express").Router();

const { deleteComment } = require("../controllers/app.controller");

commentsRouter.delete("/:comment_id", deleteComment);

module.exports = commentsRouter;
