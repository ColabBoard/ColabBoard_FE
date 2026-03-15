import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '../../../api/apiClient'
import type { Profile } from '../types'

interface UpdateProfileRequest {
  username?: string
  full_name?: string
  avatar_url?: string
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) =>
      apiClient
        .put<{ success: boolean; data: Profile }>('/api/profile/', data)
        .then((r) => r.data.data),
    onSuccess: (updated) => {
      queryClient.setQueryData(['profile'], updated)
      toast.success('Profile updated.')
    },
    onError: () => {
      toast.error('Failed to update profile.')
    },
  })
}
