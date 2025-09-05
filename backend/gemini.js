import axios from "axios";

/**
 * Handles multimodal requests (text + optional image).
 * @param {string} prompt - The user prompt.
 * @param {string|null} base64Image - Base64 encoded image string (optional).
 * @param {string} model - Model to use (default from env or fallback)
 * @returns {Promise<string>} - The clean response text.
 */
const geminiMultiModalResponse = async (prompt, base64Image = null, model = process.env.GEMINI_MODEL || "gemma-3n-e4b-it") => {
    try {
        if (!prompt && !base64Image) throw new Error("Prompt or image is required");

        const apiUrl = process.env.GEMINI_API_URL;
        const apiKey = process.env.GEMINI_API_KEY;

        let contents = [{ parts: [{ text: prompt }] }];

        if (base64Image) {
            contents[0].parts.push({
                inlineData: { mimeType: "image/png", data: base64Image }
            });
        }

        const payload = { model, contents };

        const result = await axios.post(apiUrl, payload, {
            headers: {
                "Content-Type": "application/json",
                ...(apiKey && { Authorization: `Bearer ${apiKey}` })
            }
        });

        let rawText = result.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        rawText = rawText.replace(/```json|```/g, "").trim();

        return rawText;
    } catch (error) {
        console.error("Error in geminiMultiModalResponse:", error.message || error);
        return JSON.stringify({
            type: "general",
            response: "Sorry, something went wrong while processing your request."
        });
    }
};

/**
 * Handles text-only requests and enforces structured JSON output.
 * @param {string} prompt - The user prompt.
 * @param {string} model - Model to use (default from env or fallback)
 * @returns {Promise<string>} - Clean JSON response string.
 */
const geminiResponse = async (prompt, model = process.env.GEMINI_MODEL || "gemma-3n-e4b-it") => {
    try {
        if (!prompt) throw new Error("Prompt is required");
        
        const apiUrl = process.env.GEMINI_API_URL;
        const apiKey = process.env.GEMINI_API_KEY;

        const payload = {
            model,
            contents: [
                {
                    parts: [
                        {
text: `
You are an intelligent AI assistant. Provide JSON responses only.
Output formats:
1. General question:
{
  "type": "general",
  "response": "<short natural answer>"
}
2. Request for current date:
{
  "type": "call_api",
  "url": "/api/date"
}
3. Request for current time:
{
  "type": "call_api",
  "url": "/api/time"
}
4. Request for current day of week:
{
  "type": "call_api",
  "url": "/api/day"
}
Rules:
- If the user asks for the current date → return type "call_api" with "/api/date".
- If the user asks for the current time (e.g., "what time is it?", "current time", "now") → return type "call_api" with "/api/time".
- If the user asks for the current day of the week (e.g., "what day is today?", "day of week") → return type "call_api" with "/api/day".
- Always return valid JSON.
- NEVER include markdown, backticks, or extra text.
User input: ${prompt}`
                        }
                    ]
                }
            ]
        };

        const result = await axios.post(apiUrl, payload, {
            headers: {
                "Content-Type": "application/json",
                ...(apiKey && { Authorization: `Bearer ${apiKey}` })
            }
        });
        let rawText = result.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        rawText = rawText.replace(/```json|```/g, "").trim();

        // Validate JSON
        try {
            JSON.parse(rawText);
        } catch {
            rawText = JSON.stringify({
                type: "general",
                response: "Sorry, I could not understand that."
            });
        }

        return rawText;
    } catch (error) {
        console.error("Error in geminiResponse:", error.message || error);
        return JSON.stringify({
            type: "general",
            response: "Sorry, something went wrong while processing your request."
        });
    }
};

export { geminiMultiModalResponse, geminiResponse };
