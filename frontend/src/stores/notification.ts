import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const message = ref<string | null>(null)
  const type = ref<'success' | 'error'>('success')

  const showNotification = (msg: string, notificationType: 'success' | 'error' = 'success') => {
    message.value = msg
    type.value = notificationType
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      message.value = null
    }, 3000)
  }

  const hideNotification = () => {
    message.value = null
  }

  return {
    message,
    type,
    showNotification,
    hideNotification
  }
})
