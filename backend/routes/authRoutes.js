const express = require("express");
const { register, login, resetPassword, getRecentLogins, getUserProfile } = require("../controllers/authController");
const { getLowStockProducts, getRecentActivities } = require("../controllers/productController");
const { verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password",verifyToken, resetPassword);
router.get("/products/low-stock", getLowStockProducts);
router.get("/users/recent-logins", getRecentLogins);
router.get("/activities", getRecentActivities);
router.get('/profile', verifyToken, getUserProfile);

module.exports = router;
