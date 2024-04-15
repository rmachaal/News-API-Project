const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");

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
        const topics = body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string"),
            expect(typeof topic.description).toBe("string");
        });
      });
  });

  test("GET 400: Responds with error message when called with incorrect endpoint.", () => {
    return request(app)
      .get("/api/ztopics")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ message: "Invalid request" });
      });
  });
});
