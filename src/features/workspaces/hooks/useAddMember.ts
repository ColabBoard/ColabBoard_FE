import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '../../../api/apiClient'
import type { AddMemberRequest, WorkspaceMember } from '../types'

export function useAddMember(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AddMemberRequest) =>
      apiClient
        .post<WorkspaceMember>(`/workspaces/${workspaceId}/members`, data)
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-members', workspaceId] })
      toast.success('Member added.')
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.error
      toast.error(msg ?? 'Failed to add member.')
    },
  })
}
