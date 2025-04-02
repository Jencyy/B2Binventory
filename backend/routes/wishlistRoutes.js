const express = require("express");
const router = express.Router();

// ✅ Use object destructuring to correctly import functions
const wishlistController = require("../controllers/wishlistController");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Use the correct function references
router.post("/", authMiddleware.verifyToken, wishlistController.addToWishlist);
router.delete("/:productId", authMiddleware.verifyToken, wishlistController.removeFromWishlist);
router.get("/", authMiddleware.verifyToken, wishlistController.getUserWishlist);

module.exports = router;
