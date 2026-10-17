import { COMPETE_CONFIG } from '../config/competeConfig'
import {
  FAKE_COMPETE_LEARNERS,
  LOCAL_LEARNER_ID,
  type FakeCompeteLearner,
} from '../fake/competeLearners'

export type LeaderboardEntry = FakeCompeteLearner & {
  isLocal?: boolean
}

export type CompeteGroups = {
  mainGroup: LeaderboardEntry[]
  newLearnersGroup: LeaderboardEntry[]
}

function sortByStreak(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries].sort((a, b) => b.streakDays - a.streakDays)
}

function withoutBlocked(
  entries: FakeCompeteLearner[],
  blockedIds: Set<string>,
): FakeCompeteLearner[] {
  return entries.filter((e) => !blockedIds.has(e.id))
}

export function buildCompeteGroups(
  localStreak: number,
  localLevelsCompleted: number,
  localAlias: string,
  localAvatar: string,
  blockedLearnerIds: string[] = [],
): CompeteGroups {
  const blocked = new Set(blockedLearnerIds)
  const localEntry: LeaderboardEntry = {
    id: LOCAL_LEARNER_ID,
    alias: localAlias,
    avatar: localAvatar,
    streakDays: localStreak,
    levelsCompleted: localLevelsCompleted,
    isLocal: true,
  }

  const isNewLearner = localStreak <= COMPETE_CONFIG.newLearnerMaxStreak

  const newPool = withoutBlocked(
    FAKE_COMPETE_LEARNERS.filter((l) => l.streakDays <= COMPETE_CONFIG.newLearnerMaxStreak),
    blocked,
  )
  const mainPool = withoutBlocked(
    FAKE_COMPETE_LEARNERS.filter((l) => l.streakDays > COMPETE_CONFIG.newLearnerMaxStreak),
    blocked,
  )

  if (isNewLearner) {
    const group = sortByStreak([
      localEntry,
      ...newPool.slice(0, COMPETE_CONFIG.mainGroupSize - 1),
    ]).slice(0, COMPETE_CONFIG.mainGroupSize)
    return {
      mainGroup: [],
      newLearnersGroup: group,
    }
  }

  const band = mainPool
    .map((l) => ({ l, distance: Math.abs(l.streakDays - localStreak) }))
    .sort((a, b) => a.distance - b.distance)
    .map((row) => row.l)
    .slice(0, COMPETE_CONFIG.mainGroupSize - 1)

  const mainGroup = sortByStreak([localEntry, ...band]).slice(0, COMPETE_CONFIG.mainGroupSize)
  const newLearnersGroup = sortByStreak(newPool).slice(0, COMPETE_CONFIG.mainGroupSize)

  return { mainGroup, newLearnersGroup }
}
