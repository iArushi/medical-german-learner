import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { buildPractiseQuestions } from '../../lib/buildPractiseQuestions'
import type { GermanLevel, GermanWord } from '../../lib/loadGermanData'
import { savePractiseOutcome } from '../../storage/levelAttemptSession'
import { recordPractiseFirstPassAnswer } from '../../lib/learnPractiseStreakRoute'
import { recordWordMistake } from '../../storage/userProgress'
import type { MistakePhase } from '../../types/progress'
import type { MarkedRoundOutcome } from '../../types/practise'
import { MarkedRoundStep } from './MarkedRoundStep'

type PractiseStepProps = {
  level: GermanLevel
  levelId: string
  words: GermanWord[]
}

export function PractiseStep({ level, levelId, words }: PractiseStepProps) {
  const navigate = useNavigate()
  const questions = useMemo(() => buildPractiseQuestions(level, words), [level, words])

  const handleFirstPassAnswer = useCallback(() => {
    recordPractiseFirstPassAnswer(levelId)
  }, [levelId])

  const handleWordMistake = useCallback(
    (wordId: string, phase: MistakePhase) => {
      recordWordMistake(wordId, levelId, phase)
    },
    [levelId],
  )

  const handleComplete = useCallback(
    (outcome: MarkedRoundOutcome) => {
      savePractiseOutcome(
        levelId,
        outcome.correctCount,
        outcome.totalCount,
        outcome.missedWordIds,
      )
      navigate(`/level/${levelId}/progress`, { replace: true })
    },
    [levelId, navigate],
  )

  if (questions.length === 0) {
    return <p className="text-sm text-text-muted">No practise questions for this level.</p>
  }

  return (
    <MarkedRoundStep
      roundLabel="Practise"
      level={level}
      words={words}
      questions={questions}
      enableRevisit={false}
      onComplete={handleComplete}
      onWordMistake={handleWordMistake}
      onFirstPassAnswer={handleFirstPassAnswer}
    />
  )
}
