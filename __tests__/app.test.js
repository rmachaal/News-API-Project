const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const endpointData = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  test("GET 200: Responds with array of topic objects with slug and description property.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string"),
            expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("/api", () => {
  test("GET 200: Responds with object describing available endpoints.", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({ endpointData });
      });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("GET 200: Responds with specified article object.", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article.title).toBe("Living in the shadow of a great man");
          expect(article.topic).toBe("mitch");
          expect(article.author).toBe("butter_bridge");
          expect(article.body).toBe("I find this existence challenging");
          expect(article.topic).toBe("mitch");
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
          expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
          expect(article.votes).toBe(100);
          expect(article.article_id).toBe(1);
        });
    });

    test("GET 404: Responds with error message when passed article_id that doesn't exist.", () => {
      return request(app)
        .get("/api/articles/99")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ message: "Article not found." });
        });
    });

    test("GET 400: Responds with error message when passed invalid article_id.", () => {
      return request(app)
        .get("/api/articles/latest")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ message: "Bad request." });
        });
    });
  });

  describe("PATCH", () => {
    test("PATCH 200: Responds with updated article.", () => {
      const exampleArticle = {
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        votes: expect.any(Number),
        created_at: expect.any(String),
        article_img_url: expect.any(String),
        article_id: expect.any(Number),
      };

      const newVote = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/3")
        .send(newVote)
        .expect(200)
        .then(({ body }) => {
          const { updatedArticle } = body;
          expect(updatedArticle).toMatchObject(exampleArticle);
          expect(updatedArticle.votes).toBe(1);
        });
    });

    test("PATCH 400: Responds with an error message when passed an invalid value for inc_votes.", () => {
      const newVote = { inc_votes: "seven" };
      return request(app)
        .patch("/api/articles/3")
        .send(newVote)
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ message: "Bad request." });
        });
    });

    test("PATCH 400: Responds with an error message when passed an invalid request object.", () => {
      const newVote = { new_votes: 10 };
      return request(app)
        .patch("/api/articles/3")
        .send(newVote)
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ message: "Invalid request." });
        });
    });

    test("PATCH 400: Responds with an error message when passed an invalid article_id.", () => {
      const newVote = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/latest")
        .send(newVote)
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ message: "Bad request." });
        });
    });

    test("PATCH 404: Responds with an error message when passed an article_id that doesnt exist.", () => {
      const newVote = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/99")
        .send(newVote)
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ message: "Invalid article_id." });
        });
    });
  });
});

describe("/api/articles", () => {
  test("GET 200: Responds with array of all article objects.", () => {
    const exampleArticle = {
      title: expect.any(String),
      topic: expect.any(String),
      author: expect.any(String),
      votes: expect.any(Number),
      created_at: expect.any(String),
      article_img_url: expect.any(String),
      article_id: expect.any(Number),
      comment_count: expect.any(Number),
    };
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toMatchObject(exampleArticle);
        });
      });
  });

  test("GET 200: Responds with all article objects sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("GET 200: Responds with array of comments for the given article_id, with the most recent comments first.", () => {
      const exampleComment = {
        comment_id: expect.any(Number),
        votes: expect.any(Number),
        created_at: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        article_id: expect.any(Number),
      };
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBe(11);
          expect(comments).toBeSortedBy("created_at", { descending: true });
          comments.forEach((comment) => {
            expect(comment).toMatchObject(exampleComment);
          });
        });
    });

    test("GET 400: Responds with error message when passed invalid article_id.", () => {
      return request(app)
        .get("/api/articles/earliest/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ message: "Bad request." });
        });
    });

    test("GET 404: Responds with error message when passed article_id that doesnt exist.", () => {
      return request(app)
        .get("/api/articles/99/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ message: "Invalid article_id." });
        });
    });

    test("GET 200: Responds with empty array when passed a valid article_id with no comments.", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBe(0);
        });
    });

    describe("POST", () => {
      test("POST 201: Responds with newly created comment for given article_id.", () => {
        const newComment = {
          body: "interesting read!",
          username: "rogersop",
        };

        const expectedComment = {
          comment_id: expect.any(Number),
          body: "interesting read!",
          article_id: 3,
          author: "rogersop",
          votes: expect.any(Number),
          created_at: expect.any(String),
        };
        return request(app)
          .post("/api/articles/3/comments")
          .send(newComment)
          .expect(201)
          .then(({ body }) => {
            const { comment } = body;
            expect(comment).toMatchObject(expectedComment);
          });
      });

      test("POST 400: Responds with error message when passed invalid article_id.", () => {
        const newComment = {
          body: "interesting read!",
          username: "rogersop",
        };
        return request(app)
          .post("/api/articles/earliest/comments")
          .send(newComment)
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({ message: "Bad request." });
          });
      });

      test("POST 404: Responds with error message when passed article_id that doesnt exist.", () => {
        const newComment = {
          body: "interesting read!",
          username: "rogersop",
        };
        return request(app)
          .post("/api/articles/99/comments")
          .send(newComment)
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual({ message: "Invalid request." });
          });
      });

      test("POST 404: Responds with error message when passed username that doesnt exist.", () => {
        const newComment = {
          body: "interesting read!",
          username: "rmachaal",
        };
        return request(app)
          .post("/api/articles/3/comments")
          .send(newComment)
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual({ message: "Invalid request." });
          });
      });

      test("POST 400: Responds with error message when passed request body with no body property.", () => {
        const newComment = {
          username: "rogersop",
        };
        return request(app)
          .post("/api/articles/3/comments")
          .send(newComment)
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({ message: "Invalid request." });
          });
      });

      test("POST 400: Responds with error message when passed request body with empty body property.", () => {
        const newComment = {
          body: "",
          username: "rogersop",
        };
        return request(app)
          .post("/api/articles/3/comments")
          .send(newComment)
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({ message: "Comment cannot be blank." });
          });
      });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE 204: Responds with no content in response body.", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("DELETE 404: Responds with error message when passed comment_id that doesnt exist.", () => {
    return request(app)
      .delete("/api/comments/99")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ message: "Comment not found." });
      });
  });
  test("DELETE 400: Responds with error message when passed invalid comment_id.", () => {
    return request(app)
      .delete("/api/comments/first")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ message: "Bad request." });
      });
  });
});

describe("/api/users", () => {
  test("GET 200: Responds with array of all user objects.", () => {
    const exampleUser = {
      username: expect.any(String),
      name: expect.any(String),
      avatar_url: expect.any(String),
    };
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        console.log(users)
        users.forEach((user) => {
          expect(user).toMatchObject(exampleUser);
        });
      });
  });
});

describe("general errors", () => {
  test("GET 400: Responds with error message when called with incorrect endpoint.", () => {
    return request(app)
      .get("/api/ztopics")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ message: "Invalid request" });
      });
  });
});
