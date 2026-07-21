const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const targetStr = `          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: geminiPrompt,
          });`;

const replaceStr = `          let response;
          let summarizeRetries = 3;
          while (summarizeRetries >= 0) {
            try {
              response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: geminiPrompt,
              });
              break;
            } catch (err: any) {
              console.warn(\`[GEMINI ENRICHMENT API ATTEMPT FAILED] Retries left: \${summarizeRetries}. Error:\`, err);
              if (summarizeRetries === 0) {
                throw err;
              }
              summarizeRetries--;
              await new Promise(resolve => setTimeout(resolve, 1500));
            }
          }`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('server.ts', code);
