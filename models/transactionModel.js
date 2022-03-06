const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    historyVoucherTopup: {
      gameName: { type: String, required: [true, "Please enter game name"] },
      category: {
        type: String,
        required: [true, "Please enter game category"],
      },
      thumbnail: { type: String },
      coinName: { type: String, required: [true, "Please enter coin name"] },
      coinQuantity: {
        type: String,
        required: [true, "Please enter coin quantity"],
      },
      price: { type: Number },
    },
    historyPayment: {
      name: { type: String, required: [true, "Please enter your name"] },
      type: { type: String, required: [true, "Please enter payment type"] },
      bank: { type: String, required: [true, "Please enter bank name"] },
      bankAccount: {
        type: String,
        required: [true, "Please enter bank account"],
      },
    },
    name: {
      type: String,
      require: [true, "Please enter name"],
      maxLength: [225, "name length between 3 - 225 characters"],
      minLength: [3, "name length between 3 - 225 characters"],
    },
    accountUser: {
      type: String,
      required: [true, "Please enter your account name"],
      maxLength: [225, "account name length between 3 - 225 characters"],
      minLength: [3, "account name length between 3 - 225 characters"],
    },
    tax: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    historyUser: {
      name: { type: String, required: [true, "please enter player name"] },
      phoneNumber: {
        type: Number,
        required: [true, "please enter phone number"],
        maxLength: [13, "phone number length between 9 - 13 characters"],
        minLength: [9, "phone number length between 9 - 13 characters"],
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
