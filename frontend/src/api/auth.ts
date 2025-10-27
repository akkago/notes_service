import api from './client'
import type { User } from '../stores/auth'

export interface LoginResponse {
  user: User
  token: string
}

export interface RegisterResponse {
  user: User
  token: string
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/users/login', { email, password })
    return response.data
  },

  async register(email: string, username: string, password: string): Promise<RegisterResponse> {
    const response = await api.post('/users/register', { email, username, password })
    return response.data
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/users/profile')
    return response.data
  }
}
