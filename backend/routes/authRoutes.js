const express = require("express");
const { register, login, resetPassword, getRecentLogins, getUserProfile,getRecentActivities, deleteUser, updateUser } = require("../controllers/authController");
const { getLowStockProducts  } = require("../controllers/productController");
const { verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.delete(":id",deleteUser);
router.put(":id",updateUser)
router.post("/reset-password",verifyToken, resetPassword);
router.get("/products/low-stock", getLowStockProducts);
router.get("/recent-logins", getRecentLogins);
router.get("/activities",getRecentActivities);
router.get('/profile', verifyToken, getUserProfile);

module.exports = router;
