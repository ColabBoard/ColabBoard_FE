import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { TaskCard } from './TaskCard'
import type { Task, TaskStatus } from '../types'

const columnMeta: Record<TaskStatus, { label: string; dot: string; cssKey: string }> = {
  TODO:  { label: 'To Do',       dot: 'var(--cb-amber)',  cssKey: 'todo'  },
  DOING: { label: 'In Progress', dot: 'var(--cb-accent)', cssKey: 'doing' },
  DONE:  { label: 'Done',        dot: 'var(--cb-teal)',   cssKey: 'done'  },
}

const dotGlows: Record<TaskStatus, string> = {
  TODO:  'rgba(245,158,11,0.6)',
  DOING: 'rgba(124,110,250,0.6)',
  DONE:  'rgba(45,212,191,0.6)',
}

interface Props {
  status: TaskStatus
  tasks: Task[]
  onOpenDetail: (id: string) => void
}

export function KanbanColumn({ status, tasks, onOpenDetail }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const meta = columnMeta[status]
  const key = meta.cssKey

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '300px', flexShrink: 0 }}>
      {/* Column header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <span
          style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: meta.dot, flexShrink: 0,
            boxShadow: `0 0 8px 2px ${dotGlows[status]}`,
          }}
        />
        <span
          className="font-syne font-semibold"
          style={{
            fontSize: '0.75rem',
            padding: '0.25rem 0.625rem',
            borderRadius: '999px',
            background: `color-mix(in srgb, ${meta.dot} 12%, transparent)`,
            color: meta.dot,
            letterSpacing: '0.01em',
          }}
        >
          {meta.label}
        </span>
        <span className="font-outfit" style={{ fontSize: '0.75rem', color: 'var(--cb-dim)', marginLeft: '0.125rem' }}>
          {tasks.length}
        </span>
      </div>

      {/* Drop zone — uses CSS vars for theme-aware column glows */}
      <div
        ref={setNodeRef}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          minHeight: '96px',
          borderRadius: '0.75rem',
          padding: '0.625rem',
          background: isOver ? `var(--col-${key}-over)` : `var(--col-${key}-bg)`,
          border: `1px solid ${isOver ? `var(--col-${key}-over-b)` : `var(--col-${key}-border)`}`,
          transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
          boxShadow: isOver ? `0 0 24px color-mix(in srgb, ${meta.dot} 15%, transparent)` : 'none',
        }}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onOpenDetail={onOpenDetail} />
          ))}
        </SortableContext>

        {tasks.length === 0 && !isOver && (
          <div
            className="font-outfit"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: '60px', fontSize: '0.75rem',
              color: 'var(--cb-dim)', opacity: 0.5, userSelect: 'none',
            }}
          >
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  )
}
