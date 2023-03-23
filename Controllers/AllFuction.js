const mdbConnection = require("../Configs/DB");
const env = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User.model");
env.config();
let port = process.env.PORT || 4000;
const test = (req, res) => {
  try {
    res.status(200).send({ msg: "deployed" });
  } catch (error) {
    console.log(error);
  }
};

const listen = () => {
  try {
    mdbConnection;
    console.log(`listening to http://localhost:${port}`);
  } catch (error) {
    console.log(error);
  }
};
const signup = async (req, res) => {
  try {
    let data = await UserModel.find({ email: req.body.email });
    if (data.length > 0) {
      res.status(200).send({ msg: "User Already Exist" });
    } else {
      bcrypt.hash(req.body.password, 4, async (err, hash) => {
        if (err) {
          res.status(500).send({ msg: "Something went wrong !" });
        }
        req.body.password = hash;
        await UserModel.create(req.body);
        res.status(200).send({ msg: "User registered Successfully" });
      });
    }
  } catch (e) {
    console.log(e);
    res.status(404).send({ msg: "Failed to create new user" });
  }
};
const login=async (req, res) => {
  try {
    let data = await UserModel.find({
      email: req.body.email,
    });
    if (data.length <= 0) {
      res.status(200).send({ msg: "User not found" });
    } else {
      bcrypt.compare(req.body.password, data[0].password, (err, result) => {
        if (err) {
          res.status(401).send({ msg: "Something went wrong !" });
        } else if (result) {
          let token = jwt.sign({ userID: data[0]._id }, process.env.ACC_KEY, {
            expiresIn: "60s",
          });
          let ref_token = jwt.sign(
            { userID: data[0]._id },
            process.env.REF_KEY,
            { expiresIn: "28d" }
          );
          res.status(200).send({
            msg: "login success",
            access_token: token,
            refresh_token: ref_token,
          });
        }
      });
    }
  } catch (e) {
    console.log(e);
    res.status(404).send({ msg: "Failed to login" });
  }
}
const refreshToken=(req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.REF_KEY, (err, decode) => {
        if (err) {
          res.status(401).send({ msg: "Something went wrong !" });
        } else if (decode) {
          let token = jwt.sign({ userID: decode.userID }, process.env.ACC_KEY, {
            expiresIn: "60s",
          });
          res.status(200).send({ msg: "token generated", token: token });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(401).send({ msg: "wrong token" });
  }
}

module.exports = { test, listen,signup,login,refreshToken };
