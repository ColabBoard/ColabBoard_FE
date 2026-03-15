import { useState, useRef, useEffect } from 'react'
import { useWorkspaceMembers } from '../../features/workspaces/hooks/useWorkspaceMembers'
import { useMemberProfiles } from '../../features/profile/hooks/useProfileById'

interface Props {
  workspaceId: string
  value: string       // userId or ''
  onChange: (userId: string) => void
  disabled?: boolean
  allowUnassign?: boolean
}

function Avatar({ name, avatarUrl, size = 24 }: { name: string; avatarUrl?: string | null; size?: number }) {
  const colors = [
    { bg: 'rgba(124,110,250,0.2)', border: 'rgba(124,110,250,0.4)', text: '#8B83FC' },
    { bg: 'rgba(45,212,191,0.15)', border: 'rgba(45,212,191,0.35)', text: '#2DD4BF' },
    { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.35)', text: '#F59E0B' },
    { bg: 'rgba(242,95,126,0.15)', border: 'rgba(242,95,126,0.35)', text: '#F25F7E' },
  ]
  let h = 0
  for (const c of name) h = c.charCodeAt(0) + ((h << 5) - h)
  const color = colors[Math.abs(h) % colors.length]
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()

  if (avatarUrl) {
    return (
      <img src={avatarUrl} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
    )
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: color.bg, border: `1px solid ${color.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: `${size * 0.38}px`, fontWeight: 700, color: color.text,
      fontFamily: "'Syne', sans-serif", userSelect: 'none',
    }}>
      {initials}
    </div>
  )
}

export function MemberSelect({ workspaceId, value, onChange, disabled, allowUnassign = true }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const { data: members, isLoading } = useWorkspaceMembers(workspaceId)
  const { profileMap } = useMemberProfiles(members?.map((m) => m.userId) ?? [])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const selected = value ? members?.find((m) => m.userId === value) : null
  const selectedProfile = value ? profileMap[value] : null
  const selectedName = selectedProfile?.full_name ?? selectedProfile?.username ?? value

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled || isLoading}
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          background: 'var(--cb-surface2)',
          border: `1px solid ${open ? 'var(--cb-border-vis)' : 'var(--cb-border-sub)'}`,
          borderRadius: '0.5rem',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'border-color 0.15s ease',
          textAlign: 'left',
        }}
      >
        {selected ? (
          <>
            <Avatar name={selectedName} avatarUrl={selectedProfile?.avatar_url} size={22} />
            <span className="font-outfit" style={{ flex: 1, fontSize: '0.8125rem', color: 'var(--cb-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {selectedName}
            </span>
          </>
        ) : (
          <span className="font-outfit" style={{ flex: 1, fontSize: '0.8125rem', color: 'var(--cb-dim)' }}>
            {isLoading ? 'Loading members…' : 'Unassigned'}
          </span>
        )}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--cb-dim)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="animate-fade-in"
          style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
            background: 'var(--cb-surface)',
            border: '1px solid var(--cb-border-vis)',
            borderRadius: '0.625rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
            zIndex: 100,
            overflow: 'hidden',
            maxHeight: '220px',
            overflowY: 'auto',
          }}
        >
          {/* Unassigned option */}
          {allowUnassign && <button
            type="button"
            onClick={() => { onChange(''); setOpen(false) }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              background: !value ? 'color-mix(in srgb, var(--cb-accent) 8%, transparent)' : 'transparent',
              border: 'none', cursor: 'pointer', textAlign: 'left',
              transition: 'background 0.1s ease',
            }}
            onMouseEnter={(e) => { if (value) e.currentTarget.style.background = 'var(--cb-surface2)' }}
            onMouseLeave={(e) => { if (value) e.currentTarget.style.background = 'transparent' }}
          >
            <div style={{
              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
              border: '1px dashed var(--cb-border-vis)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--cb-dim)" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <span className="font-outfit" style={{ fontSize: '0.8125rem', color: 'var(--cb-muted)' }}>Unassigned</span>
          </button>

          }

          {/* Divider */}
          {allowUnassign && members && members.length > 0 && (
            <div style={{ height: '1px', background: 'var(--cb-border-sub)', margin: '0 0.5rem' }} />
          )}

          {/* Members */}
          {members?.map((member) => {
            const profile = profileMap[member.userId]
            const name = profile?.full_name ?? profile?.username ?? member.userId
            const isSelected = member.userId === value
            return (
              <button
                key={member.userId}
                type="button"
                onClick={() => { onChange(member.userId); setOpen(false) }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  background: isSelected ? 'color-mix(in srgb, var(--cb-accent) 8%, transparent)' : 'transparent',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  transition: 'background 0.1s ease',
                }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'var(--cb-surface2)' }}
                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
              >
                <Avatar name={name} avatarUrl={profile?.avatar_url} size={22} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="font-outfit" style={{ fontSize: '0.8125rem', color: 'var(--cb-text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {name}
                  </p>
                  {profile?.username && profile.full_name && (
                    <p className="font-outfit" style={{ fontSize: '0.6875rem', color: 'var(--cb-dim)', margin: 0 }}>
                      @{profile.username}
                    </p>
                  )}
                </div>
                {isSelected && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--cb-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
