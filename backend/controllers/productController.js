const Product = require("../models/Product");

// ✅ Add a new product (Admin Only)
exports.addProduct = async (req, res) => {
  try {
    const { name, image, price, stock, category, description, video } = req.body;

    const product = new Product({ name, image, price, stock, category, description, video });
    await product.save();
    
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all products (Now includes category details)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update product (Admin Only)
exports.updateProduct = async (req, res) => {
  try {
    const { name, image, price, stock, category, description, video } = req.body;
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, image, price, stock, category, description, video },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete product (Admin Only)
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
