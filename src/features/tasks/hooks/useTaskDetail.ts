import { useQuery } from '@tanstack/react-query'
import apiClient from '../../../api/apiClient'
import type { Task } from '../../board/types'

export function useTaskDetail(taskId: string | null) {
  return useQuery<Task>({
    queryKey: ['task', taskId],
    queryFn: () => apiClient.get<Task>(`/tasks/${taskId}`).then((r) => r.data),
    enabled: !!taskId,
  })
}
