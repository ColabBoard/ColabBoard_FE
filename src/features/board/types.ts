export type TaskStatus = 'TODO' | 'DOING' | 'DONE'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface TaskAssignee {
  uid: string
  displayName: string
  avatarUrl?: string
}

export interface Task {
  id: string
  workspaceId: string
  title: string
  description: string
  status: TaskStatus
  assignee: TaskAssignee
  priority: TaskPriority
  dueDate: string | null
  createdAt: string
  version: number
}
