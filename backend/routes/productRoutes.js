const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig"); // ✅ Import Multer Config
const productController = require("../controllers/productController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// ✅ Add product (Admin Only) - Now Handles Image & Video Uploads
router.post("/", upload.fields([{ name: "images", maxCount: 5 }, { name: "video", maxCount: 1 }]),productController.addProduct);


// ✅ Get all products
router.get("/", productController.getAllProducts);

// ✅ Update product (Admin Only)
router.put("/:id", verifyToken, isAdmin, upload.fields([{ name: "images", maxCount: 5 }, { name: "video", maxCount: 1 }]), productController.updateProduct);

// ✅ Delete product (Admin Only)
router.delete("/:id", verifyToken, isAdmin, productController.deleteProduct);

module.exports = router;
