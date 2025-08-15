import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { chatHistoryService } from '$lib/server/services/chat-history-service';

export const GET: RequestHandler = async ({ locals }) => {
  try {
    const session = await locals.getSession();
    
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await chatHistoryService.getUserChatStats(session.user.id);

    return json({ stats });

  } catch (error) {
    console.error('Get chat stats error:', error);
    return json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
};
