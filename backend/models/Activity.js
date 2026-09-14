const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		question: {
			type: String,
			required: true,
		},
		answer: {
			type: String,
			default: "",
		},
		type: {
			type: String,
			default: "chat",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
