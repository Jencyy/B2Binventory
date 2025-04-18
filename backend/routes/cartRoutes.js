console.log("✅ cartRoutes loaded");

const express = require("express");
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require("../controllers/cartController.js");
const { verifyToken } = require("../middleware/authMiddleware.js");

router.get("/test", (req, res) => {
  console.log("✅ /api/cart/test route hit");
  res.send("Cart route is working!");
});

router.get("/", verifyToken, getCart);
router.delete("/clear",verifyToken, clearCart); 
router.post("/add", verifyToken, addToCart);
router.put("/update",verifyToken , updateCartItem);
router.delete("/remove/:productId", verifyToken, removeCartItem);
module.exports = router;
  