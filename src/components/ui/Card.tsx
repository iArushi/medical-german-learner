import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  padding?: 'none' | 'sm' | 'md'
  variant?: 'elevated' | 'flat' | 'dashed' | 'accent' | 'review'
}

const PADDING = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
}

const VARIANT: Record<NonNullable<CardProps['variant']>, string> = {
  elevated: 'border border-border bg-surface shadow-soft',
  flat: 'border border-border bg-surface',
  dashed: 'border border-dashed border-border bg-surface',
  accent: 'border border-accent bg-accent-muted shadow-soft',
  review: 'border border-review/30 bg-review-muted shadow-soft',
}

export function Card({
  children,
  className,
  padding = 'md',
  variant = 'elevated',
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-card transition-shadow duration-200',
        VARIANT[variant],
        PADDING[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
