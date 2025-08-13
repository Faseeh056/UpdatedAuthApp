<script lang="ts">
  import { goto } from '$app/navigation';

  function handleClientClick() {
    goto('/login?role=client');
  }

  function handleAdminClick() {
    goto('/admin/login');
  }
</script>

<svelte:head>
  <title>Auth App - Secure Authentication Platform</title>
  <meta name="description" content="Choose your role to access the appropriate dashboard with enhanced security and modern interface" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
  <!-- Enhanced 3D Background Elements -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute top-20 left-10 w-32 h-32 bg-blue-600 rounded-full opacity-10 blur-xl transform rotate-12 animate-pulse"></div>
    <div class="absolute top-40 right-20 w-24 h-24 bg-blue-600 rounded-full opacity-15 blur-lg transform -rotate-12 animate-pulse delay-1000"></div>
    <div class="absolute bottom-20 left-1/4 w-40 h-40 bg-emerald-500 rounded-full opacity-8 blur-2xl transform rotate-45 animate-pulse delay-2000"></div>
    <div class="absolute bottom-40 right-1/3 w-28 h-28 bg-blue-600 rounded-full opacity-12 blur-xl transform -rotate-30 animate-pulse delay-1500"></div>
  </div>

  <div class="relative z-10 min-h-screen flex items-center justify-center p-8">
    <div class="max-w-7xl w-full mx-auto">
      <!-- Enhanced Hero Section -->
      <div class="text-center mb-20">
        <div class="flex justify-center mb-12">
          <div class="relative group">
            <div class="w-32 h-32 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 group-hover:rotate-0 transition-all duration-700 hover:scale-110">
              <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <div class="absolute -top-3 -right-3 w-10 h-10 bg-emerald-500 rounded-full opacity-80 animate-bounce"></div>
            <div class="absolute -bottom-2 -left-2 w-8 h-8 bg-blue-600 rounded-full opacity-60 animate-bounce delay-500"></div>
          </div>
        </div>
        <h1 class="text-8xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent mb-8 tracking-tight leading-tight">
          Auth App
        </h1>
        <p class="text-2xl text-gray-900 font-medium max-w-3xl mx-auto leading-relaxed mb-4">
          Choose your role to access the appropriate dashboard with enhanced security and modern interface
        </p>
        <div class="flex items-center justify-center space-x-6 mt-8">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span class="text-gray-900 font-medium">Secure Authentication</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span class="text-gray-700 font-medium">Role-Based Access</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span class="text-gray-600 font-medium">Modern Interface</span>
          </div>
        </div>
      </div>

      <!-- Enhanced Role Selection Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
        <!-- Enhanced Client Card -->
        <div
          onclick={handleClientClick}
          class="group cursor-pointer transform transition-all duration-700 hover:scale-105 hover:-translate-y-3"
        >
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl transform rotate-1 group-hover:rotate-0 transition-transform duration-700 shadow-2xl"></div>
            <div class="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-12 shadow-2xl border border-blue-200 backdrop-blur-sm group-hover:shadow-3xl transition-all duration-500">
              <div class="flex items-center justify-between mb-8">
                <div class="flex items-center space-x-8">
                  <div class="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 group-hover:scale-110 transition-transform duration-500">
                    <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div class="text-left">
                    <h3 class="text-4xl font-bold text-white mb-3">Continue as Client</h3>
                    <p class="text-white/90 text-xl leading-relaxed">Access your personal dashboard with enhanced security features</p>
                  </div>
                </div>
                <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 group-hover:scale-125 transition-transform duration-500">
                  <svg class="w-8 h-8 text-white group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
              <div class="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                <div class="flex items-center space-x-4">
                  <div class="w-2 h-2 bg-white/60 rounded-full"></div>
                  <p class="text-white/90 text-lg font-medium">Personal workspace with secure access and modern interface</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Admin Card -->
        <div
          onclick={handleAdminClick}
          class="group cursor-pointer transform transition-all duration-700 hover:scale-105 hover:-translate-y-3"
        >
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl transform -rotate-1 group-hover:rotate-0 transition-transform duration-700 shadow-2xl"></div>
            <div class="relative bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-12 shadow-2xl border border-emerald-200 backdrop-blur-sm group-hover:shadow-3xl transition-all duration-500">
              <div class="flex items-center justify-between mb-8">
                <div class="flex items-center space-x-8">
                  <div class="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 group-hover:scale-110 transition-transform duration-500">
                    <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <div class="text-left">
                    <h3 class="text-4xl font-bold text-white mb-3">Continue as Admin</h3>
                    <p class="text-white/90 text-xl leading-relaxed">Access administrative panel with full control and management</p>
                  </div>
                </div>
                <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 group-hover:scale-125 transition-transform duration-500">
                  <svg class="w-8 h-8 text-white group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
              <div class="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                <div class="flex items-center space-x-4">
                  <div class="w-2 h-2 bg-white/60 rounded-full"></div>
                  <p class="text-white/90 text-lg font-medium">Administrative control and comprehensive user management system</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Info Section -->
      <div class="mt-24 text-center">
        <div class="bg-white/95 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-gray-200 max-w-5xl mx-auto">
          <div class="flex items-center justify-center space-x-6 mb-8">
            <div class="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
            <div class="w-4 h-4 bg-emerald-500 rounded-full animate-pulse delay-300"></div>
            <div class="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-600"></div>
          </div>
          <h2 class="text-3xl font-bold text-gray-900 mb-6">Secure Authentication System</h2>
          <p class="text-gray-700 text-xl leading-relaxed max-w-4xl mx-auto">
            Experience our modern authentication platform with role-based access control,
            enhanced security features, and intuitive user interface designed for professional environments.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Secure Access</h3>
              <p class="text-gray-600">Advanced authentication with role-based permissions</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Modern Interface</h3>
              <p class="text-gray-600">Clean, responsive design optimized for all devices</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Fast Performance</h3>
              <p class="text-gray-600">Optimized for speed and seamless user experience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
