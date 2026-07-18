// After: let state = createInitialState(prompt);
// ADD THIS — load persistent memory
const tenantId = req.headers['x-tenant-id'] as string || 'default';
const persistedMemory = await PersistentMemoryService.load(tenantId);
state.memory = { ...state.memory, ...persistedMemory };

// After: let finalState = await graph.run(state);
// ADD THIS — save memory back
await PersistentMemoryService.save(tenantId, finalState.memory);
