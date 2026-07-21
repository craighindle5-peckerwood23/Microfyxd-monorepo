export const streamingTTS = {
  async synthesizeChunk(textChunk: string): Promise<ArrayBuffer> {
    // Mock for SomeStreamingTTS
    console.log("Synthesizing chunk:", textChunk);
    return new ArrayBuffer(0);
  },
};
