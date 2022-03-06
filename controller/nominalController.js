const NominalModel = require("../models/nominalModel");

class Nominal {
  static async nominal(req, res, next) {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const nominal = await NominalModel.find();

      res.render("admin/nominal/viewNominal", {
        nominal,
        alert,
        name: req.session.user.name,
        title: "Nominal",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  }

  static async viewNominal(req, res, next) {
    try {
      res.render("admin/nominal/create", {
        name: req.session.user.name,
        title: "Create Nominal",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  }

  static async createNominal(req, res, next) {
    try {
      const { coinName, coinQuantity, price } = req.body;

      const nominal = await NominalModel({ coinName, coinQuantity, price });
      await nominal.save();

      req.flash("alertMessage", "Successfully created nominal");
      req.flash("alertStatus", "success");

      res.redirect("/nominal");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  }

  static async editNominal(req, res, next) {
    try {
      const { id } = req.params;

      const nominal = await NominalModel.findOne({ _id: id });

      res.render("admin/nominal/edit", {
        nominal,
        name: req.session.user.name,
        title: "Edit Nominal",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  }

  static async editPostNominal(req, res, next) {
    try {
      const { id } = req.params;
      const { coinName, coinQuantity, price } = req.body;

      await NominalModel.findOneAndUpdate(
        { _id: id },
        { coinName, coinQuantity, price }
      );

      req.flash("alertMessage", "Successfully updated nominal");
      req.flash("alertStatus", "success");

      res.redirect("/nominal");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  }

  static async deleteNominal(req, res, next) {
    try {
      const { id } = req.params;

      await NominalModel.findOneAndRemove({ _id: id });

      req.flash("alertMessage", "Successfully deleted nominal");
      req.flash("alertStatus", "success");

      res.redirect("/nominal");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  }
}

module.exports = Nominal;
