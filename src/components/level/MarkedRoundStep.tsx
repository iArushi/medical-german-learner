import { useEffect, useRef, useState } from 'react'
import type { GermanLevel, GermanWord } from '../../lib/loadGermanData'
import { getWordById } from '../../lib/loadGermanData'
import { buildPractiseFeedback } from '../../lib/practiseFeedback'
import {
  advanceMarkedQuestion,
  recordMarkedAnswer,
} from '../../lib/markedRoundLogic'
import type { MistakePhase } from '../../types/progress'
import {
  createInitialPractiseState,
  type MarkedRoundOutcome,
  type PractiseQuestion,
  type PractiseSessionState,
} from '../../types/practise'
import { Button } from '../ui/Button'
import { ProgressBar } from '../ui/ProgressBar'
import { MatchMeaningQuestionView } from './practise/MatchMeaningQuestionView'
import { PickArticleQuestionView } from './practise/PickArticleQuestionView'
import { PractiseFeedbackPanel } from './practise/PractiseFeedbackPanel'

type MarkedRoundStepProps = {
  roundLabel: string
  level: GermanLevel
  words: GermanWord[]
  questions: PractiseQuestion[]
  enableRevisit: boolean
  onComplete: (outcome: MarkedRoundOutcome) => void
  onWordMistake?: (wordId: string, phase: MistakePhase) => void
  onFirstPassAnswer?: () => void
}

function mistakePhase(roundLabel: string, isRevisit: boolean): MistakePhase {
  if (isRevisit) return 'revisit'
  if (roundLabel === 'Improve') return 'improve'
  return 'practise'
}

function applyAnswer(
  state: PractiseSessionState,
  answer: string,
  roundLabel: string,
  onWordMistake?: (wordId: string, phase: MistakePhase) => void,
  onFirstPassAnswer?: () => void,
): PractiseSessionState {
  const question = state.questions[state.currentIndex]
  const next = recordMarkedAnswer(state, answer)
  if (!question.isRevisit) {
    onFirstPassAnswer?.()
  }
  if (!next.lastAnswerCorrect && onWordMistake) {
    onWordMistake(question.wordId, mistakePhase(roundLabel, Boolean(question.isRevisit)))
  }
  return next
}

function buildOutcome(state: PractiseSessionState): MarkedRoundOutcome {
  const firstPassQuestions = state.questions.filter((q) => !q.isRevisit)
  const correctWordIds = firstPassQuestions
    .filter((q) => !state.missedWordIds.includes(q.wordId))
    .map((q) => q.wordId)

  return {
    correctCount: state.correctCount,
    totalCount: state.initialQuestionCount,
    missedWordIds: state.missedWordIds,
    correctWordIds,
  }
}

export function MarkedRoundStep({
  roundLabel,
  level,
  words,
  questions,
  enableRevisit,
  onComplete,
  onWordMistake,
  onFirstPassAnswer,
}: MarkedRoundStepProps) {
  const [state, setState] = useState(() =>
    createInitialPractiseState(questions, enableRevisit),
  )
  const completedRef = useRef(false)

  useEffect(() => {
    if (state.phase !== 'complete' || completedRef.current) return
    completedRef.current = true
    onComplete(buildOutcome(state))
  }, [state, onComplete])

  const question = state.questions[state.currentIndex]
  const showFeedback = state.phase === 'feedback'

  if (state.phase === 'complete') {
    return <p className="text-sm text-text-muted">{roundLabel} complete — loading next step…</p>
  }

  const word = getWordById(question.wordId)
  const feedback =
    showFeedback && word
      ? buildPractiseFeedback(question, word, state.lastAnswerCorrect)
      : null

  const revisitTag = question.isRevisit ? ' · Revisit' : ''
  const roundHeading =
    roundLabel === 'Practise' && question.isRevisit ? 'Revisit' : roundLabel

  return (
    <div className="flex min-h-full flex-col pt-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wide text-text">{roundHeading}</p>
        <p className="text-xs font-semibold text-text-muted">
          Question {state.currentIndex + 1} of {state.questions.length}
          {revisitTag}
        </p>
      </div>
      <h2 className="sr-only">{level.title}</h2>
      <p className="mt-1 text-xs text-text-muted" aria-live="polite">
        Score so far: {state.correctCount} / {state.initialQuestionCount} correct
      </p>
      <div className="mt-3">
        <ProgressBar thin value={state.currentIndex + (showFeedback ? 1 : 0)} max={state.questions.length} />
      </div>

      <div
        key={`${state.currentIndex}-${question.wordId}`}
        className="card-enter mt-6 min-h-[240px] flex-1"
      >
        {question.type === 'match' ? (
          <MatchMeaningQuestionView
            question={question}
            selectedAnswer={state.selectedAnswer}
            showFeedback={showFeedback}
            onSelect={(option) =>
              setState((s) =>
                applyAnswer(s, option, roundLabel, onWordMistake, onFirstPassAnswer),
              )
            }
          />
        ) : (
          <PickArticleQuestionView
            question={question}
            selectedAnswer={state.selectedAnswer}
            showFeedback={showFeedback}
            onSelect={(article) =>
              setState((s) =>
                applyAnswer(s, article, roundLabel, onWordMistake, onFirstPassAnswer),
              )
            }
          />
        )}
      </div>

      <div className="mt-4 min-h-[15.5rem] shrink-0 pb-2">
        {showFeedback && feedback && word ? (
          <div className="flex flex-col gap-3">
            <PractiseFeedbackPanel
              feedback={feedback}
              exampleGerman={word.exampleGerman}
              exampleEnglish={word.exampleEnglish}
            />
            <Button
              variant="primary"
              fullWidth
              onClick={() => setState((s) => advanceMarkedQuestion(s, level, words))}
            >
              Continue
            </Button>
          </div>
        ) : (
          <p className="sr-only">Choose an answer to continue</p>
        )}
      </div>
    </div>
  )
}
