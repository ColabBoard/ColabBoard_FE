import type { Task } from '../../features/board/types'

export const tasks = new Map<string, Task[]>([
  [
    'ws-1',
    [
      {
        id: 't-1', workspaceId: 'ws-1', title: 'Audit current design system',
        description: 'Review all existing components and document inconsistencies.',
        status: 'TODO', priority: 'HIGH', dueDate: '2026-04-01', version: 1,
        assignee: { uid: 'u-1', displayName: 'Alice Johnson' },
        createdAt: '2026-03-01T10:00:00Z',
      },
      {
        id: 't-2', workspaceId: 'ws-1', title: 'Set up Storybook',
        description: 'Configure Storybook for component documentation.',
        status: 'TODO', priority: 'MEDIUM', dueDate: '2026-04-05', version: 1,
        assignee: { uid: 'u-2', displayName: 'Bob Smith' },
        createdAt: '2026-03-02T09:00:00Z',
      },
      {
        id: 't-3', workspaceId: 'ws-1', title: 'Redesign navigation bar',
        description: 'Implement new nav with mobile-first approach.',
        status: 'DOING', priority: 'HIGH', dueDate: '2026-03-25', version: 1,
        assignee: { uid: 'u-1', displayName: 'Alice Johnson' },
        createdAt: '2026-03-03T11:00:00Z',
      },
      {
        id: 't-4', workspaceId: 'ws-1', title: 'Update color tokens',
        description: 'Apply new brand colors across all tokens.',
        status: 'DOING', priority: 'LOW', dueDate: null, version: 1,
        assignee: { uid: 'u-3', displayName: 'Carol White' },
        createdAt: '2026-03-04T14:00:00Z',
      },
      {
        id: 't-5', workspaceId: 'ws-1', title: 'Write component guidelines',
        description: 'Document usage rules for each UI component.',
        status: 'DOING', priority: 'MEDIUM', dueDate: '2026-03-28', version: 1,
        assignee: { uid: 'u-2', displayName: 'Bob Smith' },
        createdAt: '2026-03-05T08:00:00Z',
      },
      {
        id: 't-6', workspaceId: 'ws-1', title: 'Remove legacy CSS',
        description: 'Delete old stylesheet and migrate all usages.',
        status: 'DONE', priority: 'HIGH', dueDate: '2026-03-10', version: 1,
        assignee: { uid: 'u-3', displayName: 'Carol White' },
        createdAt: '2026-03-01T07:00:00Z',
      },
      {
        id: 't-7', workspaceId: 'ws-1', title: 'Define typography scale',
        description: 'Establish font sizes, weights, and line heights.',
        status: 'DONE', priority: 'MEDIUM', dueDate: '2026-03-12', version: 1,
        assignee: { uid: 'u-1', displayName: 'Alice Johnson' },
        createdAt: '2026-03-02T10:00:00Z',
      },
      {
        id: 't-8', workspaceId: 'ws-1', title: 'Kick-off meeting',
        description: 'Align team on goals and timeline.',
        status: 'DONE', priority: 'LOW', dueDate: null, version: 1,
        assignee: { uid: 'u-2', displayName: 'Bob Smith' },
        createdAt: '2026-03-01T06:00:00Z',
      },
    ],
  ],
])
