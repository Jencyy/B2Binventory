const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  whatsapp: String,
  deliveryAddress: String,
  password: String,
  lastLogin: { type: Date },
  role: { type: String, enum: ["admin", "businessman"], default: "businessman" },
  isVerified: { type: Boolean, default: false },
  passwordExpiry: { type: Date },
});

module.exports = mongoose.model("User", UserSchema);
