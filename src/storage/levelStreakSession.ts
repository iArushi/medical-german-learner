const SESSION_KEY = 'mg_level_streak_session'

export type LevelStreakSession = {
  levelId: string
  learnStartedAt: number
  practiseStartedAt: number | null
  practiseFirstPassAnswers: number
  learnPractiseStreakQualified: boolean
}

export function startLearnSession(levelId: string): void {
  const session: LevelStreakSession = {
    levelId,
    learnStartedAt: Date.now(),
    practiseStartedAt: null,
    practiseFirstPassAnswers: 0,
    learnPractiseStreakQualified: false,
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function getLearnSession(): LevelStreakSession | null {
  const raw = sessionStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as LevelStreakSession
  } catch {
    return null
  }
}

export function markPractiseStarted(levelId: string): void {
  const session = getLearnSession()
  if (!session || session.levelId !== levelId) return
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      ...session,
      practiseStartedAt: Date.now(),
    }),
  )
}

export function incrementPractiseFirstPassAnswers(levelId: string): LevelStreakSession | null {
  const session = getLearnSession()
  if (!session || session.levelId !== levelId) return null
  const next: LevelStreakSession = {
    ...session,
    practiseFirstPassAnswers: session.practiseFirstPassAnswers + 1,
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(next))
  return next
}

export function markLearnPractiseStreakQualified(): void {
  const session = getLearnSession()
  if (!session) return
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ ...session, learnPractiseStreakQualified: true }),
  )
}
