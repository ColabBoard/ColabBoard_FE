export interface WorkspaceMock {
  id: string
  name: string
  ownerId: string
}

export const workspaces: WorkspaceMock[] = [
  { id: 'ws-1', name: 'Frontend Redesign', ownerId: 'user-123' },
  { id: 'ws-2', name: 'Backend API v2',    ownerId: 'user-123' },
  { id: 'ws-3', name: 'Mobile App Launch', ownerId: 'user-456' },
  { id: 'ws-4', name: 'Data Pipeline',     ownerId: 'user-789' },
]

export const membersByWorkspace: Record<string, { userId: string; role: string }[]> = {
  'ws-1': [
    { userId: 'user-123', role: 'OWNER' },
    { userId: 'user-456', role: 'ADMIN' },
    { userId: 'user-789', role: 'MEMBER' },
  ],
  'ws-2': [
    { userId: 'user-123', role: 'OWNER' },
  ],
  'ws-3': [
    { userId: 'user-456', role: 'OWNER' },
    { userId: 'user-123', role: 'MEMBER' },
  ],
  'ws-4': [
    { userId: 'user-789', role: 'OWNER' },
    { userId: 'user-123', role: 'MEMBER' },
  ],
}
