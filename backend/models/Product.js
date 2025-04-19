const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  images: { type: [String], required: true },
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
  viewCount: {
    type: Number,
    default: 0
  },
  notifyWhenRestocked: {
    type: Boolean,
    default: false
  }
  
  
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
