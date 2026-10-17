import { REVIEW_LEVEL_ID } from '../constants/reviewLevel'
import { computePassPoints } from '../lib/points'
import {
  applyStreakBreakIfNeeded,
  buildSkillStreakView,
  qualifySkillStreakDay,
  restoreSkillStreak,
  type SkillStreakView,
} from '../lib/skillStreak'
import type {
  LevelScoreRecord,
  MistakePhase,
  UserProgress,
  WordMistakeEvent,
} from '../types/progress'
import { createEmptyProgress, createEmptySkillStreak } from '../types/progress'
import { STORAGE_KEYS } from './keys'

function loadProgress(): UserProgress {
  const raw = localStorage.getItem(STORAGE_KEYS.userProgress)
  if (!raw) return createEmptyProgress()
  try {
    const parsed = JSON.parse(raw) as UserProgress
    return {
      ...createEmptyProgress(),
      ...parsed,
      completedLevelIds: parsed.completedLevelIds ?? [],
      levelScores: parsed.levelScores ?? {},
      wordMistakes: parsed.wordMistakes ?? {},
      totalPoints: parsed.totalPoints ?? 0,
      skillStreak: { ...createEmptySkillStreak(), ...parsed.skillStreak },
    }
  } catch {
    return createEmptyProgress()
  }
}

function saveProgress(progress: UserProgress): void {
  localStorage.setItem(STORAGE_KEYS.userProgress, JSON.stringify(progress))
}

export function getUserProgress(): UserProgress {
  const progress = loadProgress()
  const synced = applyStreakBreakIfNeeded(progress)
  if (synced !== progress) {
    saveProgress(synced)
  }
  return synced
}

export function qualifySkillStreakDayInStorage(): void {
  const progress = loadProgress()
  saveProgress(qualifySkillStreakDay(progress))
}

export function getSkillStreakViewFromStorage(): SkillStreakView {
  const progress = getUserProgress()
  return buildSkillStreakView(progress)
}

export function restoreSkillStreakFromStorage(): boolean {
  const restored = restoreSkillStreak(loadProgress())
  if (!restored) return false
  saveProgress(restored)
  return true
}

export function getTotalPoints(): number {
  return loadProgress().totalPoints
}

export function isLevelCompleted(levelId: string): boolean {
  if (levelId === REVIEW_LEVEL_ID) return false
  return loadProgress().completedLevelIds.includes(levelId)
}

export function getLatestLevelScore(levelId: string): LevelScoreRecord | undefined {
  const records = loadProgress().levelScores[levelId]
  if (!records?.length) return undefined
  return records[records.length - 1]
}

export function getBestCombinedPercent(levelId: string): number | undefined {
  const records = loadProgress().levelScores[levelId]
  if (!records?.length) return undefined
  return Math.max(...records.map((r) => r.combinedPercent))
}

export function recordWordMistake(
  wordId: string,
  levelId: string,
  phase: MistakePhase,
): void {
  const progress = loadProgress()
  const event: WordMistakeEvent = {
    at: new Date().toISOString(),
    levelId,
    phase,
  }
  const history = progress.wordMistakes[wordId] ?? []
  saveProgress({
    ...progress,
    wordMistakes: {
      ...progress.wordMistakes,
      [wordId]: [...history, event],
    },
  })
}

export function getReviewWordIds(): string[] {
  const { wordMistakes } = loadProgress()
  return Object.entries(wordMistakes)
    .map(([wordId, history]) => {
      const count = history.length
      const latest = history[history.length - 1]?.at ?? ''
      return { wordId, count, latest }
    })
    .filter((row) => row.count > 0)
    .sort((a, b) => b.count - a.count || b.latest.localeCompare(a.latest))
    .map((row) => row.wordId)
}

export function recordLevelAttemptResult(input: {
  levelId: string
  passed: boolean
  combinedPercent: number
  practiseCorrect: number
  practiseTotal: number
  improveCorrect: number
  improveTotal: number
  practiseMissedWordIds: string[]
}): LevelScoreRecord {
  const progress = loadProgress()
  const isReplay =
    input.levelId !== REVIEW_LEVEL_ID && progress.completedLevelIds.includes(input.levelId)
  const hadPractiseMistakes = input.practiseMissedWordIds.length > 0
  const pointsEarned = input.passed
    ? computePassPoints(isReplay, hadPractiseMistakes)
    : 0

  const record: LevelScoreRecord = {
    at: new Date().toISOString(),
    passed: input.passed,
    combinedPercent: input.combinedPercent,
    practiseCorrect: input.practiseCorrect,
    practiseTotal: input.practiseTotal,
    improveCorrect: input.improveCorrect,
    improveTotal: input.improveTotal,
    pointsEarned,
    isReplay,
  }

  const levelScores = progress.levelScores[input.levelId] ?? []
  const completedLevelIds =
    input.passed &&
    input.levelId !== REVIEW_LEVEL_ID &&
    !progress.completedLevelIds.includes(input.levelId)
      ? [...progress.completedLevelIds, input.levelId]
      : progress.completedLevelIds

  const withScore = {
    ...progress,
    totalPoints: progress.totalPoints + pointsEarned,
    completedLevelIds,
    levelScores: {
      ...progress.levelScores,
      [input.levelId]: [...levelScores, record],
    },
  }

  saveProgress(qualifySkillStreakDay(withScore))

  return record
}
