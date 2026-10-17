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
    'rounded-[10px] bg-primary text-white shadow-[0_5px_14px_rgb(23_75_63/14%)] hover:bg-primary-hover active:scale-[0.99] active:bg-primary-hover disabled:scale-100 disabled:bg-border disabled:text-text-muted disabled:shadow-none',
  secondary:
    'rounded-[10px] border border-border bg-surface text-text hover:bg-primary-muted/40 active:bg-bg disabled:opacity-60',
  ghost: 'rounded-[10px] bg-transparent text-text-muted hover:bg-bg active:bg-bg disabled:opacity-50',
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
        'inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold transition-[color,transform,background-color,box-shadow] duration-200 motion-reduce:active:scale-100',
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
