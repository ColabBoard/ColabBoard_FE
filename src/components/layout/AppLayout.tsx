import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { useProfile } from '../../features/profile/hooks/useProfile'
import { useProfileStore } from '../../store/profileStore'
import { useAuthStore } from '../../store/authStore'

export function AppLayout() {
  const location = useLocation()
  const setProfile = useProfileStore((s) => s.setProfile)
  const uid = useAuthStore((s) => s.uid)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const { data: profile, isLoading } = useProfile()

  useEffect(() => {
    if (profile) setProfile(profile)
  }, [profile, setProfile])

  useEffect(() => {
    if (!uid) clearAuth()
  }, [uid, clearAuth])

  if (!uid) return <Navigate to="/login" replace />

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cb-bg)' }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '2px solid var(--cb-border-vis)',
            borderTopColor: 'var(--cb-accent)',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (profile === null && location.pathname !== '/profile/setup') {
    return <Navigate to="/profile/setup" replace />
  }

  if (profile === null) {
    return <Outlet />
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--cb-bg)' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  )
}
