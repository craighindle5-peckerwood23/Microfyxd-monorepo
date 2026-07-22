import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || ''
});

export const llm = {
  invoke: async (messages: any[]) => {
    const system = messages.find(m => m.role === 'system')?.content || '';
    const user = messages.find(m => m.role === 'user')?.content || '';

    // Try each provider in order
    const providers = [
      {
        name: 'gemini',
        fn: async () => {
          const res = await ai.models.generateContent({
            model: 'gemini-2.0-flash',  // fixed model name
            contents: user,
            ...(system ? { config: { systemInstruction: system } } : {})
          });
          return res.text || '';
        }
      },
      {
        name: 'groq',
        fn: async () => {
          if (!process.env.GROQ_API_KEY) throw new Error('No key');
          const reqMessages = [];
          if (system) reqMessages.push({ role: 'system', content: system });
          reqMessages.push({ role: 'user', content: user });

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
                messages: reqMessages
              })
            }
          );
          const data = await res.json() as any;
          return data.choices[0].message.content;
        }
      },
      {
        name: 'deepseek',
        fn: async () => {
          if (!process.env.DEEPSEEK_API_KEY) throw new Error('No key');
          const reqMessages = [];
          if (system) reqMessages.push({ role: 'system', content: system });
          reqMessages.push({ role: 'user', content: user });

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
                messages: reqMessages
              })
            }
          );
          const data = await res.json() as any;
          return data.choices[0].message.content;
        }
      },
      {
        name: 'grok',
        fn: async () => {
          if (!process.env.GROK_API_KEY) throw new Error('No key');
          const reqMessages = [];
          if (system) reqMessages.push({ role: 'system', content: system });
          reqMessages.push({ role: 'user', content: user });

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
                messages: reqMessages
              })
            }
          );
          const data = await res.json() as any;
          return data.choices[0].message.content;
        }
      }
    ];

    for (const provider of providers) {
      try {
        const content = await provider.fn();
        console.log(`[LLM] Responded via ${provider.name}`);
        return { content, provider: provider.name };
      } catch (err: any) {
        console.warn(`[LLM] ${provider.name} failed:`, err.message);
        continue;
      }
    }

    return { content: "All providers failed — fallback response", provider: "none" };
  }
};
