<template>
  <div class="max-w-md mx-auto">
    <div class="card">
      <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">Register</h1>
      
      <form @submit.prevent="handleRegister" class="space-y-6">
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
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            Username *
          </label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            minlength="3"
            maxlength="50"
            class="input-field"
            placeholder="Enter your username..."
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
            minlength="6"
            class="input-field"
            placeholder="Enter your password..."
          />
        </div>
        
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password *
          </label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            class="input-field"
            placeholder="Confirm your password..."
          />
        </div>
        
        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ authStore.loading ? 'Creating account...' : 'Register' }}
        </button>
        
        <div class="text-center">
          <p class="text-gray-600">
            Already have an account?
            <router-link to="/login" class="text-blue-600 hover:text-blue-700 font-medium">
              Login here
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
  username: '',
  password: '',
  confirmPassword: ''
})

const handleRegister = async () => {
  if (!form.value.email.trim() || !form.value.username.trim() || 
      !form.value.password.trim() || !form.value.confirmPassword.trim()) {
    notificationStore.showNotification('Please fill in all fields', 'error')
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    notificationStore.showNotification('Passwords do not match', 'error')
    return
  }

  if (form.value.password.length < 6) {
    notificationStore.showNotification('Password must be at least 6 characters', 'error')
    return
  }

  try {
    await authStore.register(form.value.email, form.value.username, form.value.password)
    notificationStore.showNotification('Registration successful!', 'success')
    router.push('/')
  } catch (err) {
    notificationStore.showNotification(
      err instanceof Error ? err.message : 'Registration failed',
      'error'
    )
  }
}
</script>
