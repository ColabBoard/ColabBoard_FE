import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '../../../api/apiClient'

interface AcceptResponse {
  workspaceId?: string
  needsRegister?: boolean
  token?: string
}

export function AcceptInvitePage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token')

  const { data, isError, error } = useQuery<AcceptResponse>({
    queryKey: ['accept-invite', token],
    queryFn: () =>
      apiClient.get<AcceptResponse>(`/invitations/accept?token=${token}`).then((r) => r.data),
    enabled: !!token,
    retry: false,
  })

  useEffect(() => {
    if (!data) return
    if (data.needsRegister) {
      navigate(`/register?redirect=/invite/accept&token=${token}`, { replace: true })
      return
    }
    if (data.workspaceId) {
      toast.success("You've joined the workspace!")
      navigate(`/workspaces/${data.workspaceId}`, { replace: true })
    }
  }, [data, token, navigate])

  if (!token) {
    return (
      <div style={pageStyle}>
        <p style={errorStyle}>Invalid invitation link — no token provided.</p>
        <a href="/" style={linkStyle}>Go home</a>
      </div>
    )
  }

  if (isError) {
    const msg = (error as any)?.response?.data?.error ?? 'This invitation is invalid or has expired.'
    return (
      <div style={pageStyle}>
        <p style={errorStyle}>{msg}</p>
        <a href="/" style={linkStyle}>Go home</a>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <div style={spinnerStyle} />
      <p className="font-outfit" style={{ color: 'var(--cb-muted)', fontSize: '0.875rem', marginTop: '1rem' }}>
        Accepting invitation…
      </p>
    </div>
  )
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.75rem',
  background: 'var(--cb-bg)',
}

const errorStyle: React.CSSProperties = {
  fontFamily: "'Outfit', sans-serif",
  fontSize: '0.9375rem',
  color: 'var(--cb-rose)',
  textAlign: 'center',
  maxWidth: '360px',
}

const linkStyle: React.CSSProperties = {
  fontFamily: "'Outfit', sans-serif",
  fontSize: '0.8125rem',
  color: 'var(--cb-accent)',
  textDecoration: 'none',
}

const spinnerStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  border: '3px solid var(--cb-border-sub)',
  borderTopColor: 'var(--cb-accent)',
  animation: 'spin 0.7s linear infinite',
}
