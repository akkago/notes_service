<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="text-xl font-bold text-gray-900">
              📝 Notes Service
            </router-link>
          </div>
          <div class="flex items-center space-x-4">
            <router-link 
              to="/notes/new" 
              class="btn-primary"
            >
              + New Note
            </router-link>
            <div v-if="!authStore.isAuthenticated" class="flex space-x-2">
              <router-link to="/login" class="btn-secondary">
                Login
              </router-link>
              <router-link to="/register" class="btn-primary">
                Register
              </router-link>
            </div>
            <div v-else class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">
                Welcome, {{ authStore.user?.username }}
              </span>
              <button @click="authStore.logout" class="btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <router-view />
    </main>

    <!-- Toast notifications -->
    <div v-if="notificationStore.message" class="fixed top-4 right-4 z-50">
      <div 
        :class="[
          'px-6 py-3 rounded-lg shadow-lg text-white font-medium',
          notificationStore.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        ]"
      >
        {{ notificationStore.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useNotificationStore } from './stores/notification'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()

onMounted(() => {
  // Check if user is already logged in
  authStore.checkAuth()
})
</script>
