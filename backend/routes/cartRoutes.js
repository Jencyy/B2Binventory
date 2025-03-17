const express = require("express");
const { getCart, addToCart, updateCartItem, removeCartItem } = require("../controllers/cartController.js");
const { verifyToken } = require("../middleware/authMiddleware.js");


const router = express.Router();

router.get("/", verifyToken, getCart);
router.post("/add", verifyToken, addToCart);
router.put("/update",verifyToken , updateCartItem);
router.delete("/remove/:productId", verifyToken, removeCartItem);

module.exports = router;
