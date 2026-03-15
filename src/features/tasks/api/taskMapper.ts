import type { Task, TaskStatus, TaskPriority } from '../../board/types'

// NOTE: field names and status values below are assumed based on the Postman collection.
// Verify against actual TaskMS responses and adjust if needed.

export interface TaskApiDto {
  id: string
  title: string
  description: string
  status: string
  priority: string
  workspace_id: string
  version: number
  created_at: string
  due_date: string | null
  assignments?: { id: string; task_id: string; user_id: string; assigned_at: string }[]
}

const STATUS_FROM_API: Record<string, TaskStatus> = {
  pending: 'TODO',
  todo: 'TODO',
  in_progress: 'DOING',
  done: 'DONE',
}

export const STATUS_TO_API: Record<TaskStatus, string> = {
  TODO: 'pending',
  DOING: 'in_progress',
  DONE: 'done',
}

const PRIORITY_FROM_API: Record<string, TaskPriority> = {
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH',
}

export function mapTask(dto: TaskApiDto): Task {
  return {
    id: dto.id,
    workspaceId: dto.workspace_id,
    title: dto.title,
    description: dto.description ?? '',
    status: STATUS_FROM_API[dto.status] ?? 'TODO',
    priority: PRIORITY_FROM_API[dto.priority] ?? 'MEDIUM',
    version: dto.version ?? 0,
    dueDate: dto.due_date ?? null,
    createdAt: dto.created_at,
    assignee: dto.assignments?.length
      ? { uid: dto.assignments[dto.assignments.length - 1].user_id, displayName: dto.assignments[dto.assignments.length - 1].user_id }
      : { uid: '', displayName: 'Unassigned' },
  }
}
