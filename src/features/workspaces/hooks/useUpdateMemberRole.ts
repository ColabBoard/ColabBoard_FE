import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '../../../api/apiClient'
import type { UpdateMemberRoleRequest, WorkspaceMember } from '../types'

interface Params {
  memberUserId: string
  data: UpdateMemberRoleRequest
}

export function useUpdateMemberRole(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ memberUserId, data }: Params) =>
      apiClient
        .patch<WorkspaceMember>(
          `/workspaces/${workspaceId}/members/${memberUserId}`,
          data,
        )
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-members', workspaceId] })
      toast.success('Role updated.')
    },
    onError: () => {
      toast.error('Failed to update role.')
    },
  })
}
