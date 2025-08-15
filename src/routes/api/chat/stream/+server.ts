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

    // Create a ReadableStream for streaming the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let assistantResponse = '';
          
          // Create a custom stream controller that captures the full response
          const customController = {
            enqueue: (chunk: Uint8Array) => {
              const text = new TextDecoder().decode(chunk);
              assistantResponse += text;
              controller.enqueue(chunk);
            },
            close: () => {
              // Store the complete assistant response
              if (assistantResponse.trim()) {
                ChatHistoryService.storeMessage(sessionId, 'assistant', assistantResponse.trim())
                  .catch(error => console.error('Failed to store assistant message:', error));
              }
              controller.close();
            },
            error: (error: any) => {
              controller.error(error);
            }
          };
          
          // Stream the response using the Gemini service
          await geminiService.streamResponse(message, customController, sessionId);
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      }
    });

    // Return the stream with appropriate headers
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('Chat stream API error:', error);
    return json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
};
