import { buildLastFourWeeks } from '../../lib/streakCalendar'
import { getUserProgress } from '../../storage/userProgress'
import { cn } from '../../lib/cn'

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export function StreakCalendar() {
  const days = buildLastFourWeeks(getUserProgress())

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-text-muted">
        {WEEKDAYS.map((label, i) => (
          <span key={`${label}-${i}`}>{label}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((day) => (
          <div
            key={day.dateKey}
            className={cn(
              'flex aspect-square items-center justify-center rounded-md text-[11px] font-bold',
              day.qualified ? 'bg-success-muted text-success' : 'bg-bg text-text-muted',
              day.isToday && 'ring-2 ring-primary ring-offset-1',
            )}
            title={day.dateKey}
          >
            {day.dayNum}
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-text-muted">
        Green days = streak qualified (last 4 weeks). Today has a teal ring.
      </p>
    </div>
  )
}
