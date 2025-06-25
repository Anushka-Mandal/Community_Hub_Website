const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema({
  issue: { type: String, required: true },
  status: { type: String, default: "pending" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Maintenance", maintenanceSchema);
