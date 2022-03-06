const CategoryModel = require("../models/categoryModel");

class Category {
  static async category(req, res, next) {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const category = await CategoryModel.find();

      res.render("admin/category/viewCategory", {
        category,
        alert,
        name: req.session.user.name,
        title: "Category",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  }

  static async viewCategory(req, res, next) {
    try {
      res.render("admin/category/create", {
        name: req.session.user.name,
        title: "Create Category",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  }

  static async createCategory(req, res, next) {
    try {
      const { name } = req.body;

      const category = await CategoryModel({ name });
      await category.save();

      req.flash("alertMessage", "Successfully created category");
      req.flash("alertStatus", "success");

      res.redirect("/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  }

  static async editCategory(req, res, next) {
    try {
      const { id } = req.params;

      const category = await CategoryModel.findOne({ _id: id });

      res.render("admin/category/edit", {
        category,
        name: req.session.user.name,
        title: "Edit Category",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  }

  static async editPostCategory(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      await CategoryModel.findOneAndUpdate({ _id: id }, { name });

      req.flash("alertMessage", "Successfully updated category");
      req.flash("alertStatus", "success");

      res.redirect("/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  }

  static async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;

      await CategoryModel.findOneAndRemove({ _id: id });

      req.flash("alertMessage", "Successfully deleted category");
      req.flash("alertStatus", "success");

      res.redirect("/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  }
}

module.exports = Category;
