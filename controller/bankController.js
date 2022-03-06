const BankModel = require("../models/bankModel");

class Bank {
  static async bank(req, res, next) {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const bank = await BankModel.find();

      res.render("admin/bank/viewBank", {
        bank,
        alert,
        name: req.session.user.name,
        title: "Bank",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  }

  static async viewBank(req, res, next) {
    try {
      res.render("admin/bank/create", {
        name: req.session.user.name,
        title: "Create Bank",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  }

  static async createBank(req, res, next) {
    try {
      const { name, bank, bankAccount } = req.body;

      const bankingAccount = await BankModel({ name, bank, bankAccount });
      await bankingAccount.save();

      req.flash("alertMessage", "Successfully created bank");
      req.flash("alertStatus", "success");

      res.redirect("/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  }

  static async editBank(req, res, next) {
    try {
      const { id } = req.params;

      const bank = await BankModel.findOne({ _id: id });

      res.render("admin/bank/edit", {
        bank,
        name: req.session.user.name,
        title: "Edit Bank",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  }

  static async editPostBank(req, res, next) {
    try {
      const { id } = req.params;
      const { name, bank, bankAccount } = req.body;

      await BankModel.findOneAndUpdate(
        { _id: id },
        { name, bank, bankAccount }
      );

      req.flash("alertMessage", "Successfully updated Bank");
      req.flash("alertStatus", "success");

      res.redirect("/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  }

  static async deleteBank(req, res, next) {
    try {
      const { id } = req.params;

      await BankModel.findOneAndRemove({ _id: id });

      req.flash("alertMessage", "Successfully deleted bank");
      req.flash("alertStatus", "success");

      res.redirect("/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  }
}

module.exports = Bank;
