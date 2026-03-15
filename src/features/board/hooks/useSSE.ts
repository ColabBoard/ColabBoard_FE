import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '../../../store/authStore'

type SSEStatus = 'connecting' | 'connected' | 'disconnected'

export function useSSE(workspaceId: string) {
  const [status, setStatus] = useState<SSEStatus>('connecting')
  const navigate = useNavigate()
  const idToken = useAuthStore((s) => s.idToken)
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!workspaceId || !idToken) return

    const url = `${import.meta.env.VITE_API_BASE_URL}/stream?workspaceId=${workspaceId}&token=${idToken}`
    const es = new EventSource(url)
    esRef.current = es
    setStatus('connecting')

    es.addEventListener('connected', () => {
      setStatus('connected')
    })

    es.addEventListener('connection-terminated', (e: MessageEvent) => {
      try {
        const payload = JSON.parse(e.data) as { reason: string }
        if (payload.reason === 'access_revoked') {
          es.close()
          toast.error('You have been removed from this workspace.')
          navigate('/workspaces', { replace: true })
        } else if (payload.reason === 'server_shutdown') {
          toast.info('Server restarting — reconnecting…')
        }
      } catch {
        // ignore malformed events
      }
    })

    es.onerror = () => {
      setStatus('disconnected')
    }

    return () => {
      es.close()
    }
  }, [workspaceId, idToken, navigate])

  return { status }
}
