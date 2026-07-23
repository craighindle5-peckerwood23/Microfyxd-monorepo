import { MemoryState } from '@microfyxd/core';

export interface ShortTermMemoryItem {
  id: string;
  key: string;
  value: any;
  timestamp: string;
  ttlSeconds: number;
}

export interface LongTermMemoryItem {
  id: string;
  tenantId: string;
  memoryType: 'episodic' | 'semantic' | 'healing_pattern' | 'heuristic_rule';
  key: string;
  value: string;
  confidence: number; // 0.0 to 1.0
  accessCount: number;
  lastAccessed: string;
  createdAt: string;
  associations?: string[];
}

export class CompoundingMemoryEngine {
  private static shortTermBuffer: Map<string, ShortTermMemoryItem> = new Map();
  private static longTermStore: Map<string, LongTermMemoryItem> = new Map();

  /**
   * Short-Term Working Memory: Save fast transient variables with TTL
   */
  static writeShortTerm(key: string, value: any, ttlSeconds: number = 300): ShortTermMemoryItem {
    const item: ShortTermMemoryItem = {
      id: `stm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      key,
      value,
      timestamp: new Date().toISOString(),
      ttlSeconds,
    };
    this.shortTermBuffer.set(key, item);
    return item;
  }

  /**
   * Short-Term Working Memory: Read transient context
   */
  static readShortTerm(key: string): any | null {
    const item = this.shortTermBuffer.get(key);
    if (!item) return null;

    const age = (Date.now() - new Date(item.timestamp).getTime()) / 1000;
    if (age > item.ttlSeconds) {
      this.shortTermBuffer.delete(key);
      return null;
    }
    return item.value;
  }

  /**
   * Long-Term Compounding Memory: Store and reinforce persistent knowledge
   */
  static writeLongTerm(
    key: string,
    value: string,
    memoryType: 'episodic' | 'semantic' | 'healing_pattern' | 'heuristic_rule' = 'semantic',
    tenantId: string = 'default_tenant',
    associations: string[] = []
  ): LongTermMemoryItem {
    const existing = Array.from(this.longTermStore.values()).find(
      m => m.key === key && m.tenantId === tenantId
    );

    if (existing) {
      // Reinforce existing compounding memory item
      existing.value = value;
      existing.confidence = Math.min(1.0, existing.confidence + 0.1);
      existing.accessCount += 1;
      existing.lastAccessed = new Date().toISOString();
      if (associations.length > 0) {
        existing.associations = Array.from(new Set([...(existing.associations || []), ...associations]));
      }
      this.longTermStore.set(existing.id, existing);
      return existing;
    }

    const newItem: LongTermMemoryItem = {
      id: `ltm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      tenantId,
      memoryType,
      key,
      value,
      confidence: 0.8,
      accessCount: 1,
      lastAccessed: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      associations,
    };
    this.longTermStore.set(newItem.id, newItem);
    return newItem;
  }

  /**
   * Recall long-term memories matching a query/concept keyword with compounding score ranking
   */
  static recallLongTerm(query: string, tenantId: string = 'default_tenant'): LongTermMemoryItem[] {
    const lower = query.toLowerCase();
    const matches: LongTermMemoryItem[] = [];

    for (const item of this.longTermStore.values()) {
      if (item.tenantId !== tenantId) continue;
      const keyMatch = item.key.toLowerCase().includes(lower);
      const valMatch = item.value.toLowerCase().includes(lower);
      const assocMatch = item.associations?.some(a => a.toLowerCase().includes(lower));

      if (keyMatch || valMatch || assocMatch) {
        // Reinforce item upon recall
        item.accessCount += 1;
        item.confidence = Math.min(1.0, Number((item.confidence + 0.02).toFixed(2)));
        item.lastAccessed = new Date().toISOString();
        matches.push(item);
      }
    }

    // Rank by Compounding Score = confidence * log(accessCount + 1)
    return matches.sort((a, b) => {
      const scoreA = a.confidence * Math.log2(a.accessCount + 1);
      const scoreB = b.confidence * Math.log2(b.accessCount + 1);
      return scoreB - scoreA;
    });
  }

  /**
   * Consolidate Short-Term Memory into Long-Term Compounding Memory
   */
  static consolidateShortToLongTerm(stateMemory: MemoryState, summaryKey: string, summaryValue: string): MemoryState {
    this.writeLongTerm(summaryKey, summaryValue, 'episodic', 'default_tenant', ['compounding-learning', 'auto-consolidated']);
    return HierarchicalAssociativeMemory.storeEpisodic(stateMemory, `[COMPOUNDED] ${summaryKey}: ${summaryValue}`);
  }

  /**
   * Get all active long-term memories as structured objects
   */
  static getAllLongTerm(): LongTermMemoryItem[] {
    return Array.from(this.longTermStore.values());
  }
}

export class HierarchicalAssociativeMemory {
  static associateConcepts(stateMemory: MemoryState, concept: string): string[] {
    const ham = stateMemory.hierarchicalAssociativeMemory;
    const directHits = ham[concept] || [];
    
    // Find nested connections
    const connected: Set<string> = new Set(directHits);
    for (const key of directHits) {
      if (ham[key]) {
        ham[key].forEach(nested => connected.add(nested));
      }
    }
    
    return Array.from(connected);
  }

  static storeEpisodic(stateMemory: MemoryState, summary: string): MemoryState {
    return {
      ...stateMemory,
      episodicSummaries: [...stateMemory.episodicSummaries, summary]
    };
  }

  static saveVectorKeys(stateMemory: MemoryState, keys: string[]): MemoryState {
    const currentKeys = new Set(stateMemory.vectorKeysSaved);
    keys.forEach(k => currentKeys.add(k));
    
    return {
      ...stateMemory,
      vectorKeysSaved: Array.from(currentKeys)
    };
  }
}
