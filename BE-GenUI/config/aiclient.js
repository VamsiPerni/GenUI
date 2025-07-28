const { GoogleGenAI } = require("@google/genai");

const GeminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_AI_API_KEY });

const getGeminiAiResponse = async (prompt) => {
  const response = await GeminiClient.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return response.text;
};

module.exports = { getGeminiAiResponse };
