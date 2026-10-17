import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

type DashboardShellContextValue = {
  mobileOpen: boolean
  openMenu: () => void
  closeMenu: () => void
}

const DashboardShellContext = createContext<DashboardShellContextValue | null>(null)

export function DashboardShellProvider({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const openMenu = useCallback(() => setMobileOpen(true), [])
  const closeMenu = useCallback(() => setMobileOpen(false), [])
  const value = useMemo(
    () => ({ mobileOpen, openMenu, closeMenu }),
    [mobileOpen, openMenu, closeMenu],
  )
  return <DashboardShellContext.Provider value={value}>{children}</DashboardShellContext.Provider>
}

export function useDashboardShell() {
  const ctx = useContext(DashboardShellContext)
  if (!ctx) {
    throw new Error('useDashboardShell must be used within DashboardShellProvider')
  }
  return ctx
}
