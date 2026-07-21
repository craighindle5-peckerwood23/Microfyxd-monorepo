import { llmStream } from "../llmStream";
import { streamingTTS } from "../audio/streamingTTS";

export async function speechStreamOutputNode(state: any) {
  const text = state.result || state.arcanaThought || state.partialInput || state.input;

  const audioChunks: ArrayBuffer[] = [];
  const textChunks: string[] = [];

  // 1. Stream LLM tokens
  for await (const token of llmStream(text)) {
    textChunks.push(token);

    // 2. Convert token chunk to audio
    const audioChunk = await streamingTTS.synthesizeChunk(token);
    audioChunks.push(audioChunk);
  }

  return {
    ...state,
    partialSpeechText: textChunks.join(""),
    partialSpeechAudio: audioChunks,
    next: "audioFinalizationNode",
  };
}
