const cron = require("node-cron");
const Post = require("../models/Post");
const User = require("../models/User"); // Import the User model
const axios = require("axios"); // Import axios

// The core function to publish to social media
const publishToSocialMedia = async (post) => {
  // Find the user to get their social media tokens
  const user = await User.findById(post.user);
  if (!user || !user.socialAccounts) {
    console.error(`User or social accounts not found for post ${post._id}`);
    return;
  }

  // Iterate over each platform selected for the post
  for (const platform of post.platforms) {
    try {
      console.log(`Publishing post ${post._id} to ${platform}...`);
      
      switch (platform) {
        case "instaclone": // <-- TARGETING MOCK PLATFORM
          if (user.socialAccounts.instaclone?.isConnected) {
            // In a real app, this would be an axios call to the mock Instaclone API.
            // For now, we simulate success with a detailed log.
            console.log(`[INSTACLONE MOCK SUCCESS] Published Content: "${post.content}" with token: ${user.socialAccounts.instaclone.accessToken}`);
            console.log(`[INSTACLONE MOCK] Media URL: ${post.mediaUrl || 'None'}`);

          } else {
            console.warn(`No InstaClone account connected for user ${post.user}`);
          }
          break;

        case "facebook":
          // Placeholder logic for Facebook...
          if (user.socialAccounts.facebook?.accessToken) {
            const pageId = user.socialAccounts.facebook.pageId; 
            const postData = {
              message: post.content,
              // Other parameters like media_url
            };

            // This would typically be an API call to the Facebook Graph API
            await axios.post(
              `https://graph.facebook.com/v16.0/${pageId}/feed`,
              postData,
              {
                params: {
                  access_token: user.socialAccounts.facebook.accessToken,
                },
              }
            );
          }
          break;

        // Add cases for other platforms like 'twitter' and 'linkedin'
        // ...

        default:
          console.error(`Unsupported platform: ${platform}`);
          break;
      }

    } catch (error) {
      console.error(
        `Failed to publish to ${platform}:`,
        error.response?.data || error.message
      );
    }
  }

  // Return a promise to indicate completion of all publishing attempts
  return Promise.resolve();
};


const startScheduler = () => {
  cron.schedule("* * * * *", async () => {
    console.log("Checking for scheduled posts...");
    const now = new Date();

    try {
      const postsToPublish = await Post.find({
        status: "scheduled",
        scheduledAt: { $lte: now },
      });

      if (postsToPublish.length > 0) {
        console.log(`Found ${postsToPublish.length} post(s) to publish.`);
        for (const post of postsToPublish) {
          try {
            await publishToSocialMedia(post);
            
            // --- CORE LOGIC: HANDLE EVERGREEN RECYCLING ---
            if (post.isEvergreen) {
                // Reschedule for the next day
                const newScheduledAt = new Date();
                newScheduledAt.setDate(newScheduledAt.getDate() + 1); 

                await Post.findByIdAndUpdate(post._id, { 
                    status: "scheduled", // KEEP as scheduled so it gets picked up again
                    scheduledAt: newScheduledAt // Set the new scheduled time for the next run
                });
                console.log(`Successfully published and RECYCLED evergreen post: ${post._id}. Next run: ${newScheduledAt.toISOString()}`);
            } else {
                // For one-time posts, mark as published (and retired)
                await Post.findByIdAndUpdate(post._id, { status: "published" });
                console.log(`Successfully published one-time post: ${post._id}`);
            }

          } catch (error) {
            console.error(`Failed to publish post ${post._id}:`, error);
            await Post.findByIdAndUpdate(post._id, { status: "failed" });
          }
        }
      }
    } catch (err) {
      console.error("Scheduler error:", err);
    }
  });
};

module.exports = startScheduler;