const Session = require("../../../models/sessionSchema"); // adjust path as per your structure
const { getGeminiAiResponse } = require("../../../config/aiclient");

const generateComponentController = async (req, res) => {
  try {
    const { prompt, sessionId } = req.body;

    if (!prompt || !sessionId) {
      return res.status(400).json({
        isSuccess: false,
        message: "Prompt and sessionId are required",
      });
    }

    const fullPrompt = `
You are a React expert. Given the input prompt below, please generate a React component using plain JavaScript (no TypeScript types or interfaces). 
Provide the component code as JSX suitable for direct in-browser rendering.

Important requirements:
1. Use function declaration syntax (not arrow functions)
2. Give the component a clear name based on its purpose
3. Don't include any imports or exports
4. Make sure the component can accept children

Prompt: ${prompt}

Respond ONLY with JSON in this exact format:
{
  "jsx": "...", 
  "css": "..."  
}
`;

    const aiResponse = await getGeminiAiResponse(fullPrompt);

    const cleanedResponse = aiResponse
      .replace(/```json|```js|```jsx|```ts|```tsx|```css|```/g, "")
      .trim();

    let codeObj;
    try {
      codeObj = JSON.parse(cleanedResponse);
    } catch (e) {
      return res
        .status(500)
        .json({ isSuccess: false, message: "Invalid AI response format" });
    }

    // 🔁 Update session: push chat and save generated code
    const session = await Session.findById(sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ isSuccess: false, message: "Session not found" });
    }

    // Append user prompt
    session.chat.push({ role: "user", message: prompt });

    // Append assistant response (optional: you can stringify JSX/CSS or summarize it)
    session.chat.push({
      role: "assistant",
      message: "Component generated successfully.",
    });

    // Save generated code to session
    session.generatedCode = {
      jsx: codeObj.jsx,
      css: codeObj.css,
    };

    await session.save();

    res.status(200).json({
      isSuccess: true,
      message: "Component generated and chat saved",
      data: codeObj,
    });
  } catch (err) {
    console.error("Error generating component:", err);
    return res
      .status(500)
      .json({ isSuccess: false, message: "Internal Server Error" });
  }
};

module.exports = { generateComponentController };
