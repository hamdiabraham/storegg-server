const bankRoute = require("express").Router();
const bankController = require("../controller/bankController");

bankRoute.get("/bank", bankController.bank);
bankRoute.get("/bank/create", bankController.viewBank);
bankRoute.post("/bank/create", bankController.createBank);
bankRoute.get("/bank/edit/:id", bankController.editBank);
bankRoute.put("/bank/edit/:id", bankController.editPostBank);
bankRoute.delete("/bank/delete/:id", bankController.deleteBank);

module.exports = bankRoute;
