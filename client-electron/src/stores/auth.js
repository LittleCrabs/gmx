import { defineStore } from 'pinia'
import api from '../api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    serverUrl: localStorage.getItem('serverUrl') || 'http://localhost:5050'
  }),
  
  actions: {
    setServer(url) {
      this.serverUrl = url
      localStorage.setItem('serverUrl', url)
      api.setBaseUrl(url)
    },
    
    async login(username, password) {
      const res = await api.post('/api/login', { username, password })
      this.token = res.data.token
      this.user = res.data.user
      localStorage.setItem('token', this.token)
      localStorage.setItem('user', JSON.stringify(this.user))
      api.setToken(this.token)
      return res.data
    },
    
    async register(username, password) {
      return await api.post('/api/register', { username, password })
    },
    
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      api.setToken(null)
    }
  }
})
