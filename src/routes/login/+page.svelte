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
  let role = $state('client');
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    role = urlParams.get('role') || 'client';
  }

  let email = $state('');
  let password = $state('');
  let loading = $state(false);
  let error = $state('');
  let success = $state('');

  async function handleSubmit(e: Event) {
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

          <!-- OAuth Login Buttons -->
          <div class="space-y-4 mb-8">
            <Button
              onclick={() => signIn('google', { callbackUrl: '/dashboard' })}
              variant="outline"
              fullWidth
              class="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-lg py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-3"
            >
              <svg class="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Sign in with Google</span>
            </Button>

            <Button
              onclick={() => signIn('github', { callbackUrl: '/dashboard' })}
              variant="outline"
              fullWidth
              class="bg-gray-900 border-gray-700 text-white hover:bg-gray-800 font-semibold text-lg py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-3"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>Sign in with GitHub</span>
            </Button>

            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-gray-50 text-gray-500 font-medium">Or continue with email</span>
              </div>
            </div>
          </div>

          <!-- Enhanced Login Form -->
          <form onsubmit={handleSubmit} class="space-y-6">
            <div class="space-y-2">
              <Input
                id="email"
                name="email"
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
                name="password"
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