import { GoogleGenAI } from "@google/genai";
import { routeLLM, llm as routerLlm } from "./llmRouter";

// Standard initialization for Gemini using the modern SDK
export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Export llm backed by our multi-provider fallback router
export const llm = routerLlm;

