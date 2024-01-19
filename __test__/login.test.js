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

test("post /login should response access_key when it is succeed", async () => {
  const user = {
    email: "admin@mail.com",
    password: "admin1",
  };
  const response = await request(app).post("/login").send(user);

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('access_token')
  expect(response.body).toHaveProperty('profile')
});

test("post /login should fail if email wrong", async () => {
  const user = {
    email: "adsmin@mail.com",
    password: "admin1",
  };
  const response = await request(app).post("/login").send(user);

  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty('message')
});

test("post /login should fail if password wrong", async () => {
  const user = {
    email: "admin@mail.com",
    password: "adm2in1",
  };
  const response = await request(app).post("/login").send(user);

  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty("message");
});

test("post /login should fail if no email", async () => {
  const user = {
    email: "",
    password: "adm2in1",
  };
  const response = await request(app).post("/login").send(user);

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("message");
});

test("post /login should fail if no password", async () => {
  const user = {
    email: "admin@mail.com",
  };
  const response = await request(app).post("/login").send(user);

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("message");
});