import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '../../../api/apiClient'

export function useInviteMember(workspaceId: string) {
  return useMutation({
    mutationFn: (data: { email: string; role?: 'MEMBER' | 'ADMIN' }) =>
      apiClient
        .post('/invitations', { workspaceId, inviteeEmail: data.email, role: data.role ?? 'MEMBER' })
        .then((r) => r.data),
    onSuccess: () => toast.success('Invitation sent.'),
    onError: (err: any) => toast.error(err?.response?.data?.error ?? 'Failed to send invitation.'),
  })
}
