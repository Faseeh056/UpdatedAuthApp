-- Fix Auth.js schema compatibility
-- Update account table to match Auth.js expectations

-- Drop existing account table constraints
ALTER TABLE "account" DROP CONSTRAINT IF EXISTS "account_userId_users_id_fk";

-- Drop existing account table
DROP TABLE IF EXISTS "account";

-- Recreate account table with correct schema
CREATE TABLE "account" (
    "userId" uuid NOT NULL,
    "type" varchar(255) NOT NULL,
    "provider" varchar(255) NOT NULL,
    "providerAccountId" varchar(255) NOT NULL,
    "refresh_token" text,
    "access_token" text,
    "expires_at" integer, -- Changed from timestamp to integer for Auth.js compatibility
    "token_type" varchar(255),
    "scope" varchar(255),
    "id_token" text,
    "session_state" varchar(255),
    PRIMARY KEY ("provider", "providerAccountId")
);

-- Add foreign key constraints
ALTER TABLE "account" ADD CONSTRAINT "account_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

-- Create indexes
CREATE INDEX IF NOT EXISTS "account_compound_key" ON "account" USING btree ("provider","providerAccountId");
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "account" USING btree ("userId");
