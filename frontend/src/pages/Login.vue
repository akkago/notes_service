<template>
  <div class="max-w-md mx-auto">
    <div class="card">
      <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">Login</h1>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="input-field"
            placeholder="Enter your email..."
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password *
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="input-field"
            placeholder="Enter your password..."
          />
        </div>
        
        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ authStore.loading ? 'Logging in...' : 'Login' }}
        </button>
        
        <div class="text-center">
          <p class="text-gray-600">
            Don't have an account?
            <router-link to="/register" class="text-blue-600 hover:text-blue-700 font-medium">
              Register here
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useNotificationStore } from '../stores/notification'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const form = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  if (!form.value.email.trim() || !form.value.password.trim()) {
    notificationStore.showNotification('Please fill in all fields', 'error')
    return
  }

  try {
    await authStore.login(form.value.email, form.value.password)
    notificationStore.showNotification('Login successful!', 'success')
    router.push('/')
  } catch (err) {
    notificationStore.showNotification(
      err instanceof Error ? err.message : 'Login failed',
      'error'
    )
  }
}
</script>
