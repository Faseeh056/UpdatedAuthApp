<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import Card from '$lib/components/ui/Card.svelte';
  import { get } from 'svelte/store';

  let message = '';
  let error = '';
  let loading = true;

  onMount(async () => {
    const url = get(page).url;
    const token = url.searchParams.get('token') || '';
    const email = url.searchParams.get('email') || '';
    if (!token || !email) {
      error = 'Invalid verification link.';
      loading = false;
      return;
    }
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');
      message = data.message;
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Verify Email | Authentication App</title>
</svelte:head>

<div class="max-w-md mx-auto">
  <Card>
    <h1 class="text-2xl font-bold mb-2">Verify Email</h1>
    {#if loading}
      <p>Verifying...</p>
    {:else if message}
      <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6" role="alert">
        <p>{message}</p>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6" role="alert">
        <p>{error}</p>
      </div>
    {/if}
  </Card>
</div>