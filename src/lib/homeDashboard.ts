import { buildLastFourWeeks } from './streakCalendar'
import type { GermanLevel } from './loadGermanData'
import { getUserProgress } from '../storage/userProgress'

export function getTimeGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Guten Morgen'
  if (hour < 18) return 'Guten Tag'
  return 'Guten Abend'
}

export function formatDashboardDate(): string {
  return new Date()
    .toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })
    .toUpperCase()
}

const WEEKLY_GOAL_DAYS = 5

export function getWeeklyGoalView(): { completedDays: number; percent: number; label: string } {
  const progress = getUserProgress()
  const lastSeven = buildLastFourWeeks(progress).slice(-7)
  const completedDays = lastSeven.filter((d) => d.qualified).length
  const capped = Math.min(completedDays, WEEKLY_GOAL_DAYS)
  const percent = Math.min(100, Math.round((capped / WEEKLY_GOAL_DAYS) * 100))
  return {
    completedDays: capped,
    percent,
    label: `${capped} of ${WEEKLY_GOAL_DAYS} days completed`,
  }
}

export function countWordsInCompletedLevels(levels: GermanLevel[]): number {
  const completed = new Set(getUserProgress().completedLevelIds)
  return levels.reduce((sum, level) => {
    if (!completed.has(level.id)) return sum
    return sum + level.wordIds.length
  }, 0)
}

export function pathCompletionPercent(levels: GermanLevel[]): number {
  if (!levels.length) return 0
  const completed = getUserProgress().completedLevelIds.length
  return Math.round((completed / levels.length) * 100)
}

export const LEVEL_CARD_TONES = ['mint', 'lavender', 'peach', 'blue'] as const
export type LevelCardTone = (typeof LEVEL_CARD_TONES)[number]

export function levelCardTone(index: number): LevelCardTone {
  return LEVEL_CARD_TONES[index % LEVEL_CARD_TONES.length]
}

/** SVG ring circumference for r=49 */
export const GOAL_RING_CIRCUMFERENCE = 308
