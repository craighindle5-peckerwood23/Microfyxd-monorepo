import { llm } from "../llm";
import { deepSpeechModel } from "../audio/deepSpeechModel";

export async function speechOutputNode(state: any) {
  const text = state.result || state.arcanaThought || state.input;

  // 1. Refine speech text using LLM for ARCANA's sophisticated voice profile
  const refined = await llm.invoke([
    {
      role: "system",
      content: "You are ARCANA. Rewrite the text for spoken delivery using a calm, articulate, and resonant voice profile. Maintain precise diction, controlled pacing, fluid phrasing, and formal sentence structure with absolute clarity and measured confidence.",
    },
    { role: "user", content: text },
  ]);

  const speechText = refined.content;

  // 2. Generate audio using your deep learning TTS model
  const audioBuffer = await deepSpeechModel.synthesize(speechText);

  // 3. Return updated state
  return {
    ...state,
    speechText,
    speechAudio: audioBuffer,
    next: null, // end of chain
  };
}
