const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ["notice", "event"], required: true },
  createdAt: { type: Date, default: Date.now },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Notice", noticeSchema);
