import { Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { PageTransition } from './ui/PageTransition'

const ROUTES_WITH_NAV = ['/home', '/compete', '/profile']

export function AppLayout() {
  const { pathname } = useLocation()
  const showNav = ROUTES_WITH_NAV.includes(pathname)

  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col bg-bg">
      <main className={showNav ? 'flex-1 pb-20' : 'flex-1'}>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      {showNav ? <BottomNav /> : null}
    </div>
  )
}
