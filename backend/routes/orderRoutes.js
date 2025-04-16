const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/place", verifyToken, orderController.placeOrder);
router.get("/", verifyToken, orderController.getAllOrders);
router.put("/:id/status", verifyToken, isAdmin, orderController.updateOrderStatus);
router.put("/:id/cancel", verifyToken, orderController.cancelOwnOrder);

module.exports = router;
