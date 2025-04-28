const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const parseDuration = require("../utills/timeParser");
const ActivityLog = require("../models/ActivityLog");
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
    const {
      name, email, phone, whatsapp, address,
      password, role = "businessman",
      passwordExpiry = "1440m" // default 1 day
    } = req.body;

    if (!name || !email || !phone || !whatsapp || !address || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const expiryTimestamp = parseDuration(passwordExpiry);
    if (!expiryTimestamp) {
      return res.status(400).json({ message: "Invalid expiry format. Use 30m, 2h, 1d, 1mo" });
    }

    const newUser = new User({
      name,
      email,
      phone,
      whatsapp,
      address,
      password: hashedPassword,
      role,
      passwordExpiry: new Date(expiryTimestamp),
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error" });
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

    if (!user.role) {
      return res.status(500).json({ message: "User role is missing" });
    }

    if (user.passwordExpiry && new Date() > user.passwordExpiry) {
      return res.status(403).json({ message: "Your password has expired. Contact admin." });
    }

    // ✅ Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    // Log activity: User login
    const activity = new ActivityLog({
      action: `${user.name} logged in`,
    });
    await activity.save(); // Save the activity log

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      id: user._id,
      token,
      role: user.role,
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


exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");x 
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to get user profile" });
  }
};
exports.getRecentLogins = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ lastLogin: -1 })
      .limit(10)
      .select("name email lastLogin");
      
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recent logins" });
  }
};
exports.getRecentActivities = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(20); // Get the 20 most recent activity logs
    res.status(200).json(logs); // Return the logs as JSON
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ message: "Error fetching activities" });
  }
};
// Delete User by Admin
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure the admin is trying to delete a user (not themselves)
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete users" });
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Update User by Admin
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure the admin is updating a user
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can update users" });
    }

    await User.findByIdAndUpdate(userId, updatedData, { new: true });
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
