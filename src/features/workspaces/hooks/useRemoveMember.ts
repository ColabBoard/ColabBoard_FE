import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '../../../api/apiClient'

export function useRemoveMember(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (memberUserId: string) =>
      apiClient.delete(`/workspaces/${workspaceId}/members/${memberUserId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-members', workspaceId] })
      toast.success('Member removed.')
    },
    onError: () => {
      toast.error('Failed to remove member.')
    },
  })
}
