import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegister } from '../hooks/useRegister'
import { useThemeStore } from '../../../store/themeStore'

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

export function RegisterPage() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const register = useRegister()
  const { theme, toggleTheme } = useThemeStore()
  const isDark = theme === 'dark'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    register.mutate(
      { email, password, displayName },
      { onSuccess: () => navigate('/workspaces') }
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--cb-bg)' }}>
      {/* Left brand panel */}
      <div
        className="hidden lg:flex lg:w-[55%] flex-col justify-between p-10 relative overflow-hidden"
        style={{
          background: isDark
            ? `radial-gradient(ellipse 70% 60% at 30% 40%, rgba(45,212,191,0.14) 0%, transparent 65%),
               radial-gradient(ellipse 50% 50% at 75% 65%, rgba(124,110,250,0.12) 0%, transparent 55%),
               #080C14`
            : `radial-gradient(ellipse 70% 60% at 30% 40%, rgba(13,148,136,0.1) 0%, transparent 65%),
               radial-gradient(ellipse 50% 50% at 75% 65%, rgba(91,76,240,0.09) 0%, transparent 55%),
               #EDF0F8`,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'} 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative z-10">
          <span className="font-syne font-bold" style={{ fontSize: '1.125rem', color: 'var(--cb-text)' }}>
            Colab<span style={{ color: 'var(--cb-accent)' }}>Board</span>
          </span>
        </div>
        <div className="relative z-10 space-y-5">
          <p
            className="font-syne font-bold leading-tight"
            style={{ fontSize: '2.75rem', letterSpacing: '-0.03em', color: 'var(--cb-text)' }}
          >
            Your team's<br />
            <span style={{ color: 'var(--cb-teal)' }}>new home.</span>
          </p>
          <p className="font-outfit" style={{ fontSize: '0.9375rem', lineHeight: 1.65, maxWidth: '26ch', color: 'var(--cb-muted)' }}>
            Invite your team, organize tasks on visual boards, and ship faster — together.
          </p>
        </div>
        <div className="relative z-10 flex flex-wrap gap-2">
          {['Free to start', 'No credit card', 'Unlimited boards', 'Real-time updates'].map((f) => (
            <span
              key={f}
              className="font-outfit text-xs font-medium"
              style={{
                padding: '0.3125rem 0.75rem',
                borderRadius: '999px',
                background: 'var(--cb-surface2)',
                border: '1px solid var(--cb-border-sub)',
                color: 'var(--cb-muted)',
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: 'var(--cb-surface)',
          borderLeft: '1px solid var(--cb-border-sub)',
          transition: 'background 0.25s ease',
          position: 'relative',
        }}
      >
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            width: '32px', height: '32px', borderRadius: '8px',
            border: '1px solid var(--cb-border-sub)',
            background: 'transparent', color: 'var(--cb-muted)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
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

        <div className="w-full animate-fade-in-up" style={{ maxWidth: '380px' }}>
          <div className="lg:hidden mb-8">
            <span className="font-syne font-bold" style={{ fontSize: '1.25rem', color: 'var(--cb-text)' }}>
              Colab<span style={{ color: 'var(--cb-accent)' }}>Board</span>
            </span>
          </div>
          <div className="mb-8">
            <h1 className="font-syne font-bold" style={{ fontSize: '1.75rem', letterSpacing: '-0.025em', color: 'var(--cb-text)', marginBottom: '0.375rem' }}>
              Create account
            </h1>
            <p className="font-outfit" style={{ fontSize: '0.875rem', color: 'var(--cb-muted)' }}>
              Get started in seconds
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="cb-label">Display name</label>
              <input type="text" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="cb-input" placeholder="Jane Doe" />
            </div>
            <div>
              <label className="cb-label">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="cb-input" placeholder="you@example.com" />
            </div>
            <div>
              <label className="cb-label">Password</label>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="cb-input" placeholder="••••••••" />
            </div>
            <div style={{ paddingTop: '0.25rem' }}>
              <button type="submit" disabled={register.isPending} className="cb-btn-primary">
                {register.isPending ? 'Creating account…' : 'Create account'}
              </button>
            </div>
          </form>
          <p className="font-outfit text-center mt-6" style={{ fontSize: '0.8125rem', color: 'var(--cb-dim)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--cb-accent)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
