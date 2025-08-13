<script lang="ts">
  import { goto } from '$app/navigation';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';

  let email = $state('');
  let loading = $state(false);
  let success = $state(false);
  let error = $state('');

  async function handleSubmit() {
    if (!email) {
      error = 'Please enter your email address';
      return;
    }

    loading = true;
    error = '';

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        success = true;
        // In development, store the reset link
        if (data.resetUrl) {
          resetUrl = data.resetUrl;
          console.log('🔗 Reset Link (Development):', data.resetUrl);
        }
      } else {
        error = data.error || 'Failed to send reset email';
      }
    } catch (err) {
      error = 'Network error. Please try again.';
    } finally {
      loading = false;
    }
  }

  function goToLogin() {
    goto('/login');
  }
</script>

<svelte:head>
  <title>Forgot Password - Auth App</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
  <div class="max-w-md w-full">
    <Card>
      <div class="text-center space-y-6">
        <!-- Header -->
        <div class="space-y-2">
          <h1 class="text-3xl font-bold text-gray-900">Forgot Password</h1>
          <p class="text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {#if success}
          <!-- Success Message -->
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-medium text-green-800">Reset email sent!</h3>
                <p class="text-sm text-green-700 mt-1">
                  Check your email for a link to reset your password.
                </p>
                {#if resetUrl}
                  <div class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p class="text-xs text-blue-800 font-medium mb-2">Development Mode - Reset Link:</p>
                    <a href={resetUrl} class="text-xs text-blue-600 hover:text-blue-500 break-all">
                      {resetUrl}
                    </a>
                    <p class="text-xs text-blue-600 mt-2">
                      💡 Click the link above to test password reset functionality
                    </p>
                  </div>
                {/if}
              </div>
            </div>
          </div>

          <Button on:click={goToLogin} variant="primary" fullWidth>
            Back to Login
          </Button>
        {:else}
          <!-- Forgot Password Form -->
          <form on:submit|preventDefault={handleSubmit} class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                bind:value={email}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            {#if error}
              <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                <p class="text-sm text-red-700">{error}</p>
              </div>
            {/if}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          <!-- Back to Login -->
          <div class="text-center">
            <button
              on:click={goToLogin}
              class="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              Back to Login
            </button>
          </div>
        {/if}
      </div>
    </Card>
  </div>
</div>