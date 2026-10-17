import { useEffect, useState } from 'react'
import { Badge } from '../ui/Badge'
import { MedIcon } from '../ui/MedIcon'
import { Button } from '../ui/Button'
import { FeedbackToast } from '../ui/FeedbackToast'
import { cn } from '../../lib/cn'
import { getLocalDateKey } from '../../lib/localDates'
import {
  getSkillStreakViewFromStorage,
  getTotalPoints,
  getUserProgress,
  restoreSkillStreakFromStorage,
} from '../../storage/userProgress'

export function HomeTopBar() {
  const [revision, setRevision] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  void revision

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(t)
  }, [toast])

  const streak = getSkillStreakViewFromStorage()
  const totalPoints = getTotalPoints()
  const displayCount = streak.isBroken ? 0 : streak.count
  const todayKey = getLocalDateKey()
  const { skillStreak } = getUserProgress()
  const streakDoneToday =
    !streak.isBroken && skillStreak.lastQualifiedDate === todayKey

  const handleRestore = () => {
    if (restoreSkillStreakFromStorage()) {
      setToast(`Streak restored to ${streak.streakAtBreak} days.`)
      setRevision((n) => n + 1)
      return
    }
    setToast(`Need ${streak.restoreCost} points to restore.`)
  }

  return (
    <header className="sticky top-0 z-20 -mx-4 border-b border-border/80 bg-bg/90 px-4 pb-3 pt-1 backdrop-blur-md">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-accent-muted px-2.5 py-1 text-sm font-bold text-accent-strong"
            aria-label={`Skill streak ${displayCount} days`}
          >
            <MedIcon name="flame" size={16} className="text-accent" aria-hidden />
            {displayCount}
          </span>
          <Badge variant="accent">{totalPoints} pts</Badge>
        </div>

        <div
          className={cn(
            'flex max-w-[52%] items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold',
            streak.isBroken
              ? 'bg-mistake-muted text-accent-strong'
              : streakDoneToday
                ? 'bg-success-muted text-success'
                : 'bg-primary-muted text-primary-hover',
          )}
          role="status"
        >
          <span
            className={cn(
              'h-2 w-2 shrink-0 rounded-full',
              streak.isBroken
                ? 'bg-mistake'
                : streakDoneToday
                  ? 'bg-success'
                  : 'bg-primary',
            )}
            aria-hidden
          />
          <span className="truncate">
            {streak.isBroken
              ? 'Streak broken'
              : streakDoneToday
                ? "Today's streak · Done"
                : "Today's streak · To earn"}
          </span>
        </div>
      </div>

      {displayCount === 0 && !streak.isBroken ? (
        <p className="mt-2 text-xs leading-relaxed text-text-muted" role="status">
          Streak at zero — finish a level or Learn→Practise today to start your first day.
        </p>
      ) : null}

      {streak.isBroken && streak.streakAtBreak > 0 ? (
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-xs text-text-muted">
            Was {streak.streakAtBreak} day{streak.streakAtBreak === 1 ? '' : 's'}
          </p>
          <Button
            variant="secondary"
            className="px-3 py-1.5 text-xs"
            onClick={handleRestore}
            disabled={!streak.canRestore}
          >
            Restore ({streak.restoreCost} pts)
          </Button>
        </div>
      ) : null}

      <FeedbackToast message={toast} />
    </header>
  )
}
