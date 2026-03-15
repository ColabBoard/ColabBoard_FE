import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useBoardTasks } from '../hooks/useBoardTasks'
import { useSSE } from '../hooks/useSSE'
import { usePresence } from '../hooks/usePresence'
import { KanbanBoard } from './KanbanBoard'
import { SSEStatusIndicator } from './SSEStatusIndicator'
import { PresenceBar } from './PresenceBar'
import { TaskDetailPanel } from '../../tasks/components/TaskDetailPanel'
import { useAuthStore } from '../../../store/authStore'

function BoardSkeleton() {
  return (
    <div style={{ display: 'flex', gap: '1.25rem' }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="cb-skeleton" style={{ height: '28px', width: '110px', borderRadius: '999px', marginBottom: '0.75rem' }} />
          {Array.from({ length: 3 - i }).map((_, j) => (
            <div key={j} className="cb-skeleton" style={{ height: '80px', borderRadius: '0.625rem' }} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function BoardPage() {
  const { id: workspaceId = '' } = useParams()
  const navigate = useNavigate()
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const uid = useAuthStore((s) => s.uid)
  const { data: tasks, isLoading, isError } = useBoardTasks(workspaceId)
  const { presentUserIds, handleConnected, handleJoined, handleLeft } = usePresence(workspaceId)
  const { status: sseStatus } = useSSE(workspaceId, {
    onConnected:      handleConnected,
    onPresenceJoined: handleJoined,
    onPresenceLeft:   handleLeft,
  })

  return (
    <div style={{ padding: '1.75rem 1.5rem' }} className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <button
          onClick={() => navigate('/workspaces')}
          className="font-outfit"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.375rem',
            fontSize: '0.8125rem', color: 'var(--cb-dim)',
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: '0.25rem 0', fontFamily: "'Outfit', sans-serif",
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cb-muted)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--cb-dim)')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8.5 2.5L4 7l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Workspaces
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <PresenceBar userIds={presentUserIds} currentUserId={uid} />
          <SSEStatusIndicator status={sseStatus} />
        </div>
      </div>

      {isLoading && <BoardSkeleton />}

      {isError && (
        <div
          className="font-outfit"
          style={{
            padding: '1rem 1.25rem',
            background: 'color-mix(in srgb, var(--cb-rose) 10%, transparent)',
            border: '1px solid color-mix(in srgb, var(--cb-rose) 25%, transparent)',
            borderRadius: '0.625rem',
            color: 'var(--cb-rose)',
            fontSize: '0.875rem',
          }}
        >
          Failed to load tasks. Please try refreshing.
        </div>
      )}

      {tasks && (
        <KanbanBoard workspaceId={workspaceId} tasks={tasks} onOpenDetail={setSelectedTaskId} />
      )}

      <TaskDetailPanel taskId={selectedTaskId} workspaceId={workspaceId} onClose={() => setSelectedTaskId(null)} />
    </div>
  )
}
