import { useQuery } from '@tanstack/react-query'
import apiClient from '../../../api/apiClient'
import type { TaskHistory } from '../types'

export function useTaskHistory(taskId: string | null) {
  return useQuery<TaskHistory[]>({
    queryKey: ['task-history', taskId],
    queryFn: () =>
      apiClient.get<TaskHistory[]>(`/tasks/${taskId}/history`).then((r) => r.data),
    enabled: !!taskId,
  })
}
