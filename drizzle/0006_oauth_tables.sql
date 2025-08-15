-- Create Auth.js compatible tables for OAuth support

-- Create account table for OAuth providers
CREATE TABLE IF NOT EXISTS "account" (
    "userId" uuid NOT NULL,
    "type" varchar(255) NOT NULL,
    "provider" varchar(255) NOT NULL,
    "providerAccountId" varchar(255) NOT NULL,
    "refresh_token" text,
    "access_token" text,
    "expires_at" timestamp,
    "token_type" varchar(255),
    "scope" varchar(255),
    "id_token" text,
    "session_state" varchar(255),
    PRIMARY KEY ("provider", "providerAccountId")
);

-- Update sessions table to match Auth.js schema
-- Drop existing sessions table if it exists
DROP TABLE IF EXISTS "sessions";

-- Create new session table with Auth.js compatible schema
CREATE TABLE IF NOT EXISTS "session" (
    "sessionToken" varchar(255) PRIMARY KEY,
    "userId" uuid NOT NULL,
    "expires" timestamp NOT NULL
);

-- Add foreign key constraints
ALTER TABLE "account" ADD CONSTRAINT "account_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "session" ADD CONSTRAINT "session_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

-- Create indexes
CREATE INDEX IF NOT EXISTS "account_compound_key" ON "account" USING btree ("provider","providerAccountId");
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "account" USING btree ("userId");
