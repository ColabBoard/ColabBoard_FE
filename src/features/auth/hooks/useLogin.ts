import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import apiClient from '../../../api/apiClient'
import { useAuthStore } from '../../../store/authStore'
import { getUidFromToken } from '../../../lib/jwt'
import type { LoginRequest, LoginResponse } from '../types'

export function useLogin() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: (data: LoginRequest) =>
      apiClient.post<LoginResponse>('/auth/login', data).then((r) => r.data),
    onSuccess: (data, variables) => {
      const uid = getUidFromToken(data.idToken)
      setAuth(data.idToken, uid, variables.email)
      navigate('/workspaces')
    },
    onError: () => {
      toast.error('Invalid email or password')
    },
  })
}
