const userRoute = require("express").Router();
const userController = require("../controller/userController");

userRoute.get("/", userController.users);
userRoute.post("/", userController.login);
userRoute.get("/logout", userController.logout);

module.exports = userRoute;
