import { useState } from 'react'
import type { Workspace, MemberRole } from '../types'
import { useWorkspaceMembers } from '../hooks/useWorkspaceMembers'
import { useAddMember } from '../hooks/useAddMember'
import { useUpdateMemberRole } from '../hooks/useUpdateMemberRole'

const ROLE_LABELS: Record<MemberRole, string> = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  MEMBER: 'Member',
}

interface Props {
  workspace: Workspace
  isOwner: boolean
  onClose: () => void
}

export function MembersModal({ workspace, isOwner, onClose }: Props) {
  const [newUserId, setNewUserId] = useState('')
  const [newRole, setNewRole] = useState<'MEMBER' | 'ADMIN'>('MEMBER')

  const { data: members, isLoading } = useWorkspaceMembers(workspace.id)
  const addMember = useAddMember(workspace.id)
  const updateRole = useUpdateMemberRole(workspace.id)

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUserId.trim()) return
    addMember.mutate(
      { userId: newUserId.trim(), role: newRole },
      { onSuccess: () => setNewUserId('') },
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'var(--cb-overlay)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full animate-fade-in-up"
        style={{
          maxWidth: '480px',
          background: 'var(--cb-surface)',
          border: '1px solid var(--cb-border-vis)',
          borderRadius: '1rem',
          padding: '1.75rem',
          boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 className="font-syne font-bold" style={{ fontSize: '1.125rem', letterSpacing: '-0.015em', color: 'var(--cb-text)' }}>
              Members
            </h2>
            <p className="font-outfit" style={{ fontSize: '0.8125rem', color: 'var(--cb-muted)', marginTop: '0.125rem' }}>
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
              fontSize: '1.125rem', transition: 'color 0.15s ease, border-color 0.15s ease',
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
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="cb-skeleton" style={{ height: '44px', borderRadius: '0.5rem' }} />
            ))
          ) : members?.length === 0 ? (
            <p className="font-outfit" style={{ fontSize: '0.8125rem', color: 'var(--cb-muted)', textAlign: 'center', padding: '1rem 0' }}>
              No members yet.
            </p>
          ) : (
            members?.map((member) => (
              <div
                key={member.userId}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.625rem 0.75rem',
                  background: 'var(--cb-surface2)',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--cb-border-sub)',
                }}
              >
                <span className="font-outfit" style={{ fontSize: '0.8125rem', color: 'var(--cb-text)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {member.userId}
                </span>

                {/* Role control: owner can change non-owner roles */}
                {isOwner && member.role !== 'OWNER' ? (
                  <select
                    value={member.role}
                    onChange={(e) =>
                      updateRole.mutate({
                        memberUserId: member.userId,
                        data: { role: e.target.value as 'MEMBER' | 'ADMIN' },
                      })
                    }
                    className="cb-select"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', width: 'auto', minWidth: '80px', marginLeft: '0.75rem' }}
                  >
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                ) : (
                  <span
                    className="font-outfit"
                    style={{
                      fontSize: '0.6875rem', fontWeight: 500, marginLeft: '0.75rem',
                      padding: '0.1875rem 0.5rem', borderRadius: '999px',
                      background: member.role === 'OWNER'
                        ? 'color-mix(in srgb, var(--cb-accent) 14%, transparent)'
                        : member.role === 'ADMIN'
                          ? 'color-mix(in srgb, var(--cb-teal) 14%, transparent)'
                          : 'color-mix(in srgb, var(--cb-muted) 14%, transparent)',
                      color: member.role === 'OWNER'
                        ? 'var(--cb-accent)'
                        : member.role === 'ADMIN'
                          ? 'var(--cb-teal)'
                          : 'var(--cb-muted)',
                    }}
                  >
                    {ROLE_LABELS[member.role]}
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Add member form (owner or admin can add) */}
        <form
          onSubmit={handleAddMember}
          style={{
            borderTop: '1px solid var(--cb-border-sub)',
            paddingTop: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.625rem',
          }}
        >
          <p className="font-syne font-semibold" style={{ fontSize: '0.875rem', color: 'var(--cb-text)' }}>Add member</p>
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
                background: 'var(--cb-accent)',
                color: 'white', border: 'none', borderRadius: '0.5rem',
                fontSize: '0.8125rem', fontWeight: 600,
                fontFamily: "'Outfit', sans-serif",
                cursor: addMember.isPending || !newUserId.trim() ? 'not-allowed' : 'pointer',
                opacity: addMember.isPending || !newUserId.trim() ? 0.5 : 1,
                transition: 'background 0.15s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { if (!addMember.isPending) e.currentTarget.style.background = 'var(--cb-accent-bright)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--cb-accent)' }}
            >
              {addMember.isPending ? 'Adding…' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
