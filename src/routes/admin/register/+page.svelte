<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';

  let loading = false;
  let error = '';
  let success = '';

  function handleSubmit(event) {
    loading = true;
    error = '';
    success = '';
  }
</script>

<svelte:head>
  <title>Admin Registration | Auth App</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
  <!-- 3D Background Elements -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute top-10 left-5 w-40 h-40 bg-blue-200 rounded-full opacity-15 blur-3xl transform rotate-12"></div>
    <div class="absolute top-20 right-10 w-32 h-32 bg-blue-300 rounded-full opacity-20 blur-2xl transform -rotate-12"></div>
    <div class="absolute bottom-10 left-1/3 w-48 h-48 bg-blue-100 rounded-full opacity-10 blur-3xl transform rotate-45"></div>
    <div class="absolute bottom-20 right-1/4 w-36 h-36 bg-blue-200 rounded-full opacity-15 blur-2xl transform -rotate-30"></div>
  </div>

  <div class="relative z-10 min-h-screen flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="relative inline-block mb-6">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
          </div>
          <div class="absolute -top-1 -right-1 w-6 h-6 bg-blue-400 rounded-full opacity-60"></div>
        </div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent mb-2">
          Admin Registration
        </h1>
        <p class="text-xl text-blue-700 font-medium">
          Request admin access
        </p>
      </div>

      <!-- Registration Form -->
      <div class="relative group">
        <div class="absolute inset-0 bg-white/90 backdrop-blur-xl rounded-3xl transform -rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
        <div class="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-blue-200/50">
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

          <form method="POST" use:enhance={handleSubmit}>
            <div class="space-y-6">
              <Input
                id="name"
                name="name"
                type="text"
                label="Full Name"
                placeholder="Enter your full name"
                required
                fullWidth
                class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />

              <Input
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
                required
                fullWidth
                class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />

              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="Create a password"
                required
                fullWidth
                class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />

              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Confirm your password"
                required
                fullWidth
                class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />

              <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div class="text-sm text-blue-700">
                    <p class="font-medium mb-1">Admin Approval Required</p>
                    <p>Your admin account will be created but requires approval from an existing admin before you can sign in.</p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                class="bg-sky-400 text-slate-50 border-sky-300 hover:bg-sky-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border-2"
              >
                Register as Admin
              </Button>
            </div>
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              Already have admin access? 
              <a href="/admin/signin" class="text-blue-600 hover:text-blue-700 font-medium">
                Sign In as Admin
              </a>
            </p>
          </div>

          <div class="mt-4 text-center">
            <a href="/" class="text-sm text-gray-500 hover:text-gray-700">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
