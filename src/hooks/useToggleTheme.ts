import { useThemeStore } from '../store/themeStore'
import { useAuthStore } from '../store/authStore'
import { useUpdatePreferences } from '../features/profile/hooks/useUpdatePreferences'

export function useToggleTheme() {
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const theme = useThemeStore((s) => s.theme)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const updatePreferences = useUpdatePreferences()

  return () => {
    toggleTheme()
    if (isAuthenticated) {
      const next = theme === 'dark' ? 'light' : 'dark'
      updatePreferences.mutate({ theme: next })
    }
  }
}
