//backend>routes>socialAuthRoutes.js
const express = require("express");
// FIX: Import the new InstaClone controller and other necessary controllers
const { instacloneAuth, facebookCallback } = require("../controllers/socialAuthController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// --------------------------------------------------------
// MOCK PLATFORM: INSTACLONE
// --------------------------------------------------------

// @route   GET /api/social/instaclone/auth
// @desc    Initiates the mock OAuth process (Protected route to ensure user is logged in)
// @access  Private
router.get("/instaclone/auth", protect, instacloneAuth);

// @route   GET /api/social/instaclone/callback
// @desc    Handles the final redirect after mock connection (Frontend will capture this URL)
// @access  Public (Frontend handles the token exchange, this route is rarely hit directly in mock)
// NOTE: We keep this route for cleaner logic, but the actual logic is in the controller
router.get("/instaclone/callback", (req, res) => {
    // This is purely for demonstration/clean redirect. Real logic is now handled in instacloneAuth.
    res.redirect(`http://localhost:5173/connect?status=error&platform=instaclone`);
});


// --------------------------------------------------------
// REAL PLATFORMS (Placeholder for future development)
// --------------------------------------------------------

// Placeholder route for when you implement real Facebook OAuth
router.post("/facebook/callback", protect, facebookCallback);

module.exports = router;
