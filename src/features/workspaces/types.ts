export interface Workspace {
  id: string
  name: string
  ownerId: string
}

export interface CreateWorkspaceRequest {
  name: string
}

export type MemberRole = 'OWNER' | 'ADMIN' | 'MEMBER'

export interface WorkspaceMember {
  userId: string
  role: MemberRole
}

export interface AddMemberRequest {
  userId: string
  role?: 'MEMBER' | 'ADMIN'
}

export interface UpdateMemberRoleRequest {
  role: 'MEMBER' | 'ADMIN'
}
