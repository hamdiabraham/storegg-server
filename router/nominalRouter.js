const nominalRoute = require("express").Router();
const nominalController = require("../controller/nominalController");

nominalRoute.get("/nominal", nominalController.nominal);
nominalRoute.get("/nominal/create", nominalController.viewNominal);
nominalRoute.post("/nominal/create", nominalController.createNominal);
nominalRoute.get("/nominal/edit/:id", nominalController.editNominal);
nominalRoute.put("/nominal/edit/:id", nominalController.editPostNominal);
nominalRoute.delete("/nominal/delete/:id", nominalController.deleteNominal);

module.exports = nominalRoute;
