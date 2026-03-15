import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import { refreshAuth } from '../lib/refreshAuth'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

apiClient.interceptors.request.use((config) => {
  const { idToken, uid } = useAuthStore.getState()
  if (idToken) {
    config.headers.Authorization = `Bearer ${idToken}`
  }
  if (uid) {
    config.headers['X-User-Id'] = uid
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const newToken = await refreshAuth()
        original.headers.Authorization = `Bearer ${newToken}`
        return apiClient(original)
      } catch {
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
