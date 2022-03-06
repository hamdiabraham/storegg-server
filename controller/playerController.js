const PlayerModel = require("../models/playerModel");
const VoucherModel = require("../models/voucherModel");
const CategoryModel = require("../models/categoryModel");
const PaymentModel = require("../models/paymentModel");
const BankModel = require("../models/bankModel");
const NominalModel = require("../models/nominalModel");
const TransactionModel = require("../models/transactionModel");
const path = require("path");
const fs = require("fs");
const config = require("../config");

class Player {
  static async landingPage(req, res, next) {
    try {
      const voucher = await VoucherModel.find()
        .select("_id name status category thumbnail")
        .populate("category");

      res.status(200).json({ data: voucher });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error!!` });
    }
  }

  static async detailPage(req, res, next) {
    try {
      const { id } = req.params;
      const voucher = await VoucherModel.findOne({ _id: id })
        .populate("category")
        .populate("nominals")
        .populate("user", "id name phoneNumber");

      if (!voucher) {
        return res.status(404).json({ message: "Voucher not found!" });
      }

      res.status(200).json({ data: voucher });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error!!` });
    }
  }

  static async category(req, res) {
    try {
      const category = await CategoryModel.find();

      res.status(200).json({ data: category });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error!!` });
    }
  }

  static async checkout(req, res, next) {
    try {
      const { accountUser, name, nominal, voucher, payment, bank } = req.body;

      const res_voucher = await VoucherModel.findOne({ _id: voucher })
        .select("name category _id thumbnail user")
        .populate("category")
        .populate("user");
      if (!res_voucher)
        return res.status(404).json({ message: "Voucher is not found!" });

      const res_nominal = await NominalModel.findOne({ _id: nominal });
      if (!res_nominal)
        return res.status(404).json({ message: "Nominal is not found!" });

      const res_payment = await PaymentModel.findOne({ _id: payment });
      if (!res_payment)
        return res.status(404).json({ message: "Payment is not found!" });

      const res_bank = await BankModel.findOne({ _id: bank });
      if (!res_bank)
        return res.status(404).json({ message: "Bank is not found!" });

      let tax = (10 / 100) * res_nominal._doc.price;
      let value = res_nominal._doc.price - tax;

      const payload = {
        historyVoucherTopup: {
          gameName: res_voucher._doc.name,
          category: res_voucher._doc.category
            ? res_voucher._doc.category.name
            : "",
          thumbnail: res_voucher._doc.thumbnail,
          coinName: res_nominal._doc.coinName,
          coinQuantity: res_nominal._doc.coinQuantity,
          price: res_nominal._doc.price,
        },
        historyPayment: {
          name: res_bank._doc.name,
          type: res_payment._doc.type,
          bank: res_bank._doc.bank,
          bankAccount: res_bank._doc.bankAccount,
        },
        name: name,
        accountUser: accountUser,
        tax: tax,
        value: value,
        player: req.player._id,
        historyUser: {
          name: res_voucher._doc.user?.name,
          phoneNumber: res_voucher._doc.user?.phoneNumber,
        },

        category: res_voucher._doc.category?._id,
        user: res_voucher._doc.user?._id,
      };

      const transaction = new TransactionModel(payload);

      await transaction.save();

      res.status(201).json({
        data: transaction,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: err.message || `Internal server error!!` });
    }
  }

  static async history(req, res, next) {
    try {
      const { status = "" } = req.query;

      let criteria = {};

      if (status.length) {
        criteria = {
          ...criteria,
          status: { $regex: `${status}`, $options: "i" },
        };
      }

      if (req.player._id) {
        criteria = {
          ...criteria,
          player: req.player._id,
        };
      }

      const history = await TransactionModel.find(criteria);

      let total = await TransactionModel.aggregate([
        { $match: criteria },
        {
          $group: {
            _id: null,
            value: { $sum: "$value" },
          },
        },
      ]);

      res.status(200).json({
        data: history,
        total: total.length ? total[0].value : 0,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: err.message || `Internal server error!!` });
    }
  }

  static async historyDetail(req, res, next) {
    try {
      const { id } = req.params;

      const history = await TransactionModel.findOne({ _id: id });

      if (!history)
        return res.status(404).json({ message: "history is not found!" });

      res.status(200).json({ data: history });
    } catch (err) {
      res
        .status(500)
        .json({ message: err.message || `Internal server error!!` });
    }
  }

  static async dashboard(req, res, next) {
    try {
      const count = await TransactionModel.aggregate([
        { $match: { player: req.player._id } },
        {
          $group: {
            _id: "$category",
            value: { $sum: "$value" },
          },
        },
      ]);

      const category = await CategoryModel.find({});

      category.forEach((el) => {
        count.forEach((data) => {
          if (data._id.toString() === el._id.toString()) {
            data.name = el.name;
          }
        });
      });

      const history = await TransactionModel.find({ player: req.player._id })
        .populate("category")
        .sort({ updatedAt: -1 });

      res.status(200).json({ data: history, count: count });
    } catch (err) {
      res
        .status(500)
        .json({ message: err.message || `Internal server error!!` });
    }
  }

  static async profile(req, res, next) {
    try {
      const player = {
        id: req.player._id,
        username: req.player.username,
        email: req.player.email,
        name: req.player.name,
        avatar: req.player.avatar,
        phoneNumber: req.player.phoneNumber,
      };

      res.status(200).json({ data: player });
    } catch (err) {
      res
        .status(500)
        .json({ message: err.message || `Internal server error!!` });
    }
  }

  static async editProfile(req, res, next) {
    try {
      const { name = "", phoneNumber = "" } = req.body;

      const payload = {};

      if (name.length) payload.name = name;
      if (phoneNumber.length) payload.phoneNumber = phoneNumber;

      if (req.file) {
        let tmp_path = req.file.path;
        let originaExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originaExt;
        let target_path = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          let player = await PlayerModel.findOne({ _id: req.player._id });

          let currentImage = `${config.rootPath}/public/uploads/${player.avatar}`;
          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }

          player = await PlayerModel.findOneAndUpdate(
            {
              _id: req.player._id,
            },
            {
              ...payload,
              avatar: filename,
            },
            { new: true, runValidators: true }
          );

          res.status(201).json({
            data: {
              id: player.id,
              name: player.name,
              phoneNumber: player.phoneNumber,
              avatar: player.avatar,
            },
          });
        });

        src.on("err", async () => {
          next(err);
        });
      } else {
        const player = await PlayerModel.findByIdAndUpdate(
          {
            _id: req.player._id,
          },
          payload,
          { new: true, runValidators: true }
        );

        res.status(200).json({
          data: {
            id: player.id,
            name: player.name,
            phoneNumber: player.phoneNumber,
            avatar: player.avatar,
          },
        });
      }
    } catch (err) {
      if (err && err.name === "ValidationError") {
        res.status(422).json({
          error: 1,
          message: err.message,
          fields: err.errors,
        });
      }
    }
  }
}

module.exports = Player;
