<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import { goto } from '$app/navigation';

  let { data } = $props();
  let { session } = data;

  // Password change state
  let currentPassword = '';
  let newPassword = '';
  let confirmPassword = '';
  let loading = false;
  let error = '';
  let success = '';

  async function handlePasswordChange(e) {
    e.preventDefault();
    loading = true;
    error = '';
    success = '';

    // Validate passwords
    if (newPassword !== confirmPassword) {
      error = 'New passwords do not match';
      loading = false;
      return;
    }

    if (newPassword.length < 6) {
      error = 'New password must be at least 6 characters long';
      loading = false;
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        success = 'Password changed successfully!';
        currentPassword = '';
        newPassword = '';
        confirmPassword = '';
      } else {
        error = data.error || 'Failed to change password';
      }
    } catch (err) {
      error = 'Network error. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Change Password | Auth App</title>
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <div class="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full opacity-60"></div>
            </div>
            <div>
              <h1 class="text-4xl font-bold text-gray-900 mb-2">
                Change Password
              </h1>
              <p class="text-xl text-gray-600 font-medium">
                Update your account security
              </p>
            </div>
          </div>
          <Button 
            onClick={() => goto('/profile')}
            variant="outline"
                              class="bg-sky-50 text-sky-700 border-sky-400 hover:bg-sky-100 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border-2"
          >
            Back to Profile
          </Button>
        </div>
      </div>

      <!-- Change Password Form -->
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

          {#if error}
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center backdrop-blur-sm" role="alert">
              <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p>{error}</p>
            </div>
          {/if}

          {#if success}
            <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center backdrop-blur-sm" role="alert">
              <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p>{success}</p>
            </div>
          {/if}

          <form onsubmit={handlePasswordChange}>
            <div class="space-y-6">
              <Input
                id="currentPassword"
                type="password"
                label="Current Password"
                placeholder="Enter your current password"
                required
                bind:value={currentPassword}
                fullWidth
                class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />

              <Input
                id="newPassword"
                type="password"
                label="New Password"
                placeholder="Enter your new password"
                required
                bind:value={newPassword}
                fullWidth
                class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />

              <Input
                id="confirmPassword"
                type="password"
                label="Confirm New Password"
                placeholder="Confirm your new password"
                required
                bind:value={confirmPassword}
                fullWidth
                class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />

              <div class="flex space-x-4">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={loading}
                  class="bg-sky-400 text-slate-50 border-sky-300 hover:bg-sky-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border-2"
                >
                  Update Password
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => goto('/profile')}
                  class="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
