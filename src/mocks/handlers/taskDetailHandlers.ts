import { http, HttpResponse } from 'msw'
import { tasks } from '../data/tasks'
import { history } from '../data/history'
import type { Task } from '../../features/board/types'

const base = import.meta.env.VITE_API_BASE_URL

export const taskDetailHandlers = [
  http.get(`${base}/tasks/:id`, ({ params }) => {
    for (const taskList of tasks.values()) {
      const task = taskList.find((t) => t.id === params.id)
      if (task) return HttpResponse.json(task)
    }
    return new HttpResponse(null, { status: 404 })
  }),

  http.put(`${base}/tasks/:id`, async ({ request, params }) => {
    const body = await request.json() as Partial<Task>
    for (const taskList of tasks.values()) {
      const task = taskList.find((t) => t.id === params.id)
      if (task) {
        Object.assign(task, body)
        const entries = history.get(String(params.id)) ?? []
        entries.push({
          id: `h-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'Updated task details',
          actor: 'You',
        })
        history.set(String(params.id), entries)
        return HttpResponse.json(task)
      }
    }
    return new HttpResponse(null, { status: 404 })
  }),

  http.get(`${base}/tasks/:id/history`, ({ params }) => {
    return HttpResponse.json(history.get(String(params.id)) ?? [])
  }),

  http.post(`${base}/tasks/:id/undo`, ({ params }) => {
    const entries = history.get(String(params.id))
    if (entries && entries.length > 0) {
      entries.pop()
      history.set(String(params.id), entries)
    }
    for (const taskList of tasks.values()) {
      const task = taskList.find((t) => t.id === params.id)
      if (task) return HttpResponse.json(task)
    }
    return new HttpResponse(null, { status: 404 })
  }),
]
