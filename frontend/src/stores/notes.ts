import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { notesApi } from '../api/notes'

export interface Note {
  id: number
  title: string
  content: string
  category?: string
  createdAt: string
  updatedAt: string
}

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getNotes = async () => {
    loading.value = true
    error.value = null
    try {
      notes.value = await notesApi.getNotes()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch notes'
    } finally {
      loading.value = false
    }
  }

  const createNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true
    error.value = null
    try {
      const newNote = await notesApi.createNote(noteData)
      notes.value.unshift(newNote)
      return newNote
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create note'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateNote = async (id: number, noteData: Partial<Note>) => {
    loading.value = true
    error.value = null
    try {
      const updatedNote = await notesApi.updateNote(id, noteData)
      const index = notes.value.findIndex(note => note.id === id)
      if (index !== -1) {
        notes.value[index] = updatedNote
      }
      return updatedNote
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update note'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteNote = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await notesApi.deleteNote(id)
      notes.value = notes.value.filter(note => note.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete note'
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchNotes = async (query: string) => {
    loading.value = true
    error.value = null
    try {
      notes.value = await notesApi.searchNotes(query)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to search notes'
    } finally {
      loading.value = false
    }
  }

  const getNoteById = computed(() => {
    return (id: number) => notes.value.find(note => note.id === id)
  })

  return {
    notes,
    loading,
    error,
    getNotes,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    getNoteById
  }
})
