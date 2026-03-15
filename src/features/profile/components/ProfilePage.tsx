import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile'
import { useUpdateProfile } from '../hooks/useUpdateProfile'
import { useAuthStore } from '../../../store/authStore'

function CopyIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  )
}

const AVATAR_COLORS = [
  { bg: 'rgba(124,110,250,0.2)', border: 'rgba(124,110,250,0.4)', text: '#8B83FC' },
  { bg: 'rgba(45,212,191,0.15)', border: 'rgba(45,212,191,0.35)', text: '#2DD4BF' },
  { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.35)', text: '#F59E0B' },
  { bg: 'rgba(242,95,126,0.15)', border: 'rgba(242,95,126,0.35)', text: '#F25F7E' },
]

function hashAvatarColor(name: string) {
  let h = 0
  for (const c of name) h = c.charCodeAt(0) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

function LargeAvatar({ name }: { name: string }) {
  const color = hashAvatarColor(name)
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  return (
    <div
      style={{
        width: 72, height: 72, borderRadius: '50%',
        background: color.bg, border: `1px solid ${color.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: color.text, fontSize: '1.375rem', fontWeight: 700,
        fontFamily: "'Syne', sans-serif",
        userSelect: 'none',
      }}
    >
      {initials}
    </div>
  )
}

export function ProfilePage() {
  const navigate = useNavigate()
  const { data: profile, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()
  const uid = useAuthStore((s) => s.uid)
  const email = useAuthStore((s) => s.email)

  const [copied, setCopied] = useState(false)
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '')
      setUsername(profile.username ?? '')
      setAvatarUrl(profile.avatar_url ?? '')
    }
  }, [profile])

  const displayName = profile?.full_name ?? profile?.username ?? ''
  const userId = profile?.user_id ?? uid ?? ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(userId)
    } catch {
      const el = document.createElement('textarea')
      el.value = userId
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile.mutate(
      { full_name: fullName.trim(), username: username.trim(), avatar_url: avatarUrl.trim() || undefined },
      { onSuccess: () => setEditing(false) },
    )
  }

  const handleCancel = () => {
    setFullName(profile?.full_name ?? '')
    setUsername(profile?.username ?? '')
    setAvatarUrl(profile?.avatar_url ?? '')
    setEditing(false)
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 56px)',
        background: 'var(--cb-bg)',
        display: 'flex',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '520px' }}>
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            marginBottom: '2rem',
            padding: '0.375rem 0.75rem 0.375rem 0.5rem',
            background: 'transparent', border: '1px solid var(--cb-border-sub)',
            borderRadius: '0.5rem', color: 'var(--cb-dim)',
            fontSize: '0.8125rem', fontFamily: "'Outfit', sans-serif",
            cursor: 'pointer', transition: 'color 0.15s ease, border-color 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--cb-text)'; e.currentTarget.style.borderColor = 'var(--cb-border-vis)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--cb-dim)'; e.currentTarget.style.borderColor = 'var(--cb-border-sub)' }}
        >
          <ArrowLeftIcon />
          Back
        </button>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[120, 180, 160].map((h, i) => (
              <div key={i} className="cb-skeleton" style={{ height: `${h}px`, borderRadius: '0.75rem' }} />
            ))}
          </div>
        ) : (
          <>
            {/* Avatar + name card */}
            <div
              style={{
                background: 'var(--cb-surface)', border: '1px solid var(--cb-border-sub)',
                borderRadius: '1rem', padding: '2rem', marginBottom: '1rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
              }}
            >
              <div style={{ position: 'relative' }}>
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                ) : (
                  <LargeAvatar name={displayName || '?'} />
                )}
                <div
                  style={{
                    position: 'absolute', inset: 0, borderRadius: '50%', pointerEvents: 'none',
                    boxShadow: '0 0 0 4px var(--cb-bg), 0 0 0 6px color-mix(in srgb, var(--cb-accent) 28%, transparent)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                {profile?.full_name && (
                  <h1 className="font-syne font-bold" style={{ fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--cb-text)', margin: 0 }}>
                    {profile.full_name}
                  </h1>
                )}
                {profile?.username && (
                  <p className="font-outfit" style={{ fontSize: '0.875rem', color: 'var(--cb-muted)', margin: 0 }}>
                    @{profile.username}
                  </p>
                )}
              </div>
            </div>

            {/* User ID card */}
            <div
              style={{
                background: 'var(--cb-surface)',
                border: '1px solid color-mix(in srgb, var(--cb-accent) 25%, var(--cb-border-sub))',
                borderRadius: '1rem', padding: '1.5rem', marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                <div
                  style={{
                    width: '28px', height: '28px', borderRadius: '7px', flexShrink: 0,
                    background: 'color-mix(in srgb, var(--cb-accent) 12%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--cb-accent) 22%, transparent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--cb-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <p className="font-syne font-semibold" style={{ fontSize: '0.875rem', color: 'var(--cb-text)', margin: 0, letterSpacing: '-0.01em' }}>
                    Your User ID
                  </p>
                  <p className="font-outfit" style={{ fontSize: '0.6875rem', color: 'var(--cb-muted)', margin: 0, marginTop: '0.0625rem' }}>
                    Share this with workspace owners to get added as a member
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.625rem 0.875rem',
                  background: 'var(--cb-surface2)', border: '1px solid var(--cb-border-sub)',
                  borderRadius: '0.625rem',
                }}
              >
                <code
                  className="font-outfit"
                  style={{ flex: 1, fontSize: '0.8125rem', color: 'var(--cb-text)', wordBreak: 'break-all', lineHeight: 1.5, letterSpacing: '0.01em' }}
                >
                  {userId}
                </code>
                <button
                  onClick={handleCopy}
                  title="Copy User ID"
                  style={{
                    flexShrink: 0, width: '30px', height: '30px', borderRadius: '0.4375rem',
                    border: `1px solid ${copied ? 'color-mix(in srgb, var(--cb-teal) 35%, transparent)' : 'var(--cb-border-sub)'}`,
                    background: copied ? 'color-mix(in srgb, var(--cb-teal) 12%, transparent)' : 'transparent',
                    color: copied ? 'var(--cb-teal)' : 'var(--cb-dim)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'color 0.15s ease, border-color 0.15s ease, background 0.15s ease',
                  }}
                  onMouseEnter={(e) => { if (!copied) { e.currentTarget.style.color = 'var(--cb-accent)'; e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--cb-accent) 35%, transparent)'; e.currentTarget.style.background = 'color-mix(in srgb, var(--cb-accent) 8%, transparent)' } }}
                  onMouseLeave={(e) => { if (!copied) { e.currentTarget.style.color = 'var(--cb-dim)'; e.currentTarget.style.borderColor = 'var(--cb-border-sub)'; e.currentTarget.style.background = 'transparent' } }}
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>

              {copied && (
                <p className="font-outfit animate-fade-in" style={{ fontSize: '0.6875rem', color: 'var(--cb-teal)', marginTop: '0.5rem', marginBottom: 0, paddingLeft: '0.25rem' }}>
                  Copied to clipboard!
                </p>
              )}
            </div>

            {/* Edit profile card */}
            <div
              style={{
                background: 'var(--cb-surface)', border: '1px solid var(--cb-border-sub)',
                borderRadius: '1rem', padding: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: editing ? '1.25rem' : 0 }}>
                <p className="font-syne font-semibold" style={{ fontSize: '0.875rem', color: 'var(--cb-text)', margin: 0, letterSpacing: '-0.01em' }}>
                  Edit profile
                </p>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                      padding: '0.3125rem 0.625rem',
                      background: 'transparent', border: '1px solid var(--cb-border-sub)',
                      borderRadius: '0.375rem', color: 'var(--cb-dim)',
                      fontSize: '0.75rem', fontFamily: "'Outfit', sans-serif",
                      cursor: 'pointer', transition: 'color 0.15s ease, border-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--cb-text)'; e.currentTarget.style.borderColor = 'var(--cb-border-vis)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--cb-dim)'; e.currentTarget.style.borderColor = 'var(--cb-border-sub)' }}
                  >
                    <PencilIcon />
                    Edit
                  </button>
                )}
              </div>

              {editing && (
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  <div>
                    <label className="cb-label">Full name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="cb-input"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="cb-label">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="cb-input"
                      placeholder="4–20 characters"
                      minLength={4}
                      maxLength={20}
                    />
                  </div>
                  <div>
                    <label className="cb-label">Avatar URL</label>
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="cb-input"
                      placeholder="https://… (optional)"
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
                    <button type="button" onClick={handleCancel} className="cb-btn-ghost" disabled={updateProfile.isPending}>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateProfile.isPending || !fullName.trim() || !username.trim()}
                      style={{
                        padding: '0.5rem 1.125rem',
                        background: 'var(--cb-accent)', color: 'white',
                        border: 'none', borderRadius: '0.5rem',
                        fontSize: '0.8125rem', fontWeight: 600,
                        fontFamily: "'Outfit', sans-serif",
                        cursor: updateProfile.isPending || !fullName.trim() || !username.trim() ? 'not-allowed' : 'pointer',
                        opacity: updateProfile.isPending || !fullName.trim() || !username.trim() ? 0.5 : 1,
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => { if (!updateProfile.isPending) e.currentTarget.style.background = 'var(--cb-accent-bright)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--cb-accent)' }}
                    >
                      {updateProfile.isPending ? 'Saving…' : 'Save changes'}
                    </button>
                  </div>
                </form>
              )}

              {!editing && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '1rem' }}>
                  {email && (
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem' }}>
                      <span className="font-outfit" style={{ fontSize: '0.75rem', color: 'var(--cb-muted)', flexShrink: 0 }}>Email</span>
                      <span className="font-outfit" style={{ fontSize: '0.8125rem', color: 'var(--cb-text)', textAlign: 'right', wordBreak: 'break-all' }}>{email}</span>
                    </div>
                  )}
                  {profile?.username && (
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem' }}>
                      <span className="font-outfit" style={{ fontSize: '0.75rem', color: 'var(--cb-muted)', flexShrink: 0 }}>Username</span>
                      <span className="font-outfit" style={{ fontSize: '0.8125rem', color: 'var(--cb-text)' }}>@{profile.username}</span>
                    </div>
                  )}
                  {profile?.full_name && (
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem' }}>
                      <span className="font-outfit" style={{ fontSize: '0.75rem', color: 'var(--cb-muted)', flexShrink: 0 }}>Full name</span>
                      <span className="font-outfit" style={{ fontSize: '0.8125rem', color: 'var(--cb-text)' }}>{profile.full_name}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
