import { isAxiosError } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '../../../api/apiClient'
import { useAuthStore } from '../../../store/authStore'
import type { CreateProfileRequest, Profile } from '../types'

export function useCreateProfile() {
  const uid = useAuthStore((s) => s.uid)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProfileRequest) =>
      apiClient
        .post<{ success: boolean; data: Profile }>('/api/profile/', data, {
          headers: { 'X-USER-ID': uid },
        })
        .then((r) => r.data.data),
    onSuccess: (profile) => {
      queryClient.setQueryData(['profile'], profile)
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.error
        : undefined
      toast.error(message ?? 'Failed to create profile. Please try again.')
    },
  })
}
