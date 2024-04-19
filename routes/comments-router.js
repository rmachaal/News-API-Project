const commentsRouter = require("express").Router();

const {
  deleteComment,
  patchComment,
} = require("../controllers/app.controller");

commentsRouter.route("/:comment_id").patch(patchComment).delete(deleteComment);

module.exports = commentsRouter;
