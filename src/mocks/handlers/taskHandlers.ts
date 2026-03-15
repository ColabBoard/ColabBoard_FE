import { http, HttpResponse } from 'msw'
import { tasks } from '../data/tasks'
import type { TaskStatus } from '../../features/board/types'

const base = import.meta.env.VITE_API_BASE_URL

export const taskHandlers = [
  http.get(`${base}/tasks`, ({ request }) => {
    const url = new URL(request.url)
    const workspaceId = url.searchParams.get('workspaceId') ?? ''
    return HttpResponse.json(tasks.get(workspaceId) ?? [])
  }),

  http.patch(`${base}/tasks/:id/status`, async ({ request, params }) => {
    const { status } = await request.json() as { status: TaskStatus }
    for (const taskList of tasks.values()) {
      const task = taskList.find((t) => t.id === params.id)
      if (task) {
        task.status = status
        return HttpResponse.json(task)
      }
    }
    return new HttpResponse(null, { status: 404 })
  }),
]
