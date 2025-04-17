const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/place", verifyToken, orderController.placeOrder);
router.get("/", verifyToken, orderController.getAllOrders);
router.put("/:id/status", verifyToken, isAdmin, orderController.updateOrderStatus);
router.put("/:orderId/cancel", verifyToken, orderController.cancelOrder);

module.exports = router;
