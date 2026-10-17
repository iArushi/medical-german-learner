import { useEffect, useState } from 'react'
import { STREAK_AND_POINTS_CONFIG } from '../config/streakAndPoints'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { FeedbackToast } from './ui/FeedbackToast'
import {
  getSkillStreakViewFromStorage,
  getTotalPoints,
  restoreSkillStreakFromStorage,
} from '../storage/userProgress'

export function SkillStreakCard() {
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

  const handleRestore = () => {
    if (restoreSkillStreakFromStorage()) {
      setToast(`Streak restored to ${streak.streakAtBreak} days.`)
      setRevision((n) => n + 1)
      return
    }
    setToast(`Need ${streak.restoreCost} points to restore.`)
  }

  return (
    <Card className="mt-4" padding="md" variant="elevated">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-text-muted">Skill streak</p>
          <p className="mt-1 text-2xl font-bold text-text">
            {displayCount}{' '}
            <span className="text-base font-semibold text-text-muted">
              day{displayCount === 1 ? '' : 's'}
            </span>
          </p>
        </div>
        <Badge variant="accent">{totalPoints} pts</Badge>
      </div>

      {streak.isBroken ? (
        <div className="mt-3 border-t border-border pt-3">
          <p className="text-sm text-text-muted">
            Streak broken — was {streak.streakAtBreak} day{streak.streakAtBreak === 1 ? '' : 's'}.
          </p>
          <Button
            variant="primary"
            fullWidth
            className="mt-2"
            onClick={handleRestore}
            disabled={!streak.canRestore}
          >
            Restore ({streak.restoreCost} pts)
          </Button>
          {!streak.canRestore && streak.streakAtBreak > 0 ? (
            <p className="mt-1 text-xs text-text-muted">
              Need {streak.restoreCost} points (you have {totalPoints}).
            </p>
          ) : null}
        </div>
      ) : (
        <p className="mt-2 text-xs leading-relaxed text-text-muted">
          Finish a level, or start Practise within{' '}
          {STREAK_AND_POINTS_CONFIG.learnToPractiseMaxMinutes} min and answer{' '}
          {STREAK_AND_POINTS_CONFIG.minPractiseAnswersForStreakDay} Practise questions.
        </p>
      )}
      <FeedbackToast message={toast} />
    </Card>
  )
}
