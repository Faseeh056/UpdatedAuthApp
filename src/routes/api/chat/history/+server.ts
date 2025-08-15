import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ChatHistoryService } from '$lib/server/services/chat-history-service';

export const GET: RequestHandler = async ({ locals, url }) => {
  try {
    const session = await locals.getSession();
    
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const limit = parseInt(url.searchParams.get('limit') || '50');
    
    // Get chat history for the user
    const chatHistory = await ChatHistoryService.getChatHistory(session.user.id, limit);

    return json({
      messages: chatHistory,
      count: chatHistory.length
    });

  } catch (error) {
    console.error('Chat history API error:', error);
    return json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
};
