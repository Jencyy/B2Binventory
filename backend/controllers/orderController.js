const Order = require("../models/Order");
const Product = require("../models/Product");

// Businessman places an order
exports.placeOrder = async (req, res) => {
  try {
    const { productId, quantity, address, paymentMethod } = req.body;
    const product = await Product.findById(productId);

    if (!product || product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const totalPrice = quantity * product.price;
    const order = new Order({
      user: req.user.id,
      product: productId,
      quantity,
      totalPrice,
      address,
      paymentMethod,
    });

    await order.save();
    res.status(201).json({ message: "Order placed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("product").populate("user");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin approves/rejects orders
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: `Order ${status}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
