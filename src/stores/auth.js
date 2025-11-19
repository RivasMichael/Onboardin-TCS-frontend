import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    refreshToken: null,
    expiresAt: null,
    usuario: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.usuario?.rol?.toLowerCase() === 'admin',
  },

  actions: {
    setAuth(payload) {
      this.token = payload.token
      this.refreshToken = payload.refreshToken
      this.expiresAt = payload.expiresAt
      this.usuario = payload.usuario

      // persist to localStorage
      try {
        localStorage.setItem('auth_token', payload.token)
        localStorage.setItem('auth_refresh', payload.refreshToken || '')
        localStorage.setItem('auth_expires', payload.expiresAt || '')
        localStorage.setItem('auth_user', JSON.stringify(payload.usuario || {}))
      } catch {
        // ignore
      }

      if (payload.token) {
        api.defaults.headers.common.Authorization = `Bearer ${payload.token}`
      }
    },

    clearAuth() {
      this.token = null
      this.refreshToken = null
      this.expiresAt = null
      this.usuario = null
      try {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_refresh')
        localStorage.removeItem('auth_expires')
        localStorage.removeItem('auth_user')
      } catch {
        // Ignore storage errors
      }
      delete api.defaults.headers.common.Authorization
    },

    async login(credentials) {
      // credentials: { correo, contrasena }
      const payload = { correo: credentials.correo, contrasena: credentials.contrasena }
      const resp = await api.post('/auth/signin', payload)
      if (resp && resp.data && resp.data.token) {
        this.setAuth(resp.data)
        return resp.data
      }
      throw new Error('Respuesta inesperada del servidor')
    },

    loadFromStorage() {
      try {
        const token = localStorage.getItem('auth_token')
        const userRaw = localStorage.getItem('auth_user')
        if (token) {
          this.token = token
          this.usuario = userRaw ? JSON.parse(userRaw) : null
          api.defaults.headers.common.Authorization = `Bearer ${token}`
        }
      } catch {
        // ignore
      }
    },
  },
})

export default useAuthStore
