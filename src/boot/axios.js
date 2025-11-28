import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

// Use '/api' so dev server proxy forwards requests to backend during development

const api = axios.create({ baseURL: 'http://localhost:5083/api' })

// Attach token from localStorage to every request (simple approach)
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch {
    // ignore
  }
  return config
})

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
