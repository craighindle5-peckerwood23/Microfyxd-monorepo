import { GoogleGenAI } from "@google/genai";

// Standard initialization for Gemini using the modern SDK
export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// A minimal wrapper to simulate the 'invoke' behavior seen in the user's LangGraph prompt
export const llm = {
  invoke: async (messages: any[]) => {
    try {
      const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return { content: response.text };
    } catch (e) {
      console.error("LLM Invoke Error:", e);
      return { content: "Fallback response due to LLM error" };
    }
  }
};
