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

describe("Profile API", () => {

  let token;

  beforeAll(async () => {

    // 🔹 usar usuario distinto para evitar conflictos
    await request(server)
      .post("/register")
      .send({
        email: "profile@test.com",
        password: "123456"
      });

    const res = await request(server)
      .post("/login")
      .send({
        email: "profile@test.com",
        password: "123456"
      });

    token = res.body.token;
  });

  test("should return profile with valid token", async () => {
    const res = await request(server)
      .get("/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("profile@test.com");
  });

  test("should fail without token", async () => {
    const res = await request(server)
      .get("/profile");

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Token required");
  });

  test("should fail with invalid token", async () => {
    const res = await request(server)
      .get("/profile")
      .set("Authorization", "Bearer invalid");

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Invalid token");
  });

});