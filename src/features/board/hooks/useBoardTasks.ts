import { useQuery } from '@tanstack/react-query'
import apiClient from '../../../api/apiClient'
import { mapTask, type TaskApiDto } from '../../tasks/api/taskMapper'
import type { Task, TaskStatus } from '../types'

export function useBoardTasks(workspaceId: string) {
  return useQuery<Record<TaskStatus, Task[]>>({
    queryKey: ['tasks', workspaceId],
    queryFn: async () => {
      const res = await apiClient.get<{ data: TaskApiDto[] }>('/tasks', {
        params: { workspace_id: workspaceId },
      })
      const grouped: Record<TaskStatus, Task[]> = { TODO: [], DOING: [], DONE: [] }
      for (const dto of res.data.data ?? []) {
        const task = mapTask(dto)
        grouped[task.status].push(task)
      }
      return grouped
    },
    enabled: !!workspaceId,
  })
}
