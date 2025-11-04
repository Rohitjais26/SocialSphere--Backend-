// routes/auditRoutes.js
const express = require("express");
const { generateAudit } = require("../controllers/auditController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/generate", protect, generateAudit);

module.exports = router;