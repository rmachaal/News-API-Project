const db = require("../db/connection");

function readTopics() {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
}

function readArticles() {
  return db
    .query(
      `SELECT articles.article_id,
      articles.title,
      articles.topic,
      articles.author,
      articles.created_at,
      articles.article_img_url,
      articles.votes,
      COUNT(comments.article_id) ::INTEGER AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
}

function readArticleById(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Article not found." });
      }
      return rows[0];
    });
}

function readCommentsByArticleId(article_id) {
  return db
    .query(
      `SELECT * FROM comments 
  WHERE article_id=$1
  ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
}

function checksArticleExists(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Invalid article_id." });
      }
    });
}

function addsComment(article_id, newComment) {
  return db
    .query(
      `INSERT INTO comments(body, author, article_id) VALUES($1, $2, $3) RETURNING *;`,
      [newComment.body, newComment.username, article_id]
    )
    .then(({ rows }) => {
      if (rows[0].body.length === 0) {
        return Promise.reject({
          status: 400,
          message: "Comment cannot be blank.",
        });
      }
      return rows[0];
    });
}

function updatesArticle(article_id, newVote) {
  return db
    .query(
      `UPDATE articles
SET
votes = votes + $1
WHERE article_id = $2
RETURNING *;`,
      [newVote, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Invalid article_id.",
        });
      }
      return rows[0];
    });
}

module.exports = {
  readTopics,
  readArticleById,
  readArticles,
  readCommentsByArticleId,
  checksArticleExists,
  addsComment,
  updatesArticle,
};
