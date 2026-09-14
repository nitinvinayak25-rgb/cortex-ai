const express = require("express");

const auth = require("../middleware/auth");
const askAI = require("../services/ai");

const Conversation = require("../models/Conversation");
const Activity = require("../models/Activity");

const router = express.Router();

// ==========================================
// SEND MESSAGE TO TERRIFIC AI
// ==========================================

router.post("/", auth, async (req, res) => {
  try {
    const { message } = req.body;

    // Validate message
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const cleanMessage = message.trim();

    console.log("AI request received:", cleanMessage);

    // Ask AI service
    const reply = await askAI(cleanMessage);

    if (!reply) {
      throw new Error("AI service returned an empty response");
    }

    // Find existing conversation
    let conversation = await Conversation.findOne({
      userId: req.userId,
    });

    // Create conversation if it doesn't exist
    if (!conversation) {
      conversation = await Conversation.create({
        userId: req.userId,
        messages: [],
      });
    }

    // Save user message and AI reply
    conversation.messages.push(
      {
        role: "user",
        text: cleanMessage,
      },
      {
        role: "assistant",
        text: reply,
      }
    );

    await conversation.save();
    await Activity.create({
      userId: req.userId,
      question: cleanMessage,
      answer: reply,
      type: "chat",
    });

    // Send response
    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("❌ AI request failed:", error.message);

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "AI request failed",
    });
  }
});

module.exports = router;