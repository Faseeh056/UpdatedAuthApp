<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { goto } from '$app/navigation';
  import { signOut } from '@auth/sveltekit/client';

  let { data } = $props();
  let { session } = data;

  function handleProfileClick() {
    goto('/profile');
  }

  async function handleSignOut() {
    await signOut({ callbackUrl: '/' });
  }
</script>

<svelte:head>
  <title>Client Dashboard | Auth App</title>
  <meta name="description" content="Access your personal dashboard with enhanced security features" />
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
    <div class="max-w-7xl mx-auto px-8 py-12">
      <!-- Enhanced Header Section -->
      <div class="bg-gray-50 rounded-3xl p-10 shadow-2xl border border-gray-200 mb-16 transform hover:scale-[1.02] transition-transform duration-500">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-8">
            <div class="relative">
              <div class="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div class="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full opacity-80 animate-bounce"></div>
            </div>
            <div>
              <h1 class="text-5xl font-bold text-gray-900 mb-3">
                Client Dashboard
              </h1>
              <p class="text-2xl text-gray-700 font-medium">
                Welcome back, <span class="font-bold text-blue-600">{session?.user?.name || 'User'}</span>!
              </p>
              <div class="flex items-center space-x-4 mt-4">
                <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span class="text-gray-600 font-medium">Secure Client Access</span>
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <!-- Enhanced Profile Button -->
          <Button 
            onClick={handleProfileClick}
            variant="outline"
            class="flex items-center gap-4 bg-white border-blue-200 hover:bg-blue-50 px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="text-blue-600 font-semibold text-lg">Profile</span>
          </Button>
        </div>
      </div>

      <!-- Enhanced Success Message -->
      <div class="bg-green-50 border-2 border-green-200 rounded-3xl p-10 mb-16 shadow-2xl backdrop-blur-sm">
        <div class="text-center">
          <div class="w-24 h-24 bg-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-4xl font-bold text-green-800 mb-4">Successfully signed in!</h2>
          <p class="text-green-700 text-xl leading-relaxed">You are now logged in as a client with enhanced security and modern interface.</p>
          <div class="flex items-center justify-center space-x-6 mt-8">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-green-700 font-medium">Secure Access</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-green-400 rounded-full"></div>
              <span class="text-green-600 font-medium">Modern Interface</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-green-300 rounded-full"></div>
              <span class="text-green-500 font-medium">Enhanced Features</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Dashboard Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <!-- Enhanced Account Information Card -->
        <div class="relative group">
          <div class="absolute inset-0 bg-gray-50 rounded-3xl transform rotate-1 group-hover:rotate-0 transition-transform duration-700 shadow-2xl"></div>
          <div class="relative bg-gray-50 rounded-3xl p-10 shadow-2xl border border-gray-200 backdrop-blur-sm group-hover:shadow-3xl transition-all duration-500">
            <div class="flex items-center mb-8">
              <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900">Account Information</h3>
            </div>
            <div class="space-y-6">
              <div class="flex justify-between items-center py-4 border-b border-gray-200">
                <span class="text-gray-600 font-medium text-lg">Name:</span>
                <span class="text-gray-900 font-semibold text-lg">{session?.user?.name || 'N/A'}</span>
              </div>
              <div class="flex justify-between items-center py-4 border-b border-gray-200">
                <span class="text-gray-600 font-medium text-lg">Email:</span>
                <span class="text-gray-900 font-semibold text-lg">{session?.user?.email || 'N/A'}</span>
              </div>
              <div class="flex justify-between items-center py-4">
                <span class="text-gray-600 font-medium text-lg">Role:</span>
                <span class="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold border border-blue-200">
                  {session?.user?.role || 'client'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Quick Actions Card -->
        <div class="relative group">
          <div class="absolute inset-0 bg-gray-50 rounded-3xl transform -rotate-1 group-hover:rotate-0 transition-transform duration-700 shadow-2xl"></div>
          <div class="relative bg-gray-50 rounded-3xl p-10 shadow-2xl border border-gray-200 backdrop-blur-sm group-hover:shadow-3xl transition-all duration-500">
            <div class="flex items-center mb-8">
              <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900">Quick Actions</h3>
            </div>
            <div class="space-y-6">
              <Button 
                onClick={handleProfileClick}
                variant="outline" 
                fullWidth
                class="bg-sky-50 text-sky-700 border-sky-400 hover:bg-sky-100 font-semibold text-lg py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2"
              >
                Edit Profile
              </Button>
              <Button 
                onClick={() => goto('/profile#password')}
                variant="outline" 
                fullWidth
                class="bg-white text-green-600 border-green-200 hover:bg-green-50 font-semibold text-lg py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Change Password
              </Button>
              <Button 
                onClick={handleSignOut}
                variant="ghost" 
                fullWidth
                class="text-red-600 hover:bg-red-50 font-semibold text-lg py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        <!-- Enhanced Recent Activity Card -->
        <div class="relative group">
          <div class="absolute inset-0 bg-gray-50 rounded-3xl transform rotate-1 group-hover:rotate-0 transition-transform duration-700 shadow-2xl"></div>
          <div class="relative bg-gray-50 rounded-3xl p-10 shadow-2xl border border-gray-200 backdrop-blur-sm group-hover:shadow-3xl transition-all duration-500">
            <div class="flex items-center mb-8">
              <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900">Recent Activity</h3>
            </div>
            <div class="text-center py-12">
              <div class="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p class="text-gray-600 text-lg font-medium mb-2">No recent activity to display.</p>
              <p class="text-gray-500 text-sm">Your activity will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>