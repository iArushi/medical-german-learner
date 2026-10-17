import { useEffect, useState } from 'react'
import { cn } from '../../../lib/cn'

const PIECES = [
  { left: '8%', delay: '0ms', color: 'bg-primary' },
  { left: '18%', delay: '80ms', color: 'bg-accent' },
  { left: '28%', delay: '40ms', color: 'bg-success' },
  { left: '38%', delay: '120ms', color: 'bg-article-die' },
  { left: '48%', delay: '20ms', color: 'bg-primary' },
  { left: '58%', delay: '100ms', color: 'bg-accent' },
  { left: '68%', delay: '60ms', color: 'bg-success' },
  { left: '78%', delay: '140ms', color: 'bg-article-der' },
  { left: '88%', delay: '30ms', color: 'bg-accent' },
  { left: '14%', delay: '160ms', color: 'bg-success' },
  { left: '44%', delay: '90ms', color: 'bg-primary' },
  { left: '74%', delay: '110ms', color: 'bg-accent' },
]

export function PassCelebration() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(false), 2400)
    return () => window.clearTimeout(t)
  }, [])

  if (!visible) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden>
      {PIECES.map((piece, i) => (
        <span
          key={i}
          className={cn('pass-confetti absolute top-0 h-2 w-2 rounded-sm', piece.color)}
          style={{ left: piece.left, animationDelay: piece.delay }}
        />
      ))}
      <div className="pass-check-burst absolute left-1/2 top-20 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-success-muted text-3xl font-bold text-success shadow-soft">
        ✓
      </div>
    </div>
  )
}
