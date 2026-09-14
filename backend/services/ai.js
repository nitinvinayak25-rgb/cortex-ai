const { GoogleGenAI } = require("@google/genai");

// Check API key
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in .env");
}

// Initialize Gemini AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ==========================================
// ASK TERRIFIC AI
// ==========================================

const askAI = async (message) => {
  try {
    if (!message || !message.trim()) {
      throw new Error("Message cannot be empty");
    }

    // Enable Google Search only when requested
    const useWebSearch = message
      .trim()
      .toLowerCase()
      .startsWith("search the web:");

    const request = {
      model: "gemini-3.6-flash",

      contents: [
        {
          role: "user",
          parts: [
            {
              text: message,
            },
          ],
        },
      ],
    };

    // Add Google Search tool when requested
    if (useWebSearch) {
      request.config = {
        tools: [
          {
            googleSearch: {},
          },
        ],
      };
    }

    // Generate AI response
    const response = await ai.models.generateContent(request);

    if (!response || !response.text) {
      throw new Error("Gemini returned an empty response");
    }

    return response.text;
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);

    const errorText = JSON.stringify(error);
    if (
      error.status === 429 ||
      error.code === 429 ||
      errorText.includes("RESOURCE_EXHAUSTED") ||
      errorText.includes("quota")
    ) {
      const quotaError = new Error(
        "AI quota reached. Please try again later or check your Gemini API billing and limits."
      );
      quotaError.statusCode = 429;
      throw quotaError;
    }

    throw new Error("Failed to generate AI response");
  }
};

module.exports = askAI;