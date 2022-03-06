const dashboardRoute = require("express").Router();
const dashboardController = require("../controller/dashboardController");
const authMiddleware = require("../middlewares/auth");

dashboardRoute.get(
  "/dashboard",
  authMiddleware.isLoginAdmin,
  dashboardController.dashboard
);

module.exports = dashboardRoute;
