import { useMutation } from '@tanstack/react-query'
import apiClient from '../../../api/apiClient'

interface UpdatePreferencesRequest {
  theme?: string
  language?: string
  email_notifications?: boolean
}

export function useUpdatePreferences() {
  return useMutation({
    mutationFn: (data: UpdatePreferencesRequest) =>
      apiClient.put('/api/profile/preferences', data),
  })
}
