const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig"); // ✅ Import Multer Config
const productController = require("../controllers/productController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// ✅ Add product (Admin Only) - Now Handles Image & Video Uploads
router.post("/", upload.fields([{ name: "images", maxCount: 5 }, { name: "video", maxCount: 1 }]),productController.addProduct);

router.get('/most-viewed', productController.getMostViewedProducts);
router.get('/out-of-stock', productController.getOutOfStockProducts);

// ✅ Get all products
router.get("/", productController.getAllProducts);

// ✅ Update product (Admin Only)
router.put("/:id", verifyToken, isAdmin,upload.fields([{ name: "image" }, { name: "video" }]), productController.updateProduct);

// ✅ Delete product (Admin Only)
router.delete("/:id", verifyToken, isAdmin, productController.deleteProduct);

router.get('/filter', productController.filterProducts);

router.get('/:id', productController.getSingleProduct); 

module.exports = router;
