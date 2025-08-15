import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { chatHistoryService } from '$lib/server/services/chat-history-service';

export const GET: RequestHandler = async ({ params, locals }) => {
  try {
    const session = await locals.getSession();
    
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = params;
    const chatSession = await chatHistoryService.getSession(sessionId, session.user.id);

    if (!chatSession) {
      return json({ error: 'Session not found' }, { status: 404 });
    }

    return json(chatSession);

  } catch (error) {
    console.error('Get session error:', error);
    return json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
  try {
    const session = await locals.getSession();
    
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = params;
    const { title } = await request.json();

    if (!title || typeof title !== 'string') {
      return json({ error: 'Title is required' }, { status: 400 });
    }

    await chatHistoryService.updateSessionTitle(sessionId, session.user.id, title);

    return json({ success: true });

  } catch (error) {
    console.error('Update session error:', error);
    return json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  try {
    const session = await locals.getSession();
    
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = params;
    await chatHistoryService.deleteSession(sessionId, session.user.id);

    return json({ success: true });

  } catch (error) {
    console.error('Delete session error:', error);
    return json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
};
