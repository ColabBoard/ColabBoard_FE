import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import type { Workspace } from '../types'
import { useThemeStore } from '../../../store/themeStore'

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
  const theme = useThemeStore((s) => s.theme)
  const isDark = theme === 'dark'
  const accent = hashAccent(workspace.id)

  const border = hovered ? (isDark ? accent.borderDark : accent.borderLight) : 'var(--cb-border-sub)'
  const glow = isDark ? accent.glowDark : accent.glowLight

  return (
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
          <h3 className="font-syne font-semibold" style={{ fontSize: '0.9375rem', letterSpacing: '-0.01em', color: 'var(--cb-text)' }}>
            {workspace.name}
          </h3>
        </div>

        {workspace.description && (
          <p
            className="font-outfit"
            style={{
              fontSize: '0.8125rem', lineHeight: 1.55, color: 'var(--cb-muted)',
              overflow: 'hidden', display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}
          >
            {workspace.description}
          </p>
        )}

        <div
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: '0.375rem', paddingTop: '0.625rem',
            borderTop: '1px solid var(--cb-border-sub)',
          }}
        >
          <span className="font-outfit" style={{ fontSize: '0.75rem', color: 'var(--cb-dim)' }}>
            {workspace.memberCount} member{workspace.memberCount !== 1 ? 's' : ''}
          </span>
          <span className="font-outfit" style={{ fontSize: '0.75rem', color: 'var(--cb-dim)' }}>
            {formatDistanceToNow(new Date(workspace.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    </button>
  )
}
