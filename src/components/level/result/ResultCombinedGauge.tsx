import { PASS_THRESHOLD_PERCENT } from '../../../lib/combinedScore'
import { cn } from '../../../lib/cn'

type ResultCombinedGaugeProps = {
  practiseCorrect: number
  practiseTotal: number
  improveCorrect: number
  improveTotal: number
  combinedPercent: number
  passed: boolean
}

function partPercent(correct: number, total: number): number {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

export function ResultCombinedGauge({
  practiseCorrect,
  practiseTotal,
  improveCorrect,
  improveTotal,
  combinedPercent,
  passed,
}: ResultCombinedGaugeProps) {
  const practisePct = partPercent(practiseCorrect, practiseTotal)
  const improvePct = partPercent(improveCorrect, improveTotal)
  const fillWidth = Math.min(100, combinedPercent)

  return (
    <div className="mt-4">
      <div className="relative h-3 w-full overflow-visible rounded-full bg-border/70">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            passed ? 'bg-success' : 'bg-accent',
          )}
          style={{ width: `${fillWidth}%` }}
        />
        <div
          className="absolute top-1/2 z-10 h-5 w-0.5 -translate-y-1/2 bg-text/70"
          style={{ left: `${PASS_THRESHOLD_PERCENT}%` }}
          aria-hidden
        />
        <span
          className="absolute -top-5 text-[10px] font-bold text-text-muted"
          style={{ left: `${PASS_THRESHOLD_PERCENT}%`, transform: 'translateX(-50%)' }}
        >
          {PASS_THRESHOLD_PERCENT}%
        </span>
      </div>

      <dl className="mt-5 flex flex-col gap-2 text-sm">
        <div className="flex items-center justify-between gap-2">
          <dt className="text-text-muted">Practise</dt>
          <dd className="font-bold text-text">
            {practiseCorrect} / {practiseTotal}{' '}
            <span className="font-semibold text-text-muted">({practisePct}%)</span>
          </dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className="text-text-muted">Improve</dt>
          <dd className="font-bold text-text">
            {improveTotal === 0 ? (
              <span className="font-normal text-text-muted">— nothing to improve</span>
            ) : (
              <>
                {improveCorrect} / {improveTotal}{' '}
                <span className="font-semibold text-text-muted">({improvePct}%)</span>
              </>
            )}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-border pt-2">
          <dt className="font-bold text-text">Combined</dt>
          <dd className={cn('text-lg font-extrabold', passed ? 'text-success' : 'text-accent-strong')}>
            {combinedPercent}%
            <span className="ml-1 text-xs font-semibold text-text-muted">
              / {PASS_THRESHOLD_PERCENT}% to pass
            </span>
          </dd>
        </div>
      </dl>
    </div>
  )
}
