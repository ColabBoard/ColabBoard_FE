import { useQuery } from '@tanstack/react-query'
import apiClient from '../../../api/apiClient'
import { mapTask, type TaskApiDto } from '../api/taskMapper'
import type { Task } from '../../board/types'

export function useTaskDetail(taskId: string | null) {
  return useQuery<Task>({
    queryKey: ['task', taskId],
    queryFn: () =>
      apiClient
        .get<{ data: TaskApiDto }>(`/tasks/${taskId}`)
        .then((r) => mapTask(r.data.data)),
    enabled: !!taskId,
  })
}
