const express = require("express");

const userRoute = express.Router();
userRoute.get("/", (req, res) => {
  res.send({ msg: "authenticated" });
});
module.exports = userRoute;
