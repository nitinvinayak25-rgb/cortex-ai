const express = require("express");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Google OAuth client
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

// Create JWT token
const createToken = (user) =>
  jwt.sign(
    {
      userId: user._id,
      isAdmin: user.email === process.env.ADMIN_EMAIL,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// ==========================================
// GOOGLE LOGIN
// ==========================================

router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required",
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error("Google login is not configured: GOOGLE_CLIENT_ID is missing");
      return res.status(500).json({
        message: "Google login is not configured on the backend",
      });
    }

    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name || email;

    if (!email || !googleId) {
      return res.status(401).json({
        message: "Invalid Google account information",
      });
    }

    // Find or create user in MongoDB
    const user = await User.findOneAndUpdate(
      {
        $or: [
          { googleId: googleId },
          { email: email },
        ],
      },
      {
        $set: {
          name: name,
          email: email,
          googleId: googleId,
          authProvider: "google",
          lastLoginAt: new Date(),
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    // Create application JWT
    const token = createToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Google login error:", error.message);

    res.status(401).json({
      message: "Google login failed. Check that the frontend and backend use the same Google client ID.",
    });
  }
});

// ==========================================
// GET USERS — ADMIN ONLY
// ==========================================

router.get("/users", auth, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const users = await User.find(
      {},
      "name email createdAt lastLoginAt"
    )
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Fetching users failed:", error);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
});

module.exports = router;