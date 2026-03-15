import { setupWorker } from 'msw/browser'
import { workspaceHandlers } from './handlers/workspaceHandlers'
import { taskHandlers } from './handlers/taskHandlers'
import { taskDetailHandlers } from './handlers/taskDetailHandlers'

export const worker = setupWorker(...workspaceHandlers, ...taskHandlers, ...taskDetailHandlers)
