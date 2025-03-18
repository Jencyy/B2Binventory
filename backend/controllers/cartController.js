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
// ✅ Update Cart Item Quantity (Increase or Decrease)
const updateCartItem = async (req, res) => {
  try {
    const { productId, change } = req.body; // Change instead of direct quantity
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((item) => item.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    item.quantity += change; // ✅ Increment or Decrement
    if (item.quantity < 1) item.quantity = 1; // Prevent going below 1

    await cart.save();
    res.json(cart.items); // ✅ Send back updated cart
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
