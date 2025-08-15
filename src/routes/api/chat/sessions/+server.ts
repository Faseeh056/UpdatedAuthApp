import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { chatHistoryService } from '$lib/server/services/chat-history-service';

export const GET: RequestHandler = async ({ locals }) => {
  try {
    const session = await locals.getSession();
    
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessions = await chatHistoryService.getSessions(session.user.id);

    return json({ sessions });

  } catch (error) {
    console.error('Get sessions error:', error);
    return json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
};
