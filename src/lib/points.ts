import { STREAK_AND_POINTS_CONFIG } from '../config/streakAndPoints'

export function computePassPoints(isReplay: boolean, hadPractiseMistakes: boolean): number {
  const { passPoints } = STREAK_AND_POINTS_CONFIG
  if (isReplay) {
    return hadPractiseMistakes ? passPoints.replayWithMistakes : passPoints.replayClean
  }
  return hadPractiseMistakes ? passPoints.firstPassWithMistakes : passPoints.firstPassClean
}
