const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const startScheduler = require('./services/schedulerService');
const path = require('path');
const socialAuthRoutes = require('./routes/socialAuthRoutes'); // Import the new routes

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --- Middleware ---
// Enable CORS for all routes and origins
app.use(cors());
// Body parser to accept JSON data
app.use(express.json());
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/audit', require('./routes/auditRoutes'));
app.use('/api/sentiment', require('./routes/sentimentRoutes'));
app.use('/api/contact', require('./routes/contactRoutes')); // The new contact route
app.use('/api/social', socialAuthRoutes); // Add the new social auth routes

// Start the scheduler
startScheduler();

// Default route for testing (Render root URL)
app.get("/", (req, res) => {
  res.send("✅ SocialSphere Backend API is running successfully!");
});

// --- Server Setup ---
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
