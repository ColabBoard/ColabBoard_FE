import { useState } from 'react'
import { createPortal } from 'react-dom'
import type { Workspace, MemberRole } from '../types'
import { useWorkspaceMembers } from '../hooks/useWorkspaceMembers'
import { useAddMember } from '../hooks/useAddMember'
import { useUpdateMemberRole } from '../hooks/useUpdateMemberRole'
import { useMemberProfiles } from '../../profile/hooks/useProfileById'

const ROLE_COLORS: Record<MemberRole, { bg: string; color: string }> = {
  OWNER: { bg: 'color-mix(in srgb, var(--cb-accent) 14%, transparent)', color: 'var(--cb-accent)' },
  ADMIN: { bg: 'color-mix(in srgb, var(--cb-teal) 14%, transparent)',   color: 'var(--cb-teal)' },
  MEMBER:{ bg: 'color-mix(in srgb, var(--cb-muted) 14%, transparent)',  color: 'var(--cb-muted)' },
}

interface Props {
  workspace: Workspace
  isOwner: boolean
  onClose: () => void
}

export function MembersPanel({ workspace, isOwner, onClose }: Props) {
  const [newUserId, setNewUserId] = useState('')
  const [newRole, setNewRole] = useState<'MEMBER' | 'ADMIN'>('MEMBER')
  const [showHint, setShowHint] = useState(false)

  const { data: members, isLoading } = useWorkspaceMembers(workspace.id)
  const addMember  = useAddMember(workspace.id)
  const updateRole = useUpdateMemberRole(workspace.id)
  const { profileMap } = useMemberProfiles(members?.map((m) => m.userId) ?? [])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUserId.trim()) return
    addMember.mutate(
      { userId: newUserId.trim(), role: newRole },
      { onSuccess: () => setNewUserId('') },
    )
  }

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 animate-fade-in"
        style={{ background: 'var(--cb-overlay)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed inset-y-0 right-0 z-40 flex flex-col animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'var(--cb-surface)',
          borderLeft: '1px solid var(--cb-border-sub)',
          boxShadow: '-20px 0 50px rgba(0,0,0,0.12)',
          transition: 'background 0.25s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--cb-border-sub)',
            flexShrink: 0,
          }}
        >
          <div>
            <p className="font-syne font-semibold" style={{ fontSize: '0.9375rem', color: 'var(--cb-text)', letterSpacing: '-0.01em' }}>
              Members
            </p>
            <p className="font-outfit" style={{ fontSize: '0.75rem', color: 'var(--cb-muted)', marginTop: '0.125rem' }}>
              {workspace.name}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '28px', height: '28px', borderRadius: '6px',
              border: '1px solid var(--cb-border-sub)',
              background: 'transparent', color: 'var(--cb-dim)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.125rem', lineHeight: 1,
              transition: 'color 0.15s ease, border-color 0.15s ease',
              fontFamily: 'inherit',
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
            ×
          </button>
        </div>

        {/* Member list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="cb-skeleton" style={{ height: '52px', borderRadius: '0.625rem' }} />
              ))
            : members?.length === 0
              ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80px' }}>
                  <p className="font-outfit" style={{ fontSize: '0.8125rem', color: 'var(--cb-dim)' }}>No members yet.</p>
                </div>
              )
              : members?.map((member) => {
                  const roleStyle = ROLE_COLORS[member.role]
                  const profile = profileMap[member.userId]
                  const displayName = profile?.full_name ?? profile?.username ?? null
                  const initial = (displayName ?? member.userId).charAt(0).toUpperCase()
                  return (
                    <div
                      key={member.userId}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.625rem 0.875rem',
                        background: 'var(--cb-surface2)',
                        border: '1px solid var(--cb-border-sub)',
                        borderRadius: '0.625rem',
                      }}
                    >
                      {/* Avatar */}
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={displayName ?? member.userId}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--cb-border-sub)' }}
                        />
                      ) : (
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                          background: roleStyle.bg,
                          border: `1px solid color-mix(in srgb, ${roleStyle.color} 30%, transparent)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.75rem', fontWeight: 700, color: roleStyle.color,
                          fontFamily: "'Syne', sans-serif",
                        }}>
                          {initial}
                        </div>
                      )}

                      {/* Name + ID */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {displayName ? (
                          <>
                            <p className="font-outfit" style={{ fontSize: '0.8125rem', color: 'var(--cb-text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {displayName}
                            </p>
                            <p className="font-outfit" style={{ fontSize: '0.6875rem', color: 'var(--cb-dim)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {profile?.username ? `@${profile.username}` : member.userId}
                            </p>
                          </>
                        ) : (
                          <p className="font-outfit" style={{ fontSize: '0.8125rem', color: 'var(--cb-text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {member.userId}
                          </p>
                        )}
                      </div>

                      {/* Role — dropdown for owner editing non-owners, badge otherwise */}
                      {isOwner && member.role !== 'OWNER' ? (
                        <select
                          value={member.role}
                          onChange={(e) => updateRole.mutate({
                            memberUserId: member.userId,
                            data: { role: e.target.value as 'MEMBER' | 'ADMIN' },
                          })}
                          className="cb-select"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', width: 'auto', minWidth: '84px' }}
                        >
                          <option value="MEMBER">Member</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      ) : (
                        <span className="font-outfit" style={{
                          fontSize: '0.6875rem', fontWeight: 500,
                          padding: '0.1875rem 0.5625rem', borderRadius: '999px',
                          background: roleStyle.bg, color: roleStyle.color,
                          flexShrink: 0,
                        }}>
                          {member.role.charAt(0) + member.role.slice(1).toLowerCase()}
                        </span>
                      )}
                    </div>
                  )
                })
          }
        </div>

        {/* Add member */}
        <form
          onSubmit={handleAdd}
          style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid var(--cb-border-sub)',
            display: 'flex', flexDirection: 'column', gap: '0.75rem',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p className="font-syne font-semibold" style={{ fontSize: '0.875rem', color: 'var(--cb-text)', margin: 0 }}>
              Add member
            </p>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setShowHint((v) => !v)}
                title="Where do I find a User ID?"
                style={{
                  width: '22px', height: '22px', borderRadius: '50%',
                  border: `1px solid ${showHint ? 'color-mix(in srgb, var(--cb-accent) 40%, transparent)' : 'var(--cb-border-sub)'}`,
                  background: showHint ? 'color-mix(in srgb, var(--cb-accent) 8%, transparent)' : 'transparent',
                  color: showHint ? 'var(--cb-accent)' : 'var(--cb-dim)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.6875rem', fontWeight: 700,
                  fontFamily: "'Outfit', sans-serif",
                  lineHeight: 1,
                  transition: 'color 0.15s ease, border-color 0.15s ease, background 0.15s ease',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  if (!showHint) {
                    e.currentTarget.style.color = 'var(--cb-accent)'
                    e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--cb-accent) 40%, transparent)'
                    e.currentTarget.style.background = 'color-mix(in srgb, var(--cb-accent) 8%, transparent)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showHint) {
                    e.currentTarget.style.color = 'var(--cb-dim)'
                    e.currentTarget.style.borderColor = 'var(--cb-border-sub)'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                ?
              </button>
              {showHint && (
                <div
                  className="animate-fade-in"
                  style={{
                    position: 'absolute', bottom: '30px', right: 0,
                    width: '230px',
                    background: 'var(--cb-surface2)',
                    border: '1px solid var(--cb-border-vis)',
                    borderRadius: '0.625rem',
                    padding: '0.75rem 0.875rem',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    zIndex: 10,
                  }}
                >
                  <p className="font-syne font-semibold" style={{ fontSize: '0.75rem', color: 'var(--cb-text)', margin: 0, marginBottom: '0.375rem' }}>
                    Where to find a User ID?
                  </p>
                  <p className="font-outfit" style={{ fontSize: '0.6875rem', color: 'var(--cb-muted)', margin: 0, lineHeight: 1.6 }}>
                    Each user can find their own User ID on their <strong style={{ color: 'var(--cb-text)' }}>Profile page</strong> — accessible by clicking their avatar in the top-right corner of the app.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={newUserId}
              onChange={(e) => setNewUserId(e.target.value)}
              placeholder="User ID"
              className="cb-input"
              style={{ flex: 1, fontSize: '0.8125rem' }}
            />
            {isOwner && (
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as 'MEMBER' | 'ADMIN')}
                className="cb-select"
                style={{ fontSize: '0.8125rem', width: 'auto' }}
              >
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
            )}
            <button
              type="submit"
              disabled={addMember.isPending || !newUserId.trim()}
              style={{
                padding: '0 1rem',
                background: 'var(--cb-accent)', color: 'white',
                border: 'none', borderRadius: '0.5rem',
                fontSize: '0.8125rem', fontWeight: 600,
                fontFamily: "'Outfit', sans-serif",
                cursor: addMember.isPending || !newUserId.trim() ? 'not-allowed' : 'pointer',
                opacity: addMember.isPending || !newUserId.trim() ? 0.5 : 1,
                whiteSpace: 'nowrap', transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => { if (!addMember.isPending) e.currentTarget.style.background = 'var(--cb-accent-bright)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--cb-accent)' }}
            >
              {addMember.isPending ? 'Adding…' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </>,
    document.body,
  )
}
