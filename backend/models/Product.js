const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Foreign key reference
    required: true,
  },
  description: {
    type: String,
  },
  video: {
    type: String, // URL for video (optional)
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
