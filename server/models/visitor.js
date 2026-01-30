const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  purpose: {
    type: String,
    enum: ["Delivery", "Guest", "Maintenance", "Cab", "Other"],
    required: true,
  },
  datetime: { type: Date, required: true },
  block: { type: String },
  flat: { type: String },
  idProofType: { type: String },
  status: { type: String, enum: ["pending", "checked-in", "checked-out"], default: "pending" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Visitor", visitorSchema);
