import { combinedScorePercent } from '../lib/combinedScore'
import type { LevelInProgress } from '../types/levelInProgress'
import type { LevelAttemptSession } from './levelAttemptSession'
import { saveLevelAttempt } from './levelAttemptSession'
import { STORAGE_KEYS } from './keys'

function loadAll(): Record<string, LevelInProgress> {
  const raw = localStorage.getItem(STORAGE_KEYS.levelsInProgress)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as Record<string, LevelInProgress>
  } catch {
    return {}
  }
}

function saveAll(map: Record<string, LevelInProgress>): void {
  localStorage.setItem(STORAGE_KEYS.levelsInProgress, JSON.stringify(map))
}

export function getLevelInProgress(levelId: string): LevelInProgress | undefined {
  return loadAll()[levelId]
}

export function getAllLevelsInProgress(): LevelInProgress[] {
  return Object.values(loadAll())
}

export function saveLevelInProgressFromAttempt(attempt: LevelAttemptSession): void {
  const combinedPercent = combinedScorePercent(
    attempt.practiseCorrect,
    attempt.practiseTotal,
    attempt.improveCorrect,
    attempt.improveTotal,
  )
  const entry: LevelInProgress = {
    levelId: attempt.levelId,
    practiseCorrect: attempt.practiseCorrect,
    practiseTotal: attempt.practiseTotal,
    practiseMissedWordIds: attempt.practiseMissedWordIds,
    improveCorrect: attempt.improveCorrect,
    improveTotal: attempt.improveTotal,
    improveCorrectWordIds: attempt.improveCorrectWordIds,
    combinedPercent,
    savedAt: new Date().toISOString(),
  }
  saveAll({ ...loadAll(), [attempt.levelId]: entry })
}

export function clearLevelInProgress(levelId: string): void {
  const map = loadAll()
  if (!map[levelId]) return
  delete map[levelId]
  saveAll(map)
}

export function restoreAttemptFromInProgress(levelId: string): LevelAttemptSession | null {
  const saved = getLevelInProgress(levelId)
  if (!saved) return null
  const attempt: LevelAttemptSession = {
    levelId: saved.levelId,
    practiseCorrect: saved.practiseCorrect,
    practiseTotal: saved.practiseTotal,
    practiseMissedWordIds: saved.practiseMissedWordIds,
    improveCorrect: saved.improveCorrect,
    improveTotal: saved.improveTotal,
    improveCorrectWordIds: saved.improveCorrectWordIds,
    ringAnimateFromPercent: null,
  }
  saveLevelAttempt(attempt)
  return attempt
}
