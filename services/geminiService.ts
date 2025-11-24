
import { GoogleGenAI } from "@google/genai";
import { EarningsEvent } from "../types";

// Initialize Gemini Client
// Note: In a production environment, API keys should be handled securely.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchEarningsData = async (): Promise<{ events: EarningsEvent[], sources: string[] }> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // We use gemini-2.5-flash for speed and search capabilities.
    // We cannot use responseMimeType: 'application/json' with tools: [googleSearch],
    // so we must instruct the model to format the text output as a JSON block.
    const prompt = `
      Act as a financial data aggregator. 
      Search for the Nasdaq earnings calendar for the next 30 days starting from today (${today}).
      
      I need a list of the most significant companies (large cap and popular tech stocks) reporting earnings.
      Focus on companies listed on Nasdaq or major exchanges relevant to tech/growth.
      
      Extract the following details for at least 20-30 upcoming events:
      1. Ticker Symbol
      2. Company Name
      3. Report Date (Format: YYYY-MM-DD)
      4. Report Time (Use exactly "BMO" for Before Market Open, "AMC" for After Market Close, or "TBD")
      
      CRITICAL OUTPUT INSTRUCTIONS:
      - Return the data ONLY as a valid JSON array inside a markdown code block (\`\`\`json ... \`\`\`).
      - Do not include any conversational text before or after the code block.
      - The JSON objects must have keys: "ticker", "companyName", "date", "time", "estimate".
      - If "estimate" (EPS estimate) is not found, use "N/A".
      - Ensure the dates are strictly within the next 30 days.
      - Sort by date ascending.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1, // Low temperature for more deterministic formatting
      },
    });

    const textResponse = response.text;
    
    if (!textResponse) {
      throw new Error("No response received from Gemini.");
    }

    // Extract sources from grounding metadata as required by guidelines
    const sources: string[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      response.candidates[0].groundingMetadata.groundingChunks.forEach(chunk => {
        if (chunk.web?.uri) {
          sources.push(chunk.web.uri);
        }
      });
    }

    // Extract JSON from code block
    const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/) || textResponse.match(/```([\s\S]*?)```/);
    
    if (jsonMatch && jsonMatch[1]) {
      const parsedData = JSON.parse(jsonMatch[1]);
      
      // Validate and sanitize data
      const sanitizedData: EarningsEvent[] = parsedData.map((item: any) => ({
        ticker: item.ticker || "UNKNOWN",
        companyName: item.companyName || "Unknown Company",
        date: item.date || today,
        time: ["BMO", "AMC", "TBD"].includes(item.time) ? item.time : "TBD",
        estimate: item.estimate || "N/A"
      }));

      return { events: sanitizedData, sources };
    } else {
      // Fallback parsing if JSON block is missing (unlikely with 2.5 Flash but possible)
      throw new Error("Failed to parse earnings data from AI response.");
    }

  } catch (error) {
    console.error("Error fetching earnings data:", error);
    throw error;
  }
};
