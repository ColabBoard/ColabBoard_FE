import { http, HttpResponse } from 'msw'
import { workspaces, membersByWorkspace } from '../data/workspaces'

const base = import.meta.env.VITE_API_BASE_URL

export const workspaceHandlers = [
  // List workspaces
  http.get(`${base}/workspaces`, () => {
    return HttpResponse.json({ workspaces })
  }),

  // Create workspace
  http.post(`${base}/workspaces`, async ({ request }) => {
    const body = await request.json() as { name: string }
    const newWorkspace = {
      id: `ws-${Date.now()}`,
      name: body.name,
      ownerId: 'user-123',
    }
    workspaces.push(newWorkspace)
    membersByWorkspace[newWorkspace.id] = [{ userId: 'user-123', role: 'OWNER' }]
    return HttpResponse.json(newWorkspace, { status: 201 })
  }),

  // Get workspace detail
  http.get(`${base}/workspaces/:id`, ({ params }) => {
    const ws = workspaces.find((w) => w.id === params.id)
    if (!ws) return HttpResponse.json({ error: 'Workspace not found' }, { status: 404 })
    return HttpResponse.json(ws)
  }),

  // List members
  http.get(`${base}/workspaces/:id/members`, ({ params }) => {
    const members = membersByWorkspace[params.id as string] ?? []
    return HttpResponse.json({ workspaceId: params.id, members })
  }),

  // Add member
  http.post(`${base}/workspaces/:id/members`, async ({ params, request }) => {
    const body = await request.json() as { userId: string; role?: string }
    const wsId = params.id as string
    if (!membersByWorkspace[wsId]) membersByWorkspace[wsId] = []
    const existing = membersByWorkspace[wsId].find((m) => m.userId === body.userId)
    if (existing) return HttpResponse.json({ error: 'User is already a member' }, { status: 409 })
    const newMember = { userId: body.userId, role: body.role ?? 'MEMBER' }
    membersByWorkspace[wsId].push(newMember)
    return HttpResponse.json({ workspaceId: wsId, ...newMember }, { status: 201 })
  }),

  // Update member role
  http.patch(`${base}/workspaces/:id/members/:memberUserId`, async ({ params, request }) => {
    const body = await request.json() as { role: string }
    const wsId = params.id as string
    const members = membersByWorkspace[wsId] ?? []
    const member = members.find((m) => m.userId === params.memberUserId)
    if (!member) return HttpResponse.json({ error: 'Workspace or member not found' }, { status: 404 })
    member.role = body.role
    return HttpResponse.json({ workspaceId: wsId, userId: params.memberUserId, role: body.role })
  }),

  // Remove member
  http.delete(`${base}/workspaces/:id/members/:memberUserId`, ({ params }) => {
    const wsId = params.id as string
    const members = membersByWorkspace[wsId]
    if (!members) return HttpResponse.json({ error: 'Workspace not found' }, { status: 404 })
    const idx = members.findIndex((m) => m.userId === params.memberUserId)
    if (idx === -1) return HttpResponse.json({ error: 'Member not found' }, { status: 404 })
    members.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  // Delete workspace
  http.delete(`${base}/workspaces/:id`, ({ params }) => {
    const idx = workspaces.findIndex((w) => w.id === params.id)
    if (idx === -1) return HttpResponse.json({ error: 'Workspace not found' }, { status: 404 })
    workspaces.splice(idx, 1)
    delete membersByWorkspace[params.id as string]
    return HttpResponse.json({ message: 'Workspace deleted' })
  }),

  // Send invitation
  http.post(`${base}/invitations`, async () =>
    HttpResponse.json({ message: 'Invitation sent (mock)' }, { status: 200 })
  ),

  // Accept invitation
  http.get(`${base}/invitations/accept`, ({ request }) => {
    const token = new URL(request.url).searchParams.get('token')
    if (!token) return HttpResponse.json({ error: 'Token required' }, { status: 400 })
    return HttpResponse.json({ workspaceId: 'ws-1' })
  }),
]
