import { cn } from '../../../lib/cn'

type AnswerOptionProps = {
  label: string
  onSelect: () => void
  disabled: boolean
  variant?: 'default' | 'correct' | 'incorrect' | 'muted-correct'
  ariaLabel?: string
}

const VARIANT_CLASS: Record<NonNullable<AnswerOptionProps['variant']>, string> = {
  default: 'border-border bg-surface text-text active:bg-bg',
  correct:
    'border-2 border-success bg-success-muted text-success ring-1 ring-success/30',
  incorrect:
    'border-2 border-dashed border-mistake bg-mistake-muted text-accent-strong',
  'muted-correct': 'border-2 border-success/60 bg-success-muted/80 text-success',
}

function statusPrefix(variant: NonNullable<AnswerOptionProps['variant']>): string | null {
  if (variant === 'correct' || variant === 'muted-correct') return 'Correct:'
  if (variant === 'incorrect') return 'Not quite:'
  return null
}

export function AnswerOption({
  label,
  onSelect,
  disabled,
  variant = 'default',
  ariaLabel,
}: AnswerOptionProps) {
  const prefix = statusPrefix(variant)
  const computedAria =
    ariaLabel ??
    (prefix ? `${prefix} ${label}` : label)

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      aria-label={computedAria}
      aria-pressed={disabled && variant !== 'default' ? variant === 'correct' : undefined}
      className={cn(
        'flex min-h-12 w-full items-center gap-2 rounded-card border px-4 py-3 text-left text-sm font-semibold shadow-soft transition-colors duration-200',
        VARIANT_CLASS[variant],
        disabled && variant === 'default' ? 'opacity-70' : '',
      )}
    >
      {prefix ? (
        <span className="shrink-0 text-xs font-extrabold uppercase tracking-wide" aria-hidden>
          {variant === 'incorrect' ? '!' : '✓'}
        </span>
      ) : null}
      <span className="flex-1">{label}</span>
    </button>
  )
}
