import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

export function useBoardTaskEvents(
  workspaceId: string,
  selectedTaskId: string | null,
  onClosePanel: () => void
) {
  const qc = useQueryClient()

  const onTaskCreated = useCallback(() => {
    qc.invalidateQueries({ queryKey: ['tasks', workspaceId] })
  }, [qc, workspaceId])

  const onTaskUpdated = useCallback((taskId: string) => {
    qc.invalidateQueries({ queryKey: ['task', taskId] })
    qc.invalidateQueries({ queryKey: ['tasks', workspaceId] })
  }, [qc, workspaceId])

  const onTaskStatusChanged = useCallback((taskId: string) => {
    qc.invalidateQueries({ queryKey: ['task', taskId] })
    qc.invalidateQueries({ queryKey: ['tasks', workspaceId] })
  }, [qc, workspaceId])

  const onTaskDeleted = useCallback((taskId: string) => {
    qc.invalidateQueries({ queryKey: ['tasks', workspaceId] })
    if (selectedTaskId === taskId) onClosePanel()
  }, [qc, workspaceId, selectedTaskId, onClosePanel])

  return { onTaskCreated, onTaskUpdated, onTaskStatusChanged, onTaskDeleted }
}
