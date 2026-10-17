import type { MatchMeaningQuestion } from '../../../types/practise'
import { AnswerOption } from './AnswerOption'

type Props = {
  question: MatchMeaningQuestion
  selectedAnswer: string | null
  showFeedback: boolean
  onSelect: (option: string) => void
}

export function MatchMeaningQuestionView({
  question,
  selectedAnswer,
  showFeedback,
  onSelect,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-text-muted">What does this mean?</p>
      <p className="text-2xl font-bold text-text">{question.promptGerman}</p>
      <div className="flex flex-col gap-2" role="group" aria-label="Answer choices">
        {question.options.map((option) => {
          let variant: 'default' | 'correct' | 'incorrect' | 'muted-correct' = 'default'
          if (showFeedback) {
            if (option === question.correctOption) {
              variant = 'correct'
            } else if (option === selectedAnswer) {
              variant = 'incorrect'
            }
          }
          return (
            <AnswerOption
              key={option}
              label={option}
              disabled={showFeedback}
              variant={variant}
              onSelect={() => onSelect(option)}
            />
          )
        })}
      </div>
    </div>
  )
}
