const playerRoute = require("express").Router();
const playerController = require("../controller/playerController");
const authMiddleware = require("../middlewares/auth");
const multer = require("multer");
const os = require("os");

playerRoute.get("/players/landingpage", playerController.landingPage);
playerRoute.get("/players/:id/detailpage", playerController.detailPage);
playerRoute.get("/players/category", playerController.category);
playerRoute.post(
  "/players/checkout",
  authMiddleware.isLoginPlayer,
  playerController.checkout
);
playerRoute.get(
  "/players/history",
  authMiddleware.isLoginPlayer,
  playerController.history
);
playerRoute.get(
  "/players/history/:id/detail",
  authMiddleware.isLoginPlayer,
  playerController.historyDetail
);
playerRoute.get(
  "/players/dashboard",
  authMiddleware.isLoginPlayer,
  playerController.dashboard
);
playerRoute.get(
  "/players/profile",
  authMiddleware.isLoginPlayer,
  playerController.profile
);
playerRoute.put(
  "/players/profile",
  authMiddleware.isLoginPlayer,
  multer({ dest: os.tmpdir() }).single("image"),
  playerController.editProfile
);

module.exports = playerRoute;
