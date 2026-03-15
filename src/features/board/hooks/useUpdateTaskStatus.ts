import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '../../../api/apiClient'
import { mapTask, STATUS_TO_API, type TaskApiDto } from '../../tasks/api/taskMapper'
import type { Task, TaskStatus } from '../types'

export function useUpdateTaskStatus(workspaceId: string) {
  const queryClient = useQueryClient()
  const queryKey = ['tasks', workspaceId]

  return useMutation({
    mutationFn: ({ taskId, status, version }: { taskId: string; status: TaskStatus; version: number }) =>
      apiClient
        .patch<{ data: TaskApiDto }>(`/tasks/${taskId}/status`, {
          status: STATUS_TO_API[status],
          version,
        })
        .then((r) => mapTask(r.data.data)),

    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey })
      const snapshot = queryClient.getQueryData<Record<TaskStatus, Task[]>>(queryKey)

      queryClient.setQueryData<Record<TaskStatus, Task[]>>(queryKey, (old) => {
        if (!old) return old
        const next: Record<TaskStatus, Task[]> = { TODO: [], DOING: [], DONE: [] }
        let moved: Task | undefined
        for (const [col, taskList] of Object.entries(old) as [TaskStatus, Task[]][]) {
          next[col] = taskList.filter((t) => {
            if (t.id === taskId) { moved = { ...t, status }; return false }
            return true
          })
        }
        if (moved) next[status].push(moved)
        return next
      })

      return { snapshot }
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(queryKey, ctx.snapshot)
      toast.error('Failed to update task status')
    },

    onSettled: (_data, _err, { taskId }) => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
    },
  })
}
