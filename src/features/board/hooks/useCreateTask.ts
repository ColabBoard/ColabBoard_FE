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
  assignee_id?: string
}

export function useCreateTask(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateTaskRequest) => {
      // MS always creates tasks as "pending" regardless of the status field.
      // If a different status was requested, patch it immediately after creation.
      const task = await apiClient
        .post<{ success: boolean; data: TaskApiDto }>('/tasks', data)
        .then((r) => r.data.data)

      if (data.status !== 'pending' && data.status !== 'todo') {
        await apiClient.patch(`/tasks/${task.id}/status`, {
          status: data.status,
          version: task.version,
        })
      }

      if (data.assignee_id?.trim()) {
        await apiClient.post(`/tasks/${task.id}/assign`, { user_id: data.assignee_id.trim() })
      }

      return task
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', workspaceId] })
      toast.success('Task created.')
    },
    onError: () => {
      toast.error('Failed to create task.')
    },
  })
}
