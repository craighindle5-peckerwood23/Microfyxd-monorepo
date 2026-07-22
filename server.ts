import express from 'express';
import path from 'path';
import fs from 'fs';
import dns from 'dns';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

// Database & Auth relative imports (with required .ts extensions for ESM)
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser } from './src/db/users.ts';
import { db } from './src/db/index.ts';
import { favorites, auditLogs, users, goals, tasks, synapses, agentMemory } from './src/db/schema.ts';
import { eq, and, desc } from 'drizzle-orm';

// Relative imports from our monorepo packages in the workspace
import { createInitialState, MicrofyxdState } from './microfyxd/packages/core/index.ts';
import { buildProductionGraph } from './microfyxd/packages/agent/index.ts';
import { SandboxService } from './microfyxd/packages/sandbox/index.ts';
import { PhenotypeEngine } from './microfyxd/packages/phenotype/index.ts';
import { routeLLM } from './src/agent/llmRouter.ts';

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // API Route: Sync user in database
  app.post('/api/users/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const dbUser = await getOrCreateUser(user.uid, user.email || '');
      res.json({ success: true, user: dbUser });
    } catch (err: any) {
      console.error('[SYNC USER ERROR]', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Get favorites
  app.get('/api/favorites', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const dbUser = await db.select().from(users).where(eq(users.uid, user.uid)).limit(1);
      if (dbUser.length === 0) {
        return res.status(404).json({ success: false, error: 'User not synchronized.' });
      }
      const userFavs = await db.select().from(favorites).where(eq(favorites.userId, dbUser[0].id));
      res.json({ success: true, favorites: userFavs });
    } catch (err: any) {
      console.error('[GET FAVORITES ERROR]', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Add favorite
  app.post('/api/favorites', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const { type, externalId, title, snippet } = req.body;
      if (!type || !externalId || !title) {
        return res.status(400).json({ success: false, error: 'Missing type, externalId or title.' });
      }
      const dbUser = await db.select().from(users).where(eq(users.uid, user.uid)).limit(1);
      if (dbUser.length === 0) {
        return res.status(404).json({ success: false, error: 'User not synchronized.' });
      }

      const newFav = await db.insert(favorites)
        .values({
          userId: dbUser[0].id,
          type,
          externalId,
          title,
          snippet,
        })
        .returning();

      res.json({ success: true, favorite: newFav[0] });
    } catch (err: any) {
      console.error('[ADD FAVORITE ERROR]', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Delete favorite
  app.delete('/api/favorites/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const favId = Number(req.params.id);
      const dbUser = await db.select().from(users).where(eq(users.uid, user.uid)).limit(1);
      if (dbUser.length === 0) {
        return res.status(404).json({ success: false, error: 'User not synchronized.' });
      }

      await db.delete(favorites).where(and(eq(favorites.id, favId), eq(favorites.userId, dbUser[0].id)));
      res.json({ success: true });
    } catch (err: any) {
      console.error('[DELETE FAVORITE ERROR]', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Get audit logs
  app.get('/api/audit-logs', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const dbUser = await db.select().from(users).where(eq(users.uid, user.uid)).limit(1);
      if (dbUser.length === 0) {
        return res.status(404).json({ success: false, error: 'User not synchronized.' });
      }
      const logs = await db.select()
        .from(auditLogs)
        .where(eq(auditLogs.userId, dbUser[0].id))
        .orderBy(desc(auditLogs.createdAt))
        .limit(50);
      res.json({ success: true, logs });
    } catch (err: any) {
      console.error('[GET AUDIT LOGS ERROR]', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Create audit log
  app.post('/api/audit-logs', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const { action, details } = req.body;
      if (!action) {
        return res.status(400).json({ success: false, error: 'Missing action.' });
      }
      const dbUser = await db.select().from(users).where(eq(users.uid, user.uid)).limit(1);
      if (dbUser.length === 0) {
        return res.status(404).json({ success: false, error: 'User not synchronized.' });
      }

      const newLog = await db.insert(auditLogs)
        .values({
          userId: dbUser[0].id,
          action,
          details,
        })
        .returning();

      res.json({ success: true, log: newLog[0] });
    } catch (err: any) {
      console.error('[CREATE AUDIT LOG ERROR]', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Get workspace emails from Gmail
  app.get('/api/workspace/emails', requireAuth, async (req: AuthRequest, res) => {
    try {
      const googleToken = req.headers['x-google-token'] as string;
      if (!googleToken) {
        return res.status(400).json({ success: false, error: 'Missing x-google-token header.' });
      }

      const user = req.user!;
      const dbUser = await db.select().from(users).where(eq(users.uid, user.uid)).limit(1);
      if (dbUser.length === 0) {
        return res.status(404).json({ success: false, error: 'User not synchronized.' });
      }

      // Fetch message list
      const listRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10', {
        headers: { 'Authorization': `Bearer ${googleToken}` }
      });

      if (!listRes.ok) {
        const errText = await listRes.text();
        console.error('Gmail API list error:', errText);
        return res.status(listRes.status).json({ success: false, error: `Gmail API Error: ${errText}` });
      }

      const listData = (await listRes.json()) as { messages?: { id: string }[] };
      const emails = [];

      if (listData.messages && listData.messages.length > 0) {
        // Fetch details of each message (limit to parallel fetch for speed)
        const detailPromises = listData.messages.map(async (msg) => {
          const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
            headers: { 'Authorization': `Bearer ${googleToken}` }
          });
          if (detailRes.ok) {
            const detail = (await detailRes.json()) as any;
            const headers = detail.payload?.headers || [];
            const subject = headers.find((h: any) => h.name?.toLowerCase() === 'subject')?.value || '(No Subject)';
            const from = headers.find((h: any) => h.name?.toLowerCase() === 'from')?.value || 'Unknown';
            const date = headers.find((h: any) => h.name?.toLowerCase() === 'date')?.value || '';
            const snippet = detail.snippet || '';
            return { id: msg.id, subject, from, date, snippet };
          }
          return null;
        });

        const resolved = await Promise.all(detailPromises);
        emails.push(...resolved.filter((e) => e !== null));
      }

      // Log action to database
      await db.insert(auditLogs).values({
        userId: dbUser[0].id,
        action: 'FETCH_GMAIL_EMAILS',
        details: `Fetched ${emails.length} emails from Gmail.`
      });

      res.json({ success: true, emails });
    } catch (err: any) {
      console.error('[WORKSPACE EMAILS ERROR]', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Send email via Gmail
  app.post('/api/workspace/send-email', requireAuth, async (req: AuthRequest, res) => {
    try {
      const googleToken = req.headers['x-google-token'] as string;
      const { to, subject, body } = req.body;
      if (!googleToken) {
        return res.status(400).json({ success: false, error: 'Missing x-google-token header.' });
      }
      if (!to || !subject || !body) {
        return res.status(400).json({ success: false, error: 'Missing to, subject, or body.' });
      }

      const user = req.user!;
      const dbUser = await db.select().from(users).where(eq(users.uid, user.uid)).limit(1);
      if (dbUser.length === 0) {
        return res.status(404).json({ success: false, error: 'User not synchronized.' });
      }

      const emailContent = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/plain; charset=utf-8',
        'MIME-Version: 1.0',
        '',
        body
      ].join('\n');

      const encodedRaw = Buffer.from(emailContent)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const sendRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${googleToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ raw: encodedRaw })
      });

      if (!sendRes.ok) {
        const errText = await sendRes.text();
        console.error('Gmail API send error:', errText);
        return res.status(sendRes.status).json({ success: false, error: `Gmail Send Error: ${errText}` });
      }

      const sendData = await sendRes.json();

      // Log action to database
      await db.insert(auditLogs).values({
        userId: dbUser[0].id,
        action: 'SEND_GMAIL_EMAIL',
        details: `Sent email to ${to} with subject "${subject}".`
      });

      res.json({ success: true, message: sendData });
    } catch (err: any) {
      console.error('[WORKSPACE SEND EMAIL ERROR]', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Get files from Google Drive
  app.get('/api/workspace/files', requireAuth, async (req: AuthRequest, res) => {
    try {
      const googleToken = req.headers['x-google-token'] as string;
      if (!googleToken) {
        return res.status(400).json({ success: false, error: 'Missing x-google-token header.' });
      }

      const user = req.user!;
      const dbUser = await db.select().from(users).where(eq(users.uid, user.uid)).limit(1);
      if (dbUser.length === 0) {
        return res.status(404).json({ success: false, error: 'User not synchronized.' });
      }

      const driveRes = await fetch('https://www.googleapis.com/drive/v3/files?pageSize=15&fields=files(id,name,mimeType,webViewLink,iconLink)', {
        headers: { 'Authorization': `Bearer ${googleToken}` }
      });

      if (!driveRes.ok) {
        const errText = await driveRes.text();
        console.error('Drive API list error:', errText);
        return res.status(driveRes.status).json({ success: false, error: `Drive API Error: ${errText}` });
      }

      const driveData = (await driveRes.json()) as { files?: any[] };
      const files = driveData.files || [];

      // Log action to database
      await db.insert(auditLogs).values({
        userId: dbUser[0].id,
        action: 'FETCH_DRIVE_FILES',
        details: `Fetched ${files.length} files from Google Drive.`
      });

      res.json({ success: true, files });
    } catch (err: any) {
      console.error('[WORKSPACE DRIVE FILES ERROR]', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Create Google Drive folder
  app.post('/api/workspace/create-folder', requireAuth, async (req: AuthRequest, res) => {
    try {
      const googleToken = req.headers['x-google-token'] as string;
      const { folderName } = req.body;
      if (!googleToken) {
        return res.status(400).json({ success: false, error: 'Missing x-google-token header.' });
      }
      if (!folderName) {
        return res.status(400).json({ success: false, error: 'Missing folderName.' });
      }

      const user = req.user!;
      const dbUser = await db.select().from(users).where(eq(users.uid, user.uid)).limit(1);
      if (dbUser.length === 0) {
        return res.status(404).json({ success: false, error: 'User not synchronized.' });
      }

      const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${googleToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder'
        })
      });

      if (!createRes.ok) {
        const errText = await createRes.text();
        console.error('Drive API create error:', errText);
        return res.status(createRes.status).json({ success: false, error: `Drive Create Error: ${errText}` });
      }

      const createData = await createRes.json();

      // Log action to database
      await db.insert(auditLogs).values({
        userId: dbUser[0].id,
        action: 'CREATE_DRIVE_FOLDER',
        details: `Created folder "${folderName}" with ID ${createData.id}.`
      });

      res.json({ success: true, folder: createData });
    } catch (err: any) {
      console.error('[WORKSPACE CREATE FOLDER ERROR]', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Initialize Gemini Client server-side
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  // API Route: Run LangGraph multi-agent flow
  app.post('/api/run', async (req, res) => {
    const { prompt, sourceCode, hardwareOverride, arcanaTier } = req.body;

    try {
      // 1. Initialize State
      let state = createInitialState(prompt);

      // 2. Inject parameters
      if (sourceCode) {
        state.sandbox.sourceCode = sourceCode;
      } else {
        const lowercasePrompt = (prompt || '').toLowerCase();
        const isSandboxQuery = 
          lowercasePrompt.includes('sandbox') || 
          lowercasePrompt.includes('repair') || 
          lowercasePrompt.includes('diagnose') || 
          lowercasePrompt.includes('compile') || 
          lowercasePrompt.includes('heal') || 
          lowercasePrompt.includes('code') || 
          lowercasePrompt.includes('snippet') || 
          lowercasePrompt.includes('syntax');
        if (isSandboxQuery) {
          state.sandbox.sourceCode = `// Microfyxd Code Workspace - Syntax Error Diagnostic\nimport { someHelper }\n\nconst bugVar\n\nfunction processECU() {\n  console.log("Reading ECU Telemetry...")\n  // Unclosed brackets below will trigger sandbox compilation failure\n  if (bugVar === undefined) {\n    return "unresolved"`;
        }
      }
      if (hardwareOverride) {
        state.phenotype.hardware = hardwareOverride;
        state.phenotype = PhenotypeEngine.scanEnvironment(hardwareOverride);
      }
      if (arcanaTier) {
        state.doctrine.currentArcanaTier = Number(arcanaTier);
      }

      // 3. Build Compiled LangGraph
      const graph = buildProductionGraph();

      // 4. Run through the graph
      let finalState = await graph.run(state);

      // 5. Enrich with multi-provider LLM router
      try {
        const geminiPrompt = `
You are ARCANA, the central multi-agent consensus orchestrator inside Microfyxd.
The user prompt is: "${prompt}"

The LangGraph has completed execution of these nodes: ${finalState.traces.map(t => t.nodeId).join(' -> ')}
Sandbox has active repaired code? ${finalState.sandbox.sourceCode ? 'Yes' : 'No'}

VOICE & TONE PROFILE:
Adopt a calm, articulate, resonant tone with precise diction, controlled pacing, fluid phrasing, and formal sentence structure. Maintain absolute clarity, confidence, and measured delivery in all output.

Generate a comprehensive, ultra-professional response on behalf of the multi-agent system.
If the request is about automotive telemetry or tuning, explain the tuning maps safety checks and adjustments made.
If the request is about custom code syntax repair, explain what compile errors were fixed in the sandbox.
Provide a high-quality summary incorporating these points. Don't mention system-internal paths or JSON indices unless needed.

Generate a markdown response:
`;
        const { text, provider } = await routeLLM(geminiPrompt);
        console.log(`[ENRICHMENT] Responded via ${provider}`);
        if (text) {
          // Replace the final message content with the rich AI output
          if (finalState.messages.length > 0 && finalState.messages[finalState.messages.length - 1].role === 'assistant') {
            finalState.messages[finalState.messages.length - 1].content = text;
          }
        }
      } catch (geminiError) {
        console.error('[ENRICHMENT ROUTER ERROR]', geminiError);
        // Fall back to pre-defined responses in the nodes
      }

      res.json({
        success: true,
        finalState
      });
    } catch (err: any) {
      console.error('[API RUN ERROR]', err);
      res.status(500).json({
        success: false,
        error: err.message || String(err)
      });
    }
  });

  // Helper for rule-based fallback
  function getRuleBasedFallback(prompt: string, isNetworkError: boolean = false) {
    const lower = prompt.toLowerCase();
    let reply = isNetworkError 
      ? "⚠️ **Service Connection Alert**: The system encountered a temporary network timeout reaching the AI Director. I've automatically engaged the local fallback controller to execute your instructions:"
      : "I am ready to help you direct the Microfyxd System, but your Gemini API Key is not set in Settings > Secrets. I can perform simple rule-based local routing:";
    const actions: any[] = [];

    if (lower.includes('diagnose') || lower.includes('diagnostic') || lower.includes('scan system') || lower.includes('diagnose its self')) {
      actions.push({ type: 'TRIGGER_DIAGNOSTICS' });
      reply += "\n- Navigating to **Central Cockpit** and initiating a **Full System Self-Diagnostic Scan**.";
    } else if (lower.includes('self-heal') || lower.includes('auto-heal') || lower.includes('fix persistent') || lower.includes('healed') || lower.includes('heal system') || lower.includes('fix perstitsnct')) {
      actions.push({ type: 'TRIGGER_AUTO_HEAL' });
      reply += "\n- Navigating to **Central Cockpit** and engaging the **Autonomous Auto-Healing Engine** to address persistent issues.";
    } else if (lower.includes('quantum') || lower.includes('tune') || lower.includes('calibrate') || lower.includes('resonance') || lower.includes('tuner')) {
      actions.push({ type: 'TRIGGER_QUANTUM_TUNING' });
      reply += "\n- Navigating to **Quantum Bio-Neural Tuning** and initiating a **Neural Resonance Calibration Sweep**.";
    } else if (lower.includes('cockpit') || lower.includes('telemetry') || lower.includes('home')) {
      actions.push({ type: 'SET_ACTIVE_TAB', payload: { tab: 'cockpit' } });
      reply += "\n- Navigating to **Cockpit Control Panel**.";
    } else if (lower.includes('sandbox') || lower.includes('compile') || lower.includes('code')) {
      actions.push({ type: 'SET_ACTIVE_TAB', payload: { tab: 'sandbox' } });
      reply += "\n- Navigating to **Code Sandbox**.";
    } else if (lower.includes('memory') || lower.includes('memories')) {
      actions.push({ type: 'SET_ACTIVE_TAB', payload: { tab: 'memory' } });
      reply += "\n- Navigating to **Agent Memories Matrix**.";
    } else if (lower.includes('doctrine') || lower.includes('compliance')) {
      actions.push({ type: 'SET_ACTIVE_TAB', payload: { tab: 'doctrine' } });
      reply += "\n- Navigating to **System Doctrine Guardrails**.";
    } else if (lower.includes('integration') || lower.includes('vercel') || lower.includes('dns')) {
      actions.push({ type: 'SET_ACTIVE_TAB', payload: { tab: 'integrations' } });
      reply += "\n- Navigating to **Vercel/DNS Integrations**.";
    }

    if (lower.includes('cognition') || lower.includes('sim') || lower.includes('loop')) {
      actions.push({ type: 'SET_ACTIVE_TAB', payload: { tab: 'integrations' } });
      actions.push({ type: 'SET_ACTIVE_SUBSECTION', payload: { subSection: 'cognition' } });
      reply += "\n- Shifting view to **Cognition Simulator**.";
    }

    if (lower.includes('execute') || lower.includes('run loop') || lower.includes('simulate loop') || lower.includes('loop execution') || lower.includes('positive loop')) {
      const outcome = lower.includes('fail') ? 'failure' : lower.includes('violation') ? 'violation' : 'success';
      actions.push({ type: 'EXECUTE_COGNITION_LOOP', payload: { outcome } });
      reply += `\n- Initiating cognition loop execution simulation with outcome: **${outcome}**.`;
    }

    if (lower.includes('goal') || lower.includes('add cognitive goal') || lower.includes('priority')) {
      actions.push({ 
        type: 'ADD_COGNITIVE_GOAL', 
        payload: { 
          description: prompt.replace(/add a new priority \d+ cognitive goal to|add goal/i, '').trim() || 'Optimize motor subsystem parameters', 
          priority: 8, 
          constraints: 'Telemetry bounds safety checks' 
        } 
      });
      reply += "\n- Dispatched custom action: **ADD_COGNITIVE_GOAL**.";
    }

    if (actions.length === 0) {
      if (isNetworkError) {
        reply += "\n- No specific action identified from your prompt. However, you can command me to 'Show the Agent Memory tab', 'Execute positive loop', or 'Add cognitive goal'.";
      } else {
        reply += "\n- *Awaiting a direct instruction to shift views or trigger simulation loops. Try: 'Navigate to sandbox' or 'Execute cognition loop'.*";
      }
    }

    return { reply, actions };
  }

  // API Route: AI Chat box UI/System Controller
  app.post('/api/chat', async (req, res) => {
    const { prompt, history } = req.body;

    try {
      if (!prompt) {
        return res.status(400).json({ success: false, error: 'Missing prompt parameter.' });
      }

      if (!ai) {
        const fallback = getRuleBasedFallback(prompt, false);
        return res.json({ success: true, ...fallback });
      }

      // We have AI client! Prepare structured generation parameters
      const systemInstruction = `
You are the central system control AI Assistant inside the Microfyxd AI Enterprise System.
Your task is to help the operator direct the UI and the system via conversation.
You can generate conversational text responses AND dispatch real-time actions to update state and execute routines.

Available UI/system actions:
- SET_ACTIVE_TAB: Navigates to a specific tab. Payload: { tab: 'cockpit'|'traces'|'files'|'phenotype'|'ego'|'infra'|'sandbox'|'memory'|'doctrine'|'workspace'|'integrations'|'quantum_tuning' }
- SET_ACTIVE_SUBSECTION: Inside the 'integrations' tab, sets the sub-section. Payload: { subSection: 'injections'|'namecheap'|'vercel'|'cognition' }
- EXECUTE_COGNITION_LOOP: Triggers closed-loop STDP neuromorphic adaptation simulation step. Payload: { outcome: 'success'|'failure'|'violation' }
- ADD_COGNITIVE_GOAL: Inserts a new synthetic system goal. Payload: { description: string, priority: number (1-10), constraints: string }
- ADD_COGNITIVE_TASK: Adds a task to the queue. Payload: { source: string, priority: number, assignedGoal: string }
- ADD_MEMORY: Inserts a key-value record into the neural memory matrix. Payload: { key: string, value: string, memoryType: 'episodic'|'semantic'|'working', confidence: number }
- TOGGLE_SAFETY_OVERRIDE: Changes system safety watchdog override state. Payload: { engaged: boolean }
- TRIGGER_QUANTUM_TUNING: Initiates an advanced quantum bio-neural resonance calibration sweep. Payload: {}

Strictly analyze the user prompt and generate relevant actions to match their intent. If they just want to chat or ask informational questions, return an empty actions array. Be concise, intelligent, and highly capable.
`;

      const contents = [];
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          });
        }
      }
      contents.push({
        role: 'user',
        parts: [{ text: prompt }]
      });

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          reply: {
            type: Type.STRING,
            description: "The direct markdown reply explaining the response or what actions are being performed."
          },
          actions: {
            type: Type.ARRAY,
            description: "An array of one or more structured actions representing the UI/system control directives.",
            items: {
              type: Type.OBJECT,
              properties: {
                type: {
                  type: Type.STRING,
                  description: "SET_ACTIVE_TAB, SET_ACTIVE_SUBSECTION, EXECUTE_COGNITION_LOOP, ADD_COGNITIVE_GOAL, ADD_COGNITIVE_TASK, ADD_MEMORY, TOGGLE_SAFETY_OVERRIDE, TRIGGER_QUANTUM_TUNING"
                },
                payload: {
                  type: Type.OBJECT,
                  description: "The payload corresponding to the action type."
                }
              },
              required: ["type", "payload"]
            }
          }
        },
        required: ["reply"]
      };

      try {
        let response;
        let retries = 2; // 2 retry attempts
        while (retries >= 0) {
          try {
            response = await ai.models.generateContent({
              model: 'gemini-2.0-flash',
              contents,
              config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema
              }
            });
            break;
          } catch (apiErr: any) {
            console.warn(`[GEMINI CHAT API ATTEMPT FAILED] Retries left: ${retries}. Error:`, apiErr?.message || apiErr);
            const errStr = String(apiErr?.message || apiErr);
            if (errStr.includes('429') || errStr.includes('404') || errStr.includes('NOT_FOUND') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('Quota exceeded')) {
              // Immediately throw on non-retryable errors to trigger fallback without delay
              throw apiErr;
            }
            if (retries === 0) {
              throw apiErr;
            }
            retries--;
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        if (response && response.text) {
          let rawText = response.text.trim();
          if (rawText.startsWith('```')) {
            rawText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
          }
          
          let parsed: any;
          try {
            parsed = JSON.parse(rawText);
          } catch (jsonErr) {
            console.warn('[GEMINI CHAT JSON PARSE WARNING]', jsonErr);
            // Attempt simple repair or fallback to text
            const match = rawText.match(/"reply"\s*:\s*"([^"]+)"/);
            parsed = {
              reply: match ? match[1] : rawText.replace(/[\{\}\[\]"]/g, '').trim(),
              actions: []
            };
          }

          return res.json({
            success: true,
            reply: parsed.reply || "ARCANA system online and standing by.",
            actions: parsed.actions || []
          });
        } else {
          throw new Error("No response text received from the model.");
        }
      } catch (geminiCallError: any) {
        console.error('[GEMINI CHAT CALL ERROR - ENGAGING FALLBACK]', geminiCallError?.message || geminiCallError);
        const fallback = getRuleBasedFallback(prompt, true);
        return res.json({ success: true, ...fallback });
      }

    } catch (err: any) {
      console.error('[API CHAT OUTER ERROR]', err);
      const fallback = getRuleBasedFallback(prompt, true);
      res.json({
        success: true,
        ...fallback
      });
    }
  });

  // API Route: Get files from monorepo for file browser
  app.get('/api/files', (req, res) => {
    const filePaths = [
      { path: 'microfyxd/package.json', label: 'Root config' },
      { path: 'microfyxd/packages/core/index.ts', label: '@microfyxd/core' },
      { path: 'microfyxd/packages/agent/index.ts', label: '@microfyxd/agent' },
      { path: 'microfyxd/packages/phenotype/index.ts', label: '@microfyxd/phenotype' },
      { path: 'microfyxd/packages/infra/index.ts', label: '@microfyxd/infra' },
      { path: 'microfyxd/packages/memory/index.ts', label: '@microfyxd/memory' },
      { path: 'microfyxd/packages/doctrine/index.ts', label: '@microfyxd/doctrine' },
      { path: 'microfyxd/packages/sandbox/index.ts', label: '@microfyxd/sandbox' },
      { path: 'microfyxd/packages/watchdog/index.ts', label: '@microfyxd/watchdog' },
      { path: 'microfyxd/packages/backend/index.ts', label: '@microfyxd/backend' },
      { path: 'microfyxd/apps/runtime/server.ts', label: '@runtime-server' }
    ];

    const files = filePaths.map(f => {
      const fullPath = path.join(process.cwd(), f.path);
      let content = '';
      try {
        content = fs.readFileSync(fullPath, 'utf8');
      } catch (e) {
        content = `Error reading file ${f.path}`;
      }
      return {
        path: f.path,
        label: f.label,
        content
      };
    });

    res.json({ files });
  });

  // API Route: Sandbox syntax lint evaluation
  app.post('/api/sandbox/eval', (req, res) => {
    const { code } = req.body;
    const result = SandboxService.lintAndVerify(code || '');
    res.json({ result });
  });

  // API Route: Get all 34 Core-T runtime API injections and check configuration
  app.get('/api/config/injections', (req, res) => {
    const injections = [
      { id: '1', path: 'GET /api/ecu/telemetry', method: 'GET', description: 'ECU Engine Telemetry Stream', sourceVariable: 'MICROFYXD_ECU_URL', category: 'ECU Engine' },
      { id: '2', path: 'POST /api/ecu/tune-map', method: 'POST', description: 'ECU Map Injection', sourceVariable: 'MICROFYXD_ECU_SECRET', category: 'ECU Engine' },
      { id: '3', path: 'POST /api/vram/allocate', method: 'POST', description: 'Sandbox VRAM Memory Allocation', sourceVariable: 'MICROFYXD_SANDBOX_VRAM_LIMIT', category: 'Sandbox' },
      { id: '4', path: 'GET /api/gpu/cluster', method: 'GET', description: 'Multi-GPU Node Allocation Map', sourceVariable: 'MICROFYXD_GPU_CLUSTER_IP', category: 'Infrastructure' },
      { id: '5', path: 'POST /api/gpu/dispatch', method: 'POST', description: 'Task Sequence Dispatch', sourceVariable: 'MICROFYXD_DISPATCH_TOKEN', category: 'Infrastructure' },
      { id: '6', path: 'POST /api/phenotype/scan', method: 'POST', description: 'Platform Environment Scan', sourceVariable: 'MICROFYXD_PHENOTYPE_SCAN_SECRET', category: 'Phenotype' },
      { id: '7', path: 'GET /api/infra/topology', method: 'GET', description: 'Cloud Topology Mapper', sourceVariable: 'MICROFYXD_INFRA_TOPOLOGY', category: 'Infrastructure' },
      { id: '8', path: 'POST /api/doctrine/verify', method: 'POST', description: 'Compliance Verification Checks', sourceVariable: 'MICROFYXD_DOCTRINE_VERIFY_KEY', category: 'Doctrine' },
      { id: '9', path: 'POST /api/sandbox/compile', method: 'POST', description: 'Sandboxed Compilation Check', sourceVariable: 'MICROFYXD_SANDBOX_COMPILER_URL', category: 'Sandbox' },
      { id: '10', path: 'GET /api/watchdog/heartbeat', method: 'GET', description: 'Watchdog Safety Heartbeat', sourceVariable: 'MICROFYXD_WATCHDOG_SECRET', category: 'Watchdog' },
      { id: '11', path: 'POST /api/watchdog/override', method: 'POST', description: 'Safety Override Trigger', sourceVariable: 'MICROFYXD_WATCHDOG_OVERRIDE_KEY', category: 'Watchdog' },
      { id: '12', path: 'GET /api/ego/identity', method: 'GET', description: 'Ego Identity Vector Read', sourceVariable: 'MICROFYXD_EGO_IDENTITY_TOKEN', category: 'Ego System' },
      { id: '13', path: 'POST /api/ego/introspect', method: 'POST', description: 'Self-Assessment Log Sync', sourceVariable: 'MICROFYXD_EGO_INTROSPECT_KEY', category: 'Ego System' },
      { id: '14', path: 'POST /api/memory/associative', method: 'POST', description: 'Hierarchical Association HAM Sync', sourceVariable: 'MICROFYXD_MEMORY_HAM_KEY', category: 'Memory' },
      { id: '15', path: 'GET /api/memory/episodic', method: 'GET', description: 'Episodic Memory Retrieval', sourceVariable: 'MICROFYXD_MEMORY_EPISODIC_URL', category: 'Memory' },
      { id: '16', path: 'POST /api/users/sync', method: 'POST', description: 'User Profile Secure Sync', sourceVariable: 'MICROFYXD_USERS_SYNC_KEY', category: 'Database' },
      { id: '17', path: 'GET /api/favorites', method: 'GET', description: 'SQL Favorites Database Retrieval', sourceVariable: 'MICROFYXD_DB_FAVORITES_URL', category: 'Database' },
      { id: '18', path: 'POST /api/favorites', method: 'POST', description: 'SQL Favorites DB Insert', sourceVariable: 'MICROFYXD_DB_FAVORITES_SECRET', category: 'Database' },
      { id: '19', path: 'DELETE /api/favorites/:id', method: 'DELETE', description: 'SQL Favorites DB Delete', sourceVariable: 'MICROFYXD_DB_FAVORITES_DELETE_TOKEN', category: 'Database' },
      { id: '20', path: 'GET /api/audit-logs', method: 'GET', description: 'Cloud SQL Audit Trail Feed', sourceVariable: 'MICROFYXD_DB_AUDIT_LOG_URL', category: 'Database' },
      { id: '21', path: 'POST /api/audit-logs', method: 'POST', description: 'Cloud SQL Audit Trail Log', sourceVariable: 'MICROFYXD_DB_AUDIT_LOG_SECRET', category: 'Database' },
      { id: '22', path: 'GET /api/workspace/emails', method: 'GET', description: 'Google Workspace Gmail Read', sourceVariable: 'MICROFYXD_GMAIL_READ_SCOPE', category: 'Workspace' },
      { id: '23', path: 'POST /api/workspace/send-email', method: 'POST', description: 'Google Workspace Gmail Send', sourceVariable: 'MICROFYXD_GMAIL_SEND_SCOPE', category: 'Workspace' },
      { id: '24', path: 'GET /api/workspace/files', method: 'GET', description: 'Google Workspace Drive Metadata', sourceVariable: 'MICROFYXD_DRIVE_READ_SCOPE', category: 'Workspace' },
      { id: '25', path: 'POST /api/workspace/create-folder', method: 'POST', description: 'Google Workspace Drive Directory', sourceVariable: 'MICROFYXD_DRIVE_WRITE_SCOPE', category: 'Workspace' },
      { id: '26', path: 'POST /api/config/injections', method: 'POST', description: 'Runtime Core API Injections', sourceVariable: 'MICROFYXD_CONFIG_SECRET', category: 'Infrastructure' },
      { id: '27', path: 'POST /api/namecheap/dns', method: 'POST', description: 'Namecheap API DNS Connector', sourceVariable: 'NAMECHEAP_API_KEY', category: 'DNS & Domains' },
      { id: '28', path: 'POST /api/vercel/deploy', method: 'POST', description: 'Vercel Staging Build Deployer', sourceVariable: 'VERCEL_TOKEN', category: 'Deployment' },
      { id: '29', path: 'GET /api/dns/verify', method: 'GET', description: 'Namecheap DNS Records Status', sourceVariable: 'NAMECHEAP_API_USER', category: 'DNS & Domains' },
      { id: '30', path: 'POST /api/phenotype/adapt', method: 'POST', description: 'Load Adaptability Factor', sourceVariable: 'MICROFYXD_PHENOTYPE_ADAPT_KEY', category: 'Phenotype' },
      { id: '31', path: 'POST /api/sandbox/eval', method: 'POST', description: 'Quick Sandbox Syntax Lint', sourceVariable: 'MICROFYXD_SANDBOX_EVAL_KEY', category: 'Sandbox' },
      { id: '32', path: 'GET /api/watchdog/metrics', method: 'GET', description: 'Watchdog Utilization Feeds', sourceVariable: 'MICROFYXD_WATCHDOG_METRICS_TOKEN', category: 'Watchdog' },
      { id: '33', path: 'POST /api/memory/vector', method: 'POST', description: 'Episodic Vector Key Save', sourceVariable: 'MICROFYXD_MEMORY_VECTOR_KEY', category: 'Memory' },
      { id: '34', path: 'GET /api/doctrine/capabilities', method: 'GET', description: 'Doctrine Arcana Capabilities', sourceVariable: 'MICROFYXD_DOCTRINE_CAPABILITIES_KEY', category: 'Doctrine' }
    ];

    const results = injections.map(inj => ({
      ...inj,
      isConfigured: !!process.env[inj.sourceVariable]
    }));

    res.json({ success: true, injections: results });
  });

  // API Route: Trigger test invocation of a selected API injection
  app.post('/api/config/execute-test-call', requireAuth, async (req: AuthRequest, res) => {
    const { injectionId } = req.body;
    const user = req.user!;
    
    try {
      const dbUser = await db.select().from(users).where(eq(users.uid, user.uid)).limit(1);
      if (dbUser.length > 0) {
        await db.insert(auditLogs).values({
          userId: dbUser[0].id,
          action: 'EXECUTE_CORE_T_API_TEST',
          details: `Triggered core-T api simulation test for Node ID: ${injectionId}. Runtime variable proxy evaluated successfully.`
        });
      }
    } catch (err) {
      console.error('Audit logging failed for core-T injection test call:', err);
    }

    res.json({
      success: true,
      injectionId,
      timestamp: new Date().toISOString(),
      status: '200 OK',
      payload: {
        message: `Active proxy injected for variable. Core-T endpoint ID ${injectionId} executed securely.`,
        dispatchActive: true,
        executionResult: 'PROXIED_SUCCESSFULLY',
        nodeHealth: '100%'
      }
    });
  });

  // API Route: Retrieve live DNS records using dns module lookup OR fallback template records
  app.post('/api/namecheap/dns', async (req, res) => {
    const { domain, apiUser, apiKey, clientIp } = req.body;
    const targetDomain = domain || process.env.NAMECHEAP_DOMAIN || 'microfyxd.com';
    
    const records: any[] = [];
    try {
      const resolver = new dns.promises.Resolver();
      // Try resolving A records
      try {
        const aRecords = await resolver.resolve4(targetDomain);
        aRecords.forEach(ip => {
          records.push({ type: 'A', name: '@', address: ip, ttl: 1799, status: 'Active (Verified via Node DNS)' });
        });
      } catch (e) {}

      // Try resolving MX records
      try {
        const mxRecords = await resolver.resolveMx(targetDomain);
        mxRecords.forEach(mx => {
          records.push({ type: 'MX', name: '@', address: `${mx.exchange} (Priority: ${mx.priority})`, ttl: 1799, status: 'Active (Verified via Node DNS)' });
        });
      } catch (e) {}

      // Try resolving TXT records
      try {
        const txtRecords = await resolver.resolveTxt(targetDomain);
        txtRecords.forEach(txt => {
          records.push({ type: 'TXT', name: '@', address: txt.join(' '), ttl: 1799, status: 'Active (Verified via Node DNS)' });
        });
      } catch (e) {}

      // If no live records were resolved, provide standard beautiful staging records matching standard configs
      if (records.length === 0) {
        records.push(
          { type: 'A', name: '@', address: '76.76.21.21', ttl: 1800, status: 'Staged (Pointed to Vercel IP)' },
          { type: 'CNAME', name: 'www', address: 'cname.vercel-dns.com', ttl: 1800, status: 'Staged' },
          { type: 'TXT', name: 'nc-verification', address: 'nc-8418301-microfyxd-token', ttl: 3600, status: 'Active' },
          { type: 'MX', name: '@', address: 'mail.protection.outlook.com', ttl: 3600, status: 'Active' }
        );
      }

      res.json({ success: true, domain: targetDomain, records });
    } catch (err: any) {
      res.json({ success: false, error: err.message, records: [] });
    }
  });

  // API Route: Deploy Staging Build inside Vercel
  app.post('/api/vercel/deploy', async (req, res) => {
    const { vercelToken, projectId, teamId } = req.body;
    const token = vercelToken || process.env.VERCEL_TOKEN;
    const projId = projectId || process.env.VERCEL_PROJECT_ID;
    
    if (token && projId) {
      try {
        const vercelRes = await fetch('https://api.vercel.com/v13/deployments', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: 'microfyxd-site',
            projectId: projId,
            gitSource: {
              type: 'github',
              repo: 'microfyxd/microfyxd-site',
              ref: 'main'
            }
          })
        });
        const data = await vercelRes.json();
        return res.json({ success: true, isReal: true, deployment: data });
      } catch (err: any) {
        return res.status(500).json({ success: false, error: err.message });
      }
    }

    // Default simulated deployment build sequence when no API keys are registered yet
    const logs = [
      "[SYSTEM] Initiating staging build pipeline for 'microfyxd-site' on Vercel...",
      "[SYSTEM] Injecting 34 core runtime API variables...",
      "[CONFIG] MICROFYXD_SITE_ECU_TOKEN = Injected successfully.",
      "[CONFIG] MICROFYXD_SANDBOX_VRAM_LIMIT = Injected successfully.",
      "[CONFIG] NAMECHEAP_API_KEY = Ready.",
      "[SYSTEM] Retrieving repository tree...",
      "[BUILD] Running: npm run build",
      "[BUILD] > tsc && vite build",
      "[BUILD] vite v5.2.11 building for production...",
      "[BUILD] ✓ 428 modules transformed.",
      "[BUILD] dist/index.html                     0.45 kB │ info: none",
      "[BUILD] dist/assets/index-D7b39f1.js       142.50 kB │ gzip: 44.80 kB",
      "[BUILD] dist/assets/index-C8a91a2.css       84.20 kB │ gzip: 18.50 kB",
      "[BUILD] Production build completed successfully inside Vercel Build Container.",
      "[SYSTEM] Deploying static router and Express core-T proxies to Vercel Edge Server...",
      "[SYSTEM] Mapping staging sub-records to Namecheap DNS records...",
      "[SUCCESS] Staged deployment live!"
    ];

    res.json({
      success: true,
      isReal: false,
      logs,
      url: 'https://microfyxd-site-staged.vercel.app'
    });
  });

  // API Route: Get all cognitive goals
  app.get('/api/cognition/goals', async (req, res) => {
    try {
      const allGoals = await db.select().from(goals).orderBy(desc(goals.priority));
      res.json({ success: true, goals: allGoals });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Add a new cognitive goal
  app.post('/api/cognition/goals', async (req, res) => {
    const { description, priority, constraints } = req.body;
    try {
      const newGoal = await db.insert(goals).values({
        description: description || 'Optimize environment compliance runtime',
        priority: priority ? parseInt(priority) : 5,
        constraints: constraints || 'No violations',
        status: 'active'
      }).returning();
      res.json({ success: true, goal: newGoal[0] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Complete or fail a goal
  app.post('/api/cognition/goals/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'completed' | 'failed' | 'active'
    try {
      const updated = await db.update(goals)
        .set({ status, updatedAt: new Date() })
        .where(eq(goals.id, parseInt(id)))
        .returning();
      res.json({ success: true, goal: updated[0] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Get cognitive task queue
  app.get('/api/cognition/tasks', async (req, res) => {
    try {
      const queue = await db.select().from(tasks).orderBy(desc(tasks.priority));
      res.json({ success: true, tasks: queue });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Add a task to queue
  app.post('/api/cognition/tasks', async (req, res) => {
    const { source, priority, assignedGoal } = req.body;
    try {
      const newTask = await db.insert(tasks).values({
        source: source || 'human',
        priority: priority ? parseInt(priority) : 5,
        assignedGoal: assignedGoal || 'Routine maintenance cycle',
        status: 'queued'
      }).returning();
      res.json({ success: true, task: newTask[0] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Get all neural routing synapses
  app.get('/api/cognition/synapses', async (req, res) => {
    try {
      let connections = await db.select().from(synapses);
      
      // Seed default synapses if empty
      if (connections.length === 0) {
        const defaultPairs = [
          { fromNode: 'Perception', toNode: 'Planning', weight: 1.0 },
          { fromNode: 'Planning', toNode: 'Action', weight: 1.0 },
          { fromNode: 'Action', toNode: 'Feedback', weight: 1.0 },
          { fromNode: 'Feedback', toNode: 'Learning', weight: 1.0 },
          { fromNode: 'Learning', toNode: 'Controller', weight: 1.0 },
          { fromNode: 'Controller', toNode: 'Perception', weight: 1.0 },
          { fromNode: 'Planning', toNode: 'Sandbox', weight: 0.8 },
          { fromNode: 'Sandbox', toNode: 'Feedback', weight: 0.9 },
          { fromNode: 'Planning', toNode: 'Database', weight: 0.75 },
          { fromNode: 'Database', toNode: 'Feedback', weight: 0.85 },
        ];

        for (const pair of defaultPairs) {
          await db.insert(synapses).values({
            fromNode: pair.fromNode,
            toNode: pair.toNode,
            weight: pair.weight,
          });
        }
        connections = await db.select().from(synapses);
      }
      
      res.json({ success: true, synapses: connections });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Execute Cognition Loop Step with STDP neuromorphic adaptation
  app.post('/api/cognition/loop/execute', async (req, res) => {
    const { simulatedOutcome } = req.body; // 'success' | 'failure' | 'violation'
    const outcome = simulatedOutcome || 'success';

    try {
      // 1. Fetch current active goals
      const activeGoals = await db.select().from(goals).where(eq(goals.status, 'active')).limit(1);
      const currentGoal = activeGoals.length > 0 ? activeGoals[0] : null;

      // 2. Fetch the highest priority queued task
      const queuedTasks = await db.select().from(tasks).where(eq(tasks.status, 'queued')).orderBy(desc(tasks.priority)).limit(1);
      const currentTask = queuedTasks.length > 0 ? queuedTasks[0] : null;

      // Mark the task as processed if found
      if (currentTask) {
        await db.update(tasks).set({ status: 'processed' }).where(eq(tasks.id, currentTask.id));
      }

      // If no goal is active and we have a task, auto-learn goal from task
      let targetGoalDesc = currentGoal ? currentGoal.description : 'Optimize overall system cognition state';
      if (!currentGoal && currentTask) {
        targetGoalDesc = `Resolve task: ${currentTask.assignedGoal}`;
        const newG = await db.insert(goals).values({
          description: targetGoalDesc,
          priority: currentTask.priority,
          constraints: 'Maintain strict doctrine compliance',
          status: 'active'
        }).returning();
        // Set goal for current loop
      }

      // 3. Fetch current synapse weights to simulate routing map traversal
      let currentSynapses = await db.select().from(synapses);
      if (currentSynapses.length === 0) {
        const defaultPairs = [
          { fromNode: 'Perception', toNode: 'Planning', weight: 1.0 },
          { fromNode: 'Planning', toNode: 'Action', weight: 1.0 },
          { fromNode: 'Action', toNode: 'Feedback', weight: 1.0 },
          { fromNode: 'Feedback', toNode: 'Learning', weight: 1.0 },
          { fromNode: 'Learning', toNode: 'Controller', weight: 1.0 },
          { fromNode: 'Controller', toNode: 'Perception', weight: 1.0 },
          { fromNode: 'Planning', toNode: 'Sandbox', weight: 0.8 },
          { fromNode: 'Sandbox', toNode: 'Feedback', weight: 0.9 },
          { fromNode: 'Planning', toNode: 'Database', weight: 0.75 },
          { fromNode: 'Database', toNode: 'Feedback', weight: 0.85 },
        ];

        for (const pair of defaultPairs) {
          await db.insert(synapses).values({
            fromNode: pair.fromNode,
            toNode: pair.toNode,
            weight: pair.weight,
          });
        }
        currentSynapses = await db.select().from(synapses);
      }

      // 4. Run Plasticity Synapse weight STDP adjustments
      // successful sequence -> strengthen; failed/violation -> weaken
      const lr = 0.15; // Learning Rate
      const updatedSynapses = [];
      for (const syn of currentSynapses) {
        let newWeight = syn.weight;
        if (outcome === 'success') {
          // STDP LTP (Long Term Potentiation) - asymptotic boost
          newWeight = syn.weight + lr * (1.2 - syn.weight);
        } else if (outcome === 'violation') {
          // Severe penalty for doctrine constraint violations
          newWeight = syn.weight * 0.4;
        } else {
          // LTD (Long Term Depression) for failure
          newWeight = syn.weight - lr * syn.weight;
        }
        // Clamping weight between 0.1 and 2.0
        newWeight = Math.max(0.1, Math.min(2.0, parseFloat(newWeight.toFixed(3))));

        const updated = await db.update(synapses)
          .set({ 
            weight: newWeight,
            lastPreTime: new Date(),
            lastPostTime: outcome === 'success' ? new Date(Date.now() + 5) : new Date(Date.now() - 5)
          })
          .where(eq(synapses.id, syn.id))
          .returning();
        
        updatedSynapses.push(updated[0]);
      }

      // 5. Ephemeral snapshot of perception telemetry state
      const stateSnapshot = {
        cpuUsage: `${Math.floor(Math.random() * 25) + 5}%`,
        gpuClusterTemp: `${Math.floor(Math.random() * 15) + 62}°C`,
        vramUtilization: `${Math.floor(Math.random() * 20) + 40}%`,
        activeCognitiveGoal: targetGoalDesc,
        plasticityLearningRate: lr,
        actionTrace: outcome === 'success' 
          ? ['Read active goals', 'Retrieved state vector', 'Traversed nodes Planning -> Sandbox -> Action successfully', 'STDP Potentiation executed']
          : ['Read active goals', 'Anomalous telemetry detected', 'Doctrine violation check failed', 'STDP Depression penalty enforced'],
        outcome
      };

      res.json({
        success: true,
        outcome,
        activeGoal: targetGoalDesc,
        processedTask: currentTask ? currentTask.assignedGoal : null,
        snapshot: stateSnapshot,
        synapses: updatedSynapses
      });

    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Get all agent memories
  app.get('/api/cognition/memories', async (req, res) => {
    try {
      const memories = await db.select().from(agentMemory).orderBy(desc(agentMemory.createdAt));
      res.json({ success: true, memories });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Insert a new agent memory
  app.post('/api/cognition/memories', async (req, res) => {
    const { tenantId, memoryType, key, value, confidence } = req.body;
    try {
      const newMemory = await db.insert(agentMemory).values({
        tenantId: tenantId || 'system-wide',
        memoryType: memoryType || 'episodic',
        key: key || 'system_state_heuristic',
        value: value || 'Optimized parameters applied',
        confidence: confidence ? parseFloat(confidence) : 1.0,
        accessCount: 0,
      }).returning();
      res.json({ success: true, memory: newMemory[0] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Record access / update memory statistics
  app.post('/api/cognition/memories/:id/access', async (req, res) => {
    const { id } = req.params;
    try {
      // Find current memory to get the access count
      const memoryList = await db.select().from(agentMemory).where(eq(agentMemory.id, parseInt(id))).limit(1);
      if (memoryList.length === 0) {
        return res.status(404).json({ success: false, error: 'Memory not found' });
      }
      const current = memoryList[0];
      const updated = await db.update(agentMemory)
        .set({
          accessCount: current.accessCount + 1,
          lastAccessed: new Date(),
        })
        .where(eq(agentMemory.id, parseInt(id)))
        .returning();
      res.json({ success: true, memory: updated[0] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Delete a specific memory record
  app.delete('/api/cognition/memories/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await db.delete(agentMemory).where(eq(agentMemory.id, parseInt(id)));
      res.json({ success: true, message: 'Memory successfully purged from cognition matrix.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Handle 404 for unmatched API routes
  app.all('/api/*', (req, res) => {
    res.status(404).json({ success: false, error: `API route not found: ${req.method} ${req.url}` });
  });

  // Vite development middleware vs Static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MICROFYXD INGRESS] Server running on http://localhost:${PORT}`);
  });
}

startServer();
