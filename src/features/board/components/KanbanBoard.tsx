import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { KanbanColumn } from './KanbanColumn'
import { TaskCard } from './TaskCard'
import { useUpdateTaskStatus } from '../hooks/useUpdateTaskStatus'
import type { Task, TaskStatus } from '../types'

const COLUMNS: TaskStatus[] = ['TODO', 'DOING', 'DONE']

interface Props {
  workspaceId: string
  tasks: Record<TaskStatus, Task[]>
  onOpenDetail: (id: string) => void
}

export function KanbanBoard({ workspaceId, tasks, onOpenDetail }: Props) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const updateStatus = useUpdateTaskStatus(workspaceId)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const findTask = (id: string): Task | undefined =>
    Object.values(tasks).flat().find((t) => t.id === id)

  const findColumn = (id: string): TaskStatus | undefined =>
    (Object.entries(tasks) as [TaskStatus, Task[]][]).find(([, list]) =>
      list.some((t) => t.id === id)
    )?.[0]

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTask(findTask(String(active.id)) ?? null)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null)
    if (!over) return

    const taskId = String(active.id)
    const overId = String(over.id)

    const targetStatus: TaskStatus = COLUMNS.includes(overId as TaskStatus)
      ? (overId as TaskStatus)
      : (findColumn(overId) ?? findColumn(taskId) ?? 'TODO')

    const currentStatus = findColumn(taskId)
    if (currentStatus !== targetStatus) {
      const task = findTask(taskId)
      updateStatus.mutate({ taskId, status: targetStatus, version: task?.version ?? 0 })
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', gap: '1.25rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        {COLUMNS.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks[status]}
            onOpenDetail={onOpenDetail}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeTask && (
          <div style={{ transform: 'rotate(1.5deg)', filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.4))' }}>
            <TaskCard task={activeTask} onOpenDetail={() => {}} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
