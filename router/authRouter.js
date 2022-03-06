const authRoute = require("express").Router();
const authController = require("../controller/authController");
const multer = require("multer");
const os = require("os");

authRoute.post(
  "/auth/signup",
  multer({ dest: os.tmpdir() }).single("image"),
  authController.signup
);
authRoute.post("/auth/signin", authController.signin);

module.exports = authRoute;
