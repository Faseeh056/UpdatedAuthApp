# Chat Storage System Documentation

## Overview

The chat storage system provides persistent chat history for users in PostgreSQL, allowing them to save, retrieve, and manage their conversations with the AI assistant. Each user has their own private chat history that persists across sessions.

## Database Schema

### Tables

#### `chat_sessions`
Stores individual chat sessions for each user.

```sql
CREATE TABLE "chat_sessions" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "title" varchar(255) DEFAULT 'New Chat',
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);
```

**Indexes:**
- `chat_sessions_user_id_idx` on `user_id`
- `chat_sessions_created_at_idx` on `created_at`

#### `chat_messages`
Stores individual messages within each chat session.

```sql
CREATE TABLE "chat_messages" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "session_id" uuid NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    "role" varchar(32) NOT NULL, -- 'user' or 'assistant'
    "content" text NOT NULL,
    "timestamp" timestamp DEFAULT now()
);
```

**Indexes:**
- `chat_messages_session_id_idx` on `session_id`
- `chat_messages_timestamp_idx` on `timestamp`

## API Endpoints

### Chat Sessions

#### `GET /api/chat/sessions`
Retrieve all chat sessions for the current user.

**Response:**
```json
{
  "sessions": [
    {
      "id": "uuid",
      "title": "Chat about programming",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T11:45:00Z"
    }
  ]
}
```

#### `GET /api/chat/sessions/{sessionId}`
Retrieve a specific chat session with all its messages.

**Response:**
```json
{
  "session": {
    "id": "uuid",
    "title": "Chat about programming",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:45:00Z"
  },
  "messages": [
    {
      "id": "uuid",
      "role": "user",
      "content": "How do I learn JavaScript?",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    {
      "id": "uuid",
      "role": "assistant",
      "content": "Here are some great ways to learn JavaScript...",
      "timestamp": "2024-01-15T10:31:00Z"
    }
  ]
}
```

#### `PUT /api/chat/sessions/{sessionId}`
Update the title of a chat session.

**Request Body:**
```json
{
  "title": "New Chat Title"
}
```

#### `DELETE /api/chat/sessions/{sessionId}`
Delete a chat session and all its messages.

### Chat Messages

#### `POST /api/chat`
Send a message and get an AI response.

**Request Body:**
```json
{
  "message": "Hello, how are you?",
  "sessionId": "optional-existing-session-id"
}
```

**Response:**
```json
{
  "message": "I'm doing great, thank you for asking!",
  "timestamp": "2024-01-15T10:30:00Z",
  "sessionId": "uuid"
}
```

#### `POST /api/chat/stream`
Send a message and get a streaming AI response.

**Request Body:**
```json
{
  "message": "Hello, how are you?",
  "sessionId": "optional-existing-session-id"
}
```

**Response:** Streaming text response

### Chat Statistics

#### `GET /api/chat/stats`
Get chat statistics for the current user.

**Response:**
```json
{
  "stats": {
    "totalSessions": 5,
    "totalMessages": 25,
    "lastActivity": "2024-01-15T11:45:00Z"
  }
}
```

## Services

### ChatHistoryService

The main service for managing chat data.

#### Methods

- `createSession(userId: string, title?: string): Promise<string>`
  - Creates a new chat session
  - Returns the session ID

- `getSessions(userId: string): Promise<ChatSession[]>`
  - Retrieves all chat sessions for a user
  - Ordered by most recent first

- `getSession(sessionId: string, userId: string): Promise<{ session: ChatSession; messages: ChatMessage[] } | null>`
  - Retrieves a specific session with all messages
  - Includes user authorization check

- `addMessage(sessionId: string, role: 'user' | 'assistant', content: string): Promise<string>`
  - Adds a message to a session
  - Automatically generates title from first user message
  - Updates session timestamp

- `updateSessionTitle(sessionId: string, userId: string, title: string): Promise<void>`
  - Updates the title of a chat session
  - Includes user authorization check

- `deleteSession(sessionId: string, userId: string): Promise<void>`
  - Deletes a chat session and all its messages
  - Includes user authorization check

- `getRecentMessages(sessionId: string, limit: number = 10): Promise<ChatMessage[]>`
  - Gets recent messages for context
  - Used for AI conversation continuity

- `getUserChatStats(userId: string): Promise<{ totalSessions: number; totalMessages: number; lastActivity: Date | null }>`
  - Gets comprehensive chat statistics for a user

## Features

### Automatic Title Generation

When a user sends their first message in a new chat session, the system automatically generates a title based on the message content:

1. Removes common greetings ("hello", "hi", "hey", etc.)
2. Removes trailing punctuation
3. Truncates to 50 characters if too long
4. Falls back to "Chat Session" if the result is too short

### Chat History Management

Users can:
- View all their previous chat sessions
- Load and continue previous conversations
- Delete unwanted chat sessions
- Start new conversations
- See chat statistics on their dashboard

### Real-time Streaming

The chat system supports real-time streaming responses from the AI, providing a smooth user experience with typing indicators and progressive message display.

### Security

- All chat data is scoped to the authenticated user
- Users can only access their own chat sessions
- Proper authorization checks on all endpoints
- Cascade deletion ensures data consistency

## Frontend Integration

### Chatbot Component

The main chatbot component (`src/lib/components/Chatbot.svelte`) includes:

- **Chat History Sidebar**: Shows all previous chat sessions
- **Message Display**: Real-time message streaming with typing indicators
- **Session Management**: Create, load, and delete chat sessions
- **Responsive Design**: Works on desktop and mobile devices

### Dashboard Integration

The dashboard displays chat statistics including:
- Total number of chat sessions
- Total number of messages
- Last activity date
- Quick access to start new chats

## Usage Examples

### Starting a New Chat

```javascript
// Frontend automatically creates a new session when no sessionId is provided
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello, how are you?' })
});
```

### Loading Previous Chat

```javascript
// Load a specific chat session
const response = await fetch(`/api/chat/sessions/${sessionId}`);
const chatData = await response.json();
```

### Getting Chat Statistics

```javascript
// Get user's chat statistics
const response = await fetch('/api/chat/stats');
const stats = await response.json();
console.log(`User has ${stats.totalSessions} chat sessions`);
```

## Database Migrations

The chat tables are created through Drizzle migrations:

```bash
# Run migrations
npm run db:migrate

# Generate new migration (if schema changes)
npx drizzle-kit generate
```

## Environment Variables

No additional environment variables are required for chat storage. The system uses the existing `DATABASE_URL` for PostgreSQL connection.

## Performance Considerations

- Indexes on frequently queried columns (`user_id`, `session_id`, `timestamp`)
- Cascade deletion for data consistency
- Efficient queries with proper joins
- Pagination support for large message histories

## Future Enhancements

Potential improvements could include:
- Message search functionality
- Chat session export/import
- Message reactions or ratings
- Chat session sharing (with permissions)
- Advanced analytics and insights
- Message threading or replies
