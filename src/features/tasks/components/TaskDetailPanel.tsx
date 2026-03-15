import { useState } from 'react'
import { useTaskDetail } from '../hooks/useTaskDetail'
import { useUndoTask } from '../hooks/useUndoTask'
import { TaskEditForm } from './TaskEditForm'
import { TaskHistoryTab } from './TaskHistoryTab'

type Tab = 'details' | 'history'

interface Props {
  taskId: string | null
  workspaceId: string
  onClose: () => void
}

export function TaskDetailPanel({ taskId, workspaceId, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('details')
  const { data: task, isLoading } = useTaskDetail(taskId)
  const undoTask = useUndoTask(taskId ?? '', workspaceId)

  return (
    <>
      {taskId && (
        <div
          className="fixed inset-0 z-30 animate-fade-in"
          style={{ background: 'var(--cb-overlay)', backdropFilter: 'blur(2px)' }}
          onClick={onClose}
        />
      )}

      <div
        className="fixed inset-y-0 right-0 z-40 flex flex-col"
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'var(--cb-surface)',
          borderLeft: '1px solid var(--cb-border-sub)',
          boxShadow: '-20px 0 50px rgba(0,0,0,0.12)',
          transform: taskId ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.25s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--cb-border-sub)',
          }}
        >
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {(['details', 'history'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="font-outfit"
                style={{
                  padding: '0.375rem 0.75rem', borderRadius: '0.375rem',
                  fontSize: '0.8125rem', fontWeight: 500,
                  textTransform: 'capitalize', cursor: 'pointer', border: 'none',
                  transition: 'all 0.15s ease',
                  background: tab === t ? 'color-mix(in srgb, var(--cb-accent) 14%, transparent)' : 'transparent',
                  color: tab === t ? 'var(--cb-accent)' : 'var(--cb-dim)',
                  fontFamily: "'Outfit', sans-serif",
                }}
                onMouseEnter={(e) => { if (tab !== t) e.currentTarget.style.color = 'var(--cb-muted)' }}
                onMouseLeave={(e) => { if (tab !== t) e.currentTarget.style.color = 'var(--cb-dim)' }}
              >
                {t}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {taskId && (
              <button
                onClick={() => undoTask.mutate()}
                disabled={undoTask.isPending}
                className="cb-btn-ghost"
                style={{ padding: '0.3125rem 0.625rem', fontSize: '0.75rem' }}
              >
                ↩ Undo
              </button>
            )}
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
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {isLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="cb-skeleton" style={{ height: '18px', width: '70%' }} />
              <div className="cb-skeleton" style={{ height: '14px', width: '100%' }} />
              <div className="cb-skeleton" style={{ height: '14px', width: '60%' }} />
              <div className="cb-skeleton" style={{ height: '80px', width: '100%', marginTop: '0.5rem' }} />
            </div>
          )}
          {task && tab === 'details' && <TaskEditForm task={task} workspaceId={workspaceId} onSaved={() => {}} />}
          {task && tab === 'history' && <TaskHistoryTab taskId={task.id} />}
        </div>
      </div>
    </>
  )
}
