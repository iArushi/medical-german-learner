const SESSION_KEY = 'mg_level_attempt'

export type LevelAttemptSession = {
  levelId: string
  practiseCorrect: number
  practiseTotal: number
  practiseMissedWordIds: string[]
  improveCorrect: number
  improveTotal: number
  improveCorrectWordIds: string[]
  /** When set, progress screen animates the ring from this value to the current combined %. */
  ringAnimateFromPercent?: number | null
}

export function saveLevelAttempt(session: LevelAttemptSession): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function getLevelAttempt(): LevelAttemptSession | null {
  const raw = sessionStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as LevelAttemptSession
  } catch {
    return null
  }
}

export function clearLevelAttempt(): void {
  sessionStorage.removeItem(SESSION_KEY)
}

export function savePractiseOutcome(
  levelId: string,
  practiseCorrect: number,
  practiseTotal: number,
  practiseMissedWordIds: string[],
): void {
  saveLevelAttempt({
    levelId,
    practiseCorrect,
    practiseTotal,
    practiseMissedWordIds,
    improveCorrect: 0,
    improveTotal: 0,
    improveCorrectWordIds: [],
    ringAnimateFromPercent: null,
  })
}

export function saveImproveOutcome(
  improveCorrect: number,
  improveTotal: number,
  improveCorrectWordIds: string[],
  ringAnimateFromPercent: number,
): void {
  const current = getLevelAttempt()
  if (!current) return
  saveLevelAttempt({
    ...current,
    improveCorrect,
    improveTotal,
    improveCorrectWordIds,
    ringAnimateFromPercent,
  })
}

export function clearRingAnimationFlag(): void {
  const current = getLevelAttempt()
  if (!current || current.ringAnimateFromPercent == null) return
  saveLevelAttempt({ ...current, ringAnimateFromPercent: null })
}
