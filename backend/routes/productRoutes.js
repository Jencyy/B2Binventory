const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// ✅ Add product (Admin Only)
router.post("/", verifyToken, isAdmin, productController.addProduct);

// ✅ Get all products (Now includes category details)
router.get("/", productController.getAllProducts);

// ✅ Update product (Admin Only)
router.put("/:id", verifyToken, isAdmin, productController.updateProduct);

// ✅ Delete product (Admin Only)
router.delete("/:id", verifyToken, isAdmin, productController.deleteProduct);

module.exports = router;
