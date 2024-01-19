const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const bcrypt = require("bcrypt");

beforeAll(async () => {
  await queryInterface.bulkInsert(
    "Users",
    [
      {
        email: "admin@mail.com",
        password: bcrypt.hashSync("admin1", bcrypt.genSaltSync(8)),
        fullName: "Admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {}
  );
});

afterAll(async () => {
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

test("post /register succeed", async () => {
  const user = {
    email: "admin2@mail.com",
    password: "admin2",
    fullName: "admin"
  };
  const response = await request(app).post("/register").send(user);

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty("email");
  expect(response.body).toHaveProperty("fullName");
  expect(response.body).toHaveProperty("id");
});

test("post /register no email", async () => {
  const user = {
    // email: "admin2@mail.com",
    password: "admin2",
    fullName: "admin",
  };
  const response = await request(app).post("/register").send(user);

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("message");
});

test("post /register no password", async () => {
  const user = {
    email: "admin2@mail.com",
    // password: "admin2",
    fullName: "admin",
  };
  const response = await request(app).post("/register").send(user);

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("message");
});

test("post /register no fullName", async () => {
  const user = {
    email: "admin2@mail.com",
    password: "admin2",
    // fullName: "admin",
  };
  const response = await request(app).post("/register").send(user);

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("message");
});

test("post /register email exist", async () => {
  const user = {
    email: "admin@mail.com",
    password: "1",
    fullName: "admin",
  };
  const response = await request(app).post("/register").send(user);

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("message");
});