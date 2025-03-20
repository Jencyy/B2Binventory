    const express = require("express");
    const router = express.Router();
    const categoryController = require("../controllers/categoryController");
    const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

    // ✅ Add category (Admin Only)
    router.post("/", verifyToken, isAdmin, categoryController.addCategory);

    // ✅ Get all categories (Anyone can access)
    router.get("/", categoryController.getAllCategories);

    // ✅ Update category (Admin Only)
    router.put("/:id", verifyToken, isAdmin, categoryController.updateCategory);

    // ✅ Delete category (Admin Only)
    router.delete("/:id", verifyToken, isAdmin, categoryController.deleteCategory);

    module.exports = router;
