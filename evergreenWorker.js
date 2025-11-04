// evergreenWorker.js
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Post = require("./models/Post");

dotenv.config();
connectDB();

const runEvergreenWorker = async () => {
  try {
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Find evergreen posts that have been published in the past
    // and have not been scheduled to be published in the next week.
    const evergreenPosts = await Post.find({
      isEvergreen: true,
      status: "published",
      scheduledAt: { $lt: now },
      _id: {
        $nin: (await Post.find({
          isEvergreen: true,
          scheduledAt: { $gt: now, $lt: oneWeekFromNow }
        })).map(post => post._id)
      }
    });

    if (evergreenPosts.length > 0) {
      console.log(`Found ${evergreenPosts.length} evergreen post(s) to recycle.`);
      const postToRecycle = evergreenPosts[Math.floor(Math.random() * evergreenPosts.length)];

      // Create a new post from the evergreen post
      const recycledPost = new Post({
        user: postToRecycle.user,
        content: postToRecycle.content,
        platforms: postToRecycle.platforms,
        mediaUrl: postToRecycle.mediaUrl,
        isEvergreen: true,
        scheduledAt: oneWeekFromNow,
        status: "scheduled",
      });

      await recycledPost.save();
      console.log(`Recycled post ID: ${recycledPost._id} scheduled for ${oneWeekFromNow}`);
    }
  } catch (error) {
    console.error("Evergreen worker error:", error);
  }
};

// Run the evergreen worker once a day
setInterval(runEvergreenWorker, 24 * 60 * 60 * 1000); // 24 hours
console.log("♻️ Evergreen post recycling worker started. Checking once a day.");