import { useCallback, useMemo } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { buildPractiseQuestionForWord } from '../../lib/buildPractiseQuestions'
import type { GermanLevel, GermanWord } from '../../lib/loadGermanData'
import { getLevelAttempt } from '../../storage/levelAttemptSession'
import { recordWordMistake } from '../../storage/userProgress'
import type { MistakePhase } from '../../types/progress'
import type { MarkedRoundOutcome, PractiseQuestion } from '../../types/practise'
import { MarkedRoundStep } from './MarkedRoundStep'

type RevisitStepProps = {
  level: GermanLevel
  levelId: string
  words: GermanWord[]
  missedWordIds: string[]
}

function buildRevisitQuestions(
  level: GermanLevel,
  words: GermanWord[],
  missedWordIds: string[],
): PractiseQuestion[] {
  return missedWordIds
    .map((wordId) => buildPractiseQuestionForWord(level, words, wordId, true))
    .filter((q): q is PractiseQuestion => q !== undefined)
}

export function RevisitStep({ level, levelId, words, missedWordIds }: RevisitStepProps) {
  const navigate = useNavigate()
  const questions = useMemo(
    () => buildRevisitQuestions(level, words, missedWordIds),
    [level, words, missedWordIds],
  )

  const handleWordMistake = useCallback(
    (wordId: string, phase: MistakePhase) => {
      recordWordMistake(wordId, levelId, phase)
    },
    [levelId],
  )

  const handleComplete = useCallback(
    (_outcome: MarkedRoundOutcome) => {
      const session = getLevelAttempt()
      if (!session || session.levelId !== levelId) return
      navigate(`/level/${levelId}/improve`, { replace: true })
    },
    [levelId, navigate],
  )

  if (questions.length === 0) {
    return <Navigate to={`/level/${levelId}/improve`} replace />
  }

  return (
    <MarkedRoundStep
      roundLabel="Revisit"
      level={level}
      words={words}
      questions={questions}
      enableRevisit={false}
      onComplete={handleComplete}
      onWordMistake={handleWordMistake}
    />
  )
}
