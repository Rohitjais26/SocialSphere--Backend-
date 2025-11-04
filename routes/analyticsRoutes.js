const express = require("express");
const { getAnalyticsData } = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getAnalyticsData);

module.exports = router;
