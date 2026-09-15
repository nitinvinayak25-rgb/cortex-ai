require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const activityRoutes = require("./routes/activity");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/activity", activityRoutes);

app.get("/", (req, res) => {
  res.json({
    name: "TERRIFIC AI",
    status: "Backend is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "TERRIFIC backend is running"
  });
});

connectDB();

module.exports = app;