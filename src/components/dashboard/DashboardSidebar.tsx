import { NavLink } from 'react-router-dom'
import { REVIEW_LEVEL_ID } from '../../constants/reviewLevel'
import { useDashboardShell } from '../../context/DashboardShellContext'
import { getLocalCompeteProfile } from '../../storage/competeStorage'
import { getAllLevels } from '../../lib/loadGermanData'
import { getReviewWordIds, getUserProgress } from '../../storage/userProgress'
import { getWeeklyGoalView } from '../../lib/homeDashboard'
import { MedIcon } from '../ui/MedIcon'

function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? 'dashboard-nav-item dashboard-nav-item-active' : 'dashboard-nav-item'
}

function initials(alias: string): string {
  const parts = alias.trim().split(/\s+/)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return alias.slice(0, 2).toUpperCase()
}

export function DashboardSidebar() {
  const { mobileOpen, closeMenu } = useDashboardShell()
  const profile = getLocalCompeteProfile()
  const reviewCount = getReviewWordIds().length
  const levels = getAllLevels()
  const inProgressCount = levels.filter((l) => {
    const completed = getUserProgress().completedLevelIds.includes(l.id)
    return !completed
  }).length
  const weekly = getWeeklyGoalView()

  return (
    <aside className={`dashboard-sidebar ${mobileOpen ? 'dashboard-sidebar-open' : ''}`}>
      <button type="button" className="dashboard-close-menu" onClick={closeMenu} aria-label="Close navigation">
        <MedIcon name="x" size={18} />
      </button>

      <div className="dashboard-brand">
        <span className="dashboard-brand-mark">
          <MedIcon name="stethoscope" size={23} />
        </span>
        <span>MedDeutsch</span>
      </div>

      <nav className="dashboard-nav" aria-label="Learning">
        <span className="dashboard-nav-label">LEARNING</span>
        <NavLink to="/home" end className={navClass} onClick={closeMenu}>
          <MedIcon name="home" size={20} />
          <span>Overview</span>
        </NavLink>
        <NavLink to="/home#path" className={navClass} onClick={closeMenu}>
          <MedIcon name="book" size={20} />
          <span>My lessons</span>
          <span className="dashboard-nav-pill">{Math.max(1, inProgressCount)}</span>
        </NavLink>
        <NavLink to="/compete" className={navClass} onClick={closeMenu}>
          <MedIcon name="users" size={20} />
          <span>Compete</span>
        </NavLink>
        <NavLink to="/profile" className={navClass} onClick={closeMenu}>
          <MedIcon name="chart" size={20} />
          <span>Progress</span>
        </NavLink>

        <span className="dashboard-nav-label dashboard-nav-label-space">PRACTICE</span>
        <NavLink
          to={reviewCount > 0 ? `/level/${REVIEW_LEVEL_ID}` : '/home'}
          className={navClass}
          onClick={closeMenu}
        >
          <MedIcon name="grid" size={20} />
          <span>Review</span>
          {reviewCount > 0 ? <span className="dashboard-nav-pill">{reviewCount}</span> : null}
        </NavLink>
      </nav>

      <div className="dashboard-sidebar-card">
        <div className="dashboard-sidebar-card-icon">
          <MedIcon name="target" size={18} />
        </div>
        <strong>Weekly goal</strong>
        <span>{weekly.label}</span>
        <div className="dashboard-mini-progress">
          <i style={{ width: `${weekly.percent}%` }} />
        </div>
      </div>

      <NavLink to="/profile" className="dashboard-profile" onClick={closeMenu}>
        <span className="dashboard-avatar">{initials(profile.alias)}</span>
        <span>
          <strong>{profile.alias}</strong>
          <small>Medical learner</small>
        </span>
        <MedIcon name="chevron" size={16} />
      </NavLink>
    </aside>
  )
}
