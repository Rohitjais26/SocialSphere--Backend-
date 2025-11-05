const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// @desc    Register new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists (handles E11000 duplicate key error)
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Create new user
    user = new User({ name, email, password });
    await user.save();

    const token = generateToken(user.id);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    // FIX: Catch specific Mongoose errors (like ValidationError from schema minlength)
    console.error("Registration failed:", err.name, err.message);
    
    if (err.name === 'ValidationError') {
        // Send 400 Bad Request with the specific Mongoose validation message
        return res.status(400).json({ message: err.message });
    }
    
    // Fallback for other server errors (e.g., connection issue, unknown crash)
    res.status(500).json({ message: "Server error during registration." });
  }
};

// @desc    Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Explicitly select password (since schema has select: false)
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error during login." });
  }
};

module.exports = { register, login };