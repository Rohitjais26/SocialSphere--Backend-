//backend>controllers>socialAuthController.js
const User = require("../models/User");
const crypto = require("crypto"); // Used for generating random IDs

// @desc    Initiate mock InstaClone OAuth flow (Protected Route)
// @route   GET /api/social/instaclone/auth
// @access  Private
const instacloneAuth = async (req, res) => {
  // 1. Instantly generate a mock access token and user ID
  const mockAccessToken = "mock_token_" + crypto.randomBytes(16).toString("hex");
  const mockUserId = "ic_user_" + req.user.id.substring(0, 8);
  const mockUsername = req.user.name.split(" ")[0].toLowerCase() + "_clone";

  // 2. Find the user from the authenticated request
  const user = await User.findById(req.user.id);

  if (user) {
    // 3. Save the mock token and set the connection status to true
    user.socialAccounts.instaclone = {
      accessToken: mockAccessToken,
      userId: mockUserId,
      username: mockUsername,
      isConnected: true,
    };
    // Ensure to update other fields to null/false if needed, but for now, we focus on the mock one.
    
    await user.save();

    // 4. Return the client-side redirect URL to the frontend.
    // The frontend will receive this URL and navigate to it to skip the external OAuth process.
    const redirectUrl = `${process.env.CLIENT_URL}/connect?status=success&platform=instaclone`;
    
    return res.status(200).json({
      message: "InstaClone account connected successfully!",
      authUrl: redirectUrl, // Sending the URL back to the frontend to handle navigation
    });
  }

  return res.status(404).json({ message: "User not found." });
};

// @desc    Placeholder for Facebook authentication (for future development)
const facebookCallback = async (req, res) => {
    // Implement Facebook logic here later
    res.status(501).json({ message: "Facebook integration not yet implemented." });
};

module.exports = { instacloneAuth, facebookCallback };
