const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

exports.isBusinessman = (req, res, next) => {
  if (req.user?.role !== "businessman") {
    return res.status(403).json({ message: "Access denied. Businessman only." });
  }
  next();
};
