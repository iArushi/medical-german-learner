import { Link } from 'react-router-dom'
import { DifficultyLabel } from '../DifficultyLabel'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { CircularProgressRing } from '../ui/CircularProgressRing'
import { cn } from '../../lib/cn'
import { getLevelCardDisplayState } from '../../lib/levelCardDisplay'
import type { LevelPathState } from '../../lib/homeLevelPath'
import type { GermanLevel } from '../../lib/loadGermanData'
import type { LevelInProgress } from '../../types/levelInProgress'

type LevelPathCardProps = {
  level: GermanLevel
  stepNumber: number
  pathState: LevelPathState
  bestPercent: number | undefined
  inProgress?: LevelInProgress
  isLast: boolean
  isCurrent: boolean
  staggerIndex?: number
}

const STATUS_PILL: Record<string, string> = {
  locked: 'bg-border/80 text-text-muted',
  'not-started': 'bg-primary-muted text-primary-hover',
  'in-progress': 'bg-mistake-muted text-accent-strong',
  passed: 'bg-success-muted text-success',
}

function actionHref(displayState: string, levelId: string): string {
  if (displayState === 'in-progress') return `/level/${levelId}/progress`
  return `/level/${levelId}/learn`
}

function actionLabel(displayState: string): string {
  if (displayState === 'in-progress') return 'Resume'
  if (displayState === 'passed') return 'Replay'
  return 'Start'
}

function statusPillLabel(displayState: string): string {
  if (displayState === 'locked') return 'Locked'
  if (displayState === 'in-progress') return 'In progress'
  if (displayState === 'passed') return 'Passed'
  return 'Not started'
}

function statusLine(
  displayState: string,
  bestPercent: number | undefined,
  inProgressPercent?: number,
): string {
  if (displayState === 'in-progress' && inProgressPercent !== undefined) {
    return `In progress · ${inProgressPercent}% so far`
  }
  if (displayState === 'passed' && bestPercent !== undefined) {
    return `✓ Best score · ${bestPercent}%`
  }
  if (displayState === 'not-started') {
    return 'Not started yet'
  }
  return ''
}

export function LevelPathCard(props: LevelPathCardProps) {
  const {
    level,
    pathState,
    isLast,
    isCurrent,
    stepNumber,
    bestPercent,
    inProgress,
    staggerIndex = 0,
  } = props

  const inProgressPercent = inProgress?.combinedPercent
  const displayState = getLevelCardDisplayState(pathState, level.id, inProgress)

  const locked = displayState === 'locked'
  const showReplayHint =
    displayState === 'passed' && bestPercent !== undefined && bestPercent < 100

  const ringTone =
    displayState === 'in-progress'
      ? 'amber'
      : displayState === 'passed'
        ? 'primary'
        : 'empty'

  const ringPercent =
    displayState === 'in-progress'
      ? (inProgressPercent ?? 0)
      : displayState === 'passed'
        ? (bestPercent ?? 0)
        : 0

  const nodeClass = cn(
    'absolute left-0 top-7 z-10 h-3.5 w-3.5 rounded-full border-2 bg-surface',
    pathState === 'completed' && 'border-success bg-success',
    pathState === 'available' && 'border-primary bg-primary',
    pathState === 'locked' && 'border-border bg-bg',
  )

  return (
    <li
      className="stagger-enter relative flex gap-3 pb-4 last:pb-0"
      style={{ animationDelay: `${Math.min(staggerIndex, 8) * 45}ms` }}
    >
      {!isLast ? (
        <span className="absolute bottom-0 left-[6px] top-10 w-0.5 bg-border" aria-hidden />
      ) : null}
      <span className={nodeClass} aria-hidden />

      <Card
        padding="md"
        variant={displayState === 'passed' ? 'flat' : 'elevated'}
        className={cn(
          'path-card relative ml-1 flex-1',
          locked && 'path-card-locked opacity-55',
          isCurrent && !locked && 'ring-2 ring-primary/25',
        )}
        aria-disabled={locked || undefined}
      >
        <div className="flex items-start gap-3">
          {!locked ? (
            <div className="shrink-0 pt-0.5">
              <CircularProgressRing
                percent={ringPercent}
                tone={ringTone}
                size={56}
                strokeWidth={5}
                compact
                animateFillOnMount
                showCenterText={displayState !== 'not-started'}
                label={`${level.title} progress`}
              />
            </div>
          ) : null}

          <div className="min-w-0 flex-1">
            <p className="section-kicker">Level {stepNumber}</p>
            <p className="font-display mt-0.5 truncate text-sm font-bold text-text">{level.title}</p>
            {showReplayHint ? (
              <p className="mt-0.5 text-xs text-text-muted">Replay to improve</p>
            ) : null}
            {!locked ? (
              <p className="mt-1 text-xs font-semibold text-text">
                {statusLine(displayState, bestPercent, inProgressPercent)}
              </p>
            ) : null}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <DifficultyLabel difficulty={level.difficulty} />
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                  STATUS_PILL[displayState],
                )}
              >
                {statusPillLabel(displayState)}
              </span>
            </div>
          </div>

          {!locked ? (
            <Link to={actionHref(displayState, level.id)} className="shrink-0 self-center">
              <Button variant="primary" className="px-3 py-2 text-xs">
                {actionLabel(displayState)}
              </Button>
            </Link>
          ) : null}
        </div>
      </Card>
    </li>
  )
}
