<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import { goto } from '$app/navigation';
  import { invalidateAll } from '$app/navigation';
  import { signIn } from '@auth/sveltekit/client';

  let { data } = $props();
  let { session } = data;

  // Get role from URL params
  let role = 'client';
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    role = urlParams.get('role') || 'client';
  }

  let email = '';
  let password = '';
  let loading = false;
  let error = '';
  let success = '';

  async function handleSubmit(e) {
    e.preventDefault();
    loading = true;
    error = '';
    success = '';

    try {
      const result = await signIn('credentials', {
        email,
        password,
        role,
        redirect: false
      });

      if (result?.error) {
        error = result.error;
      } else {
        success = 'Sign in successfully!';
        await invalidateAll();
        setTimeout(() => {
          // Redirect based on role
          const redirectUrl = role === 'admin' ? '/admin/dashboard' : '/dashboard';
          goto(redirectUrl);
        }, 1500);
      }
    } catch (err) {
      error = 'Network error. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Sign In | Auth App</title>
  <meta name="description" content="Sign in to your account with secure authentication" />
</svelte:head>

<div class="min-h-screen bg-white relative overflow-hidden">
  <!-- Enhanced 3D Background Elements -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute top-10 left-5 w-40 h-40 bg-blue-600 rounded-full opacity-3 blur-3xl transform rotate-12 animate-pulse"></div>
    <div class="absolute top-20 right-10 w-32 h-32 bg-blue-500 rounded-full opacity-5 blur-2xl transform -rotate-12 animate-pulse delay-1000"></div>
    <div class="absolute bottom-10 left-1/3 w-48 h-48 bg-blue-600 rounded-full opacity-2 blur-3xl transform rotate-45 animate-pulse delay-2000"></div>
    <div class="absolute bottom-20 right-1/4 w-36 h-36 bg-blue-500 rounded-full opacity-4 blur-2xl transform -rotate-30 animate-pulse delay-1500"></div>
  </div>

  <div class="relative z-10 min-h-screen flex items-center justify-center p-8">
    <div class="max-w-md w-full mx-auto">
      <!-- Enhanced Login Card -->
      <div class="relative group">
        <div class="absolute inset-0 bg-gray-50 rounded-3xl transform rotate-1 group-hover:rotate-0 transition-transform duration-700 shadow-2xl"></div>
        <div class="relative bg-gray-50 rounded-3xl p-12 shadow-2xl border border-gray-200 backdrop-blur-sm group-hover:shadow-3xl transition-all duration-500">
          <!-- Enhanced Header -->
          <div class="text-center mb-10">
            <div class="flex justify-center mb-8">
              <div class="relative group">
                <div class="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-2 group-hover:rotate-0 transition-transform duration-500">
                  <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <div class="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full opacity-60 animate-bounce"></div>
              </div>
            </div>
            <h1 class="text-4xl font-bold text-gray-900 mb-4">
              Welcome Back
            </h1>
            <p class="text-gray-500 text-lg leading-relaxed">
              Sign in to your account to continue
            </p>
            <div class="flex items-center justify-center space-x-4 mt-6">
              <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span class="text-gray-500 font-medium text-sm">Secure Authentication</span>
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </div>

          <!-- Enhanced Alert Messages -->
          {#if error}
            <div class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 flex items-center backdrop-blur-sm" role="alert">
              <svg class="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="font-medium">{error}</p>
            </div>
          {/if}

          {#if success}
            <div class="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl mb-8 flex items-center backdrop-blur-sm" role="alert">
              <svg class="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="font-medium">{success}</p>
            </div>
          {/if}

          <!-- Enhanced Login Form -->
          <form onsubmit={handleSubmit} class="space-y-6">
            <div class="space-y-2">
              <Input
                id="email"
                type="email"
                label="Email Address"
                placeholder="Enter your email address"
                required
                bind:value={email}
                fullWidth
                class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div class="space-y-2">
              <Input
                id="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                required
                bind:value={password}
                fullWidth
                class="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span class="text-gray-500">Role: <span class="font-semibold text-gray-900">{role}</span></span>
              </div>
              <a href="/forgot-password" class="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              class="bg-sky-400 text-slate-50 border-sky-300 hover:bg-sky-500 backdrop-blur-sm font-semibold text-lg py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <!-- Enhanced Footer -->
          <div class="mt-10 text-center">
            <p class="text-gray-500 text-sm">
              Don't have an account? 
              <a href="/client-signup" class="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 ml-1">
                Sign up here
              </a>
            </p>
            <p class="text-gray-400 text-xs mt-2">
              Admin users can register at 
              <a href="/admin/register" class="text-blue-600 hover:text-blue-700 transition-colors duration-200">
                admin registration
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>