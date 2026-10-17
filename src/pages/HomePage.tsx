import { Link } from 'react-router-dom'
import { REVIEW_LEVEL_ID } from '../constants/reviewLevel'
import { HomeTopBar } from '../components/home/HomeTopBar'
import { LevelPathCard } from '../components/home/LevelPathCard'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { cn } from '../lib/cn'
import {
  findContinueLevel,
  getLevelPathState,
  isContinueLevelReplay,
} from '../lib/homeLevelPath'
import { getAllLevels } from '../lib/loadGermanData'
import { getLevelInProgress } from '../storage/levelInProgress'
import { getBestCombinedPercent, getReviewWordIds } from '../storage/userProgress'

export function HomePage() {
  const levels = getAllLevels()
  const reviewWordIds = getReviewWordIds()
  const reviewCount = reviewWordIds.length
  const continueLevel = findContinueLevel(levels)
  const allComplete = isContinueLevelReplay(levels)
  const continueTargetId = continueLevel?.id
  const continueInProgress = continueTargetId ? getLevelInProgress(continueTargetId) : undefined
  const continueHref = continueTargetId
    ? continueInProgress
      ? `/level/${continueTargetId}/progress`
      : `/level/${continueTargetId}/learn`
    : undefined

  return (
    <div className="flex min-h-full flex-col px-4 pb-4 pt-2">
      <HomeTopBar />

      <section className="mt-4" aria-label="Quick actions">
        {continueHref ? (
          <Link
            to={continueHref}
            className={cn(
              'flex w-full flex-col rounded-card bg-primary px-4 py-4 text-white shadow-soft transition-colors duration-200',
              'active:bg-primary-hover',
            )}
          >
            <span className="text-xs font-bold uppercase tracking-wide text-white/85">
              {continueInProgress ? 'Resume' : allComplete ? 'Keep going' : 'Continue'}
            </span>
            <span className="mt-0.5 text-lg font-bold leading-tight">{continueLevel?.title}</span>
            <span className="mt-1 text-sm font-medium text-white/90">
              {continueInProgress
                ? 'Pick up where you left off'
                : allComplete
                  ? 'Replay from the start'
                  : 'Tap to open your next level'}
            </span>
          </Link>
        ) : null}

        {reviewCount > 0 ? (
          <Link to={`/level/${REVIEW_LEVEL_ID}`} className="mt-3 block active:opacity-95">
            <Card padding="sm" variant="review" className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-text">Review mistakes</p>
                <p className="mt-0.5 text-xs text-text-muted">
                  {reviewCount} word{reviewCount === 1 ? '' : 's'} waiting
                </p>
              </div>
              <span className="flex h-10 min-w-10 items-center justify-center rounded-full bg-review/15 text-sm font-bold text-review">
                {reviewCount}
              </span>
            </Card>
          </Link>
        ) : (
          <div className="mt-3">
            <EmptyState
              icon="🌿"
              title="No mistakes yet"
              description="When you miss a word in Practise, it will show up here so you can review."
            />
          </div>
        )}
      </section>

      <section className="mt-8" aria-labelledby="home-path-heading">
        <h2
          id="home-path-heading"
          className="text-sm font-bold uppercase tracking-wide text-text-muted"
        >
          Your path
        </h2>
        <ol className="relative mt-4 pl-2">
          {levels.map((level, index) => {
            const pathState = getLevelPathState(level, index, levels)
            const bestPercent = getBestCombinedPercent(level.id)
            const isCurrent = continueLevel?.id === level.id
            const inProgress = getLevelInProgress(level.id)

            return (
              <LevelPathCard
                key={level.id}
                level={level}
                stepNumber={level.order}
                pathState={pathState}
                bestPercent={bestPercent}
                inProgress={inProgress}
                isLast={index === levels.length - 1}
                isCurrent={isCurrent}
              />
            )
          })}
        </ol>
      </section>
    </div>
  )
}
