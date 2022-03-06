const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

class User {
  static async users(req, res, next) {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      if (req.session.user === null || req.session.user === undefined) {
        res.render("admin/users/viewLogin", {
          alert,
          title: "Login",
        });
      } else {
        res.redirect("/dashboard");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email: email });

      if (user) {
        if (user.status === "Y") {
          const checkPassword = await bcrypt.compare(password, user.password);
          if (checkPassword) {
            req.session.user = {
              id: user._id,
              email: user.email,
              status: user.status,
              name: user.name,
            };

            res.redirect("/dashboard");
          } else {
            req.flash("alertMessage", `Invalid Passoword!`);
            req.flash("alertStatus", "danger");
            res.redirect("/");
          }
        } else {
          req.flash("alertMessage", `User is not registered!`);
          req.flash("alertStatus", "danger");
          res.redirect("/");
        }
      } else {
        req.flash("alertMessage", `Invalid Email!`);
        req.flash("alertStatus", "danger");
        res.redirect("/");
      }
    } catch (error) {
      // req.flash("alertMessage", `${error.message}`);
      // req.flash("alertStatus", "danger");
      // res.redirect("/");
      console.log(err);
    }
  }

  static async logout(req, res) {
    req.session.destroy();
    res.redirect("/");
  }
}

module.exports = User;
