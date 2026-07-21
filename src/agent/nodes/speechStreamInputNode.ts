import { streamingSTT } from "../audio/streamingSTT";

export async function speechStreamInputNode(state: any) {
  const audioChunk = state.audioChunk;
  if (!audioChunk) {
    return { ...state, next: null };
  }

  // 1. Transcribe chunk
  const partialText = await streamingSTT.transcribeChunk(audioChunk);

  // 2. Append to running transcript
  const updated = (state.partialInput || "") + " " + partialText;

  return {
    ...state,
    partialInput: updated.trim(),
    next: "arcanaCognitiveRouterNode",
  };
}
