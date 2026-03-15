import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '../../../api/apiClient'

export function useDeleteWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (workspaceId: string) =>
      apiClient.delete(`/workspaces/${workspaceId}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      toast.success('Workspace deleted.')
    },
    onError: () => {
      toast.error('Failed to delete workspace.')
    },
  })
}
