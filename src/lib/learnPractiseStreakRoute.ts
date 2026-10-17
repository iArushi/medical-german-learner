import { STREAK_AND_POINTS_CONFIG } from '../config/streakAndPoints'
import { learnPractiseWindowMs } from './skillStreak'
import {
  getLearnSession,
  incrementPractiseFirstPassAnswers,
  markLearnPractiseStreakQualified,
} from '../storage/levelStreakSession'
import { qualifySkillStreakDayInStorage } from '../storage/userProgress'

export function recordPractiseFirstPassAnswer(levelId: string): void {
  const session = incrementPractiseFirstPassAnswers(levelId)
  if (!session) return
  tryQualifyLearnPractiseStreak(session)
}

function tryQualifyLearnPractiseStreak(session: NonNullable<ReturnType<typeof getLearnSession>>): void {
  if (session.learnPractiseStreakQualified) return
  if (
    session.practiseFirstPassAnswers <
    STREAK_AND_POINTS_CONFIG.minPractiseAnswersForStreakDay
  ) {
    return
  }
  if (session.practiseStartedAt === null) return

  const elapsed = session.practiseStartedAt - session.learnStartedAt
  if (elapsed < 0 || elapsed > learnPractiseWindowMs()) return

  markLearnPractiseStreakQualified()
  qualifySkillStreakDayInStorage()
}
