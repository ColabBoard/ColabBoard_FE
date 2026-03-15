import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  idToken: string | null
  refreshToken: string | null
  uid: string | null
  email: string | null
  isAuthenticated: boolean
  setAuth: (idToken: string, uid: string, email: string, refreshToken?: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      idToken: null,
      refreshToken: null,
      uid: null,
      email: null,
      isAuthenticated: false,
      setAuth: (idToken, uid, email, refreshToken) =>
        set((prev) => ({
          idToken,
          uid,
          email,
          isAuthenticated: true,
          refreshToken: refreshToken ?? prev.refreshToken,
        })),
      clearAuth: () =>
        set({ idToken: null, refreshToken: null, uid: null, email: null, isAuthenticated: false }),
    }),
    {
      name: 'colabboard-auth',
    }
  )
)
