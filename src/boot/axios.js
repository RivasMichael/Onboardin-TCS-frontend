import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

// Use '/api' so dev server proxy forwards requests to backend during development
const api = axios.create({ baseURL: '/api' })

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
