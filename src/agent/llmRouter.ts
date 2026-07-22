import { GoogleGenAI } from '@google/genai';

// ── PROVIDER REGISTRY ──
// Add any provider here. Order = priority.
const PROVIDERS = [
  {
    name: 'gemini',
    available: () => !!process.env.GEMINI_API_KEY,
    invoke: async (prompt: string, system: string) => {
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY! 
      });
      const res = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        ...(system ? { config: { systemInstruction: system } } : {})
      });
      return res.text || '';
    }
  },
  {
    name: 'deepseek',
    available: () => !!process.env.DEEPSEEK_API_KEY,
    invoke: async (prompt: string, system: string) => {
      const messages = [];
      if (system) messages.push({ role: 'system', content: system });
      messages.push({ role: 'user', content: prompt });

      const res = await fetch(
        'https://api.deepseek.com/chat/completions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages
          })
        }
      );
      const data = await res.json() as any;
      if (!res.ok || data.error) {
        throw new Error(data.error?.message || `DeepSeek error ${res.status}`);
      }
      return data.choices[0]?.message?.content || '';
    }
  },
  {
    name: 'grok',
    available: () => !!process.env.GROK_API_KEY,
    invoke: async (prompt: string, system: string) => {
      const messages = [];
      if (system) messages.push({ role: 'system', content: system });
      messages.push({ role: 'user', content: prompt });

      const res = await fetch(
        'https://api.x.ai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'grok-3',
            messages
          })
        }
      );
      const data = await res.json() as any;
      if (!res.ok || data.error) {
        throw new Error(data.error?.message || `Grok error ${res.status}`);
      }
      return data.choices[0]?.message?.content || '';
    }
  },
  {
    name: 'perplexity',
    available: () => !!process.env.PERPLEXITY_API_KEY,
    invoke: async (prompt: string, system: string) => {
      const messages = [];
      if (system) messages.push({ role: 'system', content: system });
      messages.push({ role: 'user', content: prompt });

      const res = await fetch(
        'https://api.perplexity.ai/chat/completions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.1-sonar-large-128k-online',
            messages
          })
        }
      );
      const data = await res.json() as any;
      if (!res.ok || data.error) {
        throw new Error(data.error?.message || `Perplexity error ${res.status}`);
      }
      return data.choices[0]?.message?.content || '';
    }
  },
  {
    name: 'claude',
    available: () => !!process.env.ANTHROPIC_API_KEY,
    invoke: async (prompt: string, system: string) => {
      const res = await fetch(
        'https://api.anthropic.com/v1/messages',
        {
          method: 'POST',
          headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY!,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            ...(system ? { system } : {}),
            messages: [{ role: 'user', content: prompt }]
          })
        }
      );
      const data = await res.json() as any;
      if (!res.ok || data.error) {
        throw new Error(data.error?.message || `Claude error ${res.status}`);
      }
      return data.content[0]?.text || '';
    }
  }
];

// ── MAIN ROUTER ──
// Tries each provider in order. If one fails or hits quota, moves to next.
export async function routeLLM(
  prompt: string,
  system: string = '',
  preferredProvider?: string
): Promise<{ text: string; provider: string }> {

  // If a specific provider is requested, try it first
  let orderedProviders = [...PROVIDERS];
  if (preferredProvider) {
    orderedProviders = [
      ...PROVIDERS.filter(p => p.name === preferredProvider),
      ...PROVIDERS.filter(p => p.name !== preferredProvider)
    ];
  }

  const errors: string[] = [];

  for (const provider of orderedProviders) {
    if (!provider.available()) continue;

    try {
      const text = await provider.invoke(prompt, system);
      console.log(`[LLM ROUTER] Success via ${provider.name}`);
      return { text, provider: provider.name };
    } catch (err: any) {
      const msg = err?.message || String(err);
      console.warn(`[LLM ROUTER] ${provider.name} failed: ${msg}`);
      errors.push(`${provider.name}: ${msg}`);

      // If quota error, immediately try next
      const isQuota = msg.includes('429') || 
                      msg.includes('quota') || 
                      msg.includes('rate limit') ||
                      msg.includes('insufficient');
      if (isQuota) continue;

      // For other errors, still try next
      continue;
    }
  }

  throw new Error(
    `All LLM providers failed:\n${errors.join('\n')}`
  );
}

// ── SIMPLE WRAPPER — drop-in replacement for llm.invoke() ──
export const llm = {
  invoke: async (messages: { role: string; content: string }[]) => {
    const system = messages.find(m => m.role === 'system')?.content || '';
    const user = messages.find(m => m.role === 'user')?.content || '';
    const { text, provider } = await routeLLM(user, system);
    return { content: text, provider };
  }
};
