import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Workspace } from '../types'
import { useThemeStore } from '../../../store/themeStore'
import { useAuthStore } from '../../../store/authStore'
import { useDeleteWorkspace } from '../hooks/useDeleteWorkspace'
import { MembersPanel } from './MembersPanel'
import { ConfirmModal } from '../../../components/ui/ConfirmModal'

const ACCENTS = [
  { color: '#7C6EFA', glowDark: 'rgba(124,110,250,0.08)', glowLight: 'rgba(91,76,240,0.07)', borderDark: 'rgba(124,110,250,0.55)', borderLight: 'rgba(91,76,240,0.35)' },
  { color: '#2DD4BF', glowDark: 'rgba(45,212,191,0.07)', glowLight: 'rgba(13,148,136,0.07)', borderDark: 'rgba(45,212,191,0.55)', borderLight: 'rgba(13,148,136,0.35)' },
  { color: '#F59E0B', glowDark: 'rgba(245,158,11,0.07)', glowLight: 'rgba(180,83,9,0.08)',   borderDark: 'rgba(245,158,11,0.5)',  borderLight: 'rgba(180,83,9,0.3)' },
  { color: '#F25F7E', glowDark: 'rgba(242,95,126,0.07)', glowLight: 'rgba(225,50,94,0.07)',  borderDark: 'rgba(242,95,126,0.5)',  borderLight: 'rgba(225,50,94,0.3)' },
]

function hashAccent(id: string) {
  let h = 0
  for (const c of id) h = c.charCodeAt(0) + ((h << 5) - h)
  return ACCENTS[Math.abs(h) % ACCENTS.length]
}

export function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const [showMembers, setShowMembers] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const theme = useThemeStore((s) => s.theme)
  const uid = useAuthStore((s) => s.uid)
  const isDark = theme === 'dark'
  const accent = hashAccent(workspace.id)
  const isOwner = workspace.ownerId === uid

  const border = hovered ? (isDark ? accent.borderDark : accent.borderLight) : 'var(--cb-border-sub)'
  const glow = isDark ? accent.glowDark : accent.glowLight

  const deleteWorkspace = useDeleteWorkspace()

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteConfirm(true)
  }

  const handleMembers = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMembers(true)
  }

  return (
    <>
      <button
        onClick={() => navigate(`/workspaces/${workspace.id}`)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'block',
          width: '100%',
          textAlign: 'left',
          padding: '1.375rem',
          background: hovered ? 'var(--cb-surface2)' : 'var(--cb-surface)',
          border: `1px solid ${border}`,
          borderRadius: '0.75rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: hovered ? `0 8px 28px ${glow}` : 'none',
          transform: hovered ? 'translateY(-2px)' : 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: `linear-gradient(90deg, ${accent.color}00, ${accent.color}, ${accent.color}00)`,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {/* Name row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: accent.color, flexShrink: 0,
                opacity: hovered ? 1 : 0.55,
                boxShadow: hovered ? `0 0 6px 1px ${accent.color}80` : 'none',
                transition: 'opacity 0.2s ease, box-shadow 0.2s ease',
              }}
            />
            <h3 className="font-syne font-semibold" style={{ fontSize: '0.9375rem', letterSpacing: '-0.01em', color: 'var(--cb-text)', flex: 1 }}>
              {workspace.name}
            </h3>
            {isOwner && (
              <span
                className="font-outfit"
                style={{
                  fontSize: '0.6875rem', fontWeight: 500,
                  padding: '0.1875rem 0.5rem',
                  borderRadius: '999px',
                  background: `color-mix(in srgb, ${accent.color} 14%, transparent)`,
                  color: accent.color,
                  border: `1px solid color-mix(in srgb, ${accent.color} 30%, transparent)`,
                  flexShrink: 0,
                }}
              >
                Owner
              </span>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
              gap: '0.375rem', marginTop: '0.25rem', paddingTop: '0.625rem',
              borderTop: '1px solid var(--cb-border-sub)',
            }}
          >
            {/* Members button */}
            <button
              onClick={handleMembers}
              title="Manage members"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                padding: '0.3125rem 0.625rem',
                border: '1px solid var(--cb-border-sub)',
                borderRadius: '0.375rem',
                background: 'transparent',
                color: 'var(--cb-dim)',
                fontSize: '0.75rem',
                fontFamily: "'Outfit', sans-serif",
                cursor: 'pointer',
                transition: 'color 0.15s ease, border-color 0.15s ease',
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
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="9" cy="7" r="4" />
                <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" />
                <path d="M21 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" />
              </svg>
              Members
            </button>

            {/* Delete button (owner only) */}
            {isOwner && (
              <button
                onClick={handleDelete}
                disabled={deleteWorkspace.isPending}
                title="Delete workspace"
                style={{
                  display: 'flex', alignItems: 'center',
                  padding: '0.3125rem 0.5rem',
                  border: '1px solid var(--cb-border-sub)',
                  borderRadius: '0.375rem',
                  background: 'transparent',
                  color: 'var(--cb-dim)',
                  cursor: deleteWorkspace.isPending ? 'not-allowed' : 'pointer',
                  transition: 'color 0.15s ease, border-color 0.15s ease',
                  opacity: deleteWorkspace.isPending ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--cb-rose)'
                  e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--cb-rose) 40%, transparent)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--cb-dim)'
                  e.currentTarget.style.borderColor = 'var(--cb-border-sub)'
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </button>

      {showMembers && (
        <MembersPanel
          workspace={workspace}
          isOwner={isOwner}
          onClose={() => setShowMembers(false)}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmModal
          title={`Delete "${workspace.name}"?`}
          message="All tasks and members will be permanently removed. This action cannot be undone."
          confirmLabel="Delete workspace"
          isPending={deleteWorkspace.isPending}
          onConfirm={() => deleteWorkspace.mutate(workspace.id, { onSuccess: () => setShowDeleteConfirm(false) })}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  )
}
