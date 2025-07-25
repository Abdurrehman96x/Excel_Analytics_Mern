const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
fileName: String,
analysisSummary: String,
rawData: [mongoose.Schema.Types.Mixed], // the actual Excel data
createdAt: { type: Date, default: Date.now },
  size: String,
});

module.exports = mongoose.model("Upload", uploadSchema);