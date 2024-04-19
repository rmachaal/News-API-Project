const usersRouter = require("express").Router();

const { getUsers } = require("../controllers/app.controller");

usersRouter.get("/", getUsers);

module.exports = usersRouter;
