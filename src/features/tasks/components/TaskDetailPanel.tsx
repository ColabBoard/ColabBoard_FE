import { useState } from 'react'
import { useTaskDetail } from '../hooks/useTaskDetail'
import { useUndoTask } from '../hooks/useUndoTask'
import { useDeleteTask } from '../hooks/useDeleteTask'
import { TaskEditForm } from './TaskEditForm'
import { TaskHistoryTab } from './TaskHistoryTab'
import { ConfirmModal } from '../../../components/ui/ConfirmModal'

type Tab = 'details' | 'history'

interface Props {
  taskId: string | null
  workspaceId: string
  onClose: () => void
}

export function TaskDetailPanel({ taskId, workspaceId, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('details')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { data: task, isLoading } = useTaskDetail(taskId)
  const undoTask   = useUndoTask(taskId ?? '', workspaceId)
  const deleteTask = useDeleteTask(workspaceId)

  return (
    <>
      {taskId && (
        <div
          className="fixed inset-x-0 bottom-0 z-30 animate-fade-in"
          style={{ top: '56px', background: 'var(--cb-overlay)', backdropFilter: 'blur(2px)' }}
          onClick={onClose}
        />
      )}

      <div
        className="fixed right-0 z-40 flex flex-col"
        style={{
          top: '56px',
          bottom: 0,
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
              <>
                <button
                  onClick={() => undoTask.mutate()}
                  disabled={undoTask.isPending}
                  className="cb-btn-ghost"
                  style={{ padding: '0.3125rem 0.625rem', fontSize: '0.75rem' }}
                >
                  ↩ Undo
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={deleteTask.isPending}
                  title="Delete task"
                  style={{
                    width: '28px', height: '28px', borderRadius: '6px',
                    border: '1px solid var(--cb-border-sub)',
                    background: 'transparent', color: 'var(--cb-dim)',
                    cursor: deleteTask.isPending ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'color 0.15s ease, border-color 0.15s ease',
                    opacity: deleteTask.isPending ? 0.5 : 1,
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
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              </>
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
          {task && tab === 'details' && <TaskEditForm task={task} workspaceId={workspaceId} onSaved={onClose} />}
          {task && tab === 'history' && <TaskHistoryTab taskId={task.id} />}
        </div>
      </div>
      {showDeleteConfirm && taskId && (
        <ConfirmModal
          title="Delete this task?"
          message="This action is permanent and cannot be undone."
          confirmLabel="Delete task"
          isPending={deleteTask.isPending}
          onConfirm={() => deleteTask.mutate(taskId, { onSuccess: () => { setShowDeleteConfirm(false); onClose() } })}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  )
}
