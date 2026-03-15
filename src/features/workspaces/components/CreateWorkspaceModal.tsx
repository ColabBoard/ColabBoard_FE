import { useState } from 'react'
import { useCreateWorkspace } from '../hooks/useCreateWorkspace'

interface Props {
  onClose: () => void
}

export function CreateWorkspaceModal({ onClose }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const createWorkspace = useCreateWorkspace()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createWorkspace.mutate({ name, description }, { onSuccess: onClose })
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
          maxWidth: '440px',
          background: 'var(--cb-surface)',
          border: '1px solid var(--cb-border-vis)',
          borderRadius: '1rem',
          padding: '1.75rem',
          boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
          transition: 'background 0.25s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 className="font-syne font-bold" style={{ fontSize: '1.125rem', letterSpacing: '-0.015em', color: 'var(--cb-text)' }}>
            New workspace
          </h2>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="cb-label">Workspace name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="cb-input" placeholder="e.g. Product Design" autoFocus />
          </div>
          <div>
            <label className="cb-label">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="cb-textarea" placeholder="What is this workspace for?" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.625rem', paddingTop: '0.25rem' }}>
            <button type="button" onClick={onClose} className="cb-btn-ghost">Cancel</button>
            <button
              type="submit"
              disabled={createWorkspace.isPending}
              style={{
                padding: '0.5rem 1.25rem',
                background: 'var(--cb-accent)',
                color: 'white', border: 'none', borderRadius: '0.5rem',
                fontSize: '0.8125rem', fontWeight: 600,
                fontFamily: "'Outfit', sans-serif",
                cursor: createWorkspace.isPending ? 'not-allowed' : 'pointer',
                opacity: createWorkspace.isPending ? 0.5 : 1,
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => { if (!createWorkspace.isPending) e.currentTarget.style.background = 'var(--cb-accent-bright)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--cb-accent)' }}
            >
              {createWorkspace.isPending ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
