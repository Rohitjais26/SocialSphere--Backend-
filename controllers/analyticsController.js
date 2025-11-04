const Post = require("../models/Post");
const User = require("../models/User"); // Import User model

// @desc    Get dashboard analytics data
// @route   GET /api/analytics
// @access  Private
const getAnalyticsData = async (req, res) => {
  try {
    const userId = req.user.id;
    // const user = await User.findById(userId); // User model not strictly needed for mock data

    // Fetch the total number of posts for the current user from the database
    const totalPosts = await Post.countDocuments({ user: userId });

    let analytics;
    
    // FIX: Always return the mock analytics data, ignoring connection status.
    analytics = {
      posts: totalPosts,
      followers: "12.5k", 
      engagement: "18.2%",
      reach: "85.6k", 
      platform: "InstaClone (Mock)", // Added (Mock) for clarity
    };
    

    // Placeholder data for the post performance chart
    const chartData = [
      { name: "Mon", posts: 4, engagement: 120 },
      { name: "Tue", posts: 6, engagement: 300 },
      { name: "Wed", posts: 3, engagement: 180 },
      { name: "Thu", posts: 5, engagement: 240 },
      { name: "Fri", posts: 7, engagement: 400 },
      { name: "Sat", posts: 2, engagement: 100 },
      { name: "Sun", posts: 4, engagement: 220 },
    ];


    // --- FIX: Replaced AI call with a static dummy recommendation ---
    const aiRecommendation = "Your engagement peaks on Friday! Focus on posting visually appealing, high-quality Reels between 6 PM and 8 PM to maximize visibility and audience interaction.";
    // --- END FIX ---

   res.json({ analytics, chartData, aiRecommendation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAnalyticsData };