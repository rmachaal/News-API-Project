const express = require("express");

// creates express app
const app = express();
// imports API router
const apiRouter = require("./routes/api-router");

app.use(express.json());

// API router
app.use("/api", apiRouter);

// for invalid endpoints
app.all("*", (req, res, next) => {
  res.status(400).send({ message: "Invalid request" });
});

// error-handling middleware
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request." });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ message: "Invalid request." });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ message: "Invalid request." });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
});

module.exports = app;
