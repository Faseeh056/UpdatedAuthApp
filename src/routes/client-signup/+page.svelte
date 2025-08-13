<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import Card from '$lib/components/ui/Card.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Button from '$lib/components/ui/Button.svelte';

  let { data } = $props();
  let { session } = data;

  let name = $state('');
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let loading = $state(false);
  let error = $state('');
  let success = $state(false);

  // Redirect if already logged in
  $effect(() => {
    if (session) {
      if (session.user.role === 'admin') {
        goto('/admin');
      } else {
        goto('/dashboard');
      }
    }
  });

  async function handleSubmit(event: Event) {
    event.preventDefault();
    loading = true;
    error = '';
    success = false;

    // Validate form
    if (!name || !email || !password || !confirmPassword) {
      error = 'All fields are required';
      loading = false;
      return;
    }

    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      loading = false;
      return;
    }

    if (password.length < 8) {
      error = 'Password must be at least 8 characters';
      loading = false;
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role: 'client' })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Registration successful
      success = true;
      setTimeout(() => {
        goto('/login?role=client');
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        error = err.message;
      } else {
        error = 'An unexpected error occurred';
      }
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Client Registration | Auth App</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8">
  <div class="max-w-md w-full mx-auto px-6">
    <Card>
      <div class="text-center mb-6">
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Create Client Account</h1>
        <p class="text-gray-600">Join our platform as a client user</p>
      </div>

      {#if error}
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <p>{error}</p>
        </div>
      {/if}

      {#if success}
        <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6" role="alert">
          <p>Registration successful! Redirecting to login...</p>
        </div>
      {/if}

      <form onsubmit={handleSubmit}>
        <div class="space-y-4">
          <Input
            id="name"
            name="name"
            type="text"
            label="Full name"
            placeholder="Enter your full name"
            required
            bind:value={name}
            fullWidth
          />

          <Input
            id="email"
            name="email"
            type="email"
            label="Email address"
            placeholder="Enter your email"
            required
            bind:value={email}
            fullWidth
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Create a password"
            required
            bind:value={password}
            fullWidth
          />

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm password"
            placeholder="Confirm your password"
            required
            bind:value={confirmPassword}
            fullWidth
          />

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            loading={loading}
            class="bg-sky-400 text-slate-50 border-sky-300 hover:bg-sky-500 backdrop-blur-sm font-semibold text-lg py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2"
          >
            Create Client Account
          </Button>

          <div class="text-center mt-6">
            <p class="text-sm text-gray-600">
              Already have an account?
              <a href="/login?role=client" class="font-medium text-blue-600 hover:text-blue-500">Sign in</a>
            </p>
            <p class="text-sm text-gray-500 mt-2">
              Want to register as an admin?
              <a href="/admin/register" class="font-medium text-blue-600 hover:text-blue-500">Admin registration</a>
            </p>
          </div>
        </div>
      </form>
    </Card>
  </div>
</div>
