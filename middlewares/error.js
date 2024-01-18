const errHandler = (err, req, res, next) => {
  console.log("error handler: ", err);
  switch (err.name) {
    case "SequelizeValidationError":
    case "SequelizeUniqueConstraintError":
      res.status(400).json({ message: err.errors[0].message });
      break;
    case "BadRequest":
      res.status(400).json({ message: "Bad Request" });
      break;
    case "EmptyEmail":
      res.status(400).json({ message: "Email or Password cannot be empty" });
      break;
    case "EmptyPassword":
      res.status(400).json({ message: "Email or Password cannot be empty" });
      break;
    case "JsonWebTokenError":
      res.status(401).json({ message: "Invalid Token" });
      break;
    case "InvalidLogin":
      res.status(401).json({
        message: "Error login user not found atau password not matched",
      });
      break;
    case "file not exist":
      res.status(400).json({
        message: "Missing File",
      });
      break;
    case "NotFound":
      res.status(404).json({ message: "Data Not Found" });
      break;
    case "Unauthorized":
      res.status(401).json({ message: "No Authorization" });
      break;
    case "Forbidden":
      res.status(403).json({ message: "Forbidden error on authorization" });
      break;
    default:
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
      break;
  }
};

module.exports = { errHandler };
