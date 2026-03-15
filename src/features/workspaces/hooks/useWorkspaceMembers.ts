import { useQuery } from '@tanstack/react-query'
import apiClient from '../../../api/apiClient'
import type { WorkspaceMember } from '../types'

interface MembersResponse {
  workspaceId: string
  members: WorkspaceMember[]
}

export function useWorkspaceMembers(workspaceId: string, enabled = true) {
  return useQuery<WorkspaceMember[]>({
    queryKey: ['workspace-members', workspaceId],
    queryFn: () =>
      apiClient
        .get<MembersResponse>(`/workspaces/${workspaceId}/members`)
        .then((r) => r.data.members),
    enabled,
  })
}
