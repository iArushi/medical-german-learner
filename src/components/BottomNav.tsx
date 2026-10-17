import { NavLink } from 'react-router-dom'
import { MedIcon } from './ui/MedIcon'
import { cn } from '../lib/cn'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition-colors duration-200',
    isActive ? 'text-primary' : 'text-text-muted',
  )

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-10 border-t border-border/90 bg-surface/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgb(23_75_63/6%)] backdrop-blur-md"
      aria-label="Main"
    >
      <div className="mx-auto flex max-w-lg px-2">
        <NavLink to="/home" className={linkClass} end>
          {({ isActive }) => (
            <>
              <span
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200',
                  isActive ? 'bg-primary-muted text-primary' : 'text-text-muted',
                )}
              >
                <MedIcon name="home" size={20} />
              </span>
              Home
            </>
          )}
        </NavLink>
        <NavLink to="/compete" className={linkClass}>
          {({ isActive }) => (
            <>
              <span
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200',
                  isActive ? 'bg-primary-muted text-primary' : 'text-text-muted',
                )}
              >
                <MedIcon name="users" size={20} />
              </span>
              Compete
            </>
          )}
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          {({ isActive }) => (
            <>
              <span
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200',
                  isActive ? 'bg-primary-muted text-primary' : 'text-text-muted',
                )}
              >
                <MedIcon name="layers" size={20} />
              </span>
              Profile
            </>
          )}
        </NavLink>
      </div>
    </nav>
  )
}
