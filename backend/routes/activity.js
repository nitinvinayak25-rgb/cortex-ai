const express = require("express");

const auth = require("../middleware/auth");
const Activity = require("../models/Activity");
const Conversation = require("../models/Conversation");

const router = express.Router();

router.get("/", auth, async (req, res) => {
	try {
		const conversation = await Conversation.findOne({ userId: req.userId })
			.select("messages")
			.lean();
		const existingActivities = await Activity.find({ userId: req.userId })
			.select("question text createdAt")
			.lean();
		const existingActivityTexts = new Set(
			existingActivities.map(
				(activity) => `${activity.question || activity.text}:${new Date(activity.createdAt).getTime()}`
			)
		);
		const legacyActivities = (conversation?.messages || [])
			.filter((message) => message.role === "user")
			.filter(
				(message) =>
					!existingActivityTexts.has(
						`${message.text}:${new Date(message.createdAt).getTime()}`
					)
			)
			.map((message) => ({
				userId: req.userId,
				question: message.text,
				answer: "",
				type: "chat",
				createdAt: message.createdAt,
			}));

		if (legacyActivities.length > 0) {
			await Activity.insertMany(legacyActivities);
		}

		const activities = await Activity.find({ userId: req.userId })
			.sort({ createdAt: -1 })
			.select("question answer text type createdAt")
			.lean();

		res.json({ activities });
	} catch (error) {
		console.error("Failed to load activity:", error.message);
		res.status(500).json({ message: "Failed to load activity" });
	}
});

module.exports = router;
