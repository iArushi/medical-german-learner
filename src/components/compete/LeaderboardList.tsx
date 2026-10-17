import type { LeaderboardEntry } from '../../lib/competeGroups'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { cn } from '../../lib/cn'
import { AliasSafetyActions } from './AliasSafetyActions'
import { LearnerAvatar } from './LearnerAvatar'

type LeaderboardListProps = {
  entries: LeaderboardEntry[]
  connectSlotsLeft: number
  connectSlotsMax: number
  onConnect?: (learnerId: string) => void
  connectDisabled?: boolean
  onConnectDisabledClick?: () => void
  onBlock: (learnerId: string, alias: string) => void
  onReport: (learnerId: string, alias: string) => void
}

export function LeaderboardList({
  entries,
  connectSlotsLeft,
  connectSlotsMax,
  onConnect,
  connectDisabled,
  onConnectDisabledClick,
  onBlock,
  onReport,
}: LeaderboardListProps) {
  if (entries.length === 0) {
    return null
  }

  return (
    <ol className="flex flex-col gap-1.5">
      {entries.map((entry, index) => (
        <li key={entry.id}>
          <Card
            padding="sm"
            variant="elevated"
            className={cn(
              entry.isLocal && 'border-primary/40 bg-primary-muted/35 ring-2 ring-primary/25',
            )}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold',
                  entry.isLocal ? 'bg-primary text-white' : 'bg-bg text-text-muted',
                )}
              >
                {index + 1}
              </span>
              <LearnerAvatar avatar={entry.avatar} alias={entry.alias} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-text">
                  {entry.alias}
                  {entry.isLocal ? (
                    <span className="ml-1 text-xs font-bold uppercase text-primary">You</span>
                  ) : null}
                </p>
                <p className="text-xs font-semibold text-text-muted">
                  {entry.streakDays} day{entry.streakDays === 1 ? '' : 's'} streak
                </p>
              </div>
              {!entry.isLocal && onConnect ? (
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="primary"
                    className="px-2.5 py-1.5 text-[11px] leading-tight"
                    disabled={connectDisabled}
                    onClick={() => {
                      if (connectDisabled) {
                        onConnectDisabledClick?.()
                        return
                      }
                      onConnect(entry.id)
                    }}
                  >
                    Connect
                    <span className="mt-0.5 block text-[10px] font-semibold opacity-90">
                      {connectSlotsLeft} of {connectSlotsMax} left
                    </span>
                  </Button>
                  <AliasSafetyActions
                    alias={entry.alias}
                    onBlock={() => onBlock(entry.id, entry.alias)}
                    onReport={() => onReport(entry.id, entry.alias)}
                  />
                </div>
              ) : null}
            </div>
          </Card>
        </li>
      ))}
    </ol>
  )
}
