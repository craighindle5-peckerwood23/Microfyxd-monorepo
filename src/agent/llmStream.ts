export async function* llmStream(text: string) {
  // Simple mock of a streaming generator
  const words = text.split(" ");
  for (const word of words) {
    yield word + " ";
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}
