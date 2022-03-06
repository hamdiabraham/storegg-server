const CategoryModel = require("../models/categoryModel");
const TransactionModel = require("../models/transactionModel");
const VoucherModel = require("../models/voucherModel");
const PlayerModel = require("../models/playerModel");

class Dashboard {
  static async dashboard(req, res, next) {
    try {
      const transaction = await TransactionModel.countDocuments();
      const voucher = await VoucherModel.countDocuments();
      const player = await PlayerModel.countDocuments();
      const category = await CategoryModel.countDocuments();

      res.render("admin/dashboard/viewDashboard", {
        name: req.session.user.name,
        title: "Dashboard",
        count: {
          transaction,
          voucher,
          player,
          category,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Dashboard;
