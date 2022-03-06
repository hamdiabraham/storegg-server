const TransactionModel = require("../models/transactionModel");

class Transaction {
  static async transaction(req, res, next) {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };

      const transaction = await TransactionModel.find().populate("player");

      res.render("admin/transaction/viewTransaction", {
        transaction,
        alert,
        name: req.session.user.name,
        title: "Transaction",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/transaction");
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.query;

      await TransactionModel.findOneAndUpdate({ _id: id }, { status: status });

      req.flash("alertMessage", `successfully updated status`);
      req.flash("alertStatus", "success");
      res.redirect("/transaction");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/transaction");
    }
  }
}

module.exports = Transaction;
