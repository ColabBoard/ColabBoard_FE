import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  idToken: string | null
  uid: string | null
  email: string | null
  isAuthenticated: boolean
  setAuth: (idToken: string, uid: string, email: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      idToken: null,
      uid: null,
      email: null,
      isAuthenticated: false,
      setAuth: (idToken, uid, email) =>
        set({ idToken, uid, email, isAuthenticated: true }),
      clearAuth: () =>
        set({ idToken: null, uid: null, email: null, isAuthenticated: false }),
    }),
    {
      name: 'colabboard-auth',
    }
  )
)
