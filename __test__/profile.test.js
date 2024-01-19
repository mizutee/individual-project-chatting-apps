const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const bcrypt = require("bcrypt");
// const { default: Profile } = require("../online-chatting-apps/src/pages/profile");
const {User, Profile} = require('../models');
const jwt = require('jsonwebtoken');

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
  dummyTokenAuth = jwt.sign({testing: 'abcd'}, "rahasia")
});

afterAll(async () => {
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

test("GET /profile will be successfull", async () => {

  const response = await request(app)
    .get("/profile")
    .auth(`${tokenAuth}`, { type: "bearer" })

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('id');
  expect(response.body).toHaveProperty('Profile');
  expect(response.body).toHaveProperty('email');
  expect(response.body).toHaveProperty("fullName");
  expect(response.body).toHaveProperty("updatedAt");
  expect(response.body).toHaveProperty("createdAt");
});

test("GET /profile no authorization", async () => {

  const response = await request(app)
    .get("/profile")
    // .auth(`${tokenAuth}`, { type: "bearer" })

  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty('message')
});