import { db } from '$lib/server/db';
import { chatSessions, chatMessages } from '$lib/server/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export class ChatHistoryService {
  // Create a new chat session
  async createSession(userId: string, title?: string): Promise<string> {
    const [session] = await db.insert(chatSessions).values({
      userId,
      title: title || 'New Chat'
    }).returning({ id: chatSessions.id });
    
    return session.id;
  }

  // Get all chat sessions for a user
  async getSessions(userId: string): Promise<ChatSession[]> {
    return await db.select({
      id: chatSessions.id,
      userId: chatSessions.userId,
      title: chatSessions.title,
      createdAt: chatSessions.createdAt,
      updatedAt: chatSessions.updatedAt
    })
    .from(chatSessions)
    .where(eq(chatSessions.userId, userId))
    .orderBy(desc(chatSessions.updatedAt));
  }

  // Get a specific chat session with all messages
  async getSession(sessionId: string, userId: string): Promise<{ session: ChatSession; messages: ChatMessage[] } | null> {
    const session = await db.select({
      id: chatSessions.id,
      userId: chatSessions.userId,
      title: chatSessions.title,
      createdAt: chatSessions.createdAt,
      updatedAt: chatSessions.updatedAt
    })
    .from(chatSessions)
    .where(and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, userId)))
    .limit(1);

    if (!session.length) return null;

    const messages = await db.select({
      id: chatMessages.id,
      sessionId: chatMessages.sessionId,
      role: chatMessages.role,
      content: chatMessages.content,
      timestamp: chatMessages.timestamp
    })
    .from(chatMessages)
    .where(eq(chatMessages.sessionId, sessionId))
    .orderBy(chatMessages.timestamp);

    return {
      session: session[0],
      messages
    };
  }

  // Add a message to a chat session
  async addMessage(sessionId: string, role: 'user' | 'assistant', content: string): Promise<string> {
    const [message] = await db.insert(chatMessages).values({
      sessionId,
      role,
      content
    }).returning({ id: chatMessages.id });

    // Update the session's updatedAt timestamp
    await db.update(chatSessions)
      .set({ updatedAt: new Date() })
      .where(eq(chatSessions.id, sessionId));

    // If this is the first user message, generate a title
    if (role === 'user') {
      await this.generateSessionTitle(sessionId, content);
    }

    return message.id;
  }

  // Generate a title for a chat session based on the first user message
  private async generateSessionTitle(sessionId: string, firstMessage: string): Promise<void> {
    try {
      // Get the current session to check if it still has the default title
      const session = await db.select({ title: chatSessions.title })
        .from(chatSessions)
        .where(eq(chatSessions.id, sessionId))
        .limit(1);

      if (!session.length || session[0].title === 'New Chat') {
        // Generate a title from the first message
        const title = this.createTitleFromMessage(firstMessage);
        
        await db.update(chatSessions)
          .set({ title, updatedAt: new Date() })
          .where(eq(chatSessions.id, sessionId));
      }
    } catch (error) {
      console.error('Error generating session title:', error);
      // Don't throw error as this is not critical functionality
    }
  }

  // Create a title from a message
  private createTitleFromMessage(message: string): string {
    // Clean the message
    let title = message.trim();
    
    // Remove common prefixes
    const prefixes = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
    for (const prefix of prefixes) {
      if (title.toLowerCase().startsWith(prefix)) {
        title = title.substring(prefix.length).trim();
        break;
      }
    }
    
    // Remove punctuation at the end
    title = title.replace(/[.!?]+$/, '');
    
    // Limit length
    if (title.length > 50) {
      title = title.substring(0, 47) + '...';
    }
    
    // If title is empty or too short, use a default
    if (!title || title.length < 3) {
      title = 'Chat Session';
    }
    
    return title;
  }

  // Update chat session title
  async updateSessionTitle(sessionId: string, userId: string, title: string): Promise<void> {
    await db.update(chatSessions)
      .set({ title, updatedAt: new Date() })
      .where(and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, userId)));
  }

  // Delete a chat session and all its messages
  async deleteSession(sessionId: string, userId: string): Promise<void> {
    await db.delete(chatSessions)
      .where(and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, userId)));
  }

  // Get recent messages for context (last 10 messages)
  async getRecentMessages(sessionId: string, limit: number = 10): Promise<ChatMessage[]> {
    return await db.select({
      id: chatMessages.id,
      sessionId: chatMessages.sessionId,
      role: chatMessages.role,
      content: chatMessages.content,
      timestamp: chatMessages.timestamp
    })
    .from(chatMessages)
    .where(eq(chatMessages.sessionId, sessionId))
    .orderBy(desc(chatMessages.timestamp))
    .limit(limit);
  }

  // Get chat statistics for a user
  async getUserChatStats(userId: string): Promise<{
    totalSessions: number;
    totalMessages: number;
    lastActivity: Date | null;
  }> {
    const sessions = await db.select({ id: chatSessions.id, updatedAt: chatSessions.updatedAt })
      .from(chatSessions)
      .where(eq(chatSessions.userId, userId));

    const totalSessions = sessions.length;
    const lastActivity = sessions.length > 0 ? 
      sessions.reduce((latest, session) => 
        session.updatedAt > latest.updatedAt ? session : latest
      ).updatedAt : null;

    // Count total messages
    const messageCounts = await Promise.all(
      sessions.map(session => 
        db.select({ count: chatMessages.id })
          .from(chatMessages)
          .where(eq(chatMessages.sessionId, session.id))
      )
    );

    const totalMessages = messageCounts.reduce((sum, result) => sum + result.length, 0);

    return {
      totalSessions,
      totalMessages,
      lastActivity
    };
  }
}

export const chatHistoryService = new ChatHistoryService();
