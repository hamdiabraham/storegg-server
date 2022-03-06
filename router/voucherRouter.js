const voucherRoute = require("express").Router();
const voucherController = require("../controller/voucherController");
const multer = require("multer");
const os = require("os");

// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, "./public/uploads");
//   },
//   filename: (req, file, callback) => {
//     callback(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

voucherRoute.get("/voucher", voucherController.voucher);
voucherRoute.get("/voucher/create", voucherController.viewVoucher);
voucherRoute.post(
  "/voucher/create",
  multer({ dest: os.tmpdir() }).single("image"),
  voucherController.createVoucher
);
// voucherRoute.post(
//   "/voucher/create",
//   upload.single("image"),
//   voucherController.createVoucher
// );
voucherRoute.get("/voucher/edit/:id", voucherController.editVoucher);
voucherRoute.put(
  "/voucher/edit/:id",
  multer({ dest: os.tmpdir() }).single("image"),
  voucherController.editPostVoucher
);
voucherRoute.delete("/voucher/delete/:id", voucherController.deleteVoucher);
voucherRoute.put("/voucher/status/:id", voucherController.updateStatusVoucher);

module.exports = voucherRoute;
