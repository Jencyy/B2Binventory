const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// Nodemailer Config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// User Registration by Admin
exports.register = async (req, res) => {
  try {
    console.log("Received Request Body:", req.body); // Debugging line

    const { name, email, phone, whatsapp, address, password, role, passwordExpiry } = req.body;

    if (!name || !email || !phone || !whatsapp || !address || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Ensure passwordExpiry is a number (or set default to 1440 minutes)
    const expiryMinutes = passwordExpiry ? parseInt(passwordExpiry, 10) : 1440;
    const passwordExpiresAt = expiryMinutes > 0 ? new Date(Date.now() + expiryMinutes * 60000) : null;
    const expiryDuration = req.body.passwordExpiry; // Minutes
    const expiryDate = expiryDuration === 0 ? null : new Date(Date.now() + expiryDuration * 60000);
    
    // Create new user
    const newUser = new User({
      name,
      email,
      phone,
      whatsapp,
      address,
      password: hashedPassword, // Save hashed password
      role: role || businessman,
      passwordExpiresAt, 
      passwordExpiry: expiryDate,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);  
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Ensure user.role is available before signing token
    if (!user.role) {
      return res.status(500).json({ message: "User role is missing" });
    }
    if (user.passwordExpiry && new Date() > user.passwordExpiry) {
      return res.status(403).json({ message: "Your password has expired. Contact admin." });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      id: user._id,
      token,
      role: user.role,  // ✅ Ensure role is included
      name: user.name,

    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Password Reset by Admin
exports.resetPassword = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can reset passwords." });
    }

    const { email, newPassword, expiryDuration } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found." });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Reset password expiry
    user.passwordExpiry = new Date(Date.now() + expiryDuration * 60 * 1000);

    await user.save();
    res.status(200).json({ message: "Password reset successful.", passwordExpiry: user.passwordExpiry });

  } catch (error) {
    console.error("Password Reset Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};