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

// User Registration with Email Verification
exports.register = async (req, res) => {
  try {
    console.log("Received Data:", req.body); // Log incoming request data
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Ensure only "admin" or "businessman" roles are allowed
    if (!["admin", "businessman"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    console.log("Saving User:", user); // Log user before saving
    await user.save();

    // Send verification email
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const verificationLink = `http://localhost:5173/verify-email/${token}`;

    console.log("Sending Email...");
    await transporter.sendMail({
      to: email,
      subject: "Verify Your Email",
      html: `<a href="${verificationLink}">Click here to verify</a>`,
    });

    console.log("Email Sent.");
    res.status(200).json({ message: "Registration successful. Check your email for verification link." });
  } catch (error) {
    console.error("Error in Register Route:", error);
    res.status(500).json({ error: error.message });
  }
};


// Email Verification
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, 'B2B');

    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Invalid or expired token" });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.isVerified) return res.status(401).json({ message: "User not found or not verified" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ token, userId: user._id, role: user.role, name: user.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

