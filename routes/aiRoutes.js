const express = require("express");
const { generateContent, generateSummary, chatWithGemini } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/generate", protect, generateContent);
router.post("/summary", protect, generateSummary);
router.post("/chat", protect, chatWithGemini);

module.exports = router;
