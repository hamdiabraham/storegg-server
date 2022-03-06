const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "Please enter email address"],
    },
    name: {
      type: String,
      require: [true, "Please enter your name"],
    },
    password: {
      type: String,
      require: [true, "Please enter your password"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    phoneNumber: {
      type: String,
      require: [true, "Please enter your phone number"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
