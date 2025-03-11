const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: Number,
  totalPrice: Number,
  address: String,
  paymentMethod: String,
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
});

module.exports = mongoose.model("Order", OrderSchema);
