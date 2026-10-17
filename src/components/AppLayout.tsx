import { Outlet, useLocation } from 'react-router-dom'
import { DashboardShellProvider } from '../context/DashboardShellContext'
import { PageTransition } from './ui/PageTransition'

const DASHBOARD_ROUTES = ['/home', '/compete', '/profile']

export function AppLayout() {
  const { pathname } = useLocation()
  const useDashboard = DASHBOARD_ROUTES.includes(pathname)

  const inner = (
    <main className="flex-1">
      <PageTransition>
        <Outlet />
      </PageTransition>
    </main>
  )

  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col bg-bg">
      {useDashboard ? <DashboardShellProvider>{inner}</DashboardShellProvider> : inner}
    </div>
  )
}
