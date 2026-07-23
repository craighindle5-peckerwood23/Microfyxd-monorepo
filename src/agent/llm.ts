import { GoogleGenAI } from "@google/genai";
import { routeLLM } from "./llmRouter";

export const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || ''
});

export const llm = {
  invoke: async (messages: any[]) => {
    const system = messages.find(m => m.role === 'system')?.content || '';
    const user = messages.find(m => m.role === 'user')?.content || '';

    try {
      const { text, provider } = await routeLLM(user, system);
      return { content: text, provider };
    } catch (err: any) {
      console.warn('[LLM INNODE FALLBACK]', err?.message);
      return { 
        content: "sandboxNode", 
        provider: "local-fallback" 
      };
    }
  }
};

