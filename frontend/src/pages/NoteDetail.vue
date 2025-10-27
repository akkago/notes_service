<template>
  <div>
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Loading note...</p>
    </div>

    <div v-else-if="error" class="card bg-red-50 border-red-200">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <div v-else-if="note" class="max-w-4xl mx-auto">
      <div class="card">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ note.title }}</h1>
            <div class="flex items-center gap-4 text-sm text-gray-600">
              <span v-if="note.category" class="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {{ note.category }}
              </span>
              <span>Created: {{ formatDate(note.createdAt) }}</span>
              <span>Updated: {{ formatDate(note.updatedAt) }}</span>
            </div>
          </div>
          <div class="flex gap-2">
            <router-link :to="`/notes/${note.id}/edit`" class="btn-primary">
              Edit
            </router-link>
            <button @click="deleteNote" class="btn-danger">
              Delete
            </button>
          </div>
        </div>
        
        <div class="prose max-w-none">
          <div class="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {{ note.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { notesApi } from '../api/notes'
import { useNotificationStore } from '../stores/notification'
import type { Note } from '../stores/notes'

const route = useRoute()
const router = useRouter()
const notificationStore = useNotificationStore()

const note = ref<Note | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  const noteId = parseInt(route.params.id as string)
  await loadNote(noteId)
})

const loadNote = async (id: number) => {
  loading.value = true
  error.value = null
  try {
    note.value = await notesApi.getNote(id)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load note'
  } finally {
    loading.value = false
  }
}

const deleteNote = async () => {
  if (!note.value) return
  
  if (confirm('Are you sure you want to delete this note?')) {
    try {
      await notesApi.deleteNote(note.value.id)
      notificationStore.showNotification('Note deleted successfully', 'success')
      router.push('/')
    } catch (err) {
      notificationStore.showNotification('Failed to delete note', 'error')
    }
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
