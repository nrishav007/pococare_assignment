const express = require("express");
const cors = require("cors");
const app = express();
const env = require("dotenv");
env.config();
const {
  test,
  listen,
  signup,
  login,
  refreshToken,
} = require("./Controllers/AllFuction");
const userRoute = require("./Routes/User.route");

const { auth } = require("./Middlewares/Auth.middleware");
let port = process.env.PORT || 4000;
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);
app.post("/signup", signup);

app.post("/login", login);
app.post("/refreshToken", refreshToken);
app.use(auth);
app.use("/user", userRoute);
app.get("/", test);

app.listen(port, listen);

module.expots = app;
