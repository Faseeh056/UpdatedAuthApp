<script lang="ts">
  import Chatbot from '$lib/components/Chatbot.svelte';
  import { goto } from '$app/navigation';
  import { signOut } from '@auth/sveltekit/client';

  let { data } = $props();
  let { session } = data;

  function handleBackToDashboard() {
    goto('/dashboard');
  }

  function handleProfileClick() {
    goto('/profile');
  }

  async function handleSignOut() {
    await signOut({ callbackUrl: '/' });
  }
</script>

<svelte:head>
  <title>AI Chatbot | Auth App</title>
</svelte:head>

<div class="min-h-screen bg-white relative overflow-hidden">
  <!-- Enhanced 3D Background Elements -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute top-10 left-5 w-40 h-40 bg-blue-600 rounded-full opacity-3 blur-3xl transform rotate-12 animate-pulse"></div>
    <div class="absolute top-20 right-10 w-32 h-32 bg-blue-500 rounded-full opacity-5 blur-2xl transform -rotate-12 animate-pulse delay-1000"></div>
    <div class="absolute bottom-10 left-1/3 w-48 h-48 bg-blue-600 rounded-full opacity-2 blur-3xl transform rotate-45 animate-pulse delay-2000"></div>
    <div class="absolute bottom-20 right-1/4 w-36 h-36 bg-blue-500 rounded-full opacity-4 blur-2xl transform -rotate-30 animate-pulse delay-1500"></div>
  </div>

  <div class="relative z-10 min-h-screen">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <button
              onclick={handleBackToDashboard}
              class="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span>Back to Dashboard</span>
            </button>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="text-right">
              <p class="text-gray-600 text-sm">Welcome back,</p>
              <p class="text-blue-600 font-semibold">{session?.user?.name || 'User'}</p>
            </div>
            
            <div class="flex items-center space-x-2">
              <button
                onclick={handleProfileClick}
                class="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Profile
              </button>
              <button
                onclick={handleSignOut}
                class="px-4 py-2 text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Chatbot Component -->
    <Chatbot {session} />
  </div>
</div>
