const request = require("supertest");
const server = require("../server");

describe("Auth API", () => {

  test("should register user", async () => {

    const res = await request(server)
      .post("/register")
      .send({
        email: "test@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe("test@test.com");
  });

  test("should fail if password missing", async () => {

    const res = await request(server)
      .post("/register")
      .send({
        email: "test@test.com"
      });

    expect(res.statusCode).toBe(400);
  });

  test("should login successfully", async () => {

    const res = await request(server)
      .post("/login")
      .send({
        email: "test@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
  });

  test("should fail login with wrong password", async () => {

    const res = await request(server)
      .post("/login")
      .send({
        email: "test@test.com",
        password: "wrong"
      });

    expect(res.statusCode).toBe(401);
  });

});