import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import { getUidFromToken } from './jwt'

// Singleton promise — prevents concurrent refresh calls from all firing at once
let refreshPromise: Promise<string> | null = null

export async function refreshAuth(): Promise<string> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    const { refreshToken, email } = useAuthStore.getState()
    if (!refreshToken) throw new Error('No refresh token available')

    const res = await axios.post<{ idToken: string; refreshToken: string }>(
      `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
      { refreshToken }
    )

    const { idToken, refreshToken: newRefreshToken } = res.data
    const uid = getUidFromToken(idToken)
    useAuthStore.getState().setAuth(idToken, uid, email ?? '', newRefreshToken)
    return idToken
  })()

  try {
    return await refreshPromise
  } finally {
    refreshPromise = null
  }
}
