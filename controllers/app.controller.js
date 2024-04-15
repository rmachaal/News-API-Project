const { readTopics } = require("../models/app.model");

function getTopics(req, res, next) {
  readTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
}

module.exports = { getTopics };
