const Category = require("../models/Category");

// ✅ Add Category (Admin Only)
exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const category = new Category({
      name,
      description,
      image: imagePath,
    });

    await category.save();
    res.status(201).json({ message: "Category added successfully", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ Get All Categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Category (Admin Only)
exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null; // Handle image update

    // Find the category
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update the category fields
    category.name = name;
    category.description = description;

    if (imagePath) {
      category.image = imagePath; // Only update if image is provided
    }

    // Save the updated category
    await category.save();
    
    res.json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete Category (Admin Only)
exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
