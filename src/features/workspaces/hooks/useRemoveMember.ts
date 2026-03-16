import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '../../../api/apiClient'

export function useRemoveMember(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (memberUserId: string) =>
      apiClient.post(`/auth/revoke/${memberUserId}`, { workspaceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-members', workspaceId] })
      toast.success('Member removed.')
    },
    onError: () => {
      toast.error('Failed to remove member.')
    },
  })
}
