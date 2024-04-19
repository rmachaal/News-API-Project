const usersRouter = require("express").Router();

const { getUsers, getUser } = require("../controllers/app.controller");

usersRouter.get("/", getUsers);

usersRouter.get("/:username", getUser);

module.exports = usersRouter;
