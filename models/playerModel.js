const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const playerSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "Please enter email address"],
      unique: true,
    },
    name: {
      type: String,
      require: [true, "Please enter your name"],
      maxLength: [225, "name length between 3 - 225 characters"],
      minLength: [3, "name length between 3 - 225 characters"],
    },
    username: {
      type: String,
      require: [true, "Please enter your name"],
      maxLength: [225, "username length between 3 - 225 characters"],
      minLength: [3, "username length between 3 - 225 characters"],
    },
    password: {
      type: String,
      require: [true, "Please enter your password"],
      maxLength: [225, "password length maxLength 225 characters"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    avatar: { type: String },
    fileName: { type: String },
    phoneNumber: {
      type: String,
      require: [true, "Please enter your phone number"],
      maxLength: [225, "phone number length between 9 - 13 characters"],
      minLength: [3, "phone number length between 9 - 13 characters"],
    },
    favorite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

playerSchema.path("email").validate(
  async function (value) {
    try {
      const count = await this.model("Player").countDocuments({ email: value });
      return !count;
    } catch (err) {
      throw err;
    }
  },
  (attr) => `${attr.value} email already exist`
);

playerSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

module.exports = mongoose.model("Player", playerSchema);
