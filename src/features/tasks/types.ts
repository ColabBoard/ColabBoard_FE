export interface TaskHistory {
  id: string
  timestamp: string
  action: string
  actor: string
}

export interface UpdateTaskRequest {
  title: string
  description: string
  status: string
  assignee: { uid: string; displayName: string; avatarUrl?: string }
}
