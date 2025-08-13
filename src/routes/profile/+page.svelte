<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import { goto } from '$app/navigation';
  import { signOut } from '@auth/sveltekit/client';
  import { invalidateAll } from '$app/navigation';

  let { data } = $props();
  let { session } = data;

  // No inline editing state needed - will navigate to separate pages

  // Navigation functions for separate pages
  function goToEditProfile() {
    goto('/edit-profile');
  }

  function goToChangePassword() {
    goto('/change-password');
  }
</script>

<svelte:head>
  <title>Profile | Auth App</title>
</svelte:head>

<div class="min-h-screen bg-white relative overflow-hidden">
  <!-- 3D Background Elements -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute top-10 left-5 w-40 h-40 bg-blue-600 rounded-full opacity-3 blur-3xl transform rotate-12"></div>
    <div class="absolute top-20 right-10 w-32 h-32 bg-blue-500 rounded-full opacity-5 blur-2xl transform -rotate-12"></div>
    <div class="absolute bottom-10 left-1/3 w-48 h-48 bg-blue-600 rounded-full opacity-2 blur-3xl transform rotate-45"></div>
    <div class="absolute bottom-20 right-1/4 w-36 h-36 bg-blue-500 rounded-full opacity-4 blur-2xl transform -rotate-30"></div>
  </div>

  <div class="relative z-10 min-h-screen">
    <div class="max-w-4xl mx-auto px-8 py-12">
      <!-- Header Section -->
      <div class="bg-gray-50 rounded-3xl p-8 shadow-2xl border border-gray-200 mb-12 transform hover:scale-[1.02] transition-transform duration-500">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-6">
            <div class="relative">
              <div class="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div class="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full opacity-60"></div>
            </div>
            <div>
              <h1 class="text-4xl font-bold text-gray-900 mb-2">
                Profile Settings
              </h1>
              <p class="text-xl text-gray-600 font-medium">
                Manage your account information and security
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Account Information Card -->
        <div class="relative group">
          <div class="absolute inset-0 bg-gray-50 rounded-3xl transform rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
          <div class="relative bg-gray-50 rounded-3xl p-8 shadow-2xl border border-gray-200 backdrop-blur-sm">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900">Account Information</h3>
              </div>
              <Button 
                onClick={goToEditProfile}
                variant="outline"
                class="bg-sky-50 text-sky-700 border-sky-400 hover:bg-sky-100 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border-2"
              >
                Edit Profile
              </Button>
            </div>

            <!-- Display Profile Information -->
            <div class="space-y-4">
              <div class="flex justify-between items-center py-3 border-b border-gray-200">
                <span class="text-gray-600 font-medium">Name:</span>
                <span class="text-gray-900 font-semibold">{session?.user?.name || 'N/A'}</span>
              </div>
              <div class="flex justify-between items-center py-3 border-b border-gray-200">
                <span class="text-gray-600 font-medium">Email:</span>
                <span class="text-gray-900 font-semibold">{session?.user?.email || 'N/A'}</span>
              </div>
              <div class="flex justify-between items-center py-3">
                <span class="text-gray-600 font-medium">Role:</span>
                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
                  {session?.user?.role || 'client'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Security Settings Card -->
        <div class="relative group">
          <div class="absolute inset-0 bg-gray-50 rounded-3xl transform -rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
          <div class="relative bg-gray-50 rounded-3xl p-8 shadow-2xl border border-gray-200 backdrop-blur-sm">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900">Security Settings</h3>
            </div>
            <div class="space-y-4">
              <Button 
                onClick={goToChangePassword}
                variant="outline" 
                fullWidth
                class="bg-sky-50 text-sky-700 border-sky-400 hover:bg-sky-100 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border-2"
              >
                Change Password
              </Button>
              <Button 
                onClick={async () => {
                  await signOut({ callbackUrl: '/' });
                }}
                variant="ghost" 
                fullWidth
                class="text-red-600 hover:bg-red-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>


    </div>
  </div>
</div>