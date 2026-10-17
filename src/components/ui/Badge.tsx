import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type BadgeVariant =
  | 'easy'
  | 'medium'
  | 'hard'
  | 'cefr-a1'
  | 'cefr-a2'
  | 'review'
  | 'accent'

const VARIANT: Record<BadgeVariant, string> = {
  easy: 'bg-success-muted text-success',
  medium: 'bg-mistake-muted text-accent-strong',
  hard: 'bg-mistake/15 text-mistake',
  'cefr-a1': 'bg-primary-muted text-primary-hover',
  'cefr-a2': 'bg-primary/10 text-primary',
  review: 'bg-review-muted text-review',
  accent: 'bg-accent-muted text-accent-strong',
}

type BadgeProps = {
  variant: BadgeVariant
  children: ReactNode
  className?: string
}

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        VARIANT[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
