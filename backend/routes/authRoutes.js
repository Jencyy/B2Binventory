const express = require("express");
const { register, login, resetPassword, getRecentLogins } = require("../controllers/authController");
const { getLowStockProducts, getRecentActivities } = require("../controllers/productController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.get("/products/low-stock", getLowStockProducts);
router.get("/users/recent-logins", getRecentLogins);
router.get("/activities", getRecentActivities);

module.exports = router;
