export type MistakePhase = 'practise' | 'improve' | 'revisit'

export type WordMistakeEvent = {
  at: string
  levelId: string
  phase: MistakePhase
}

export type LevelScoreRecord = {
  at: string
  passed: boolean
  combinedPercent: number
  practiseCorrect: number
  practiseTotal: number
  improveCorrect: number
  improveTotal: number
  pointsEarned: number
  isReplay: boolean
}

export type SkillStreakState = {
  count: number
  lastQualifiedDate: string | null
  streakAtBreak: number
  isBroken: boolean
}

export type UserProgress = {
  totalPoints: number
  completedLevelIds: string[]
  levelScores: Record<string, LevelScoreRecord[]>
  wordMistakes: Record<string, WordMistakeEvent[]>
  skillStreak: SkillStreakState
}

export function createEmptySkillStreak(): SkillStreakState {
  return {
    count: 0,
    lastQualifiedDate: null,
    streakAtBreak: 0,
    isBroken: false,
  }
}

export function createEmptyProgress(): UserProgress {
  return {
    totalPoints: 0,
    completedLevelIds: [],
    levelScores: {},
    wordMistakes: {},
    skillStreak: createEmptySkillStreak(),
  }
}
