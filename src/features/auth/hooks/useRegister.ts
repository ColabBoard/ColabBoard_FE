import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '../../../api/apiClient'
import { useAuthStore } from '../../../store/authStore'
import { getUidFromToken } from '../../../lib/jwt'
import type { LoginResponse, RegisterRequest, RegisterResponse } from '../types'

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      await apiClient.post<RegisterResponse>('/auth/register', data)
      const loginRes = await apiClient.post<LoginResponse>('/auth/login', {
        email: data.email,
        password: data.password,
      })
      return { loginData: loginRes.data, email: data.email }
    },
    onSuccess: ({ loginData, email }) => {
      const uid = getUidFromToken(loginData.idToken)
      setAuth(loginData.idToken, uid, email)
    },
    onError: () => {
      toast.error('Registration failed. Please try again.')
    },
  })
}
