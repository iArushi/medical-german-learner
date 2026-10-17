import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { buildPractiseQuestionForWord } from '../../lib/buildPractiseQuestions'
import type { GermanLevel, GermanWord } from '../../lib/loadGermanData'
import { combinedScorePercent } from '../../lib/combinedScore'
import { getLevelAttempt, saveImproveOutcome } from '../../storage/levelAttemptSession'
import { clearLevelInProgress } from '../../storage/levelInProgress'
import { recordWordMistake } from '../../storage/userProgress'
import type { MistakePhase } from '../../types/progress'
import type { MarkedRoundOutcome, PractiseQuestion } from '../../types/practise'
import { MarkedRoundStep } from './MarkedRoundStep'

type ImproveStepProps = {
  level: GermanLevel
  levelId: string
  words: GermanWord[]
  missedWordIds: string[]
}

function buildImproveQuestions(
  level: GermanLevel,
  words: GermanWord[],
  missedWordIds: string[],
): PractiseQuestion[] {
  return missedWordIds
    .map((wordId) => buildPractiseQuestionForWord(level, words, wordId, false))
    .filter((q): q is PractiseQuestion => q !== undefined)
}

export function ImproveStep({ level, levelId, words, missedWordIds }: ImproveStepProps) {
  const navigate = useNavigate()
  const questions = useMemo(
    () => buildImproveQuestions(level, words, missedWordIds),
    [level, words, missedWordIds],
  )

  const handleWordMistake = useCallback(
    (wordId: string, phase: MistakePhase) => {
      recordWordMistake(wordId, levelId, phase)
    },
    [levelId],
  )

  const handleComplete = useCallback(
    (outcome: MarkedRoundOutcome) => {
      const session = getLevelAttempt()
      if (!session) return
      const practiseMissed = session.practiseMissedWordIds.length
        ? session.practiseMissedWordIds
        : missedWordIds
      const improveCorrectWordIds = outcome.correctWordIds.filter((id) =>
        practiseMissed.includes(id),
      )

      const ringFrom = combinedScorePercent(
        session.practiseCorrect,
        session.practiseTotal,
        0,
        0,
      )
      saveImproveOutcome(
        outcome.correctCount,
        outcome.totalCount,
        improveCorrectWordIds,
        ringFrom,
      )
      clearLevelInProgress(levelId)
      navigate(`/level/${levelId}/progress`, { replace: true })
    },
    [levelId, missedWordIds, navigate],
  )

  return (
    <MarkedRoundStep
      roundLabel="Improve"
      level={level}
      words={words}
      questions={questions}
      enableRevisit={false}
      onComplete={handleComplete}
      onWordMistake={handleWordMistake}
    />
  )
}
