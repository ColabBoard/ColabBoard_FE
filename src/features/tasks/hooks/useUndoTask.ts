import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '../../../api/apiClient'

export function useUndoTask(taskId: string, workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => apiClient.post(`/tasks/${taskId}/undo`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      queryClient.invalidateQueries({ queryKey: ['task-history', taskId] })
      queryClient.invalidateQueries({ queryKey: ['tasks', workspaceId] })
      toast.success('Action undone')
    },
    onError: () => {
      toast.error('Failed to undo.')
    },
  })
}
