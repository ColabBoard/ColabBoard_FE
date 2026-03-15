import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '../../../store/authStore'
import { isTokenExpired } from '../../../lib/jwt'
import { refreshAuth } from '../../../lib/refreshAuth'

type SSEStatus = 'connecting' | 'connected' | 'disconnected'

type SSECallbacks = {
  onConnected?:      (presentUserIds: string[]) => void
  onPresenceJoined?: (userId: string) => void
  onPresenceLeft?:   (userId: string) => void
}

export function useSSE(workspaceId: string, callbacks: SSECallbacks = {}) {
  const [status, setStatus] = useState<SSEStatus>('connecting')
  const navigate = useNavigate()
  const esRef = useRef<EventSource | null>(null)
  const callbacksRef = useRef(callbacks)
  useEffect(() => { callbacksRef.current = callbacks })

  useEffect(() => {
    if (!workspaceId) return

    let cancelled = false

    const connect = async () => {
      // Read token fresh from store — avoids idToken as a dep and prevents
      // spurious cleanup cycles when the token refreshes mid-connection
      let token = useAuthStore.getState().idToken
      if (!token) { navigate('/login'); return }
      if (isTokenExpired(token)) {
        try {
          token = await refreshAuth()
        } catch {
          useAuthStore.getState().clearAuth()
          navigate('/login')
          return
        }
      }
      if (cancelled) return

      const url = `${import.meta.env.VITE_API_BASE_URL}/stream?workspaceId=${workspaceId}&token=${token}`
      const es = new EventSource(url)
      esRef.current = es
      setStatus('connecting')

      es.addEventListener('connected', (e: MessageEvent) => {
        setStatus('connected')
        try {
          const payload = JSON.parse(e.data) as { presentUserIds?: string[] }
          if (payload.presentUserIds) {
            callbacksRef.current.onConnected?.(payload.presentUserIds)
          }
        } catch {}
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

      es.addEventListener('presence-joined', (e: MessageEvent) => {
        try { callbacksRef.current.onPresenceJoined?.(JSON.parse(e.data).userId) } catch {}
      })

      es.addEventListener('presence-left', (e: MessageEvent) => {
        try { callbacksRef.current.onPresenceLeft?.(JSON.parse(e.data).userId) } catch {}
      })

      es.onerror = () => {
        setStatus('disconnected')
        if (isTokenExpired(token)) {
          es.close()
          refreshAuth().catch(() => {
            useAuthStore.getState().clearAuth()
            navigate('/login')
          })
        }
      }
    }

    connect()

    return () => {
      cancelled = true
      esRef.current?.close()
      // Signal departure immediately so other windows update without waiting for disconnect detection
      const token = useAuthStore.getState().idToken
      if (token && workspaceId) {
        fetch(
          `${import.meta.env.VITE_API_BASE_URL}/presence/${workspaceId}?token=${token}`,
          { method: 'DELETE', keepalive: true }
        ).catch(() => {})
      }
    }
  }, [workspaceId, navigate])

  return { status }
}
