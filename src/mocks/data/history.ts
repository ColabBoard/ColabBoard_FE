export interface HistoryEntry {
  id: string
  timestamp: string
  action: string
  actor: string
}

export const history = new Map<string, HistoryEntry[]>([
  [
    't-3',
    [
      { id: 'h-1', timestamp: '2026-03-03T11:00:00Z', action: 'Created task', actor: 'Alice Johnson' },
      { id: 'h-2', timestamp: '2026-03-05T09:15:00Z', action: 'Changed status from TODO to DOING', actor: 'Alice Johnson' },
      { id: 'h-3', timestamp: '2026-03-07T14:30:00Z', action: 'Updated description', actor: 'Bob Smith' },
      { id: 'h-4', timestamp: '2026-03-10T10:00:00Z', action: 'Changed priority to HIGH', actor: 'Alice Johnson' },
    ],
  ],
  [
    't-1',
    [
      { id: 'h-5', timestamp: '2026-03-01T10:00:00Z', action: 'Created task', actor: 'Alice Johnson' },
      { id: 'h-6', timestamp: '2026-03-02T16:00:00Z', action: 'Assigned to Alice Johnson', actor: 'Bob Smith' },
    ],
  ],
  [
    't-6',
    [
      { id: 'h-7', timestamp: '2026-03-01T07:00:00Z', action: 'Created task', actor: 'Carol White' },
      { id: 'h-8', timestamp: '2026-03-04T11:00:00Z', action: 'Changed status from TODO to DOING', actor: 'Carol White' },
      { id: 'h-9', timestamp: '2026-03-09T15:00:00Z', action: 'Changed status from DOING to DONE', actor: 'Carol White' },
    ],
  ],
])
