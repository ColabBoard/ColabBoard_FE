import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import apiClient from '../../../api/apiClient'
import { useAuthStore } from '../../../store/authStore'
import type { Profile } from '../types'

export function useProfile() {
  const uid = useAuthStore((s) => s.uid)

  return useQuery<Profile | null>({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        const res = await apiClient.get<{ success: boolean; data: Profile }>('/api/profile/me', {
          headers: { 'X-USER-ID': uid },
        })
        return res.data.data
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          return null
        }
        throw err
      }
    },
    enabled: !!uid,
    staleTime: Infinity,
  })
}
