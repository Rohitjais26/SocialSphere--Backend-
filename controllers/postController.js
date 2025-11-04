const Post = require("../models/Post");

// @desc    Schedule a new post
// @route   POST /api/posts/schedule
// @access  Private
const schedulePost = async (req, res) => {
  try {
    const { content, platforms, scheduledAt, isEvergreen, status } = req.body;
    const mediaUrl = req.file ? req.file.path : null;
    const user = req.user.id;

    const parsedPlatforms = JSON.parse(platforms);

    const newPost = new Post({
      user,
      content,
      platforms: parsedPlatforms,
      mediaUrl,
      scheduledAt,
      isEvergreen,
      status, // Use the status sent from the frontend
    });

    await newPost.save();

    res.status(201).json({
      message: "Post scheduled successfully!",
      post: newPost,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all scheduled posts for the user
// @route   GET /api/posts
// @access  Private
const getScheduledPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id, status: "scheduled" }).sort({ scheduledAt: 1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all draft posts for the user
// @route   GET /api/posts/drafts
// @access  Private
const getDrafts = async (req, res) => {
  try {
    const drafts = await Post.find({ user: req.user.id, status: "draft" }).sort({ createdAt: -1 });
    res.json(drafts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// @desc    Get all published/active posts for the user (NEW ENDPOINT)
// @route   GET /api/posts/published
// @access  Private
const getPublishedPosts = async (req, res) => {
  try {
    // Fetches all posts that are either 'published' (one-time posts) or 'scheduled' (evergreen/future posts)
    const publishedPosts = await Post.find({ 
        user: req.user.id, 
        status: { $in: ["published", "scheduled"] } 
    }).sort({ scheduledAt: -1 });

    res.json(publishedPosts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a post by ID
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ensure the post belongs to the authenticated user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post successfully deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { schedulePost, getScheduledPosts, getDrafts, getPublishedPosts, deletePost };