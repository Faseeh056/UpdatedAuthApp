import { db } from '$lib/server/db';
import { chatSessions, chatMessages, users } from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export interface ChatMessageData {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  userName?: string;
}

export interface ChatSessionData {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
}

export class ChatHistoryService {
  /**
   * Get or create a chat session for a user
   */
  static async getOrCreateSession(userId: string): Promise<string> {
    // Try to get the most recent active session
    const existingSession = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.userId, userId))
      .orderBy(desc(chatSessions.updatedAt))
      .limit(1);

    if (existingSession.length > 0) {
      // Update the session's updatedAt timestamp
      await db
        .update(chatSessions)
        .set({ updatedAt: new Date() })
        .where(eq(chatSessions.id, existingSession[0].id));
      
      return existingSession[0].id;
    }

    // Create a new session
    const newSession = await db
      .insert(chatSessions)
      .values({
        userId,
        title: 'New Chat',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    return newSession[0].id;
  }

  /**
   * Store a message in the database
   */
  static async storeMessage(
    sessionId: string,
    role: 'user' | 'assistant',
    content: string,
    userName?: string
  ): Promise<string> {
    // For user messages, store the actual user name instead of "user"
    const roleToStore = role === 'user' && userName ? userName : role;
    
    const message = await db
      .insert(chatMessages)
      .values({
        sessionId,
        role: roleToStore,
        content,
        timestamp: new Date()
      })
      .returning();

    return message[0].id;
  }

  /**
   * Get chat history for a user with user information
   */
  static async getChatHistory(userId: string, limit: number = 50): Promise<ChatMessageData[]> {
    // Get the user's session
    const session = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.userId, userId))
      .orderBy(desc(chatSessions.updatedAt))
      .limit(1);

    if (session.length === 0) {
      return [];
    }

    // Get messages - now the role column contains user names for user messages
    const messages = await db
      .select({
        id: chatMessages.id,
        role: chatMessages.role,
        content: chatMessages.content,
        timestamp: chatMessages.timestamp
      })
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, session[0].id))
      .orderBy(chatMessages.timestamp)
      .limit(limit);

    return messages.map(msg => {
      // Determine if this is a user message or assistant message
      const isUserMessage = msg.role !== 'assistant';
      
      return {
        id: msg.id,
        role: isUserMessage ? 'user' : 'assistant',
        content: msg.content,
        timestamp: msg.timestamp,
        userName: isUserMessage ? msg.role : 'AI Assistant'
      };
    });
  }

  /**
   * Get user's chat sessions
   */
  static async getUserSessions(userId: string): Promise<ChatSessionData[]> {
    const sessions = await db
      .select({
        id: chatSessions.id,
        title: chatSessions.title,
        createdAt: chatSessions.createdAt,
        updatedAt: chatSessions.updatedAt
      })
      .from(chatSessions)
      .where(eq(chatSessions.userId, userId))
      .orderBy(desc(chatSessions.updatedAt));

    // Get message count for each session
    const sessionsWithCount = await Promise.all(
      sessions.map(async (session) => {
        const messageCount = await db
          .select({ count: chatMessages.id })
          .from(chatMessages)
          .where(eq(chatMessages.sessionId, session.id));

        return {
          ...session,
          messageCount: messageCount.length
        };
      })
    );

    return sessionsWithCount;
  }

  /**
   * Create a new chat session
   */
  static async createNewSession(userId: string, title?: string): Promise<string> {
    const newSession = await db
      .insert(chatSessions)
      .values({
        userId,
        title: title || 'New Chat',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    return newSession[0].id;
  }

  /**
   * Delete a chat session and all its messages
   */
  static async deleteSession(sessionId: string, userId: string): Promise<boolean> {
    // Verify the session belongs to the user
    const session = await db
      .select()
      .from(chatSessions)
      .where(and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, userId)));

    if (session.length === 0) {
      return false;
    }

    // Delete the session (messages will be deleted due to CASCADE)
    await db
      .delete(chatSessions)
      .where(eq(chatSessions.id, sessionId));

    return true;
  }

  /**
   * Get user information for a message
   */
  static async getUserInfo(userId: string): Promise<{ name: string; email: string } | null> {
    const user = await db
      .select({
        name: users.name,
        email: users.email
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return user.length > 0 ? user[0] : null;
  }
}
