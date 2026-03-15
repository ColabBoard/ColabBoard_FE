import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '../../../api/apiClient'
import { mapTask, type TaskApiDto } from '../api/taskMapper'
import type { Task } from '../../board/types'
import type { UpdateTaskRequest } from '../types'

export function useUpdateTask(taskId: string, workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateTaskRequest) =>
      apiClient
        .put<{ data: TaskApiDto }>(`/tasks/${taskId}`, data)
        .then((r) => mapTask(r.data.data)),
    onSuccess: (updatedTask: Task) => {
      queryClient.setQueryData(['task', taskId], updatedTask)
      queryClient.invalidateQueries({ queryKey: ['tasks', workspaceId] })
    },
    onError: () => {
      toast.error('Failed to update task.')
    },
  })
}
