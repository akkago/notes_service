import api from './client'
import type { Note } from '../stores/notes'

export const notesApi = {
  async getNotes(): Promise<Note[]> {
    const response = await api.get('/notes')
    return response.data
  },

  async getNote(id: number): Promise<Note> {
    const response = await api.get(`/notes/${id}`)
    return response.data
  },

  async createNote(noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    const response = await api.post('/notes', noteData)
    return response.data
  },

  async updateNote(id: number, noteData: Partial<Note>): Promise<Note> {
    const response = await api.patch(`/notes/${id}`, noteData)
    return response.data
  },

  async deleteNote(id: number): Promise<void> {
    await api.delete(`/notes/${id}`)
  },

  async searchNotes(query: string): Promise<Note[]> {
    const response = await api.get(`/notes/search?query=${encodeURIComponent(query)}`)
    return response.data
  }
}
