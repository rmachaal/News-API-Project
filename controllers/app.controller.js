const { readTopics } = require("../models/app.model");
const endpointData = require("./endpoints.json");

function getTopics(req, res, next) {
  readTopics().then((topics) => {
    res.status(200).send(topics);
  });
}

function getEndpoints(req, res, next) {
  res.status(200).send(endpointData);
}
module.exports = { getTopics, getEndpoints };
