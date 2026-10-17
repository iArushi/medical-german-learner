import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { DifficultyLabel } from '../../components/DifficultyLabel'
import { ReviewLabel } from '../../components/ReviewLabel'
import { PassCelebration } from '../../components/level/result/PassCelebration'
import { ResultCombinedGauge } from '../../components/level/result/ResultCombinedGauge'
import { WordOutcomeRow } from '../../components/level/result/WordOutcomeRow'
import { REVIEW_LEVEL_ID } from '../../constants/reviewLevel'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { cn } from '../../lib/cn'
import { combinedScorePercent, hasPassed } from '../../lib/combinedScore'
import { findContinueLevel } from '../../lib/homeLevelPath'
import { resolveLevel } from '../../lib/levelAccess'
import { getAllLevels } from '../../lib/loadGermanData'
import { getLocalDateKey } from '../../lib/localDates'
import { getLevelAttempt } from '../../storage/levelAttemptSession'
import { clearLevelInProgress } from '../../storage/levelInProgress'
import {
  getSkillStreakViewFromStorage,
  getUserProgress,
  recordLevelAttemptResult,
} from '../../storage/userProgress'
import type { LevelScoreRecord } from '../../types/progress'

function resolveNextLevelHref(levelId: string): string {
  const levels = getAllLevels()
  if (levelId === REVIEW_LEVEL_ID) {
    const next = findContinueLevel(levels)
    return next ? `/level/${next.id}/learn` : '/home'
  }
  const index = levels.findIndex((l) => l.id === levelId)
  if (index >= 0 && index < levels.length - 1) {
    return `/level/${levels[index + 1].id}/learn`
  }
  return '/home'
}

export function LevelResultPage() {
  const { levelId } = useParams<{ levelId: string }>()
  const level = levelId ? resolveLevel(levelId) : undefined
  const attempt = getLevelAttempt()
  const savedRef = useRef(false)
  const [savedRecord, setSavedRecord] = useState<LevelScoreRecord | null>(null)

  useEffect(() => {
    if (!levelId || !attempt || attempt.levelId !== levelId || savedRef.current) return
    savedRef.current = true
    const combinedPercent = combinedScorePercent(
      attempt.practiseCorrect,
      attempt.practiseTotal,
      attempt.improveCorrect,
      attempt.improveTotal,
    )
    const record = recordLevelAttemptResult({
      levelId,
      passed: hasPassed(combinedPercent),
      combinedPercent,
      practiseCorrect: attempt.practiseCorrect,
      practiseTotal: attempt.practiseTotal,
      improveCorrect: attempt.improveCorrect,
      improveTotal: attempt.improveTotal,
      practiseMissedWordIds: attempt.practiseMissedWordIds,
    })
    setSavedRecord(record)
    clearLevelInProgress(levelId)
  }, [attempt, levelId])

  const streak = getSkillStreakViewFromStorage()
  const streakDisplay = streak.isBroken ? 0 : streak.count
  const streakDoneToday =
    !streak.isBroken && getUserProgress().skillStreak.lastQualifiedDate === getLocalDateKey()

  const wordOutcomes = useMemo(() => {
    if (!attempt) return { improved: [] as string[], stillWrong: [] as string[] }
    const improved = attempt.improveCorrectWordIds
    const stillWrong = attempt.practiseMissedWordIds.filter((id) => !improved.includes(id))
    return { improved, stillWrong }
  }, [attempt])

  if (!levelId || !level) {
    return (
      <div className="px-4 py-6">
        <EmptyState title="Result unavailable" description="This level could not be loaded." />
        <Link to="/home" className="mt-4 inline-block text-sm font-semibold text-primary">
          Back to Home
        </Link>
      </div>
    )
  }

  if (!attempt || attempt.levelId !== levelId) {
    return <Navigate to={`/level/${levelId}/learn`} replace />
  }

  const isReview = levelId === REVIEW_LEVEL_ID
  const combinedPercent = combinedScorePercent(
    attempt.practiseCorrect,
    attempt.practiseTotal,
    attempt.improveCorrect,
    attempt.improveTotal,
  )
  const passed = hasPassed(combinedPercent)
  const nextLevelHref = resolveNextLevelHref(levelId)
  const pointsEarned = savedRecord?.pointsEarned ?? 0

  return (
    <div className="relative flex min-h-full flex-col px-4 pb-6 pt-6">
      {passed ? <PassCelebration /> : null}

      <Link to="/home" className="text-sm font-semibold text-primary">
        ← Home
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-bold text-text">{level.title}</h1>
        {isReview ? <ReviewLabel /> : <DifficultyLabel difficulty={level.difficulty} />}
      </div>

      <Card
        className={cn(
          'mt-4',
          passed ? 'border-success/40 bg-success-muted' : 'border-mistake/50 bg-mistake-muted',
        )}
        padding="md"
        variant="flat"
      >
        <p className={cn('text-2xl font-extrabold', passed ? 'text-success' : 'text-accent-strong')}>
          {passed ? 'You passed!' : 'Try again'}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-text-muted">
          {passed
            ? 'Nice work — here is what you improved this run.'
            : 'You are close. Check which words still need practice, then replay the level.'}
        </p>
      </Card>

      <Card className="mt-4" padding="md" variant="elevated">
        <h2 className="text-sm font-bold text-text">Scores</h2>
        <ResultCombinedGauge
          practiseCorrect={attempt.practiseCorrect}
          practiseTotal={attempt.practiseTotal}
          improveCorrect={attempt.improveCorrect}
          improveTotal={attempt.improveTotal}
          combinedPercent={combinedPercent}
          passed={passed}
        />
      </Card>

      <Card className="mt-4" padding="md" variant="flat">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent">
            {passed ? `+${pointsEarned} points` : '0 points this run'}
          </Badge>
          <Badge variant={streakDoneToday ? 'easy' : 'medium'}>
            🔥 {streakDisplay} day{streakDisplay === 1 ? '' : 's'}
            {streakDoneToday ? ' · streak earned today' : ' · streak pending today'}
          </Badge>
        </div>
        {savedRecord?.isReplay && passed ? (
          <p className="mt-2 text-xs text-text-muted">Replay level — reduced points apply.</p>
        ) : null}
        {!savedRecord?.isReplay && passed && attempt.practiseMissedWordIds.length === 0 ? (
          <p className="mt-2 text-xs text-text-muted">Clean pass — no Practise mistakes.</p>
        ) : null}
      </Card>

      <section className="mt-6" aria-labelledby="improved-heading">
        <h2 id="improved-heading" className="text-sm font-bold text-text">
          Wrong → right in Improve
        </h2>
        {wordOutcomes.improved.length === 0 ? (
          <p className="mt-2 text-sm text-text-muted">
            {attempt.practiseMissedWordIds.length === 0
              ? 'Every Practise answer was correct on the first try.'
              : 'No missed words were answered correctly in Improve this time.'}
          </p>
        ) : (
          <ul className="mt-2 flex flex-col gap-2">
            {wordOutcomes.improved.map((id) => (
              <WordOutcomeRow key={id} wordId={id} variant="improved" />
            ))}
          </ul>
        )}
      </section>

      {wordOutcomes.stillWrong.length > 0 ? (
        <section className="mt-6" aria-labelledby="still-wrong-heading">
          <h2 id="still-wrong-heading" className="text-sm font-bold text-text">
            Still to practice
          </h2>
          <ul className="mt-2 flex flex-col gap-2">
            {wordOutcomes.stillWrong.map((id) => (
              <WordOutcomeRow key={id} wordId={id} variant="still-wrong" />
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-8 flex flex-col gap-2">
        <Link to={nextLevelHref} className="block">
          <Button variant="primary" fullWidth>
            Next level
          </Button>
        </Link>
        <Link to={`/level/${levelId}/learn`} className="block">
          <Button variant="secondary" fullWidth>
            Replay level
          </Button>
        </Link>
      </div>
    </div>
  )
}
