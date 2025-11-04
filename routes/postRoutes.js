// routes/postRoutes.js

const express = require("express");
const { schedulePost, getScheduledPosts, getDrafts, getPublishedPosts, deletePost } = require("../controllers/postController"); 
const { protect } = require("../middleware/authMiddleware");

// --- CLOUDINARY SETUP FOR PERSISTENT STORAGE ---
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const router = express.Router();

// Configure Cloudinary (Reads credentials from environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define the Cloudinary storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "socialsphere_posts", // Folder on Cloudinary
    allowed_formats: ["jpeg", "png", "jpg", "mp4"], // Only allow image and video
    public_id: (req, file) => `${file.fieldname}-${Date.now()}-${req.user.id}`,
  },
});
const upload = multer({ storage: storage });
// -----------------------------------------------------------

router.post("/schedule", protect, upload.single("media"), schedulePost);
router.get("/", protect, getScheduledPosts);
router.get("/drafts", protect, getDrafts); 
router.get("/published", protect, getPublishedPosts); 
router.delete("/:id", protect, deletePost); 

module.exports = router;