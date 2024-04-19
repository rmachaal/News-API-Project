const topicsRouter = require("express").Router();

const { getTopics } = require("../controllers/app.controller");

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
