import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

apiClient.interceptors.request.use((config) => {
  const idToken = useAuthStore.getState().idToken
  if (idToken) {
    config.headers.Authorization = `Bearer ${idToken}`
  }
  return config
})

export default apiClient
