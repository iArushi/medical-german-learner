import { cn } from '../../lib/cn'

type ProgressBarProps = {
  value: number
  max: number
  label?: string
  thin?: boolean
}

export function ProgressBar({ value, max, label, thin = false }: ProgressBarProps) {
  const safeMax = max > 0 ? max : 1
  const pct = Math.min(100, Math.round((value / safeMax) * 100))

  return (
    <div className="w-full">
      {label ? (
        <p className="mb-1 text-xs font-medium text-text-muted">{label}</p>
      ) : null}
      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-border/60',
          thin ? 'h-1' : 'h-2',
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={safeMax}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
