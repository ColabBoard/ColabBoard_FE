import { useQueries } from '@tanstack/react-query'
import apiClient from '../../../api/apiClient'
import type { Profile } from '../types'

async function fetchProfile(userId: string): Promise<Profile | null> {
  try {
    const res = await apiClient.get<{ success: boolean; data: Profile }>(`/api/profile/${userId}`)
    return res.data.data
  } catch {
    return null
  }
}

export function useMemberProfiles(userIds: string[]) {
  const results = useQueries({
    queries: userIds.map((id) => ({
      queryKey: ['profile', id],
      queryFn: () => fetchProfile(id),
      staleTime: 5 * 60 * 1000, // 5 min — profiles don't change often
    })),
  })

  const profileMap: Record<string, Profile | null> = {}
  userIds.forEach((id, i) => {
    profileMap[id] = results[i].data ?? null
  })

  const isLoading = results.some((r) => r.isLoading)

  return { profileMap, isLoading }
}
