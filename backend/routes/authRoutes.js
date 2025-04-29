const express = require("express");
const { register, login, resetPassword, getRecentLogins, getUserProfile,getRecentActivities, deleteUser, updateUser, getAllUsers } = require("../controllers/authController");
const { getLowStockProducts  } = require("../controllers/productController");
const { verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.delete("/:id",verifyToken,deleteUser);
router.put("/:id",verifyToken,updateUser)
router.post("/reset-password",verifyToken, resetPassword);
router.get("/products/low-stock", getLowStockProducts);
router.get("/recent-logins", getRecentLogins); 
router.get("/activities",getRecentActivities);
router.get('/profile', verifyToken, getUserProfile);
router.get("/users", verifyToken, getAllUsers);

module.exports = router;
