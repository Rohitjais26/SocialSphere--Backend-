// routes/dashboardRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // assuming you already have a User model
const router = express.Router();

// Middleware: verify JWT
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Controller
const dashboardController = (req, res) => {
  res.json({
    message: "Welcome to the Dashboard API 🚀",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
};

// Route (protected)
router.get("/", authMiddleware, dashboardController);

module.exports = router;
