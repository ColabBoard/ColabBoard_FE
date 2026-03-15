import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { format } from 'date-fns'
import { Avatar } from '../../../components/ui/Avatar'
import type { Task, TaskPriority } from '../types'
import type { Profile } from '../../profile/types'

const priorityConfig: Record<TaskPriority, { cssColor: string; label: string }> = {
  LOW:    { cssColor: 'var(--cb-dim)',   label: 'Low'  },
  MEDIUM: { cssColor: 'var(--cb-amber)', label: 'Med'  },
  HIGH:   { cssColor: 'var(--cb-rose)',  label: 'High' },
}

interface Props {
  task: Task
  onOpenDetail: (id: string) => void
  profileMap?: Record<string, Profile | null>
}

export function TaskCard({ task, onOpenDetail, profileMap }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  }

  const priority = priorityConfig[task.priority]

  const assigneeUid = task.assignee?.uid
  const assigneeProfile = assigneeUid && profileMap ? profileMap[assigneeUid] : null
  const assigneeName = assigneeProfile?.full_name ?? assigneeProfile?.username ?? task.assignee?.displayName ?? ''
  const assigneeAvatar = assigneeProfile?.avatar_url ?? task.assignee?.avatarUrl

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: 'var(--cb-surface)',
        border: `1px solid ${isDragging ? 'color-mix(in srgb, var(--cb-accent) 35%, transparent)' : 'var(--cb-border-sub)'}`,
        borderRadius: '0.625rem',
        padding: '0.75rem',
        cursor: isDragging ? 'grabbing' : 'grab',
        boxShadow: isDragging ? '0 12px 32px rgba(0,0,0,0.18)' : 'none',
        userSelect: 'none',
        position: 'relative',
        overflow: 'hidden',
        transition: isDragging ? undefined : 'all 0.15s ease',
      }}
      {...attributes}
      {...listeners}
      onClick={() => onOpenDetail(task.id)}
      onMouseEnter={(e) => {
        if (!isDragging) {
          const el = e.currentTarget as HTMLElement
          el.style.borderColor = 'var(--cb-border-vis)'
          el.style.background = 'var(--cb-surface2)'
          el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
          el.style.transform = (CSS.Transform.toString(transform) ?? '') + ' translateY(-1px)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          const el = e.currentTarget as HTMLElement
          el.style.borderColor = 'var(--cb-border-sub)'
          el.style.background = 'var(--cb-surface)'
          el.style.boxShadow = 'none'
          el.style.transform = CSS.Transform.toString(transform) ?? ''
        }
      }}
    >
      {/* Priority left accent */}
      <div
        style={{
          position: 'absolute', left: 0, top: '20%', bottom: '20%', width: '2px',
          background: priority.cssColor,
          borderRadius: '0 2px 2px 0',
          opacity: task.priority === 'LOW' ? 0.35 : 0.75,
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '0.25rem' }}>
        <p className="font-outfit" style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--cb-text)', lineHeight: 1.45 }}>
          {task.title}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            className="font-outfit"
            style={{
              fontSize: '0.6875rem', fontWeight: 500,
              color: priority.cssColor,
              background: `color-mix(in srgb, ${priority.cssColor} 14%, transparent)`,
              padding: '0.125rem 0.5rem', borderRadius: '999px',
            }}
          >
            {priority.label}
          </span>
          {task.dueDate && (
            <span className="font-outfit" style={{ fontSize: '0.6875rem', color: 'var(--cb-dim)' }}>
              {format(new Date(task.dueDate), 'MMM d')}
            </span>
          )}
        </div>

        {assigneeName && assigneeName !== 'Unassigned' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '0.125rem' }}>
            <Avatar name={assigneeName} avatarUrl={assigneeAvatar} size="sm" />
            <span className="font-outfit" style={{ fontSize: '0.6875rem', color: 'var(--cb-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {assigneeName}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
