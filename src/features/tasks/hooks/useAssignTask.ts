import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '../../../api/apiClient'

export function useAssignTask(taskId: string, workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) =>
      apiClient
        .post(`/tasks/${taskId}/assign`, { user_id: userId })
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      queryClient.invalidateQueries({ queryKey: ['tasks', workspaceId] })
      toast.success('Task assigned.')
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.error
      toast.error(msg ?? 'Failed to assign task.')
    },
  })
}
