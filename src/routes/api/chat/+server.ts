import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { geminiService } from '$lib/server/services/gemini-service';
import { ChatHistoryService } from '$lib/server/services/chat-history-service';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const session = await locals.getSession();
    
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return json({ error: 'Message is required' }, { status: 400 });
    }

    // Get or create a chat session for the user
    const sessionId = await ChatHistoryService.getOrCreateSession(session.user.id);
    
    // Store the user message with the user's name
    await ChatHistoryService.storeMessage(sessionId, 'user', message, session.user.name);

    // Generate AI response
    const response = await geminiService.sendMessageStream(message);

    // Store the assistant response
    await ChatHistoryService.storeMessage(sessionId, 'assistant', response);

    return json({
      message: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
};
