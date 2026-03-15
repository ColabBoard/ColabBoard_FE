export interface TaskHistory {
  id: string
  timestamp: string
  action: string
  actor: string
}

export interface UpdateTaskRequest {
  title: string
  description: string
  priority: string
  due_date: string | null
  version: number
}
