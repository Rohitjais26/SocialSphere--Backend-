// models/Post.js
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Post content is required"],
      maxlength: 2200,
    },
    platforms: {
      type: [String],
      required: [true, "At least one platform is required"],
    },
    mediaUrl: {
      type: String,
      default: null,
    },
    scheduledAt: {
      type: Date,
      required: [true, "Scheduled time is required"],
    },
    isEvergreen: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "published", "failed"], // <-- Update this line
      default: "draft",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);