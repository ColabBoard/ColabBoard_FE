import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateProfile } from '../hooks/useCreateProfile'

export function ProfileSetupPage() {
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const navigate = useNavigate()
  const createProfile = useCreateProfile()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createProfile.mutate(
      { username, full_name: fullName, avatar_url: avatarUrl || undefined },
      { onSuccess: () => navigate('/workspaces') }
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'var(--cb-bg)',
      }}
    >
      <div
        className="w-full animate-fade-in-up"
        style={{
          maxWidth: '420px',
          background: 'var(--cb-surface)',
          border: '1px solid var(--cb-border-sub)',
          borderRadius: '1rem',
          padding: '2.5rem',
          boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
          transition: 'background 0.25s ease',
        }}
      >
        <div style={{ marginBottom: '0.5rem' }}>
          <span className="font-syne font-bold" style={{ fontSize: '1rem', color: 'var(--cb-text)' }}>
            Colab<span style={{ color: 'var(--cb-accent)' }}>Board</span>
          </span>
        </div>
        <div style={{ margin: '1.25rem 0 1.75rem' }}>
          <h1 className="font-syne font-bold" style={{ fontSize: '1.5rem', letterSpacing: '-0.02em', color: 'var(--cb-text)', marginBottom: '0.375rem' }}>
            Set up your profile
          </h1>
          <p className="font-outfit" style={{ fontSize: '0.875rem', color: 'var(--cb-muted)' }}>
            Just a few details to get you started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="cb-label">Full name</label>
            <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="cb-input" placeholder="Jane Doe" />
          </div>
          <div>
            <label className="cb-label">Username</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="cb-input" placeholder="janedoe" />
          </div>
          <div>
            <label className="cb-label">
              Avatar URL{' '}
              <span style={{ color: 'var(--cb-dim)', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
            </label>
            <input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="cb-input" placeholder="https://..." />
          </div>
          <div style={{ paddingTop: '0.375rem' }}>
            <button type="submit" disabled={createProfile.isPending} className="cb-btn-primary">
              {createProfile.isPending ? 'Saving…' : 'Continue →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
