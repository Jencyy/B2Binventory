const Product = require("../models/Product");
const multer = require("multer");
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const Category = require("../models/Category");
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

exports.getOutOfStockProducts = async (req, res) => {
  try {
    console.log("Trying to fetch products with stock = 0");

    const outOfStock = await Product.find({ stock: 0 });

    console.log("Fetched products:", outOfStock);

    res.status(200).json(outOfStock);
  } catch (error) {
    console.error("Error fetching out of stock products:", error);
    res.status(500).json({ error: "Error fetching out of stock products" });
  }
};


// controller/productController.js

exports.filterProducts = async (req, res) => {
  try {
    const { minStock, maxStock, minPrice, maxPrice } = req.query;

    let filter = {};

    if (minStock) filter.stock = { ...filter.stock, $gte: parseInt(minStock) };
    if (maxStock) filter.stock = { ...filter.stock, $lte: parseInt(maxStock) };

    if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };

    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error filtering products:", error);
    res.status(500).json({ error: "Error filtering products" });
  }
};

// Get a single product and increase its view count
exports.getSingleProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Increase view count
    product.viewCount = (product.viewCount || 0) + 1;
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product' });
  }
};
// Get top most viewed products
exports.getMostViewedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const products = await Product.find()
      .sort({ viewCount: -1 })
      .limit(limit);

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching most viewed products:', error);
    res.status(500).json({ error: 'Error fetching product' });
  }
};

// Get All Products - For Admin
exports.getAllProductsForAdmin = async (req, res) => {
  try {
    const products = await Product.find(); // You can add sorting, pagination, etc.
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({ error: "Error fetching all products" });
  }
};
exports.uploadProductsFromExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const getOrCreateCategory = async (categoryName) => {
      let category = await Category.findOne({ name: categoryName.trim() });

      if (!category) {
        category = new Category({ name: categoryName.trim() });
        await category.save();
      }

      return category._id;
    };

    const productsToInsert = [];

    for (const row of data) {
      const {
        name,
        price,
        stock,
        category: categoryName,
        description,
        images,
        video,
      } = row;

      const categoryId = await getOrCreateCategory(categoryName);

      const product = {
        name,
        price,
        stock,
        description,
        images: images ? images.split(',').map((img) => img.trim()) : [],
        video: video || '',
        category: categoryId,
      };

      productsToInsert.push(product);
    }

    const insertedProducts = await Product.insertMany(productsToInsert);

    fs.unlinkSync(filePath); // Clean up uploaded file

    res.status(200).json({
      message: 'Products uploaded successfully',
      data: insertedProducts,
    });
  } catch (error) {
    console.error('Excel Upload Error:', error);
    res.status(500).json({
      error: 'Failed to upload products',
      details: error.message,
    });
  }
};
