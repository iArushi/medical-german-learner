import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

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
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 760px)')
    const sync = () => {
      if (mq.matches) setMobileOpen(false)
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

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
