import { pgTable, varchar, uuid, timestamp, boolean, text, index, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Main users table - Auth.js expects this exact name 'user'
export const users = pgTable('user', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }).notNull().unique(),
    emailVerified: timestamp('emailVerified', { mode: 'date' }),
    password: varchar('password', { length: 255 }),
    role: varchar('role', { length: 32 }).notNull().default('client'),
    adminApproved: boolean('adminApproved').default(false),
    image: varchar('image', { length: 255 }),
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
}, (table) => {
    return {
        emailIdx: index('email_idx').on(table.email),
    }
});

// Auth.js session table - must match exactly
export const sessions = pgTable('session', {
    sessionToken: varchar('sessionToken', { length: 255 }).primaryKey(),
    userId: uuid('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
});

// Auth.js verification token table
export const verificationTokens = pgTable('verificationToken', {
    identifier: varchar('identifier', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull().unique(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (vt) => ({
    compoundKey: index('verification_token_compound_key').on(vt.identifier, vt.token),
}));

// Auth.js accounts table for OAuth providers
export const accounts = pgTable('account', {
    userId: uuid('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 255 }).notNull(),
    provider: varchar('provider', { length: 255 }).notNull(),
    providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'), // Auth.js expects integer timestamp
    token_type: varchar('token_type', { length: 255 }),
    scope: varchar('scope', { length: 255 }),
    id_token: text('id_token'),
    session_state: varchar('session_state', { length: 255 }),
}, (account) => ({
    compoundKey: index('account_compound_key').on(account.provider, account.providerAccountId),
    userIdIdx: index('account_user_id_idx').on(account.userId),
}));

// Chat history tables
export const chatSessions = pgTable('chat_sessions', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).default('New Chat'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
}, (table) => {
    return {
        userIdIdx: index('chat_sessions_user_id_idx').on(table.userId),
        createdAtIdx: index('chat_sessions_created_at_idx').on(table.createdAt),
    }
});

export const chatMessages = pgTable('chat_messages', {
    id: uuid('id').primaryKey().defaultRandom(),
    sessionId: uuid('session_id').notNull().references(() => chatSessions.id, { onDelete: 'cascade' }),
    role: varchar('role', { length: 32 }).notNull(), // 'user' or 'assistant'
    content: text('content').notNull(),
    timestamp: timestamp('timestamp', { mode: 'date' }).defaultNow(),
}, (table) => {
    return {
        sessionIdIdx: index('chat_messages_session_id_idx').on(table.sessionId),
        timestampIdx: index('chat_messages_timestamp_idx').on(table.sessionId),
    }
});

// Relations for Auth.js and chat functionality
export const usersRelations = relations(users, ({ many }) => ({
    accounts: many(accounts),
    sessions: many(sessions),
    chatSessions: many(chatSessions),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id],
    }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

export const chatSessionsRelations = relations(chatSessions, ({ one, many }) => ({
    user: one(users, {
        fields: [chatSessions.userId],
        references: [users.id],
    }),
    messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
    session: one(chatSessions, {
        fields: [chatMessages.sessionId],
        references: [chatSessions.id],
    }),
}));