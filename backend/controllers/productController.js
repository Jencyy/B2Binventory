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
    const { id } = req.params;
    let updatedData = { ...req.body };

    // Check if image or video files are uploaded
    if (req.files?.image) {
      updatedData.image = `/uploads/${req.files.image[0].filename}`;
    }
    if (req.files?.video) {
      updatedData.video = `/uploads/${req.files.video[0].filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Error updating product", error });
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
// GET /api/products/low-stock
exports.getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({ stock: { $lt: 10 } }); // adjust threshold
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching low stock products" });
  }
};
// GET /api/activities
exports.getRecentActivities = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching activities" });
  }
};
