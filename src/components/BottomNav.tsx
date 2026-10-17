import { NavLink } from 'react-router-dom'
import { cn } from '../lib/cn'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex flex-1 flex-col items-center gap-1 py-2 text-xs font-semibold transition-colors duration-200',
    isActive ? 'text-primary underline decoration-2 underline-offset-4' : 'text-text-muted',
  )

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] shadow-soft"
      aria-label="Main"
    >
      <div className="mx-auto flex max-w-lg">
        <NavLink to="/home" className={linkClass} end>
          Home
        </NavLink>
        <NavLink to="/compete" className={linkClass}>
          Compete
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          Profile
        </NavLink>
      </div>
    </nav>
  )
}
