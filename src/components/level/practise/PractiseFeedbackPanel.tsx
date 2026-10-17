import type { PractiseFeedback } from '../../../lib/practiseFeedback'
import { Card } from '../../ui/Card'
import { cn } from '../../../lib/cn'

type PractiseFeedbackPanelProps = {
  feedback: PractiseFeedback
  exampleGerman?: string
  exampleEnglish?: string
}

export function PractiseFeedbackPanel({
  feedback,
  exampleGerman,
  exampleEnglish,
}: PractiseFeedbackPanelProps) {
  return (
    <Card
      padding="md"
      variant="flat"
      role="status"
      aria-live="polite"
      className={cn(
        'feedback-slide-up border-2',
        feedback.isCorrect
          ? 'border-success bg-success-muted'
          : 'border-dashed border-mistake bg-mistake-muted',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-2 text-sm font-bold',
          feedback.isCorrect ? 'text-success' : 'text-accent-strong',
        )}
      >
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-current text-xs"
          aria-hidden
        >
          {feedback.isCorrect ? '✓' : '!'}
        </span>
        {feedback.statusLabel}
      </p>
      <p className="mt-2 text-sm text-text">
        <span className="font-semibold text-text-muted">Correct answer: </span>
        {feedback.correctAnswerLine}
      </p>
      {exampleGerman ? (
        <p className="mt-2 text-sm leading-relaxed text-text">
          <span className="font-semibold text-text-muted">Example: </span>
          {exampleGerman}
        </p>
      ) : null}
      {exampleEnglish ? (
        <p className="mt-1 text-xs leading-relaxed text-text-muted">{exampleEnglish}</p>
      ) : null}
      <p className="mt-2 text-sm leading-relaxed text-text-muted">
        <span className="font-semibold text-text">Tip: </span>
        {feedback.reasonLine}
      </p>
    </Card>
  )
}
