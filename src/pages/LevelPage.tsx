import type { ReactNode } from 'react'
import { useEffect } from 'react'
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { DifficultyLabel } from '../components/DifficultyLabel'
import { ReviewLabel } from '../components/ReviewLabel'
import { EmptyState } from '../components/ui/EmptyState'
import { REVIEW_LEVEL_ID } from '../constants/reviewLevel'
import { ImproveStep } from '../components/level/ImproveStep'
import { LearnStep } from '../components/level/LearnStep'
import { PractiseStep } from '../components/level/PractiseStep'
import { RevisitStep } from '../components/level/RevisitStep'
import { resolveLevel, resolveWordsForLevel } from '../lib/levelAccess'
import { getLevelAttempt } from '../storage/levelAttemptSession'
import { markPractiseStarted, startLearnSession } from '../storage/levelStreakSession'
import { LevelProgressPage } from './level/LevelProgressPage'
import { LevelResultPage } from './level/LevelResultPage'
import { restoreAttemptFromInProgress } from '../storage/levelInProgress'

function LevelShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const { levelId } = useParams<{ levelId: string }>()
  const level = levelId ? resolveLevel(levelId) : undefined
  const isReview = levelId === REVIEW_LEVEL_ID
  const isLearnStep = pathname.endsWith('/learn')

  if (!levelId || !level) {
    return (
      <div className="px-4 py-6">
        <EmptyState
          title={levelId === REVIEW_LEVEL_ID ? 'Review is empty' : 'Level not found'}
          description={
            levelId === REVIEW_LEVEL_ID
              ? 'Miss a word in Practise, then come back here from Home.'
              : 'This level link may be outdated. Pick a level from Home.'
          }
        />
        <Link
          to="/home"
          className="mt-4 inline-block text-sm font-semibold text-primary"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  if (isLearnStep) {
    return (
      <div className="flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden px-4 pb-3 pt-3">
        <Link to="/home" className="shrink-0 text-sm font-semibold text-primary">
          ← Home
        </Link>
        <div className="mt-2 min-h-0 flex-1">{children}</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col px-4 pb-4 pt-6">
      <Link to="/home" className="text-sm font-semibold text-primary">
        ← Home
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <h1 className="text-lg font-bold text-text">{level.title}</h1>
        {isReview ? <ReviewLabel /> : <DifficultyLabel difficulty={level.difficulty} />}
      </div>
      <div className="mt-4 flex-1">{children}</div>
    </div>
  )
}

function LearnRoute() {
  const { levelId } = useParams<{ levelId: string }>()
  const navigate = useNavigate()
  const level = levelId ? resolveLevel(levelId) : undefined
  const words = levelId ? resolveWordsForLevel(levelId) : []

  useEffect(() => {
    if (levelId) {
      startLearnSession(levelId)
    }
  }, [levelId])

  if (!level || !levelId) {
    return <p className="text-sm text-text-muted">Loading level…</p>
  }

  if (words.length === 0) {
    return <Navigate to="/home" replace />
  }

  return (
    <LearnStep
      level={level}
      words={words}
      onStartPractise={() => {
        markPractiseStarted(levelId)
        navigate(`/level/${levelId}/practise`, { replace: true })
      }}
    />
  )
}

function PractiseRoute() {
  const { levelId } = useParams<{ levelId: string }>()
  const level = levelId ? resolveLevel(levelId) : undefined
  const words = levelId ? resolveWordsForLevel(levelId) : []

  if (!level || !levelId) {
    return <p className="text-sm text-text-muted">Loading Practise…</p>
  }

  return <PractiseStep level={level} levelId={levelId} words={words} />
}

function ProgressRoute() {
  const { levelId } = useParams<{ levelId: string }>()
  if (!levelId) return <Navigate to="/home" replace />
  const attempt = getLevelAttempt()
  if (!attempt || attempt.levelId !== levelId) {
    restoreAttemptFromInProgress(levelId)
  }
  return <LevelProgressPage />
}

function RevisitRoute() {
  const { levelId } = useParams<{ levelId: string }>()
  const level = levelId ? resolveLevel(levelId) : undefined
  const words = levelId ? resolveWordsForLevel(levelId) : []
  const attempt = getLevelAttempt()

  if (!level || !levelId) {
    return <p className="text-sm text-text-muted">Loading Revisit…</p>
  }

  if (!attempt || attempt.levelId !== levelId) {
    return <Navigate to={`/level/${levelId}/progress`} replace />
  }

  if (attempt.practiseMissedWordIds.length === 0) {
    return <Navigate to={`/level/${levelId}/progress`} replace />
  }

  return (
    <RevisitStep
      level={level}
      levelId={levelId}
      words={words}
      missedWordIds={attempt.practiseMissedWordIds}
    />
  )
}

function ImproveRoute() {
  const { levelId } = useParams<{ levelId: string }>()
  const navigate = useNavigate()
  const level = levelId ? resolveLevel(levelId) : undefined
  const words = levelId ? resolveWordsForLevel(levelId) : []
  const attempt = getLevelAttempt()

  useEffect(() => {
    if (!levelId || !attempt || attempt.levelId !== levelId) return
    if (attempt.practiseMissedWordIds.length === 0) {
      navigate(`/level/${levelId}/progress`, { replace: true })
    }
  }, [attempt, levelId, navigate])

  if (!level || !levelId) {
    return <p className="text-sm text-text-muted">Loading Improve…</p>
  }

  if (!attempt || attempt.levelId !== levelId) {
    return <Navigate to={`/level/${levelId}/progress`} replace />
  }

  if (attempt.practiseMissedWordIds.length === 0) {
    return null
  }

  return (
    <ImproveStep
      level={level}
      levelId={levelId}
      words={words}
      missedWordIds={attempt.practiseMissedWordIds}
    />
  )
}

function LevelResultRoute() {
  return <LevelResultPage />
}

export function LevelPage() {
  const { levelId } = useParams<{ levelId: string }>()

  return (
    <LevelShell>
      <Routes>
        <Route index element={<Navigate to="learn" replace />} />
        <Route path="learn" element={<LearnRoute />} />
        <Route path="practise" element={<PractiseRoute />} />
        <Route path="progress" element={<ProgressRoute />} />
        <Route path="revisit" element={<RevisitRoute />} />
        <Route path="improve" element={<ImproveRoute />} />
        <Route path="result" element={<LevelResultRoute />} />
        <Route path="*" element={<Navigate to={`/level/${levelId}/learn`} replace />} />
      </Routes>
    </LevelShell>
  )
}
