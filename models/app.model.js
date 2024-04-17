const { deleteComment, getUsers } = require("../controllers/app.controller");
const db = require("../db/connection");

function readTopics() {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
}

function getArticlesModel(topic) {
  const validTopics = ["mitch", "cats"];

  if (topic && !validTopics.includes(topic)) {
    return Promise.reject({ status: 404, message: "Topic not found." });
  }

  let sqlQuery = `SELECT articles.article_id,
      articles.title,
      articles.topic,
      articles.author,
      articles.created_at,
      articles.article_img_url,
      articles.votes,
      COUNT(comments.article_id) ::INTEGER AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      `;

  const query = [];

  if (topic) {
    sqlQuery += ` WHERE topic=$1
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`;
    query.push(topic);
  } else {
    sqlQuery += `GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;`;
  }

  return db.query(sqlQuery, query).then(({ rows }) => {
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

function deleteCommentModel(comment_id) {
  return db
    .query(
      `DELETE FROM comments
  WHERE comment_id=$1;`,
      [comment_id]
    )
    .then(({ rowCount }) => {
      return rowCount === 1;
    });
}

function getUsersModel() {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
}

module.exports = {
  readTopics,
  readArticleById,
  getArticlesModel,
  readCommentsByArticleId,
  checksArticleExists,
  addsComment,
  updatesArticle,
  deleteCommentModel,
  getUsersModel,
};
