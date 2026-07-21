import { llm } from "../llm";
import { deepSpeechModel } from "../audio/deepSpeechModel";

export async function speechOutputNode(state: any) {
  const text = state.result || state.arcanaThought || state.input;

  // 1. Optional: refine speech text using LLM
  const refined = await llm.invoke([
    {
      role: "system",
      content: "Rewrite the text for spoken output. Make it clear and natural.",
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
