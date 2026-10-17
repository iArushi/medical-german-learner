import type { GermanLevel } from './loadGermanData'
import { getAllLevelsInProgress } from '../storage/levelInProgress'
import { isLevelCompleted } from '../storage/userProgress'

export type LevelPathState = 'locked' | 'available' | 'completed'

export function isLevelUnlockedOnPath(
  levelIndex: number,
  levels: GermanLevel[],
): boolean {
  if (levelIndex <= 0) return true
  const previous = levels[levelIndex - 1]
  return previous ? isLevelCompleted(previous.id) : false
}

export function getLevelPathState(
  level: GermanLevel,
  levelIndex: number,
  levels: GermanLevel[],
): LevelPathState {
  if (isLevelCompleted(level.id)) return 'completed'
  if (isLevelUnlockedOnPath(levelIndex, levels)) return 'available'
  return 'locked'
}

export function findContinueLevel(levels: GermanLevel[]): GermanLevel | undefined {
  const saved = getAllLevelsInProgress().sort((a, b) => b.savedAt.localeCompare(a.savedAt))[0]
  if (saved) {
    const savedLevel = levels.find((l) => l.id === saved.levelId)
    if (savedLevel && !isLevelCompleted(savedLevel.id)) {
      return savedLevel
    }
  }

  for (let i = 0; i < levels.length; i++) {
    const level = levels[i]
    if (!isLevelUnlockedOnPath(i, levels)) continue
    if (!isLevelCompleted(level.id)) return level
  }
  return levels[0]
}

export function isContinueLevelReplay(levels: GermanLevel[]): boolean {
  return levels.every((level) => isLevelCompleted(level.id))
}
