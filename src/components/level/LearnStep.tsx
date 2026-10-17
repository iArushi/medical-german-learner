import { useCallback, useRef, useState } from 'react'
import type { GermanLevel, GermanWord } from '../../lib/loadGermanData'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'
import { LearnWordCard } from './LearnWordCard'
import { cn } from '../../lib/cn'

const SWIPE_MIN_PX = 48

type LearnStepProps = {
  level: GermanLevel
  words: GermanWord[]
  onStartPractise: () => void
}

export function LearnStep({ level, words, onStartPractise }: LearnStepProps) {
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  const isLast = index >= words.length - 1
  const word = words[index]

  const goNext = useCallback(() => {
    if (index < words.length - 1) {
      setIndex((i) => i + 1)
    }
  }, [index, words.length])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current
    touchStartX.current = null
    if (start === null) return
    const endX = e.changedTouches[0]?.clientX ?? start
    if (start - endX >= SWIPE_MIN_PX && !isLast) {
      goNext()
    }
  }

  if (!word) {
    return null
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-wide text-text-muted">Learn</p>
          <p className="text-xs font-bold text-text">
            Card {index + 1} of {words.length}
          </p>
        </div>
        <div className="mt-1.5">
          <ProgressBar thin value={index + 1} max={words.length} />
        </div>
        <p
          className="mt-2 rounded-card border border-dashed border-primary/35 bg-primary-muted/40 px-3 py-2 text-center text-xs font-semibold leading-snug text-primary-hover"
          role="note"
        >
          This step is not marked — browse the words, then start Practise for your score.
        </p>
        <p className="mt-1 truncate text-center text-[11px] text-text-muted">{level.title}</p>
      </div>

      <button
        type="button"
        onClick={() => !isLast && goNext()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={cn(
          'mt-3 flex min-h-0 flex-1 flex-col',
          !isLast && 'cursor-pointer active:opacity-[0.98]',
        )}
        aria-label={isLast ? 'Last word on this card' : 'Tap or swipe left for next word'}
      >
        <Card
          key={word.id}
          padding="md"
          variant="elevated"
          className="card-enter flex min-h-0 flex-1 flex-col justify-center shadow-soft"
        >
          <LearnWordCard word={word} />
          {!isLast ? (
            <p className="mt-4 shrink-0 text-center text-[11px] font-medium text-text-muted">
              Swipe left or tap Next →
            </p>
          ) : null}
        </Card>
      </button>

      <div className="shrink-0 pt-3">
        {isLast ? (
          <Button variant="primary" fullWidth onClick={onStartPractise}>
            Start Practise
          </Button>
        ) : (
          <Button variant="secondary" fullWidth onClick={goNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  )
}
