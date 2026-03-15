import { useState, useEffect } from 'react'
import { useUpdateTask } from '../hooks/useUpdateTask'
import { useUpdateTaskStatus } from '../../board/hooks/useUpdateTaskStatus'
import { useAssignTask } from '../hooks/useAssignTask'
import { MemberSelect } from '../../../components/ui/MemberSelect'
import type { Task, TaskStatus } from '../../board/types'

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

// Convert ISO datetime from API to date-only string for <input type="date">
function toDateInput(iso: string | null): string {
  if (!iso) return ''
  return iso.slice(0, 10) // 'YYYY-MM-DD'
}

interface Props {
  task: Task
  workspaceId: string
  onSaved: () => void
}

export function TaskEditForm({ task, workspaceId, onSaved }: Props) {
  const [title, setTitle]           = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [priority, setPriority]     = useState(task.priority.toLowerCase())
  const [dueDate, setDueDate]       = useState(toDateInput(task.dueDate))
  const [status, setStatus]         = useState<TaskStatus>(task.status)

  const [assigneeId, setAssigneeId] = useState(task.assignee?.uid ?? '')
  const updateTask   = useUpdateTask(task.id, workspaceId)
  const updateStatus = useUpdateTaskStatus(workspaceId)
  const assignTask   = useAssignTask(task.id, workspaceId)

  useEffect(() => {
    setTitle(task.title)
    setDescription(task.description)
    setPriority(task.priority.toLowerCase())
    setDueDate(toDateInput(task.dueDate))
    setStatus(task.status)
    setAssigneeId(task.assignee?.uid ?? '')
  }, [task.id, task.title, task.description, task.priority, task.dueDate, task.status, task.assignee?.uid])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (status !== task.status) {
      updateStatus.mutate({ taskId: task.id, status, version: task.version })
    }

    const assigneeChanged = assigneeId && assigneeId !== task.assignee?.uid

    updateTask.mutate(
      {
        title,
        description,
        priority,
        due_date: dueDate ? `${dueDate}T00:00:00Z` : null,
        version: task.version,
      },
      {
        onSuccess: () => {
          if (assigneeChanged) {
            assignTask.mutate(assigneeId, { onSuccess: onSaved })
          } else {
            onSaved()
          }
        },
      },
    )
  }

  const isPending = updateTask.isPending || updateStatus.isPending || assignTask.isPending


  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
      <div>
        <label className="cb-label">Title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="cb-input"
        />
      </div>

      <div>
        <label className="cb-label">Description</label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="cb-textarea"
          placeholder="Add a description…"
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

      {/* Assignee */}
      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--cb-border-sub)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label className="cb-label" style={{ marginBottom: 0 }}>Assignee</label>
        <MemberSelect
          workspaceId={workspaceId}
          value={assigneeId}
          onChange={(userId) => setAssigneeId(userId)}
          disabled={isPending}
          allowUnassign={false}
        />
      </div>

      <div style={{ paddingTop: '0.25rem' }}>
        <button type="submit" disabled={isPending} className="cb-btn-primary">
          {isPending ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}
