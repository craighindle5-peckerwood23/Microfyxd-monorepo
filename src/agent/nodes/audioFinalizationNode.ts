export async function audioFinalizationNode(state: any) {
  const chunks = state.partialSpeechAudio || [];

  // Note: Node.js does not have a global Blob. We can just return the chunks directly or mock.
  // In an actual browser or using a polyfill we could use Blob. Let's just pass the chunks.
  
  // Here we mock merging by just taking the first chunk or simulating it if this was client side.
  // Since we're in the backend typically with LangGraph we should be careful with DOM types.
  
  // For now, let's just combine the ArrayBuffers if needed, or pass as is.
  return {
    ...state,
    finalSpeechAudio: chunks,
    next: null,
  };
}
