import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useLogin'
import { useThemeStore } from '../../../store/themeStore'

function BrandPanel() {
  const theme = useThemeStore((s) => s.theme)
  const isDark = theme === 'dark'

  return (
    <div
      className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden h-full"
      style={{
        background: isDark
          ? `radial-gradient(ellipse 70% 60% at 20% 50%, rgba(124,110,250,0.18) 0%, transparent 65%),
             radial-gradient(ellipse 50% 50% at 80% 30%, rgba(45,212,191,0.10) 0%, transparent 55%),
             radial-gradient(ellipse 40% 40% at 60% 80%, rgba(242,95,126,0.07) 0%, transparent 50%),
             #080C14`
          : `radial-gradient(ellipse 70% 60% at 20% 50%, rgba(91,76,240,0.12) 0%, transparent 65%),
             radial-gradient(ellipse 50% 50% at 80% 30%, rgba(13,148,136,0.08) 0%, transparent 55%),
             #EDF0F8`,
      }}
    >
      {/* Dot grid */}
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
          Where teams<br />
          <span style={{ color: 'var(--cb-accent)' }}>build</span> together.
        </p>
        <p className="font-outfit" style={{ fontSize: '0.9375rem', lineHeight: 1.65, maxWidth: '26ch', color: 'var(--cb-muted)' }}>
          Visual workspaces, real-time collaboration, and effortless task management — all in one place.
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap gap-2">
        {['Kanban boards', 'Real-time sync', 'Task history', 'Team workspaces'].map((f) => (
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
  )
}

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const login = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login.mutate({ email, password })
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--cb-bg)' }}>
      <div className="lg:w-[55%] h-full">
        <BrandPanel />
      </div>

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
        }}
      >
        <div className="w-full animate-fade-in-up" style={{ maxWidth: '380px' }}>
          <div className="lg:hidden mb-8">
            <span className="font-syne font-bold" style={{ fontSize: '1.25rem', color: 'var(--cb-text)' }}>
              Colab<span style={{ color: 'var(--cb-accent)' }}>Board</span>
            </span>
          </div>

          <div className="mb-8">
            <h1
              className="font-syne font-bold"
              style={{ fontSize: '1.75rem', letterSpacing: '-0.025em', color: 'var(--cb-text)', marginBottom: '0.375rem' }}
            >
              Welcome back
            </h1>
            <p className="font-outfit" style={{ fontSize: '0.875rem', color: 'var(--cb-muted)' }}>
              Sign in to your workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="cb-label">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="cb-input" placeholder="you@example.com" />
            </div>
            <div>
              <label className="cb-label">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="cb-input" placeholder="••••••••" />
            </div>
            <div style={{ paddingTop: '0.25rem' }}>
              <button type="submit" disabled={login.isPending} className="cb-btn-primary">
                {login.isPending ? 'Signing in…' : 'Sign in'}
              </button>
            </div>
          </form>

          <p className="font-outfit text-center mt-6" style={{ fontSize: '0.8125rem', color: 'var(--cb-dim)' }}>
            No account?{' '}
            <Link to="/register" style={{ color: 'var(--cb-accent)' }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
