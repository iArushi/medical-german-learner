import type { LevelPathState } from './homeLevelPath'
import type { LevelInProgress } from '../types/levelInProgress'
import { isLevelCompleted } from '../storage/userProgress'

export type LevelCardDisplayState = 'locked' | 'not-started' | 'in-progress' | 'passed'

export function getLevelCardDisplayState(
  pathState: LevelPathState,
  levelId: string,
  inProgress: LevelInProgress | undefined,
): LevelCardDisplayState {
  if (pathState === 'locked') return 'locked'
  if (inProgress) return 'in-progress'
  if (isLevelCompleted(levelId)) return 'passed'
  return 'not-started'
}
