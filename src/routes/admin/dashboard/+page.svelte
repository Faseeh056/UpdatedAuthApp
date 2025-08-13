<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { goto } from '$app/navigation';

  let { data } = $props();
  let { session, users, userCount } = data;

  // Filter users by role
  let clientUsers = $derived(users.filter(user => user.role === 'client'));
  let adminUsers = $derived(users.filter(user => user.role === 'admin'));
  let userUsers = $derived(users.filter(user => user.role === 'user'));

  // Function to format date
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  }

  // Function to change user role
  async function changeUserRole(userId, newRole) {
    try {
      console.log('Attempting to change user role - User ID:', userId, 'New Role:', newRole);
      
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error:', errorData);
        throw new Error(`Failed to update user role: ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log('Role update successful:', result);

      // Update the user in the list
      users = users.map(user => {
        if (user.id === userId) {
          return { ...user, role: newRole };
        }
        return user;
      });

      alert(`User role updated successfully to ${newRole}! The user will need to log in again with their new role.`);
    } catch (error) {
      console.error('Error changing user role:', error);
      alert(`Failed to update user role: ${error.message}`);
    }
  }

  // Function to approve admin user
  async function approveAdmin(userId) {
    try {
      console.log('Attempting to approve admin with ID:', userId);
      
      const response = await fetch(`/api/admin/users/${userId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error:', errorData);
        throw new Error(`Failed to approve admin: ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log('Approval successful:', result);

      // Update the user in the list
      users = users.map(user => {
        if (user.id === userId) {
          return { ...user, adminApproved: true };
        }
        return user;
      });

      alert('Admin approved successfully!');
    } catch (error) {
      console.error('Error approving admin:', error);
      alert(`Failed to approve admin: ${error.message}`);
    }
  }

  // Function to reject admin user
  async function rejectAdmin(userId) {
    if (!confirm('Are you sure you want to reject this admin application? This will delete the user account.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to reject admin');
      }

      // Remove the user from the list
      users = users.filter(user => user.id !== userId);
    } catch (error) {
      console.error('Error rejecting admin:', error);
      alert('Failed to reject admin');
    }
  }
</script>

<svelte:head>
  <title>Admin Dashboard | Authentication App</title>
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
    <div class="max-w-7xl mx-auto px-8 py-12">
      <!-- Header Section -->
      <div class="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-blue-200/50 mb-12 transform hover:scale-[1.02] transition-transform duration-500">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-6">
            <div class="relative">
              <div class="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <div class="absolute -top-1 -right-1 w-6 h-6 bg-blue-400 rounded-full opacity-60"></div>
            </div>
            <div>
              <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent mb-2">
                Admin Dashboard
              </h1>
              <p class="text-xl text-blue-700 font-medium">
                Manage users and view analytics with enhanced control
              </p>
            </div>
          </div>
          <div class="flex space-x-4">
            <Button 
              onClick={() => goto('/admin/profile')}
              variant="outline"
              class="bg-sky-50 text-sky-700 border-sky-400 hover:bg-sky-100 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border-2"
            >
              Edit Profile
            </Button>
            <Button 
              onClick={() => goto('/admin/change-password')}
              variant="outline"
              class="bg-sky-50 text-sky-700 border-sky-400 hover:bg-sky-100 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border-2"
            >
              Change Password
            </Button>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        <!-- Total Users Card -->
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl transform rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
          <div class="relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-8 shadow-2xl border border-blue-200/50 backdrop-blur-sm">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-medium mb-2 text-blue-100">Total Users</h2>
                <p class="text-4xl font-bold text-white">{userCount}</p>
                <div class="mt-2 text-sm text-blue-200">Registered accounts</div>
              </div>
              <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Client Users Card -->
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 rounded-3xl transform -rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
          <div class="relative bg-gradient-to-br from-green-500 to-green-700 rounded-3xl p-8 shadow-2xl border border-green-200/50 backdrop-blur-sm">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-medium mb-2 text-green-100">Client Users</h2>
                <p class="text-4xl font-bold text-white">{clientUsers.length}</p>
                <div class="mt-2 text-sm text-green-200">Active clients</div>
              </div>
              <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Admin Users Card -->
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl transform rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
          <div class="relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 shadow-2xl border border-blue-200/50 backdrop-blur-sm">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-medium mb-2 text-blue-100">Admin Users</h2>
                <p class="text-4xl font-bold text-white">{adminUsers.length}</p>
                <div class="mt-2 text-sm text-blue-200">With admin privileges</div>
              </div>
              <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Regular Users Card -->
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-800 rounded-3xl transform -rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
          <div class="relative bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl p-8 shadow-2xl border border-orange-200/50 backdrop-blur-sm">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-medium mb-2 text-orange-100">Regular Users</h2>
                <p class="text-4xl font-bold text-white">{userUsers.length}</p>
                <div class="mt-2 text-sm text-orange-200">Standard accounts</div>
              </div>
              <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Client Users Section -->
      <div class="relative group mb-12">
        <div class="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 rounded-3xl transform rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
        <div class="relative bg-gradient-to-br from-green-500 to-green-700 rounded-3xl p-8 shadow-2xl border border-green-200/50 backdrop-blur-sm">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-3xl font-bold text-white">Client Users</h2>
                <p class="text-green-100 text-lg">Users who logged in as clients</p>
              </div>
            </div>
            <div class="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-white/30">
              {clientUsers.length} clients
            </div>
          </div>
          
          {#if clientUsers.length > 0}
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-green-200/30">
                <thead>
                  <tr>
                    <th class="px-6 py-4 text-left text-xs font-medium text-green-100 uppercase tracking-wider">
                      Client
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-medium text-green-100 uppercase tracking-wider">
                      Email
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-medium text-green-100 uppercase tracking-wider">
                      Status
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-medium text-green-100 uppercase tracking-wider">
                      Registered
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-medium text-green-100 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-green-200/20">
                  {#each clientUsers as user (user.id)}
                    <tr class="hover:bg-white/5 transition-colors duration-200">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-12 w-12">
                            {#if user.image}
                              <img class="h-12 w-12 rounded-full" src={user.image} alt="" />
                            {:else}
                              <div class="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                                <span class="text-white font-medium">
                                  {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                                </span>
                              </div>
                            {/if}
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-white">{user.name || 'N/A'}</div>
                            <div class="text-sm text-green-200">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-white">{user.email}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/30">
                          Active Client
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-green-200">
                        {formatDate(user.createdAt)}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div class="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onclick={() => changeUserRole(user.id, 'admin')}
                            class="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
                          >
                            Make Admin
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onclick={() => changeUserRole(user.id, 'user')}
                            class="bg-orange-500/20 text-orange-200 border-orange-300/30 hover:bg-orange-500/30 backdrop-blur-sm"
                          >
                            Make User
                          </Button>
                        </div>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {:else}
            <div class="text-center py-16">
              <div class="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/30">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-medium text-white mb-3">No Client Users Yet</h3>
              <p class="text-green-200">When users register and login as clients, they will appear here.</p>
            </div>
          {/if}
        </div>
      </div>

      <!-- All Users Management -->
      <div class="relative group mb-12">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl transform -rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
        <div class="relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-8 shadow-2xl border border-blue-200/50 backdrop-blur-sm">
          <div class="flex items-center mb-8">
            <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-sm border border-white/30">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-white">All Users Management</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-blue-200/30">
              <thead>
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                    User
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                    Email
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                    Role
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                    Created
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-blue-200/20">
                {#each users as user (user.id)}
                  <tr class="hover:bg-white/5 transition-colors duration-200">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-12 w-12">
                          {#if user.image}
                            <img class="h-12 w-12 rounded-full" src={user.image} alt="" />
                          {:else}
                            <div class="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                              <span class="text-white font-medium">
                                {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                              </span>
                            </div>
                          {/if}
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-white">{user.name || 'N/A'}</div>
                          <div class="text-sm text-blue-200">{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-white">{user.email}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full backdrop-blur-sm border border-white/30 {user.role === 'admin' ? 'bg-purple-500/20 text-purple-200' : user.role === 'client' ? 'bg-green-500/20 text-green-200' : 'bg-orange-500/20 text-orange-200'}"
                      >
                        {user.role}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-200">
                      {formatDate(user.createdAt)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex space-x-2">
                        {#if user.role === 'admin'}
                          <Button
                            variant="outline"
                            size="sm"
                            onclick={() => changeUserRole(user.id, 'client')}
                            class="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
                          >
                            Make Client
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onclick={() => changeUserRole(user.id, 'user')}
                            class="bg-orange-500/20 text-orange-200 border-orange-300/30 hover:bg-orange-500/30 backdrop-blur-sm"
                          >
                            Make User
                          </Button>
                        {:else if user.role === 'client'}
                          <Button
                            variant="outline"
                            size="sm"
                            onclick={() => changeUserRole(user.id, 'admin')}
                            class="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
                          >
                            Make Admin
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onclick={() => changeUserRole(user.id, 'user')}
                            class="bg-orange-500/20 text-orange-200 border-orange-300/30 hover:bg-orange-500/30 backdrop-blur-sm"
                          >
                            Make User
                          </Button>
                        {:else}
                          <Button
                            variant="outline"
                            size="sm"
                            onclick={() => changeUserRole(user.id, 'admin')}
                            class="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
                          >
                            Make Admin
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onclick={() => changeUserRole(user.id, 'client')}
                            class="bg-green-500/20 text-green-200 border-green-300/30 hover:bg-green-500/30 backdrop-blur-sm"
                          >
                            Make Client
                          </Button>
                        {/if}
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Pending Admin Approvals Section -->
      {#if users.filter(u => u.role === 'admin' && !u.adminApproved).length > 0}
        <div class="relative group mb-12">
          <div class="absolute inset-0 bg-gradient-to-br from-yellow-600 to-orange-800 rounded-3xl transform -rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
          <div class="relative bg-gradient-to-br from-yellow-500 to-orange-700 rounded-3xl p-8 shadow-2xl border border-yellow-200/50 backdrop-blur-sm">
            <div class="flex items-center justify-between mb-8">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h2 class="text-3xl font-bold text-white">Pending Admin Approvals</h2>
                  <p class="text-yellow-100 text-lg">New admin applications waiting for approval</p>
                </div>
              </div>
              <div class="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-white/30">
                {users.filter(u => u.role === 'admin' && !u.adminApproved).length} pending
              </div>
            </div>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-yellow-200/30">
                <thead>
                  <tr>
                    <th class="px-6 py-4 text-left text-xs font-medium text-yellow-100 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-medium text-yellow-100 uppercase tracking-wider">
                      Email
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-medium text-yellow-100 uppercase tracking-wider">
                      Applied
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-medium text-yellow-100 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-yellow-200/20">
                  {#each users.filter(u => u.role === 'admin' && !u.adminApproved) as user (user.id)}
                    <tr class="hover:bg-white/5 transition-colors duration-200">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-12 w-12">
                            <div class="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                              <span class="text-white font-medium">
                                {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-white">{user.name || 'N/A'}</div>
                            <div class="text-sm text-yellow-200">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-white">{user.email}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-yellow-200">
                        {formatDate(user.createdAt)}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div class="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onclick={() => approveAdmin(user.id)}
                            class="bg-green-500/20 text-green-200 border-green-300/30 hover:bg-green-500/30 backdrop-blur-sm"
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onclick={() => rejectAdmin(user.id)}
                            class="bg-red-500/20 text-red-200 border-red-300/30 hover:bg-red-500/30 backdrop-blur-sm"
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      {/if}

      <!-- Analytics Section -->
      <div class="relative group">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl transform rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
        <div class="relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 shadow-2xl border border-blue-200/50 backdrop-blur-sm">
          <div class="flex items-center mb-8">
            <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-sm border border-white/30">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-white">Analytics</h2>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
              <h3 class="text-lg font-medium text-white mb-4">User Distribution</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-blue-200">Client Users</span>
                  <span class="font-semibold text-white">{clientUsers.length}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-purple-200">Admin Users</span>
                  <span class="font-semibold text-white">{adminUsers.length}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-orange-200">Regular Users</span>
                  <span class="font-semibold text-white">{userUsers.length}</span>
                </div>
              </div>
            </div>
            <div class="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
              <h3 class="text-lg font-medium text-white mb-4">Recent Activity</h3>
              <div class="space-y-4">
                <div class="flex items-center space-x-3">
                  <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span class="text-blue-200 text-sm">Total registered users: {userCount}</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span class="text-blue-200 text-sm">Client users: {clientUsers.length}</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span class="text-blue-200 text-sm">Admin users: {adminUsers.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>