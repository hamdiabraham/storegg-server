const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Please enter category name"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
