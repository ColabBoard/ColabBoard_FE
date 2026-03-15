import { useQuery } from '@tanstack/react-query'
import apiClient from '../../../api/apiClient'
import type { Workspace } from '../types'

export function useWorkspaces() {
  return useQuery<Workspace[]>({
    queryKey: ['workspaces'],
    queryFn: () =>
      apiClient
        .get<{ workspaces: Workspace[] }>('/workspaces')
        .then((r) => r.data.workspaces),
  })
}
