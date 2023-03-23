const JWT = require("jsonwebtoken");
require("dotenv").config();
const auth = (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (token) {
      const decoded = JWT.verify(token, process.env.ACC_KEY);
      if (decoded) {
        const userID = decoded.userID;
        req.body.userID = userID;
        next();
      } else {
        res.status(400).send({ message: "User Not Found, Try Logging In" });
      }
    } else {
      res.status(400).send({ message: "User Not Found, Try Logging In" });
    }
  } catch (err) {
    if (err.name == "TokenExpiredError") {
      res.status(401).send({ msg: "token expired" });
    } else {
      res.status(401).send({ msg: "wrong token" });
    }
  }
};
module.exports = {
  auth,
};
