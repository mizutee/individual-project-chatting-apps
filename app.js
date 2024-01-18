const express = require("express");
const app = express();
const port = 3000;
const { User } = require("./models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hai" });
});

const authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) throw { name: "NoAuthorization" };

    let [type, token] = authorization.split(" ");

    if (!type || type !== "Bearer") throw { name: "NoAuthorization" };

    let verify = jwt.decode(token, "rahasia");

    if (!verify) throw { name: "NoAuthorization" };

    req.user = verify;

    next();
  } catch (error) {
    console.log(error);
  }
};

app.post("/register", async (req, res) => {
  try {
    let { email, password, fullName } = req.body;

    await User.create(req.body);

    let user = await User.findOne({
      where: { email: email },
      attributes: { exclude: "password, createdAt, updatedAt" },
    });

    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
});

app.post("/google-sign-in", async (req, res) => {
  try {
    let { email, displayName } = req.body;

    const [user, created] = await User.findOrCreate({
      where: {
        email: email,
      },
      defaults: {
        email: email,
        password: Math.random() * 8777,
        fullName: displayName,
      },
      hooks: false,
    });

    let newUser = await User.findOne({
      where: {
        email: email,
      },
    });

    let token = jwt.sign(
      { id: newUser.id, email: newUser.email, fullName: newUser.fullname },
      "rahasia"
    );

    res.status(201).json({ access_token: token });
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    let user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) throw { name: "NoUser" };

    let comparing = bcrypt.compareSync(password, user.password);

    if (!comparing) throw { name: "WrongPassword" };

    let token = jwt.sign(
      { id: user.id, email: user.email, fullName: user.fullName },
      "rahasia"
    );

    res.status(201).json({ access_token: token, profile: {id: user.id, email: user.email, fullName: user.fullName} });
  } catch (error) {
    console.log(error);
  }
});

app.get("/profile", authentication, async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        id: req.user.id,
      },
      attributes: {exclude: "password"}
    });
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
