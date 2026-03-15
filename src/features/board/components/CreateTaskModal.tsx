import { useState } from 'react'
import { useCreateTask } from '../hooks/useCreateTask'
import { STATUS_TO_API } from '../../tasks/api/taskMapper'
import type { TaskStatus } from '../types'

interface Props {
  workspaceId: string
  initialStatus: TaskStatus
  onClose: () => void
}

const PRIORITY_OPTIONS = [
  { value: 'low',    label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high',   label: 'High' },
]

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'TODO',  label: 'To Do' },
  { value: 'DOING', label: 'In Progress' },
  { value: 'DONE',  label: 'Done' },
]

export function CreateTaskModal({ workspaceId, initialStatus, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [status, setStatus] = useState<TaskStatus>(initialStatus)
  const [dueDate, setDueDate] = useState('')

  const createTask = useCreateTask(workspaceId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createTask.mutate(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        workspace_id: workspaceId,
        status: STATUS_TO_API[status],
        priority,
        due_date: dueDate || null,
      },
      { onSuccess: onClose },
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
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 className="font-syne font-bold" style={{ fontSize: '1.125rem', letterSpacing: '-0.015em', color: 'var(--cb-text)' }}>
            New task
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="cb-label">Title *</label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="cb-input"
              placeholder="What needs to be done?"
            />
          </div>

          <div>
            <label className="cb-label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="cb-textarea"
              placeholder="Add more details…"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="cb-label">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="cb-select"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="cb-label">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="cb-select"
              >
                {PRIORITY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="cb-label">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="cb-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.625rem', paddingTop: '0.25rem' }}>
            <button type="button" onClick={onClose} className="cb-btn-ghost">Cancel</button>
            <button
              type="submit"
              disabled={createTask.isPending || !title.trim()}
              style={{
                padding: '0.5rem 1.25rem',
                background: 'var(--cb-accent)',
                color: 'white', border: 'none', borderRadius: '0.5rem',
                fontSize: '0.8125rem', fontWeight: 600,
                fontFamily: "'Outfit', sans-serif",
                cursor: createTask.isPending || !title.trim() ? 'not-allowed' : 'pointer',
                opacity: createTask.isPending || !title.trim() ? 0.5 : 1,
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => { if (!createTask.isPending) e.currentTarget.style.background = 'var(--cb-accent-bright)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--cb-accent)' }}
            >
              {createTask.isPending ? 'Creating…' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
