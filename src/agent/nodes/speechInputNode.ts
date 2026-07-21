import { deepSpeechInputModel } from "../audio/deepSpeechInputModel"; // your STT wrapper

/**
 * Speech Input Node
 * -----------------
 * Converts microphone audio into text and injects it into LangGraph state.
 */

export async function speechInputNode(state: any) {
  const audioBuffer = state.speechInputAudio;

  if (!audioBuffer) {
    return {
      ...state,
      error: "No audio provided to speechInputNode",
      next: null,
    };
  }

  // 1. Run deep-learning speech-to-text
  const transcript = await deepSpeechInputModel.transcribe(audioBuffer);

  // 2. Normalize text
  const normalized = transcript.trim();

  // 3. Inject into LangGraph state
  return {
    ...state,
    input: normalized,
    speechInputText: normalized,
    next: "arcanaCognitiveRouterNode",
  };
}
