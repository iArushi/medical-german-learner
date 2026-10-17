export type LevelInProgress = {
  levelId: string
  practiseCorrect: number
  practiseTotal: number
  practiseMissedWordIds: string[]
  improveCorrect: number
  improveTotal: number
  improveCorrectWordIds: string[]
  combinedPercent: number
  savedAt: string
}
