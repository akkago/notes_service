<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">My Notes</h1>
      
      <!-- Search bar -->
      <div class="flex gap-4 mb-6">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search notes..."
            class="input-field"
          />
        </div>
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="btn-secondary"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="notesStore.loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Loading notes...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="notesStore.error" class="card bg-red-50 border-red-200">
      <p class="text-red-600">{{ notesStore.error }}</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="notesStore.notes.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">📝</div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No notes yet</h3>
      <p class="text-gray-600 mb-6">Create your first note to get started!</p>
      <router-link to="/notes/new" class="btn-primary">
        Create Note
      </router-link>
    </div>

    <!-- Notes grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="note in notesStore.notes"
        :key="note.id"
        class="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        @click="viewNote(note.id)"
      >
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">
            {{ note.title }}
          </h3>
          <div class="flex gap-2">
            <button
              @click.stop="editNote(note.id)"
              class="text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit note"
            >
              ✏️
            </button>
            <button
              @click.stop="deleteNote(note.id)"
              class="text-gray-400 hover:text-red-600 transition-colors"
              title="Delete note"
            >
              🗑️
            </button>
          </div>
        </div>
        
        <p class="text-gray-600 text-sm line-clamp-3 mb-4">
          {{ note.content }}
        </p>
        
        <div class="flex justify-between items-center text-xs text-gray-500">
          <span v-if="note.category" class="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {{ note.category }}
          </span>
          <span>{{ formatDate(note.updatedAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotesStore } from '../stores/notes'
import { useNotificationStore } from '../stores/notification'

const router = useRouter()
const notesStore = useNotesStore()
const notificationStore = useNotificationStore()

const searchQuery = ref('')

onMounted(async () => {
  await notesStore.getNotes()
})

const handleSearch = async () => {
  if (searchQuery.value.trim()) {
    await notesStore.searchNotes(searchQuery.value)
  } else {
    await notesStore.getNotes()
  }
}

const clearSearch = async () => {
  searchQuery.value = ''
  await notesStore.getNotes()
}

const viewNote = (id: number) => {
  router.push(`/notes/${id}`)
}

const editNote = (id: number) => {
  router.push(`/notes/${id}/edit`)
}

const deleteNote = async (id: number) => {
  if (confirm('Are you sure you want to delete this note?')) {
    try {
      await notesStore.deleteNote(id)
      notificationStore.showNotification('Note deleted successfully', 'success')
    } catch (error) {
      notificationStore.showNotification('Failed to delete note', 'error')
    }
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
