import { GoogleGenAI } from "@google/genai";

// Standard initialization for Gemini using the modern SDK
export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// A minimal wrapper to simulate the 'invoke' behavior seen in the user's LangGraph prompt
export const llm = {
  invoke: async (messages: any[]) => {
    let retries = 3;
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    
    while (retries >= 0) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
        });
        return { content: response.text };
      } catch (e: any) {
        console.warn(`[GEMINI INVOKE API ATTEMPT FAILED] Retries left: ${retries}. Error:`, e);
        if (retries === 0) {
          console.error("LLM Invoke Error after retries:", e);
          return { content: "Fallback response due to LLM error" };
        }
        retries--;
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }
    return { content: "Fallback response due to LLM error" };
  }
};
