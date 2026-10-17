export const PASS_THRESHOLD_PERCENT = 75

export function combinedScorePercent(
  practiseCorrect: number,
  practiseTotal: number,
  improveCorrect: number,
  improveTotal: number,
): number {
  const totalQuestions = practiseTotal + improveTotal
  if (totalQuestions === 0) return 0
  return Math.round(((practiseCorrect + improveCorrect) / totalQuestions) * 100)
}

export function hasPassed(combinedPercent: number): boolean {
  return combinedPercent >= PASS_THRESHOLD_PERCENT
}
