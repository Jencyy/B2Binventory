const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyToken, isAdmin, isBusinessman } = require("../middleware/authMiddleware");

router.post("/place", verifyToken, isBusinessman, orderController.placeOrder);
router.get("/", verifyToken, orderController.getAllOrders);
router.put("/:id/status", verifyToken, isAdmin, orderController.updateOrderStatus);

module.exports = router;
