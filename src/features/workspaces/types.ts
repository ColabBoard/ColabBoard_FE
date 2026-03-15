export interface Workspace {
  id: string
  name: string
  description: string
  memberCount: number
  createdAt: string
}

export interface CreateWorkspaceRequest {
  name: string
  description: string
}
