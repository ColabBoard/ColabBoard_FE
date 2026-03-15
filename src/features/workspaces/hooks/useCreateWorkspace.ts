import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '../../../api/apiClient'
import type { CreateWorkspaceRequest, Workspace } from '../types'

export function useCreateWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateWorkspaceRequest) =>
      apiClient.post<Workspace>('/workspaces', data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
    },
    onError: () => {
      toast.error('Failed to create workspace.')
    },
  })
}
