const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  block: { type: String, enum: ["A", "B", "C"], required: true },
  flat: { type: String, required: true },
  password: { type: String, required: true },
   role: {
    type: String,
    enum: ["resident", "security", "admin"],
    default: "resident",
    required: true,
  },
});

const Usermodel = mongoose.model("User", userSchema);
module.exports = Usermodel;
