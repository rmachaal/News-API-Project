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

module.exports = {
  readTopics,
  readArticleById,
  readArticles,
  readCommentsByArticleId,
  checksArticleExists,
};
