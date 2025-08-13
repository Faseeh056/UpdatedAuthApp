<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import { goto } from '$app/navigation';
  import { invalidateAll } from '$app/navigation';

  let { data } = $props();
  let { session } = data;

  // Profile editing state
  let editName = session?.user?.name || '';
  let editEmail = session?.user?.email || '';
  let loading = false;
  let error = '';
  let success = '';

  async function handleProfileUpdate(e) {
    e.preventDefault();
    loading = true;
    error = '';
    success = '';

    // Validate inputs
    if (!editName.trim()) {
      error = 'Name is required';
      loading = false;
      return;
    }

    if (!editEmail.trim() || !editEmail.includes('@')) {
      error = 'Please enter a valid email address';
      loading = false;
      return;
    }

    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editName.trim(),
          email: editEmail.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        success = 'Profile updated successfully!';
        // Refresh the session data
        await invalidateAll();
      } else {
        error = data.error || 'Failed to update profile';
      }
    } catch (err) {
      error = 'Network error. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Edit Profile | Admin</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
  <!-- 3D Background Elements -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute top-10 left-5 w-40 h-40 bg-blue-200 rounded-full opacity-15 blur-3xl transform rotate-12"></div>
    <div class="absolute top-20 right-10 w-32 h-32 bg-blue-300 rounded-full opacity-20 blur-2xl transform -rotate-12"></div>
    <div class="absolute bottom-10 left-1/3 w-48 h-48 bg-blue-100 rounded-full opacity-10 blur-3xl transform rotate-45"></div>
    <div class="absolute bottom-20 right-1/4 w-36 h-36 bg-blue-200 rounded-full opacity-15 blur-2xl transform -rotate-30"></div>
  </div>

  <div class="relative z-10 min-h-screen">
    <div class="max-w-4xl mx-auto px-8 py-12">
      <!-- Header Section -->
      <div class="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-blue-200/50 mb-12 transform hover:scale-[1.02] transition-transform duration-500">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-6">
            <div class="relative">
              <div class="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div class="absolute -top-1 -right-1 w-6 h-6 bg-blue-400 rounded-full opacity-60"></div>
            </div>
            <div>
              <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent mb-2">
                Edit Profile
              </h1>
              <p class="text-xl text-blue-700 font-medium">
                Update your account information
              </p>
            </div>
          </div>
          <Button 
            onClick={() => goto('/admin')}
            variant="outline"
                              class="bg-sky-50 text-sky-700 border-sky-400 hover:bg-sky-100 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border-2"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>

      <!-- Edit Profile Form -->
      <div class="relative group">
        <div class="absolute inset-0 bg-white/90 backdrop-blur-xl rounded-3xl transform rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
        <div class="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-blue-200/50">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900">Account Information</h3>
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

          <form onsubmit={handleProfileUpdate}>
            <div class="space-y-6">
              <Input
                id="editName"
                type="text"
                label="Name"
                placeholder="Enter your name"
                required
                bind:value={editName}
                fullWidth
                class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />

              <Input
                id="editEmail"
                type="email"
                label="Email"
                placeholder="Enter your email"
                required
                bind:value={editEmail}
                fullWidth
                class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />

              <div class="flex space-x-4">
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  class="bg-sky-400 text-slate-50 border-sky-300 hover:bg-sky-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border-2"
                >
                  Update Profile
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => goto('/admin')}
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
