export interface WorkspaceMock {
  id: string
  name: string
  description: string
  memberCount: number
  createdAt: string
}

export const workspaces: WorkspaceMock[] = [
  {
    id: 'ws-1',
    name: 'Frontend Redesign',
    description: 'Revamping the UI across all product surfaces',
    memberCount: 5,
    createdAt: '2026-01-10T09:00:00Z',
  },
  {
    id: 'ws-2',
    name: 'Backend API v2',
    description: 'Migrating endpoints to the new service architecture',
    memberCount: 3,
    createdAt: '2026-01-18T11:30:00Z',
  },
  {
    id: 'ws-3',
    name: 'Mobile App Launch',
    description: 'Coordinating tasks for the Q2 mobile release',
    memberCount: 7,
    createdAt: '2026-02-01T08:15:00Z',
  },
  {
    id: 'ws-4',
    name: 'Data Pipeline',
    description: 'Building ETL workflows for the analytics platform',
    memberCount: 4,
    createdAt: '2026-02-20T14:00:00Z',
  },
]
