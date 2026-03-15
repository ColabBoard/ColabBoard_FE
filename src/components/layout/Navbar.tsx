import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Avatar } from '../ui/Avatar'
import { useAuthStore } from '../../store/authStore'
import { useProfileStore } from '../../store/profileStore'
import { useProfile } from '../../features/profile/hooks/useProfile'
import { useThemeStore } from '../../store/themeStore'
import { useToggleTheme } from '../../hooks/useToggleTheme'

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
    </svg>
  )
}

export function Navbar() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const clearProfile = useProfileStore((s) => s.clearProfile)
  const { data: profile } = useProfile()
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useToggleTheme()

  const handleLogout = () => {
    clearAuth()
    clearProfile()
    queryClient.clear()
    navigate('/login')
  }

  const displayName = profile?.full_name ?? profile?.username ?? ''

  return (
    <nav
      style={{
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        background: 'var(--cb-nav-bg)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--cb-border-sub)',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        transition: 'background 0.25s ease, border-color 0.25s ease',
      }}
    >
      {/* Logo */}
      <span
        className="font-syne"
        style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--cb-text)', letterSpacing: '-0.01em' }}
      >
        Colab<span style={{ color: 'var(--cb-accent)' }}>Board</span>
      </span>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: '1px solid var(--cb-border-sub)',
            background: 'transparent',
            color: 'var(--cb-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.15s ease, border-color 0.15s ease, background 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--cb-text)'
            e.currentTarget.style.borderColor = 'var(--cb-border-vis)'
            e.currentTarget.style.background = 'var(--cb-surface2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--cb-muted)'
            e.currentTarget.style.borderColor = 'var(--cb-border-sub)'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* User */}
        {displayName && (
          <button
            onClick={() => navigate('/profile')}
            title="View profile"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '0.125rem',
              borderRadius: '999px',
              transition: 'opacity 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.75' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
          >
            <Avatar name={displayName} avatarUrl={profile?.avatar_url} size="sm" />
          </button>
        )}

        {/* Sign out */}
        <button
          onClick={handleLogout}
          className="font-outfit"
          style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'var(--cb-dim)',
            padding: '0.375rem 0.75rem',
            border: '1px solid var(--cb-border-sub)',
            borderRadius: '0.375rem',
            background: 'transparent',
            cursor: 'pointer',
            transition: 'color 0.15s ease, border-color 0.15s ease',
            fontFamily: "'Outfit', sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--cb-text)'
            e.currentTarget.style.borderColor = 'var(--cb-border-vis)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--cb-dim)'
            e.currentTarget.style.borderColor = 'var(--cb-border-sub)'
          }}
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}
