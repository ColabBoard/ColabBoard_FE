import { useQuery } from '@tanstack/react-query'
import apiClient from '../../../api/apiClient'
import type { Task, TaskStatus } from '../types'

export function useBoardTasks(workspaceId: string) {
  return useQuery<Record<TaskStatus, Task[]>>({
    queryKey: ['tasks', workspaceId],
    queryFn: async () => {
      const res = await apiClient.get<Task[]>('/tasks', {
        params: { workspaceId },
      })
      const grouped: Record<TaskStatus, Task[]> = { TODO: [], DOING: [], DONE: [] }
      for (const task of res.data) {
        grouped[task.status].push(task)
      }
      return grouped
    },
    enabled: !!workspaceId,
  })
}
