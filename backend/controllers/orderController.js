const Order = require("../models/Order");
const Product = require("../models/Product");

// Businessman places an order
exports.placeOrder = async (req, res) => {
  try {
    const { productId, quantity, address, paymentMethod, userId } = req.body;
    const product = await Product.findById(productId);

    if (!product || product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const totalPrice = quantity * product.price;
    const order = new Order({
      user: userId || req.user.id, // ✅ Admin can place an order for any user
      product: productId,
      quantity,
      totalPrice,
      address,
      paymentMethod,
      placedBy: req.user.role, // ✅ Track who placed the order (Admin or Client)
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
    
    console.log("Fetched Orders:", orders); // ✅ Debugging Line
    
    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
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

    if (status === "delivered") {
      // ✅ Notify User via WhatsApp (Optional)
      console.log(`✅ Order ${order._id} marked as Delivered!`);
    }

    res.json({ message: `Order status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
