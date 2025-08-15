<script lang="ts">
  import { onMount } from 'svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Input from '$lib/components/ui/Input.svelte';

  export let session: any;

  interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }

  let messages: ChatMessage[] = [];
  let newMessage = '';
  let isLoading = false;
  let error = '';

  // Initialize with welcome message and load chat history
  onMount(async () => {
    try {
      // Load chat history from the server
      const response = await fetch('/api/chat/history');
      if (response.ok) {
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          // Convert database messages to chat format
          messages = data.messages.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.timestamp)
          }));
        } else {
          // No history, show welcome message
          messages = [
            {
              id: '1',
              role: 'assistant',
              content: `Hello ${session?.user?.name || 'there'}! I'm your AI assistant. Ask me anything!`,
              timestamp: new Date()
            }
          ];
        }
      } else {
        // Fallback to welcome message
        messages = [
          {
            id: '1',
            role: 'assistant',
            content: `Hello ${session?.user?.name || 'there'}! I'm your AI assistant. Ask me anything!`,
            timestamp: new Date()
          }
        ];
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
      // Fallback to welcome message
      messages = [
        {
          id: '1',
          role: 'assistant',
          content: `Hello ${session?.user?.name || 'there'}! I'm your AI assistant. Ask me anything!`,
          timestamp: new Date()
        }
      ];
    }
  });

  async function sendMessage() {
    if (!newMessage.trim() || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage.trim(),
      timestamp: new Date()
    };

    messages = [...messages, userMessage];
    const messageToSend = newMessage.trim();
    newMessage = '';
    isLoading = true;
    error = '';

    // Create assistant message placeholder
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date()
    };

    messages = [...messages, assistantMessage];

    try {
      // Use streaming API for real-time response
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let streamedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        // Decode the chunk and add to content
        const chunk = decoder.decode(value, { stream: true });
        streamedContent += chunk;
        
        // Update the assistant message with the streamed content
        assistantMessage.content = streamedContent;
        messages = [...messages];
      }

    } catch (err) {
      console.error('Chat error:', err);
      error = err instanceof Error ? err.message : 'Failed to send message';
      
      // Remove the empty assistant message on error
      messages = messages.filter(msg => msg.id !== assistantMessage.id);
    } finally {
      isLoading = false;
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function clearChat() {
    messages = [
      {
        id: '1',
        role: 'assistant',
        content: `Hello ${session?.user?.name || 'there'}! I'm your AI assistant. Ask me anything!`,
        timestamp: new Date()
      }
    ];
    error = '';
  }
</script>

<svelte:head>
  <title>AI Chatbot | Auth App</title>
  <style>
    @keyframes typing {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    
    .typing-cursor {
      animation: typing 1s infinite;
    }
    
    .streaming-text {
      transition: all 0.1s ease-out;
    }
  </style>
</svelte:head>

<div class="min-h-screen bg-white relative overflow-hidden">
  <!-- Enhanced 3D Background Elements -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute top-10 left-5 w-40 h-40 bg-blue-600 rounded-full opacity-3 blur-3xl transform rotate-12 animate-pulse"></div>
    <div class="absolute top-20 right-10 w-32 h-32 bg-blue-500 rounded-full opacity-5 blur-2xl transform -rotate-12 animate-pulse delay-1000"></div>
    <div class="absolute bottom-10 left-1/3 w-48 h-48 bg-blue-600 rounded-full opacity-2 blur-3xl transform rotate-45 animate-pulse delay-2000"></div>
    <div class="absolute bottom-20 right-1/4 w-36 h-36 bg-blue-500 rounded-full opacity-4 blur-2xl transform -rotate-30 animate-pulse delay-1500"></div>
  </div>

  <div class="relative z-10 min-h-screen flex flex-col">
    <!-- Header -->
    <div class="bg-gray-50 border-b border-gray-200 p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900">AI Assistant</h1>
            <p class="text-sm text-gray-600">Ask me anything!</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-sm text-gray-600">Online</span>
          </div>
          
          <button
            on:click={clearChat}
            class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span>Clear Chat</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Messages Area -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
      {#each messages as message (message.id)}
        <div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}">
          <div class="max-w-xs lg:max-w-md xl:max-w-lg">
            <div class="flex items-end space-x-2 {message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}">
                             <!-- Avatar -->
               <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0
                 {message.role === 'user' 
                   ? 'bg-blue-600' 
                   : 'bg-gray-600'
                 }">
                 {message.role === 'user' ? (message.userName ? message.userName.charAt(0).toUpperCase() : 'U') : 'AI'}
               </div>
              
                             <!-- Message Bubble -->
               <div class="px-4 py-3 rounded-2xl shadow-lg
                 {message.role === 'user' 
                   ? 'bg-blue-600 text-white rounded-br-md' 
                   : 'bg-gray-100 text-gray-900 rounded-bl-md'
                 }">
                 {#if message.role === 'user' && message.userName}
                   <p class="text-xs opacity-80 mb-1 font-medium">
                     {message.userName}
                   </p>
                 {/if}
                 <p class="text-sm leading-relaxed streaming-text">
                   {message.content}
                   {#if message.role === 'assistant' && isLoading}
                     <span class="inline-block w-2 h-4 bg-blue-500 typing-cursor ml-1"></span>
                   {/if}
                 </p>
                 <p class="text-xs mt-2 opacity-70
                   {message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}">
                   {formatTime(message.timestamp)}
                 </p>
               </div>
            </div>
          </div>
        </div>
      {/each}

      <!-- Loading Indicator -->
      {#if isLoading}
        <div class="flex justify-start">
          <div class="max-w-xs lg:max-w-md xl:max-w-lg">
            <div class="flex items-end space-x-2">
              <div class="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-semibold">
                AI
              </div>
              <div class="px-4 py-3 rounded-2xl bg-gray-100 text-gray-900 rounded-bl-md shadow-lg">
                <div class="flex items-center space-x-2">
                  <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  </div>
                  <span class="text-xs text-gray-500 ml-2">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/if}

      <!-- Error Message -->
      {#if error}
        <div class="flex justify-center">
          <div class="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 shadow-lg">
            <p class="text-red-700 text-sm font-medium">{error}</p>
          </div>
        </div>
      {/if}
    </div>

    <!-- Input Area -->
    <div class="border-t border-gray-200 p-4 bg-white">
      <div class="flex space-x-4">
        <div class="flex-1">
          <Input
            id="message"
            name="message"
            type="text"
            bind:value={newMessage}
            onKeyPress={handleKeyPress}
            placeholder="Type your question here..."
            disabled={isLoading}
            class="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 resize-none"
          />
        </div>
        <Button
          onClick={sendMessage}
          disabled={!newMessage.trim() || isLoading}
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {#if isLoading}
            <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          {:else}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          {/if}
        </Button>
      </div>
      <p class="text-xs text-gray-500 mt-2 text-center">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  </div>
</div>
