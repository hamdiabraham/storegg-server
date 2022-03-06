const VoucherModel = require("../models/voucherModel");
const CategoryModel = require("../models/categoryModel");
const NominalModel = require("../models/nominalModel");
const path = require("path");
const fs = require("fs");
const config = require("../config");

class Voucher {
  static async voucher(req, res, next) {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const voucher = await VoucherModel.find()
        .populate("category")
        .populate("nominals");

      res.render("admin/voucher/viewVoucher", {
        voucher,
        alert,
        name: req.session.user.name,
        title: "Voucher",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  }

  static async viewVoucher(req, res, next) {
    try {
      const category = await CategoryModel.find();
      const nominal = await NominalModel.find();

      res.render("admin/voucher/create", {
        category,
        nominal,
        name: req.session.user.name,
        title: "Create Voucher",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  }

  static async createVoucher(req, res, next) {
    try {
      // const { name, category, nominals, thumbnail } = req.body;
      // const payload = await {
      //   name,
      //   category,
      //   nominals,
      //   thumbnail: req.file.originalname,
      // };
      // const voucher = await VoucherModel.create(payload);
      // req.flash("alertMessage", "Successfully created voucher");
      // req.flash("alertStatus", "success");
      // res.redirect("/voucher");
      const { name, category, nominals } = req.body;
      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originalExt;
        let targetPath = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        );
        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(targetPath);
        src.pipe(dest);
        src.on("end", async () => {
          try {
            const voucher = new VoucherModel({
              name,
              category,
              nominals,
              thumbnail: filename,
            });
            await voucher.save();
            req.flash("alertMessage", "Successfully created voucher");
            req.flash("alertStatus", "success");
            res.redirect("/voucher");
          } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/voucher");
            // console.log(error);
          }
        });
      } else {
        const voucher = new VoucherModel({
          name,
          category,
          nominals,
        });
        await voucher.save();
        req.flash("alertMessage", "Successfully created voucher");
        req.flash("alertStatus", "success");
        res.redirect("/voucher");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
      // console.log(error);
    }
  }

  static async editVoucher(req, res, next) {
    try {
      const { id } = req.params;

      const category = await CategoryModel.find();
      const nominal = await NominalModel.find();
      const voucher = await VoucherModel.findOne({ _id: id })
        .populate("category")
        .populate("nominals");

      res.render("admin/voucher/edit", {
        voucher,
        category,
        nominal,
        name: req.session.user.name,
        title: "Edit Voucher",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  }

  static async editPostVoucher(req, res, next) {
    try {
      const { id } = req.params;
      const { name, category, nominals } = req.body;
      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originalExt;
        let targetPath = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        );
        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(targetPath);
        src.pipe(dest);
        src.on("end", async () => {
          try {
            const voucher = await VoucherModel.findOne({ _id: id });

            let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;

            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }

            await VoucherModel.findOneAndUpdate(
              { _id: id },
              {
                name,
                category,
                nominals,
                thumbnail: filename,
              }
            );

            req.flash("alertMessage", "Successfully updated voucher");
            req.flash("alertStatus", "success");
            res.redirect("/voucher");
          } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/voucher");
          }
        });
      } else {
        await VoucherModel.findOneAndUpdate(
          { _id: id },
          {
            name,
            category,
            nominals,
          }
        );
        req.flash("alertMessage", "Successfully updated voucher");
        req.flash("alertStatus", "success");
        res.redirect("/voucher");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  }

  static async deleteVoucher(req, res, next) {
    try {
      const { id } = req.params;

      const voucher = await VoucherModel.findOneAndRemove({ _id: id });

      let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;

      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }

      req.flash("alertMessage", "Successfully deleted voucher");
      req.flash("alertStatus", "success");

      res.redirect("/voucher");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  }

  static async updateStatusVoucher(req, res, next) {
    try {
      const { id } = req.params;
      let voucher = await VoucherModel.findById({ _id: id });
      let status = voucher.status === "Y" ? "N" : "Y";

      voucher = await VoucherModel.findByIdAndUpdate({ _id: id }, { status });

      req.flash("alertMessage", "Successfully updated voucher status");
      req.flash("alertStatus", "success");

      res.redirect("/voucher");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  }
}

module.exports = Voucher;
