import { Link } from 'react-router-dom'
import { REVIEW_LEVEL_ID } from '../../constants/reviewLevel'
import { useDashboardShell } from '../../context/DashboardShellContext'
import { getSkillStreakViewFromStorage } from '../../storage/userProgress'
import { getReviewWordIds } from '../../storage/userProgress'
import { MedIcon } from '../ui/MedIcon'

type DashboardTopbarProps = {
  section: string
  page: string
}

export function DashboardTopbar({ section, page }: DashboardTopbarProps) {
  const { openMenu } = useDashboardShell()
  const streak = getSkillStreakViewFromStorage()
  const displayCount = streak.isBroken ? 0 : streak.count
  const reviewCount = getReviewWordIds().length

  return (
    <header className="dashboard-topbar">
      <button type="button" className="dashboard-menu-button" onClick={openMenu} aria-label="Open navigation">
        <MedIcon name="menu" size={20} />
      </button>

      <div className="dashboard-breadcrumb">
        <span>{section}</span>
        <MedIcon name="chevron" size={14} />
        <strong>{page}</strong>
      </div>

      <div className="dashboard-top-actions">
        <span className="dashboard-streak" aria-label={`${displayCount} day streak`}>
          <MedIcon name="flame" size={18} />
          <strong>{displayCount}</strong>
          <span className="hidden min-[360px]:inline"> day streak</span>
        </span>
        <Link
          to={reviewCount > 0 ? `/level/${REVIEW_LEVEL_ID}` : '/home'}
          className="dashboard-icon-button"
          aria-label={reviewCount > 0 ? `${reviewCount} words to review` : 'No reviews pending'}
        >
          {reviewCount > 0 ? <span className="dashboard-notification-dot" aria-hidden /> : null}
          <MedIcon name="message" size={19} />
        </Link>
      </div>
    </header>
  )
}
