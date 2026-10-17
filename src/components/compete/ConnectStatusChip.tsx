import { cn } from '../../lib/cn'
import type { ConnectChip } from '../../lib/connectRequestDisplay'

const TONE: Record<ConnectChip['tone'], string> = {
  pending: 'bg-mistake-muted text-accent-strong',
  accepted: 'bg-success-muted text-success',
  expired: 'bg-border/60 text-text-muted',
  declined: 'bg-border/60 text-text-muted',
}

export function ConnectStatusChip({ chip }: { chip: ConnectChip }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold',
        TONE[chip.tone],
      )}
    >
      {chip.label}
    </span>
  )
}
