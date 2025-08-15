-- Fix table names to match Auth.js requirements exactly

-- Rename users table to user (Auth.js expects 'user')
ALTER TABLE IF EXISTS "users" RENAME TO "user";

-- Update foreign key references in other tables to point to the renamed table
-- Update chat_sessions table foreign key reference
ALTER TABLE IF EXISTS "chat_sessions" 
  DROP CONSTRAINT IF EXISTS "chat_sessions_user_id_fkey";

ALTER TABLE IF EXISTS "chat_sessions" 
  ADD CONSTRAINT "chat_sessions_user_id_fkey" 
  FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;

-- Update account table foreign key reference
ALTER TABLE IF EXISTS "account" 
  DROP CONSTRAINT IF EXISTS "account_userId_users_id_fk";

ALTER TABLE IF EXISTS "account" 
  ADD CONSTRAINT "account_userId_user_id_fk" 
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE;

-- Update session table foreign key reference
ALTER TABLE IF EXISTS "session" 
  DROP CONSTRAINT IF EXISTS "session_userId_users_id_fk";

ALTER TABLE IF EXISTS "session" 
  ADD CONSTRAINT "session_userId_user_id_fk" 
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE;
