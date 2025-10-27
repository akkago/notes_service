<template>
  <div class="max-w-4xl mx-auto">
    <div class="card">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">
        {{ isEditing ? 'Edit Note' : 'Create New Note' }}
      </h1>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            class="input-field"
            placeholder="Enter note title..."
          />
        </div>
        
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <input
            id="category"
            v-model="form.category"
            type="text"
            class="input-field"
            placeholder="Enter category (optional)..."
          />
        </div>
        
        <div>
          <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            id="content"
            v-model="form.content"
            required
            rows="10"
            class="input-field resize-vertical"
            placeholder="Enter note content..."
          ></textarea>
        </div>
        
        <div class="flex gap-4">
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Saving...' : (isEditing ? 'Update Note' : 'Create Note') }}
          </button>
          
          <router-link to="/" class="btn-secondary">
            Cancel
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotesStore } from '../stores/notes'
import { useNotificationStore } from '../stores/notification'
import { notesApi } from '../api/notes'

const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()
const notificationStore = useNotificationStore()

const isEditing = ref(false)
const loading = ref(false)

const form = ref({
  title: '',
  content: '',
  category: ''
})

onMounted(async () => {
  const noteId = route.params.id as string
  
  if (noteId && noteId !== 'new') {
    isEditing.value = true
    await loadNote(parseInt(noteId))
  }
})

const loadNote = async (id: number) => {
  loading.value = true
  try {
    const note = await notesApi.getNote(id)
    form.value = {
      title: note.title,
      content: note.content,
      category: note.category || ''
    }
  } catch (err) {
    notificationStore.showNotification('Failed to load note', 'error')
    router.push('/')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!form.value.title.trim() || !form.value.content.trim()) {
    notificationStore.showNotification('Please fill in all required fields', 'error')
    return
  }

  loading.value = true
  try {
    if (isEditing.value) {
      const noteId = parseInt(route.params.id as string)
      await notesStore.updateNote(noteId, form.value)
      notificationStore.showNotification('Note updated successfully', 'success')
    } else {
      await notesStore.createNote(form.value)
      notificationStore.showNotification('Note created successfully', 'success')
    }
    router.push('/')
  } catch (err) {
    notificationStore.showNotification(
      isEditing.value ? 'Failed to update note' : 'Failed to create note',
      'error'
    )
  } finally {
    loading.value = false
  }
}
</script>
