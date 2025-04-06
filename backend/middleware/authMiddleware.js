
const jwt = require("jsonwebtoken");
const User = require("../models/User");


exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token

  console.log("Incoming Token:", token); // 🔍 Debugging

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // 🔍 Debugging

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token Verification Error:", error); // 🔍 Debugging
    return res.status(401).json({ message: "Invalid token" });
  }
};


exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied: Admins only" });
  }
  next();
};

