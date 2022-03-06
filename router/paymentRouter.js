const paymentRoute = require("express").Router();
const paymentController = require("../controller/paymentController");

paymentRoute.get("/payment", paymentController.payment);
paymentRoute.get("/payment/create", paymentController.viewPayment);
paymentRoute.post("/payment/create", paymentController.createPayment);
paymentRoute.get("/payment/edit/:id", paymentController.editPayment);
paymentRoute.put("/payment/edit/:id", paymentController.editPostPayment);
paymentRoute.delete("/payment/delete/:id", paymentController.deletePayment);
paymentRoute.put("/payment/status/:id", paymentController.updatePaymentStatus);

module.exports = paymentRoute;
