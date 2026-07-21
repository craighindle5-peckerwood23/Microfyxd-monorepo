import { phenotypeNode } from "./nodes/phenotypeNode";
import { arcanaCognitiveRouterNode } from "./nodes/arcanaCognitiveRouterNode";
import { speechOutputNode } from "./nodes/speechOutputNode";
import { speechInputNode } from "./nodes/speechInputNode";
import { speechStreamInputNode } from "./nodes/speechStreamInputNode";
import { speechStreamOutputNode } from "./nodes/speechStreamOutputNode";
import { audioFinalizationNode } from "./nodes/audioFinalizationNode";

// A mock of the LangGraph runtime for UI bindings
export const microfyxdApp = {
  invoke: async (state: any) => {
    let currentState = { ...state };
    
    // Simple state machine runner for the mockup
    let activeNode = currentState.next || "arcanaCognitiveRouterNode";
    
    // If audio chunk is provided, start stream input
    if (currentState.audioChunk) {
        activeNode = "speechStreamInputNode";
    } else if (currentState.speechInputAudio) {
        activeNode = "speechInputNode";
    }

    // Run a few steps (bounded)
    for (let i = 0; i < 5; i++) {
        if (!activeNode) break;

        switch (activeNode) {
            case "speechStreamInputNode":
                currentState = await speechStreamInputNode(currentState);
                break;
            case "speechStreamOutputNode":
                currentState = await speechStreamOutputNode(currentState);
                break;
            case "audioFinalizationNode":
                currentState = await audioFinalizationNode(currentState);
                break;
            case "speechInputNode":
                currentState = await speechInputNode(currentState);
                break;
            case "speechOutputNode":
                currentState = await speechOutputNode(currentState);
                break;
            case "arcanaCognitiveRouterNode":
                currentState = await arcanaCognitiveRouterNode(currentState);
                break;
            case "phenotypeNode":
                currentState = await phenotypeNode(currentState);
                break;
            default:
                // Fallback for unknown nodes
                currentState.next = null;
                break;
        }

        activeNode = currentState.next;
    }
    
    return currentState;
  }
};
