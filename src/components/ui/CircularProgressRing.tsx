import { useEffect, useState } from 'react'
import { PASS_THRESHOLD_PERCENT } from '../../lib/combinedScore'
import { cn } from '../../lib/cn'

type RingTone = 'primary' | 'amber' | 'empty'

type CircularProgressRingProps = {
  percent: number
  animateFrom?: number
  /** Animate fill from 0 when the ring first mounts (e.g. Home load). */
  animateFillOnMount?: boolean
  tone?: RingTone
  size?: number
  strokeWidth?: number
  className?: string
  label?: string
  compact?: boolean
  showCenterText?: boolean
}

const STROKE: Record<Exclude<RingTone, 'empty'>, string> = {
  primary: 'var(--color-primary)',
  amber: 'var(--color-mistake)',
}

export function CircularProgressRing({
  percent,
  animateFrom,
  animateFillOnMount = false,
  tone = 'primary',
  size = 200,
  strokeWidth = 12,
  className,
  label = 'Level progress',
  compact = false,
  showCenterText = true,
}: CircularProgressRingProps) {
  const isEmpty = tone === 'empty'
  const target = isEmpty ? 0 : Math.min(100, Math.max(0, percent))
  const [displayPercent, setDisplayPercent] = useState(isEmpty ? 0 : target)
  const safe = Math.min(100, Math.max(0, Math.round(displayPercent)))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (safe / 100) * circumference
  const passOffset = circumference - (PASS_THRESHOLD_PERCENT / 100) * circumference

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isEmpty) {
      setDisplayPercent(0)
      return
    }

    let from = target
    if (animateFrom !== undefined) {
      from = animateFrom
    } else if (animateFillOnMount && !reduceMotion) {
      from = 0
    }

    if (reduceMotion || from === target) {
      setDisplayPercent(target)
      return
    }

    setDisplayPercent(from)
    const start = window.performance.now()
    const duration = 700
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      setDisplayPercent(from + (target - from) * eased)
      if (t < 1) {
        frame = window.requestAnimationFrame(tick)
      }
    }
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [animateFrom, animateFillOnMount, isEmpty, target])

  const ariaLabel = isEmpty
    ? `${label}: not started. Pass mark is ${PASS_THRESHOLD_PERCENT} percent.`
    : `${label}: ${safe} percent. Pass mark is ${PASS_THRESHOLD_PERCENT} percent.`

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
        />
        {!isEmpty ? (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={STROKE[tone as 'primary' | 'amber']}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        ) : null}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-accent-strong)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={`2 ${circumference - 2}`}
          strokeDashoffset={passOffset}
          opacity={0.85}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {showCenterText && !isEmpty ? (
          <span
            className={cn('font-extrabold text-text', compact ? 'text-xs' : 'text-4xl')}
            aria-hidden
          >
            {safe}%
          </span>
        ) : null}
      </div>
      <span className="sr-only">{ariaLabel}</span>
      {!compact && !isEmpty ? (
        <p className="mt-2 text-center text-xs font-semibold text-text-muted" aria-hidden>
          Pass line: {PASS_THRESHOLD_PERCENT}% (marked on ring)
        </p>
      ) : null}
    </div>
  )
}
