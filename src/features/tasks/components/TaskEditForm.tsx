import { useState, useEffect } from 'react'
import { useUpdateTask } from '../hooks/useUpdateTask'
import type { Task, TaskStatus } from '../../board/types'

const STATUSES: TaskStatus[] = ['TODO', 'DOING', 'DONE']
const STATUS_LABELS: Record<TaskStatus, string> = { TODO: 'To Do', DOING: 'In Progress', DONE: 'Done' }

const MOCK_MEMBERS = [
  { uid: 'u-1', displayName: 'Alice Johnson' },
  { uid: 'u-2', displayName: 'Bob Smith' },
  { uid: 'u-3', displayName: 'Carol White' },
]

interface Props {
  task: Task
  workspaceId: string
  onSaved: () => void
}

export function TaskEditForm({ task, workspaceId, onSaved }: Props) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [status, setStatus] = useState<TaskStatus>(task.status)
  const [assigneeUid, setAssigneeUid] = useState(task.assignee.uid)
  const updateTask = useUpdateTask(task.id, workspaceId)

  useEffect(() => {
    setTitle(task.title)
    setDescription(task.description)
    setStatus(task.status)
    setAssigneeUid(task.assignee.uid)
  }, [task.title, task.description, task.status, task.assignee.uid])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const assignee = MOCK_MEMBERS.find((m) => m.uid === assigneeUid) ?? task.assignee
    updateTask.mutate(
      { title, description, status, assignee },
      { onSuccess: onSaved }
    )
  }

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
            {STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="cb-label">Assignee</label>
          <select
            value={assigneeUid}
            onChange={(e) => setAssigneeUid(e.target.value)}
            className="cb-select"
          >
            {MOCK_MEMBERS.map((m) => (
              <option key={m.uid} value={m.uid}>{m.displayName}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ paddingTop: '0.25rem' }}>
        <button type="submit" disabled={updateTask.isPending} className="cb-btn-primary">
          {updateTask.isPending ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}
