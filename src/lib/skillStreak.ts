import { STREAK_AND_POINTS_CONFIG } from '../config/streakAndPoints'
import type { SkillStreakState, UserProgress } from '../types/progress'
import { createEmptySkillStreak } from '../types/progress'
import { addDaysToDateKey, getLocalDateKey } from './localDates'

export type SkillStreakView = {
  count: number
  isBroken: boolean
  canRestore: boolean
  restoreCost: number
  streakAtBreak: number
}

function normalizeStreak(raw: SkillStreakState | undefined): SkillStreakState {
  return {
    ...createEmptySkillStreak(),
    ...raw,
  }
}

/** If a full calendar day was missed, mark streak broken and remember prior count. */
export function applyStreakBreakIfNeeded(progress: UserProgress): UserProgress {
  const streak = normalizeStreak(progress.skillStreak)
  const { lastQualifiedDate, count, isBroken } = streak

  if (!lastQualifiedDate) {
    return progress.skillStreak === streak ? progress : { ...progress, skillStreak: streak }
  }

  const today = getLocalDateKey()
  const yesterday = addDaysToDateKey(today, -1)

  if (lastQualifiedDate === today || lastQualifiedDate === yesterday) {
    const synced = { ...streak, isBroken: false }
    return { ...progress, skillStreak: synced }
  }

  if (isBroken && streak.streakAtBreak > 0) {
    return { ...progress, skillStreak: { ...streak, count: 0 } }
  }

  return {
    ...progress,
    skillStreak: {
      count: 0,
      lastQualifiedDate,
      streakAtBreak: count > 0 ? count : streak.streakAtBreak,
      isBroken: true,
    },
  }
}

export function qualifySkillStreakDay(progress: UserProgress): UserProgress {
  let next = applyStreakBreakIfNeeded(progress)
  const streak = normalizeStreak(next.skillStreak)
  const today = getLocalDateKey()

  if (streak.lastQualifiedDate === today) {
    return next
  }

  const yesterday = addDaysToDateKey(today, -1)
  const newCount = streak.lastQualifiedDate === yesterday ? streak.count + 1 : 1

  return {
    ...next,
    skillStreak: {
      count: newCount,
      lastQualifiedDate: today,
      streakAtBreak: 0,
      isBroken: false,
    },
  }
}

export function buildSkillStreakView(progress: UserProgress): SkillStreakView {
  const synced = applyStreakBreakIfNeeded(progress)
  const streak = normalizeStreak(synced.skillStreak)
  const cost = STREAK_AND_POINTS_CONFIG.streakRestoreCost
  const canRestore =
    streak.isBroken && streak.streakAtBreak > 0 && synced.totalPoints >= cost

  return {
    count: streak.isBroken ? 0 : streak.count,
    isBroken: streak.isBroken,
    canRestore,
    restoreCost: cost,
    streakAtBreak: streak.streakAtBreak,
  }
}

export function restoreSkillStreak(progress: UserProgress): UserProgress | null {
  const synced = applyStreakBreakIfNeeded(progress)
  const streak = normalizeStreak(synced.skillStreak)
  const cost = STREAK_AND_POINTS_CONFIG.streakRestoreCost

  if (!streak.isBroken || streak.streakAtBreak <= 0 || synced.totalPoints < cost) {
    return null
  }

  const today = getLocalDateKey()
  return {
    ...synced,
    totalPoints: synced.totalPoints - cost,
    skillStreak: {
      count: streak.streakAtBreak,
      lastQualifiedDate: today,
      streakAtBreak: 0,
      isBroken: false,
    },
  }
}

export function learnPractiseWindowMs(): number {
  return STREAK_AND_POINTS_CONFIG.learnToPractiseMaxMinutes * 60 * 1000
}
