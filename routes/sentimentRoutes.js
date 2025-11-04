// routes/sentimentRoutes.js

const express = require("express");
const { analyzeSentiment } = require("../controllers/sentimentController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer"); 
const path = require("path");     

const router = express.Router();

// --- NEW FIX: Use memory storage for direct Base64 buffer access ---
const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });
// -----------------------------------------------------------------

// Route is updated to use memory storage
router.post("/analyze", protect, upload.single('media'), analyzeSentiment); 

module.exports = router;