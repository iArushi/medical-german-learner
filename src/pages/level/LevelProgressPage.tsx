import { useEffect } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { CircularProgressRing } from '../../components/ui/CircularProgressRing'
import { Button } from '../../components/ui/Button'
import { combinedScorePercent } from '../../lib/combinedScore'
import { countWordsToFix, wordsToFixMessage } from '../../lib/levelProgressCopy'
import { resolveLevel } from '../../lib/levelAccess'
import {
  clearRingAnimationFlag,
  getLevelAttempt,
} from '../../storage/levelAttemptSession'
import {
  clearLevelInProgress,
  saveLevelInProgressFromAttempt,
} from '../../storage/levelInProgress'

export function LevelProgressPage() {
  const { levelId } = useParams<{ levelId: string }>()
  const navigate = useNavigate()
  const level = levelId ? resolveLevel(levelId) : undefined
  const attempt = getLevelAttempt()

  useEffect(() => {
    return () => {
      clearRingAnimationFlag()
    }
  }, [])

  if (!levelId || !level) {
    return <Navigate to="/home" replace />
  }

  if (!attempt || attempt.levelId !== levelId) {
    return <Navigate to={`/level/${levelId}/practise`} replace />
  }

  const combinedPercent = combinedScorePercent(
    attempt.practiseCorrect,
    attempt.practiseTotal,
    attempt.improveCorrect,
    attempt.improveTotal,
  )
  const wordsToFix = countWordsToFix(attempt)
  const afterImprove = attempt.improveTotal > 0
  const animateFrom =
    attempt.ringAnimateFromPercent != null ? attempt.ringAnimateFromPercent : undefined

  const handleSaveForLater = () => {
    saveLevelInProgressFromAttempt(attempt)
    navigate('/home', { replace: true })
  }

  const handleFixNow = () => {
    if (wordsToFix === 0 && attempt.practiseMissedWordIds.length === 0) {
      navigate(`/level/${levelId}/result`, { replace: true })
      return
    }
    navigate(`/level/${levelId}/revisit`, { replace: true })
  }

  const handleViewResults = () => {
    clearLevelInProgress(levelId)
    navigate(`/level/${levelId}/result`, { replace: true })
  }

  return (
    <div className="flex flex-col items-center pb-6">
      <p className="text-xs font-bold uppercase tracking-wide text-text-muted">Progress</p>
      <h2 className="mt-1 text-lg font-bold text-text">{level.title}</h2>

      <div className="mt-8">
        <CircularProgressRing
          percent={combinedPercent}
          animateFrom={animateFrom}
          label={`${level.title} progress`}
        />
      </div>

      <p className="mt-6 max-w-sm text-center text-base font-medium leading-relaxed text-text">
        {wordsToFixMessage(wordsToFix)}
      </p>

      <div className="mt-8 flex w-full max-w-sm flex-col gap-2">
        {afterImprove || (wordsToFix === 0 && attempt.practiseMissedWordIds.length === 0) ? (
          <Button variant="primary" fullWidth onClick={handleViewResults}>
            View my results
          </Button>
        ) : (
          <>
            <Button variant="primary" fullWidth onClick={handleFixNow}>
              Fix my mistakes now
            </Button>
            <Button variant="secondary" fullWidth onClick={handleSaveForLater}>
              Save for later
            </Button>
          </>
        )}
      </div>

      <Link to="/home" className="mt-4 text-sm font-semibold text-primary">
        Back to Home
      </Link>
    </div>
  )
}
