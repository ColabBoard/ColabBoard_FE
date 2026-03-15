import axios from 'axios'
import { useAuthStore } from '../store/authStore'

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

export default apiClient
