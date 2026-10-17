import type { ReactNode } from 'react'
import { useDashboardShell } from '../../context/DashboardShellContext'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardTopbar } from './DashboardTopbar'

type DashboardShellProps = {
  section?: string
  page: string
  children: ReactNode
}

export function DashboardShell({ section = 'Dashboard', page, children }: DashboardShellProps) {
  const { mobileOpen, closeMenu } = useDashboardShell()

  return (
    <div className="dashboard-root page-enter">
      <DashboardSidebar />
      {mobileOpen ? (
        <button type="button" className="dashboard-scrim" aria-label="Close navigation" onClick={closeMenu} />
      ) : null}

      <div className="dashboard-main">
        <DashboardTopbar section={section} page={page} />
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  )
}
