const PaymentModel = require("../models/paymentModel");
const BankModel = require("../models/bankModel");

class Payment {
  static async payment(req, res, next) {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };

      const payment = await PaymentModel.find().populate("banks");

      res.render("admin/payment/viewPayment", {
        payment,
        alert,
        name: req.session.user.name,
        title: "Payment",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  }

  static async viewPayment(req, res, next) {
    try {
      const bank = await BankModel.find();

      res.render("admin/payment/create", {
        bank,
        name: req.session.user.name,
        title: "Create Payment",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  }

  static async createPayment(req, res, next) {
    try {
      const { type, banks } = req.body;

      const payment = await PaymentModel({ type, banks });
      await payment.save();

      req.flash("alertMessage", "Successfully created payment");
      req.flash("alertStatus", "success");

      res.redirect("/payment");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  }

  static async editPayment(req, res, next) {
    try {
      const { id } = req.params;

      const banks = await BankModel.find();
      const payment = await PaymentModel.findOne({ _id: id }).populate("banks");

      res.render("admin/payment/edit", {
        payment,
        banks,
        name: req.session.user.name,
        title: "Edit Payment",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  }

  static async editPostPayment(req, res, next) {
    try {
      const { id } = req.params;
      const { type, banks } = req.body;

      await PaymentModel.findOneAndUpdate({ _id: id }, { type, banks });

      req.flash("alertMessage", "Successfully updated payment");
      req.flash("alertStatus", "success");

      res.redirect("/payment");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  }

  static async deletePayment(req, res, next) {
    try {
      const { id } = req.params;

      await PaymentModel.findOneAndRemove({ _id: id });

      req.flash("alertMessage", "Successfully deleted payment");
      req.flash("alertStatus", "success");

      res.redirect("/payment");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  }

  static async updatePaymentStatus(req, res, next) {
    try {
      const { id } = req.params;
      let payment = await PaymentModel.findById({ _id: id });
      let status = payment.status === "Y" ? "N" : "Y";

      payment = await PaymentModel.findByIdAndUpdate({ _id: id }, { status });

      req.flash("alertMessage", "Successfully updated payment status");
      req.flash("alertStatus", "success");

      res.redirect("/payment");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  }
}

module.exports = Payment;
