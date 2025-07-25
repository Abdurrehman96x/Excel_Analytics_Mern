const mongoose = require("mongoose");

const chartSchema = new mongoose.Schema(
  {
    title: String,
    type: String,
    data: Object,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chart", chartSchema);
