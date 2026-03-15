import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute'
import { LoginPage } from '../features/auth/components/LoginPage'
import { RegisterPage } from '../features/auth/components/RegisterPage'
import { ProfileSetupPage } from '../features/profile/components/ProfileSetupPage'
import { AppLayout } from '../components/layout/AppLayout'
import { useAuthStore } from '../store/authStore'
import { WorkspacesPage } from '../features/workspaces/components/WorkspacesPage'
import { BoardPage } from '../features/board/components/BoardPage'

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/workspaces" replace />
  return <>{children}</>
}

export const router = createBrowserRouter([
  { path: '/login', element: <PublicRoute><LoginPage /></PublicRoute> },
  { path: '/register', element: <PublicRoute><RegisterPage /></PublicRoute> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/workspaces" replace /> },
      { path: 'workspaces', element: <WorkspacesPage /> },
      { path: 'workspaces/:id', element: <BoardPage /> },
      { path: 'profile/setup', element: <ProfileSetupPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
])
