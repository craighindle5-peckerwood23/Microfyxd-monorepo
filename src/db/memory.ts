import { db } from './index.ts';
import { pgTable, serial, text, integer, 
         timestamp, real } from 'drizzle-orm/pg-core';
import { eq, desc } from 'drizzle-orm';

// Add this table to schema.ts too (see below)
export const agentMemory = pgTable('agent_memory', {
  id: serial('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  memoryType: text('memory_type').notNull(), // 'episodic' | 'associative' | 'vector'
  key: text('key').notNull(),
  value: text('value').notNull(),
  confidence: real('confidence').notNull().default(1.0),
  accessCount: integer('access_count').notNull().default(0),
  lastAccessed: timestamp('last_accessed').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

export class PersistentMemoryService {

  // Load memory for a tenant — applies confidence decay
  static async load(tenantId: string): Promise<{
    hierarchicalAssociativeMemory: Record<string, string[]>;
    episodicSummaries: string[];
    vectorKeysSaved: string[];
  }> {
    const records = await db
      .select()
      .from(agentMemory)
      .where(eq(agentMemory.tenantId, tenantId))
      .orderBy(desc(agentMemory.lastAccessed));

    const ham: Record<string, string[]> = {};
    const episodic: string[] = [];
    const vectors: string[] = [];

    for (const r of records) {
      // Confidence decay — memories older than 30 days lose weight
      const ageMs = Date.now() - new Date(r.lastAccessed!).getTime();
      const ageDays = ageMs / (1000 * 60 * 60 * 24);
      const decayedConfidence = r.confidence * Math.exp(-0.023 * ageDays);

      // Drop memories below 10% confidence
      if (decayedConfidence < 0.1) continue;

      if (r.memoryType === 'associative') {
        ham[r.key] = JSON.parse(r.value);
      } else if (r.memoryType === 'episodic') {
        // Weight recent high-confidence memories first
        if (decayedConfidence > 0.3) episodic.push(r.value);
      } else if (r.memoryType === 'vector') {
        vectors.push(r.key);
      }
    }

    return {
      hierarchicalAssociativeMemory: ham,
      episodicSummaries: episodic,
      vectorKeysSaved: vectors,
    };
  }

  // Save memory after a session completes
  static async save(tenantId: string, memory: {
    hierarchicalAssociativeMemory: Record<string, string[]>;
    episodicSummaries: string[];
    vectorKeysSaved: string[];
  }): Promise<void> {

    // Save associative memory
    for (const [key, values] of Object.entries(
                            memory.hierarchicalAssociativeMemory)) {
      await db.insert(agentMemory).values({
        tenantId,
        memoryType: 'associative',
        key,
        value: JSON.stringify(values),
        confidence: 1.0,
        lastAccessed: new Date(),
      }).onConflictDoUpdate({
        target: [agentMemory.tenantId, agentMemory.key],
        set: { value: JSON.stringify(values), 
               lastAccessed: new Date(), confidence: 1.0 }
      });
    }

    // Save episodic summaries (last 20 only)
    const recentEpisodic = memory.episodicSummaries.slice(-20);
    for (const summary of recentEpisodic) {
      await db.insert(agentMemory).values({
        tenantId,
        memoryType: 'episodic',
        key: `episodic_${Date.now()}`,
        value: summary,
        confidence: 1.0,
        lastAccessed: new Date(),
      });
    }

    // Save vector keys
    for (const key of memory.vectorKeysSaved) {
      await db.insert(agentMemory).values({
        tenantId,
        memoryType: 'vector',
        key,
        value: key,
        confidence: 1.0,
        lastAccessed: new Date(),
      }).onConflictDoUpdate({
        target: [agentMemory.tenantId, agentMemory.key],
        set: { lastAccessed: new Date() }
      });
    }
  }
}
