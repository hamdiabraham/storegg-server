const transactionRoute = require("express").Router();
const transactionController = require("../controller/transactionController");

transactionRoute.get("/transaction", transactionController.transaction);
transactionRoute.put(
  "/transaction/status/:id",
  transactionController.updateStatus
);

module.exports = transactionRoute;
