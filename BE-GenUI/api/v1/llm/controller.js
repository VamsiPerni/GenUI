const { getGeminiAiResponse } = require("../../../config/aiclient");

const generateComponentController = async (req, res) => {
  try {
    const { prompt, sessionId } = req.body;

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
  "jsx": "...", // React JSX code without imports or exports
  "css": "..."  // Corresponding CSS styles
}
`;

    const aiResponse = await getGeminiAiResponse(fullPrompt);

    const cleanedResponse = aiResponse
      .replace(/```json|```js|```jsx|```ts|```tsx|```css|```/g, "")
      .trim();

    let codeObj = {};
    try {
      codeObj = JSON.parse(cleanedResponse);
    } catch (e) {
      return res
        .status(500)
        .json({ isSuccess: false, message: "Invalid AI response format" });
    }

    res
      .status(200)
      .json({ isSuccess: true, message: "Component generated", data: codeObj });
  } catch (err) {
    console.error("Error generating component:", err);
    return res
      .status(500)
      .json({ isSuccess: false, message: "Internal Server Error" });
  }
};

module.exports = { generateComponentController };
