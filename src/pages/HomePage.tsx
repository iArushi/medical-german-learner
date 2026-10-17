import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { DashboardShell } from '../components/dashboard/DashboardShell'
import { Button } from '../components/ui/Button'
import { FeedbackToast } from '../components/ui/FeedbackToast'
import { MedIcon } from '../components/ui/MedIcon'
import { REVIEW_LEVEL_ID } from '../constants/reviewLevel'
import {
  findContinueLevel,
  getLevelPathState,
  isContinueLevelReplay,
} from '../lib/homeLevelPath'
import {
  countWordsInCompletedLevels,
  formatDashboardDate,
  getTimeGreeting,
  getWeeklyGoalView,
  GOAL_RING_CIRCUMFERENCE,
  levelCardTone,
  pathCompletionPercent,
} from '../lib/homeDashboard'
import { getLocalDateKey } from '../lib/localDates'
import { getLevelCardDisplayState } from '../lib/levelCardDisplay'
import { getAllLevels } from '../lib/loadGermanData'
import { getLevelInProgress } from '../storage/levelInProgress'
import {
  getBestCombinedPercent,
  getReviewWordIds,
  getSkillStreakViewFromStorage,
  getTotalPoints,
  getUserProgress,
  restoreSkillStreakFromStorage,
} from '../storage/userProgress'
import { getLocalCompeteProfile } from '../storage/competeStorage'

function levelHref(displayState: string, levelId: string): string {
  if (displayState === 'in-progress') return `/level/${levelId}/progress`
  return `/level/${levelId}/learn`
}

function levelMeta(displayState: string, bestPercent: number | undefined, inProgressPercent?: number): string {
  if (displayState === 'in-progress' && inProgressPercent !== undefined) {
    return `${inProgressPercent}% in progress`
  }
  if (displayState === 'passed' && bestPercent !== undefined) {
    return `Best ${bestPercent}%`
  }
  if (displayState === 'locked') return 'Locked'
  return 'Not started'
}

export function HomePage() {
  const location = useLocation()
  const levels = getAllLevels()

  useEffect(() => {
    if (location.hash !== '#path') return
    const el = document.getElementById('path')
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [location.hash])
  const reviewCount = getReviewWordIds().length
  const continueLevel = findContinueLevel(levels)
  const allComplete = isContinueLevelReplay(levels)
  const continueTargetId = continueLevel?.id
  const continueInProgress = continueTargetId ? getLevelInProgress(continueTargetId) : undefined
  const continueHref = continueTargetId
    ? continueInProgress
      ? `/level/${continueTargetId}/progress`
      : `/level/${continueTargetId}/learn`
    : undefined

  const progressPercent =
    continueInProgress?.combinedPercent ??
    (continueTargetId ? getBestCombinedPercent(continueTargetId) : 0) ??
    0

  const alias = getLocalCompeteProfile().alias.split(' ')[0] ?? 'Learner'
  const weekly = getWeeklyGoalView()
  const ringOffset = GOAL_RING_CIRCUMFERENCE * (1 - weekly.percent / 100)

  const streak = getSkillStreakViewFromStorage()
  const totalPoints = getTotalPoints()
  const wordsMastered = countWordsInCompletedLevels(levels)
  const pathPercent = pathCompletionPercent(levels)

  const [revision, setRevision] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  void revision

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(t)
  }, [toast])

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
    <DashboardShell page="Overview">
      <section className="dashboard-welcome">
        <div>
          <span className="dashboard-eyebrow">
            <MedIcon name="sparkles" size={15} /> {formatDashboardDate()}
          </span>
          <h1>
            {getTimeGreeting()}, {alias}.
          </h1>
          <p>
            Ready to sharpen your medical German? Pick up your next level or review words you missed.
          </p>
          {streak.isBroken && streak.streakAtBreak > 0 ? (
            <div className="dashboard-streak-banner flex flex-wrap items-center justify-between gap-2">
              <span>Streak was {streak.streakAtBreak} days</span>
              <Button variant="secondary" className="px-3 py-1.5 text-xs" onClick={handleRestore} disabled={!streak.canRestore}>
                Restore ({streak.restoreCost} pts)
              </Button>
            </div>
          ) : !streakDoneToday && !streak.isBroken ? (
            <p className="dashboard-streak-banner">Finish a level today to keep your streak going.</p>
          ) : null}
        </div>

        <div className="dashboard-goal-ring" aria-label={`Weekly goal ${weekly.percent} percent`}>
          <svg viewBox="0 0 120 120" aria-hidden>
            <circle className="dashboard-ring-bg" cx="60" cy="60" r="49" />
            <circle
              className="dashboard-ring-fill"
              cx="60"
              cy="60"
              r="49"
              strokeDasharray={GOAL_RING_CIRCUMFERENCE}
              strokeDashoffset={ringOffset}
            />
          </svg>
          <div>
            <strong>{weekly.percent}%</strong>
            <span>weekly goal</span>
          </div>
        </div>
      </section>

      {continueHref && continueLevel ? (
        <Link to={continueHref} className="dashboard-continue-card">
          <div className="dashboard-continue-art">
            <span className="dashboard-art-circle dashboard-circle-one" />
            <span className="dashboard-art-circle dashboard-circle-two" />
            <MedIcon name="stethoscope" size={40} />
          </div>
          <div className="dashboard-continue-copy">
            <span className="dashboard-section-kicker">Continue learning</span>
            <h2>{continueLevel.title}</h2>
            <p>
              Level {continueLevel.order} of {levels.length} · {continueLevel.difficulty}
            </p>
            {progressPercent > 0 ? (
              <div className="dashboard-lesson-progress">
                <div className="dashboard-lesson-progress-bar">
                  <i style={{ width: `${progressPercent}%` }} />
                </div>
                <span>{progressPercent}%</span>
              </div>
            ) : null}
          </div>
          <span className="dashboard-primary-button">
            <span className="dashboard-button-play">
              <MedIcon name="play" size={16} />
            </span>
            {continueInProgress ? 'Resume lesson' : allComplete ? 'Replay level' : 'Start lesson'}
          </span>
        </Link>
      ) : null}

      <section className="dashboard-mode-section" id="path" aria-labelledby="home-path-heading">
        <div className="dashboard-section-heading">
          <div>
            <span className="dashboard-section-kicker">Choose your focus</span>
            <h2 id="home-path-heading">Your learning path</h2>
          </div>
          <p>Levels unlock as you pass each one (75% combined score).</p>
        </div>

        <div className="dashboard-mode-grid">
          {reviewCount > 0 ? (
            <Link
              to={`/level/${REVIEW_LEVEL_ID}`}
              className="dashboard-mode-card dashboard-mode-card-selected"
            >
              <span className="dashboard-mode-check">
                <MedIcon name="check" size={13} />
              </span>
              <span className="dashboard-mode-icon dashboard-tone-lavender">
                <MedIcon name="grid" size={25} />
              </span>
              <strong>Review mistakes</strong>
              <span className="dashboard-mode-description">
                Revisit words you missed in Practise until they stick.
              </span>
              <span className="dashboard-mode-meta">
                <span>
                  <MedIcon name="clock" size={15} />5–10 min
                </span>
                <em>{reviewCount} word{reviewCount === 1 ? '' : 's'}</em>
              </span>
            </Link>
          ) : null}

          {levels.map((level, index) => {
            const pathState = getLevelPathState(level, index, levels)
            const inProgress = getLevelInProgress(level.id)
            const displayState = getLevelCardDisplayState(pathState, level.id, inProgress)
            const locked = displayState === 'locked'
            const isCurrent = continueLevel?.id === level.id
            const bestPercent = getBestCombinedPercent(level.id)
            const tone = levelCardTone(index)
            const href = levelHref(displayState, level.id)

            return (
              <Link
                key={level.id}
                to={locked ? '#' : href}
                className={`dashboard-mode-card ${isCurrent ? 'dashboard-mode-card-selected' : ''} ${locked ? 'dashboard-mode-card-locked' : ''}`}
                aria-disabled={locked || undefined}
                onClick={locked ? (e) => e.preventDefault() : undefined}
              >
                {isCurrent ? (
                  <span className="dashboard-mode-check">
                    <MedIcon name="check" size={13} />
                  </span>
                ) : null}
                <span className={`dashboard-mode-icon dashboard-tone-${tone}`}>
                  <MedIcon name="layers" size={25} />
                </span>
                <strong>{level.title}</strong>
                <span className="dashboard-mode-description">
                  Level {level.order} · {level.questionStyle.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="dashboard-mode-meta">
                  <span>
                    <MedIcon name="clock" size={15} />
                    {level.difficulty}
                  </span>
                  <em>{levelMeta(displayState, bestPercent, inProgress?.combinedPercent)}</em>
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="dashboard-stats-grid" aria-label="Your stats">
        <article>
          <span className="dashboard-stat-icon dashboard-tone-mint">
            <MedIcon name="target" size={20} />
          </span>
          <div>
            <small>Points</small>
            <strong>{totalPoints}</strong>
            <span>Earned from levels & streaks</span>
          </div>
        </article>
        <article>
          <span className="dashboard-stat-icon dashboard-tone-lavender">
            <MedIcon name="layers" size={20} />
          </span>
          <div>
            <small>Words mastered</small>
            <strong>{wordsMastered}</strong>
            <span>From completed levels</span>
          </div>
        </article>
        <article>
          <span className="dashboard-stat-icon dashboard-tone-peach">
            <MedIcon name="chart" size={20} />
          </span>
          <div>
            <small>Path progress</small>
            <strong>{pathPercent}%</strong>
            <span>
              {getUserProgress().completedLevelIds.length} of {levels.length} levels passed
            </span>
          </div>
        </article>
      </section>

      <FeedbackToast message={toast} />
    </DashboardShell>
  )
}
