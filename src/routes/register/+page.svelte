<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Card from '$lib/components/ui/Card.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { get } from 'svelte/store';

  let { data } = $props();
  let { session } = data;

  let name = $state('');
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let loading = $state(false);
  let error = $state('');
  let success = $state(false);

  // Get role from URL parameter using $derived
  let role = $derived(() => {
    const url = get(page).url;
    return url.searchParams.get('role') || 'client';
  });

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
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Registration successful
      success = true;
      setTimeout(() => {
        goto(`/login?role=${role}`);
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
  <title>Register | Auth App</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8">
  <div class="max-w-md w-full mx-auto px-6">
    <Card>
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold">Create {role === 'admin' ? 'Admin' : 'Client'} Account</h1>
        <p class="text-gray-600 mt-2">Fill in the form below to create your account</p>
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

          <Button type="submit" variant="primary" fullWidth loading={loading}>Create Account</Button>

          <div class="text-center mt-4">
            <p class="text-sm text-gray-600">
              Already have an account?
              <a href="/login?role={role}" class="font-medium text-blue-600 hover:text-blue-500">Sign in</a>
            </p>
          </div>
        </div>
      </form>
    </Card>
  </div>
</div>