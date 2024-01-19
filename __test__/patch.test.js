const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const bcrypt = require("bcrypt");
// const { default: Profile } = require("../online-chatting-apps/src/pages/profile");
const { User, Profile } = require("../models");
const jwt = require("jsonwebtoken");

beforeAll(async () => {
  let userAdmin = await User.create({
    email: "admin@mail.com",
    password: "admin1",
    fullName: "Admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  tokenAuth = jwt.sign(
    { id: userAdmin.id, email: userAdmin.email, fullName: userAdmin.role },
    "rahasia"
  );
  dummyTokenAuth = jwt.sign({ testing: "abcd" }, "rahasia");
});

afterAll(async () => {
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

test("PATCH /profile/:id will upload picture successfully", async () => {
  const response = await request(app)
    .patch("/profile/1")
    .set("Authorization", `Bearer ${tokenAuth}`)
    .attach("imgUrl", "./data/testing.jpeg");

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty("message", expect.any(String));
});

test("PATCH /profile/:id fail no file", async () => {
  const response = await request(app)
    .patch("/profile/1")
    .set("Authorization", `Bearer ${tokenAuth}`)
    // .attach("imgUrl", "./data/testing.jpeg");

  expect(response.status).toBe(500);
  expect(response.body).toHaveProperty("message", expect.any(String));
});