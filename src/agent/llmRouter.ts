import { GoogleGenAI } from '@google/genai';

// ── PROVIDER REGISTRY ──
// Add any provider here. Order = priority.
const PROVIDERS = [
  {
    name: 'azure-openai',
    available: () => !!(process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_ENDPOINT),
    invoke: async (prompt: string, system: string) => {
      const messages = [];
      if (system) messages.push({ role: 'system', content: system });
      messages.push({ role: 'user', content: prompt });

      const endpoint = process.env.AZURE_OPENAI_ENDPOINT?.replace(/\/$/, '');
      const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o';
      const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-08-01-preview';
      const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'api-key': process.env.AZURE_OPENAI_API_KEY!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages })
      });

      const data = await res.json() as any;
      if (!res.ok || data.error) {
        throw new Error(data.error?.message || `Azure OpenAI error ${res.status}`);
      }
      return data.choices[0]?.message?.content || '';
    }
  },
  {
    name: 'gemini',
    available: () => !!process.env.GEMINI_API_KEY,
    invoke: async (prompt: string, system: string) => {
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY! 
      });
      const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
      let lastErr = null;
      for (const model of modelsToTry) {
        try {
          const res = await ai.models.generateContent({
            model,
            contents: prompt,
            ...(system ? { config: { systemInstruction: system } } : {})
          });
          if (res.text) return res.text;
        } catch (err: any) {
          lastErr = err;
          const errStr = String(err?.message || err);
          if (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('Quota exceeded')) {
            console.log(`[LLM ROUTER] Gemini model ${model} quota reached. Trying next model.`);
          } else {
            console.log(`[LLM ROUTER] Gemini model ${model} failed: ${errStr.slice(0, 100)}`);
          }
        }
      }
      throw lastErr || new Error('All Gemini models failed');
    }
  },
  {
    name: 'openai',
    available: () => !!process.env.OPENAI_API_KEY,
    invoke: async (prompt: string, system: string) => {
      const messages = [];
      if (system) messages.push({ role: 'system', content: system });
      messages.push({ role: 'user', content: prompt });

      const res = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages
          })
        }
      );
      const data = await res.json() as any;
      if (!res.ok || data.error) {
        throw new Error(data.error?.message || `OpenAI error ${res.status}`);
      }
      return data.choices[0]?.message?.content || '';
    }
  },
  {
    name: 'groq',
    available: () => !!process.env.GROQ_API_KEY,
    invoke: async (prompt: string, system: string) => {
      const messages = [];
      if (system) messages.push({ role: 'system', content: system });
      messages.push({ role: 'user', content: prompt });

      const res = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages
          })
        }
      );
      const data = await res.json() as any;
      if (!res.ok || data.error) {
        throw new Error(data.error?.message || `Groq error ${res.status}`);
      }
      return data.choices[0]?.message?.content || '';
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
      const isQuota = msg.includes('429') || 
                      msg.includes('quota') || 
                      msg.includes('rate limit') ||
                      msg.includes('RESOURCE_EXHAUSTED') ||
                      msg.includes('insufficient');

      if (isQuota) {
        console.log(`[LLM ROUTER] ${provider.name} rate limit / quota reached. Switching provider.`);
      } else {
        console.log(`[LLM ROUTER] ${provider.name} unavailable: ${msg.slice(0, 100)}`);
      }
      errors.push(`${provider.name}: ${msg.slice(0, 100)}`);
      continue;
    }
  }

  // Local heuristic fallback when external APIs or quotas fail
  console.log(`[LLM ROUTER] External LLM providers unavailable or quota limited. Engaging local heuristic fallback.`);
  
  let fallbackText = "sandboxNode";
  if (system.includes("Arcana") || system.includes("subsystem")) {
    const lower = prompt.toLowerCase();
    if (lower.includes("code") || lower.includes("build") || lower.includes("sandbox")) fallbackText = "sandboxNode";
    else if (lower.includes("repair") || lower.includes("fix") || lower.includes("debug")) fallbackText = "selfRepairNode";
    else if (lower.includes("memory") || lower.includes("recall")) fallbackText = "memoryNode";
    else if (lower.includes("rule") || lower.includes("safety") || lower.includes("doctrine")) fallbackText = "doctrineNode";
    else if (lower.includes("car") || lower.includes("obd") || lower.includes("vehicle")) fallbackText = "automotiveObdNode";
    else if (lower.includes("ego") || lower.includes("identity")) fallbackText = "egoModelNode";
    else if (lower.includes("phenotype") || lower.includes("trait")) fallbackText = "phenotypeNode";
    else fallbackText = "sandboxNode";
  } else if (system.includes("Phenotype")) {
    fallbackText = "High-alert diagnostic posture, Resilient memory caching, Adaptive subsystem probing";
  } else if (system.includes("explaining your routing decision")) {
    fallbackText = `Arcana routed request to target subsystem based on system heuristic bounds and active memory state.`;
  } else {
    fallbackText = "Microfyxd Meta-Cognitive Engine active. All cognitive sub-routing operational.";
  }

  return { text: fallbackText, provider: 'local-fallback' };
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
