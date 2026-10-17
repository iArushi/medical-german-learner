import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { StreakCalendar } from '../components/profile/StreakCalendar'
import { useLearningMode } from '../context/LearningModeContext'
import { STREAK_AND_POINTS_CONFIG } from '../config/streakAndPoints'
import { getLocalCompeteProfile } from '../storage/competeStorage'
import type { LearningMode } from '../types/mode'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { FeedbackToast } from '../components/ui/FeedbackToast'
import {
  getSkillStreakViewFromStorage,
  getTotalPoints,
  restoreSkillStreakFromStorage,
} from '../storage/userProgress'

const MODE_LABEL: Record<LearningMode, string> = {
  individual: 'Learn individually',
  compete: 'Compete mode',
}

export function ProfilePage() {
  const { mode, setMode } = useLearningMode()
  const competeProfile = getLocalCompeteProfile()
  const [revision, setRevision] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  void revision

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(t)
  }, [toast])

  if (!mode) {
    return (
      <div className="px-4 py-6">
        <Card variant="flat" padding="md">
          <p className="text-sm text-text-muted">Choose a learning mode first.</p>
        </Card>
        <Link to="/mode" className="mt-4 inline-block text-sm font-semibold text-primary">
          Choose mode
        </Link>
      </div>
    )
  }

  const streak = getSkillStreakViewFromStorage()
  const totalPoints = getTotalPoints()
  const displayCount = streak.isBroken ? 0 : streak.count
  const restoreCost = STREAK_AND_POINTS_CONFIG.streakRestoreCost

  const handleRestore = () => {
    if (restoreSkillStreakFromStorage()) {
      setToast(`Streak restored to ${streak.streakAtBreak} days.`)
      setRevision((n) => n + 1)
      return
    }
    setToast(`Need ${restoreCost} points to restore (you have ${totalPoints}).`)
  }

  return (
    <div className="flex min-h-full flex-col px-4 pb-4 pt-6">
      <h1 className="text-xl font-bold text-text">Profile</h1>

      <Card className="mt-4" padding="md" variant="elevated">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-text">Points</h2>
          <Badge variant="accent">{totalPoints} pts</Badge>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-text">{displayCount}</span>
          <span className="text-sm font-semibold text-text-muted">
            day{displayCount === 1 ? '' : 's'} streak
          </span>
        </div>
        {displayCount === 0 && !streak.isBroken ? (
          <p className="mt-2 text-sm leading-relaxed text-text-muted" role="status">
            Streak at zero — play a level today to begin. Each qualified day adds to your calendar
            below.
          </p>
        ) : null}
        {streak.isBroken && streak.streakAtBreak > 0 ? (
          <div className="mt-4 border-t border-border pt-4">
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
              Restore streak ({restoreCost} pts)
            </Button>
            {!streak.canRestore ? (
              <p className="mt-1 text-xs text-text-muted">
                You need {restoreCost} points; you have {totalPoints}.
              </p>
            ) : null}
          </div>
        ) : null}
      </Card>

      <Card className="mt-4" padding="md" variant="flat">
        <h2 className="text-sm font-bold text-text">Streak calendar</h2>
        <div className="mt-3">
          <StreakCalendar key={revision} />
        </div>
      </Card>

      <Card className="mt-4" padding="md" variant="elevated">
        <h2 className="text-sm font-bold text-text">Compete alias</h2>
        <p className="mt-2 text-sm font-bold text-text">
          {competeProfile.avatar} {competeProfile.alias}
        </p>
        <p className="mt-1 text-xs text-text-muted">Generated alias — not your real name.</p>
      </Card>

      <section className="mt-6">
        <h2 className="text-sm font-bold text-text">Learning mode</h2>
        <p className="mt-1 text-sm text-text-muted">Current: {MODE_LABEL[mode]}</p>
        <div className="mt-3 flex flex-col gap-2">
          {(['individual', 'compete'] as const).map((option) => (
            <Button
              key={option}
              variant={mode === option ? 'primary' : 'secondary'}
              fullWidth
              className="justify-start text-left"
              onClick={() => setMode(option)}
            >
              {MODE_LABEL[option]}
            </Button>
          ))}
        </div>
      </section>

      <FeedbackToast message={toast} />
    </div>
  )
}
