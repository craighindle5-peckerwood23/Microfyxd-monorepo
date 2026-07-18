import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

// Relative imports from our monorepo packages in the workspace
import { createInitialState, MicrofyxdState } from './microfyxd/packages/core/index.ts';
import { buildProductionGraph } from './microfyxd/packages/agent/index.ts';
import { SandboxService } from './microfyxd/packages/sandbox/index.ts';
import { PhenotypeEngine } from './microfyxd/packages/phenotype/index.ts';

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

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

      // 5. Enrich with real Gemini intelligence if API key is present
      if (ai) {
        try {
          const geminiPrompt = `
You are the central multi-agent consensus orchestrator inside Microfyxd.
The user prompt is: "${prompt}"

The LangGraph has completed execution of these nodes: ${finalState.traces.map(t => t.nodeId).join(' -> ')}
Sandbox has active repaired code? ${finalState.sandbox.sourceCode ? 'Yes' : 'No'}

We need you to generate a comprehensive, ultra-professional response on behalf of the multi-agent system.
If the request is about automotive telemetry or tuning, explain the tuning maps safety checks and adjustments made.
If the request is about custom code syntax repair, explain what compile errors were fixed in the sandbox.
Provide a high-quality summary incorporating these points. Don't mention system-internal paths or JSON indices unless needed.

Generate a markdown response:
`;
          const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: geminiPrompt,
          });

          if (response.text) {
            // Replace the final message content with the rich AI output
            if (finalState.messages.length > 0 && finalState.messages[finalState.messages.length - 1].role === 'assistant') {
              finalState.messages[finalState.messages.length - 1].content = response.text;
            }
          }
        } catch (geminiError) {
          console.error('[GEMINI ENRICHMENT ERROR]', geminiError);
          // Fall back to pre-defined responses in the nodes
        }
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
