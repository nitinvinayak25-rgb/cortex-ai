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
app.get("/api/health", async (req, res) => {
  try {
    await connectDB();
    res.json({
      status: "OK",
      database: "connected",
      message: "TERRIFIC backend is running",
    });
  } catch (error) {
    console.error("Health check database connection failed:", error.message);
    res.status(503).json({
      status: "ERROR",
      database: "unavailable",
      message: "The backend is running but cannot connect to its database.",
    });
  }
});

// Local development only
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`TERRIFIC backend running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
