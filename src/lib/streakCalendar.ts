import { addDaysToDateKey, getLocalDateKey } from './localDates'
import type { UserProgress } from '../types/progress'

export type CalendarDay = {
  dateKey: string
  dayNum: number
  isToday: boolean
  qualified: boolean
}

export function getQualifiedStreakDateKeys(progress: UserProgress): Set<string> {
  const { skillStreak } = progress
  if (skillStreak.isBroken || !skillStreak.lastQualifiedDate || skillStreak.count <= 0) {
    return new Set()
  }

  const keys = new Set<string>()
  let cursor = skillStreak.lastQualifiedDate
  for (let i = 0; i < skillStreak.count; i++) {
    keys.add(cursor)
    cursor = addDaysToDateKey(cursor, -1)
  }
  return keys
}

/** Last 28 days ending today (4 weeks), oldest first. */
export function buildLastFourWeeks(progress: UserProgress): CalendarDay[] {
  const today = getLocalDateKey()
  const qualified = getQualifiedStreakDateKeys(progress)
  const days: CalendarDay[] = []

  for (let offset = -27; offset <= 0; offset++) {
    const dateKey = addDaysToDateKey(today, offset)
    const dayNum = Number(dateKey.split('-')[2])
    days.push({
      dateKey,
      dayNum,
      isToday: offset === 0,
      qualified: qualified.has(dateKey),
    })
  }

  return days
}
