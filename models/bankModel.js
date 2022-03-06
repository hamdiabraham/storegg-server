const mongoose = require("mongoose");

const bankSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Please enter bank owner name"],
    },
    bank: {
      type: String,
      require: [true, "Please enter bank name"],
    },
    bankAccount: {
      type: String,
      require: [true, "Please enter bank account"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bank", bankSchema);
