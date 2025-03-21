const Product = require("../models/Product");
const multer = require("multer");

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure "uploads" folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Initialize upload middleware
const upload = multer({ storage });

// ✅ Add a new product (Admin Only)
exports.addProduct = async (req, res) => {
  try {
    const { name, price, stock, category, description } = req.body;

    // Handle image upload
    let images = [];
    if (req.files["images"]) {
      images = req.files["images"].map((file) => `/uploads/${file.filename}`);
    }

    // Handle video upload
    let video = "";
    if (req.files["video"]) {
      video = `/uploads/${req.files["video"][0].filename}`;
    }

    const newProduct = new Product({
      name,
      price,
      stock,
      category,
      description,
      images,
      video,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added", product: newProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
