const Product = require("../models/Product");

// Add a new product (Admin Only)
exports.addProduct = async (req, res) => {
  try {
    const { name, image, price, stock } = req.body;
    const product = new Product({ name, image, price, stock });
    await product.save();
    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✅ Update product (Admin Only)
exports.updateProduct = async (req, res) => {

  try {
    console.log("Updating product with ID:", req.params.id); // ✅ Log ID
    console.log("Received Data:", req.body); // ✅ Log body data

    const { name, image, price, stock } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, image, price, stock },
      { new: true }
    );

    if (!updatedProduct) {
      console.log("❌ Product not found in database.");
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("✅ Product updated successfully:", updatedProduct);
    res.json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    console.error("❌ Update Error:", error);
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

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

