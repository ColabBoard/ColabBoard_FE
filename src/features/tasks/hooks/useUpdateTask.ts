import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '../../../api/apiClient'
import type { Task } from '../../board/types'
import type { UpdateTaskRequest } from '../types'

export function useUpdateTask(taskId: string, workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateTaskRequest) =>
      apiClient.put<Task>(`/tasks/${taskId}`, data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      queryClient.invalidateQueries({ queryKey: ['tasks', workspaceId] })
    },
    onError: () => {
      toast.error('Failed to update task.')
    },
  })
}
