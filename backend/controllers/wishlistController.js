const Wishlist = require("../models/Wishlist");

// ✅ Add Product to Wishlist
const mongoose = require("mongoose");

exports.addToWishlist = async (req, res) => {
    const { productId, userId } = req.body;

    if (!productId || !userId) {
        return res.status(400).json({ message: "Product ID and User ID are required." });
    }

    console.log("Received productId:", productId, "for userId:", userId); // ✅ Debugging

    try {
        const wishlistItem = new Wishlist({ productId, userId });
        await wishlistItem.save();
        res.status(201).json({ message: "Added to wishlist", wishlistItem });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


   
    

// ✅ Remove Product from Wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        await Wishlist.findOneAndDelete({ userId, productId });
        res.json({ message: "Removed from wishlist" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ✅ Get User's Wishlist
exports.getUserWishlist = async (req, res) => {
    try {
        const userId = req.user.id; 
 
        const wishlist = await Wishlist.find({ userId }).populate("productId");
        res.json(wishlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};