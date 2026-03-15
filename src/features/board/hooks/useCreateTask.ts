import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '../../../api/apiClient'
import type { TaskApiDto } from '../../tasks/api/taskMapper'

export interface CreateTaskRequest {
  title: string
  description?: string
  workspace_id: string
  status: string
  priority: string
  due_date?: string | null
}

export function useCreateTask(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTaskRequest) =>
      apiClient
        .post<{ success: boolean; data: TaskApiDto }>('/tasks', data)
        .then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', workspaceId] })
      toast.success('Task created.')
    },
    onError: () => {
      toast.error('Failed to create task.')
    },
  })
}
