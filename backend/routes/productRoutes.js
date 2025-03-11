const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// ✅ Add product (Admin Only)
router.post("/add", verifyToken, isAdmin, productController.addProduct);

// ✅ Get all products (Anyone can access)
router.get("/", productController.getAllProducts);

// ✅ Update product (Admin Only)
router.put("/:id", verifyToken, isAdmin, productController.updateProduct);

// ✅ Delete product (Admin Only)
router.delete("/:id", verifyToken, isAdmin, productController.deleteProduct);

module.exports = router;
