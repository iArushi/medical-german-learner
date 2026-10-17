import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  fullWidth?: boolean
  children: ReactNode
}

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white shadow-soft hover:bg-primary-hover active:bg-primary-hover disabled:bg-border disabled:text-text-muted',
  secondary:
    'border border-border bg-surface text-text hover:bg-bg active:bg-bg disabled:opacity-60',
  ghost: 'bg-transparent text-text-muted hover:bg-bg active:bg-bg disabled:opacity-50',
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  className,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-card px-4 py-2.5 text-sm font-semibold transition-colors duration-200',
        VARIANT[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
