import { useState } from 'react'
import { useWorkspaces } from '../hooks/useWorkspaces'
import { WorkspaceCard } from './WorkspaceCard'
import { WorkspaceCardSkeleton } from './WorkspaceCardSkeleton'
import { CreateWorkspaceModal } from './CreateWorkspaceModal'

export function WorkspacesPage() {
  const [showModal, setShowModal] = useState(false)
  const { data: workspaces, isLoading } = useWorkspaces()

  return (
    <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div
        className="animate-fade-in-up"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}
      >
        <div>
          <h1 className="font-syne font-bold" style={{ fontSize: '1.5rem', letterSpacing: '-0.02em', color: 'var(--cb-text)' }}>
            Workspaces
          </h1>
          <p className="font-outfit" style={{ fontSize: '0.8125rem', color: 'var(--cb-muted)', marginTop: '0.25rem' }}>
            {isLoading ? '' : `${workspaces?.length ?? 0} workspace${(workspaces?.length ?? 0) !== 1 ? 's' : ''}`}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="font-outfit font-medium"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.5625rem 1.125rem',
            background: 'var(--cb-accent)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.8125rem',
            cursor: 'pointer',
            transition: 'background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease',
            fontFamily: "'Outfit', sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--cb-accent-bright)'
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 6px 20px color-mix(in srgb, var(--cb-accent) 35%, transparent)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--cb-accent)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <span style={{ fontSize: '1rem', lineHeight: 1 }}>+</span>
          New Workspace
        </button>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                <WorkspaceCardSkeleton />
              </div>
            ))
          : workspaces?.map((ws, i) => (
              <div key={ws.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                <WorkspaceCard workspace={ws} />
              </div>
            ))}
      </div>

      {/* Empty state */}
      {!isLoading && workspaces?.length === 0 && (
        <div
          className="animate-fade-in"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '5rem', gap: '1rem' }}
        >
          <div
            style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: 'color-mix(in srgb, var(--cb-accent) 12%, transparent)',
              border: '1px solid color-mix(in srgb, var(--cb-accent) 25%, transparent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--cb-accent)" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p className="font-syne font-semibold" style={{ fontSize: '0.9375rem', color: 'var(--cb-text)' }}>No workspaces yet</p>
            <p className="font-outfit" style={{ fontSize: '0.8125rem', color: 'var(--cb-muted)', marginTop: '0.25rem' }}>
              Create your first workspace to get started
            </p>
          </div>
          <button onClick={() => setShowModal(true)} className="cb-btn-ghost" style={{ width: 'auto', marginTop: '0.5rem' }}>
            Create workspace
          </button>
        </div>
      )}

      {showModal && <CreateWorkspaceModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
