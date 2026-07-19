import { relations } from 'drizzle-orm';
import { integer, pgTable, real, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Define the 'users' table.
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'favorites' table.
export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  type: text('type').notNull(), // 'email' | 'file'
  externalId: text('external_id').notNull(), // messageId or fileId
  title: text('title').notNull(),
  snippet: text('snippet'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'audit_logs' table.
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  action: text('action').notNull(), // e.g. 'SEND_EMAIL', 'CREATE_FOLDER', 'PICK_FILE'
  details: text('details'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define relationships for the 'users' table.
export const usersRelations = relations(users, ({ many }) => ({
  favorites: many(favorites),
  auditLogs: many(auditLogs),
}));

// Define relationships for 'favorites'
export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
}));

// Define relationships for 'audit_logs'
export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

// Define the 'agent_memory' table.
export const agentMemory = pgTable('agent_memory', {
  id: serial('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  memoryType: text('memory_type').notNull(),
  key: text('key').notNull(),
  value: text('value').notNull(),
  confidence: real('confidence').notNull().default(1.0),
  accessCount: integer('access_count').notNull().default(0),
  lastAccessed: timestamp('last_accessed').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'goals' table.
export const goals = pgTable('goals', {
  id: serial('id').primaryKey(),
  description: text('description').notNull(),
  priority: integer('priority').notNull().default(5),
  constraints: text('constraints'),
  status: text('status').notNull().default('active'), // 'active' | 'completed' | 'failed'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Define the 'tasks' table.
export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  source: text('source').notNull(), // 'telemetry' | 'doctrine' | 'human'
  priority: integer('priority').notNull().default(5),
  assignedGoal: text('assigned_goal'),
  status: text('status').notNull().default('queued'), // 'queued' | 'processed' | 'ignored'
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'synapses' table.
export const synapses = pgTable('synapses', {
  id: serial('id').primaryKey(),
  fromNode: text('from_node').notNull(),
  toNode: text('to_node').notNull(),
  weight: real('weight').notNull().default(1.0),
  lastPreTime: timestamp('last_pre_time').defaultNow(),
  lastPostTime: timestamp('last_post_time').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});


