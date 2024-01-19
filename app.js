if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const { User, Profile } = require("./models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const { errHandler } = require("./middlewares/error");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) throw { name: "Unauthorized" };

    let [type, token] = authorization.split(" ");

    if (!type || type !== "Bearer") throw { name: "Unauthorized" };

    let verify = jwt.decode(token, "rahasia");

    if (!verify) throw { name: "JsonWebTokenError" };

    req.user = verify;

    next();
  } catch (error) {
    next(error);
  }
};

app.post("/register", async (req, res, next) => {
  try {
    let { email, password, fullName } = req.body;

    await User.create(req.body);

    let user = await User.findOne({
      where: { email: email },
      attributes: { exclude: "password, createdAt, updatedAt" },
    });

    await Profile.create({
      UserId: user.id,
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

app.post("/google-sign-in", async (req, res, next) => {
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

    let validateProfile = await Profile.findOne({
      where: {
        UserId: newUser.id,
      },
    });

    if (!validateProfile) {
      await Profile.create({
        UserId: newUser.id,
      });
    }

    let token = jwt.sign(
      { id: newUser.id, email: newUser.email, fullName: newUser.fullname },
      "rahasia"
    );

    res.status(200).json({ access_token: token });
  } catch (error) {
    next(error);
  }
});

app.post("/login", async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (!email) throw { name: "EmptyEmail" };
    if (!password) throw { name: "EmptyPassword" };

    let user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) throw { name: "InvalidLogin" };

    let comparing = bcrypt.compareSync(password, user.password);

    if (!comparing) throw { name: "InvalidLogin" };

    let token = jwt.sign(
      { id: user.id, email: user.email, fullName: user.fullName },
      "rahasia"
    );

    res.status(200).json({
      access_token: token,
      profile: { id: user.id, email: user.email, fullName: user.fullName },
    });
  } catch (error) {
    next(error);
  }
});

app.get("/profile", authentication, async (req, res, next) => {
  try {
    let user = await User.findOne({
      include: {
        model: Profile,
      },
      where: {
        id: req.user.id,
      },
      attributes: { exclude: "password" },
    });

    if(!user) throw {name: "NotFound"}


    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

app.put("/profile/:id", authentication, async (req, res, next) => {
  try {
    const { id } = req.params;

    let verifyData = await Profile.findByPk(id);

    if(!verifyData) throw {name: "NotFound"}

    await Profile.update(req.body, {
      where: {
        id: id,
      },
    });

    res.status(201).json({ message: "Profile has been updated successfully" });
  } catch (error) {
    next(error);
  }
});

app.patch(
  "/profile/:id",
  authentication,
  upload.single("imgUrl"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const buffer = req.file.buffer;
      if(!req.file) throw {name: "NoFile"}
      if(!buffer) throw {name: "NoFile"}
      const decodedBuffer = Buffer.from(buffer).toString("base64");
      const changeImg = `data:${req.file.mimetype};base64,${decodedBuffer}`; // convert buffer => data URI
      const upload = await cloudinary.uploader.upload(changeImg, {
        public_id: req.file.originalname,
      });

      await Profile.update(
        {
          imgUrl: upload.secure_url,
        },
        {
          where: {
            id: id,
          },
        }
      );

      res.status("201").json({message: "Profile has been updated successfully"})
    } catch (error) {
      next(error);
    }
  }
);

app.delete("/profile/:id", authentication, async (req, res, next) => {
  try {

    let data = await User.destroy({
      where: {
        id: req.params.id
      }
    })

    if (!data) throw {name: "NotFound"}

    res.status(200).json({message: "User has been deleted"})
  } catch (error) {
    next(error)
  }
})

app.use(errHandler);

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

module.exports = app
