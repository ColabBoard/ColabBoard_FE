import { http, HttpResponse } from 'msw'
import { workspaces } from '../data/workspaces'

const base = import.meta.env.VITE_API_BASE_URL

export const workspaceHandlers = [
  http.get(`${base}/workspaces`, () => {
    return HttpResponse.json(workspaces)
  }),

  http.post(`${base}/workspaces`, async ({ request }) => {
    const body = await request.json() as { name: string; description: string }
    const newWorkspace = {
      id: `ws-${Date.now()}`,
      name: body.name,
      description: body.description ?? '',
      memberCount: 1,
      createdAt: new Date().toISOString(),
    }
    workspaces.push(newWorkspace)
    return HttpResponse.json(newWorkspace, { status: 201 })
  }),

  http.get(`${base}/workspaces/:id`, ({ params }) => {
    const ws = workspaces.find((w) => w.id === params.id)
    if (!ws) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(ws)
  }),
]
