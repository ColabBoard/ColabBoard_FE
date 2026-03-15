import { useState, useEffect } from 'react'
import { useUpdateTask } from '../hooks/useUpdateTask'
import type { Task } from '../../board/types'

interface Props {
  task: Task
  workspaceId: string
  onSaved: () => void
}

export function TaskEditForm({ task, workspaceId, onSaved }: Props) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const updateTask = useUpdateTask(task.id, workspaceId)

  useEffect(() => {
    setTitle(task.title)
    setDescription(task.description)
  }, [task.title, task.description])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateTask.mutate(
      { title, description, version: task.version },
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

      <div style={{ paddingTop: '0.25rem' }}>
        <button type="submit" disabled={updateTask.isPending} className="cb-btn-primary">
          {updateTask.isPending ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}
