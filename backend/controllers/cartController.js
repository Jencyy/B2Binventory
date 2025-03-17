const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ✅ Get Cart Items
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
    res.json(cart ? cart : { userId: req.user.id, items: [] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Add Product to Cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json(cart.items);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Update Cart Item Quantity
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((item) => item.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    item.quantity = quantity;
    await cart.save();

    res.json(cart.items);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Remove Item from Cart
const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    await cart.save();

    res.json({ success: true, productId }); // Ensure response returns productId
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
