require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const activityRoutes = require("./routes/activity");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/activity", activityRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({
    name: "TERRIFIC AI",
    status: "Backend is running",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "TERRIFIC backend is running",
  });
});

// Connect MongoDB
connectDB();

// Local development only
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`TERRIFIC backend running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;

