export const streamingSTT = {
  async transcribeChunk(chunk: ArrayBuffer): Promise<string> {
    // Mock for SomeStreamingSTT
    console.log("Transcribing chunk of size:", chunk.byteLength);
    return "chunk";
  },
};
