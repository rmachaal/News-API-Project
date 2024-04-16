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
