import { useState, useCallback } from 'react'

export function usePresence(_workspaceId: string) {
  const [presentUserIds, setPresentUserIds] = useState<string[]>([])

  // Called when the SSE 'connected' event fires — server provides the accurate list
  const handleConnected = useCallback((userIds: string[]) => {
    setPresentUserIds(userIds)
  }, [])

  const handleJoined = useCallback((userId: string) => {
    setPresentUserIds((prev) => prev.includes(userId) ? prev : [...prev, userId])
  }, [])

  const handleLeft = useCallback((userId: string) => {
    setPresentUserIds((prev) => prev.filter((id) => id !== userId))
  }, [])

  return { presentUserIds, handleConnected, handleJoined, handleLeft }
}
