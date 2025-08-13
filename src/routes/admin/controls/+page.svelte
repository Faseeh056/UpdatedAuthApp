<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { goto } from '$app/navigation';

  let { data } = $props();
  let { session } = data;

  function handleBack() {
    goto('/admin');
  }

  function handleViewUsers() {
    goto('/admin/users');
  }
</script>

<svelte:head>
  <title>Administrative Controls | Auth App</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Administrative Controls</h1>
        <p class="text-gray-600 mt-2">Advanced system management and controls</p>
      </div>
      
      <Button 
        onClick={handleBack}
        variant="outline"
      >
        Back to Dashboard
      </Button>
    </div>

    <!-- Control Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">User Management</h3>
          </div>
          <p class="text-gray-600 mb-4">View, edit, and delete user accounts. Manage user roles and permissions.</p>
          <Button 
            onClick={handleViewUsers}
            variant="primary" 
            fullWidth
          >
            Manage Users
          </Button>
        </div>
      </Card>

      <Card>
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">System Analytics</h3>
          </div>
          <p class="text-gray-600 mb-4">View system statistics, user activity, and performance metrics.</p>
          <Button 
            variant="outline" 
            fullWidth
            disabled
          >
            View Analytics
          </Button>
        </div>
      </Card>

      <Card>
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">System Settings</h3>
          </div>
          <p class="text-gray-600 mb-4">Configure system settings, security options, and application preferences.</p>
          <Button 
            variant="outline" 
            fullWidth
            disabled
          >
            Configure Settings
          </Button>
        </div>
      </Card>

      <Card>
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Security Logs</h3>
          </div>
          <p class="text-gray-600 mb-4">Monitor security events, login attempts, and system access logs.</p>
          <Button 
            variant="outline" 
            fullWidth
            disabled
          >
            View Logs
          </Button>
        </div>
      </Card>

      <Card>
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Backup & Restore</h3>
          </div>
          <p class="text-gray-600 mb-4">Create system backups and restore data from previous backups.</p>
          <Button 
            variant="outline" 
            fullWidth
            disabled
          >
            Backup System
          </Button>
        </div>
      </Card>

      <Card>
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Help & Support</h3>
          </div>
          <p class="text-gray-600 mb-4">Access documentation, troubleshooting guides, and support resources.</p>
          <Button 
            variant="outline" 
            fullWidth
            disabled
          >
            Get Help
          </Button>
        </div>
      </Card>
    </div>
  </div>
</div>
