import { pgTable, varchar, uuid, timestamp, boolean, text, index } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }).notNull().unique(),
    emailVerified: timestamp('email_verified', { mode: 'date' }),
    password: varchar('password', { length: 255 }),
    role: varchar('role', { length: 32 }).notNull().default('user'),
    adminApproved: boolean('admin_approved').default(false),
    image: varchar('image', { length: 255 }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
}, (table) => {
    return {
        emailIdx: index('email_idx').on(table.email),
    }
});

export const sessions = pgTable('sessions', {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable('verification_token', {
    identifier: varchar('identifier', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull().unique(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (vt) => ({
    compoundKey: index('verification_token_compound_key').on(vt.identifier, vt.token),
}));