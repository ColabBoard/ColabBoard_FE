import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '../../../store/authStore'
import { isTokenExpired } from '../../../lib/jwt'
import { refreshAuth } from '../../../lib/refreshAuth'

type SSEStatus = 'connecting' | 'connected' | 'disconnected'

type SSECallbacks = {
  onConnected?:          (presentUserIds: string[]) => void
  onPresenceJoined?:     (userId: string) => void
  onPresenceLeft?:       (userId: string) => void
  onTaskCreated?:        (taskId: string) => void
  onTaskUpdated?:        (taskId: string) => void
  onTaskStatusChanged?:  (taskId: string, newStatus: string) => void
  onTaskDeleted?:        (taskId: string) => void
}

export function useSSE(workspaceId: string, callbacks: SSECallbacks = {}) {
  const [status, setStatus] = useState<SSEStatus>('connecting')
  const navigate = useNavigate()
  const esRef = useRef<EventSource | null>(null)
  const callbacksRef = useRef(callbacks)
  useEffect(() => { callbacksRef.current = callbacks })

  // Holds the token that was used to open the current connection.
  // Using a ref (not the store) so that the value survives clearAuth() being
  // called before the component unmounts (e.g. during sign-out).
  const activeTokenRef = useRef<string | null>(null)

  // Extracted so both the cleanup and the beforeunload handler share the same logic.
  const sendLeaveRef = useRef<() => void>(() => {})
  useEffect(() => {
    sendLeaveRef.current = () => {
      const token = activeTokenRef.current
      if (!token || !workspaceId) return
      fetch(
        `${import.meta.env.VITE_API_BASE_URL}/presence/${workspaceId}?token=${token}`,
        { method: 'DELETE', keepalive: true }
      ).catch(() => {})
    }
  }, [workspaceId])

  // Fire departure on tab/browser close.
  // React's useEffect cleanup does NOT run on tab/browser close; beforeunload does.
  useEffect(() => {
    if (!workspaceId) return
    const handleUnload = () => sendLeaveRef.current()
    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [workspaceId])

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

      // Capture the token before opening the connection so the cleanup can use
      // it even if clearAuth() has been called in the meantime.
      activeTokenRef.current = token

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
          // session_expired: server rotated a stale connection — EventSource
          // reconnects automatically after the retry interval, no user-visible noise.
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

      es.addEventListener('task-created', (e: MessageEvent) => {
        try { callbacksRef.current.onTaskCreated?.(JSON.parse(e.data).taskId) } catch {}
      })
      es.addEventListener('task-updated', (e: MessageEvent) => {
        try { callbacksRef.current.onTaskUpdated?.(JSON.parse(e.data).taskId) } catch {}
      })
      es.addEventListener('task-status-changed', (e: MessageEvent) => {
        try {
          const { taskId, newStatus } = JSON.parse(e.data)
          callbacksRef.current.onTaskStatusChanged?.(taskId, newStatus)
        } catch {}
      })
      es.addEventListener('task-deleted', (e: MessageEvent) => {
        try { callbacksRef.current.onTaskDeleted?.(JSON.parse(e.data).taskId) } catch {}
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
      // Uses activeTokenRef so this works even when clearAuth() was called first
      // (e.g. sign-out navigates away before the component fully unmounts).
      sendLeaveRef.current()
    }
  }, [workspaceId, navigate])

  return { status }
}
