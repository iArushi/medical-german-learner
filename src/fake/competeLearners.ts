/**
 * FAKE DATA — for demo only.
 * All learners in this file are generated sample competitors, not real people.
 * Groups, ranks, and head-to-head opponent scores are simulated for the build prototype.
 */

export type FakeCompeteLearner = {
  id: string
  alias: string
  avatar: string
  streakDays: number
  levelsCompleted: number
}

export const FAKE_COMPETE_LEARNERS: FakeCompeteLearner[] = [
  { id: 'fake_01', alias: 'Quiet Fox', avatar: '🦊', streakDays: 14, levelsCompleted: 6 },
  { id: 'fake_02', alias: 'Calm Heron', avatar: '🐦', streakDays: 12, levelsCompleted: 5 },
  { id: 'fake_03', alias: 'Steady Oak', avatar: '🌳', streakDays: 11, levelsCompleted: 7 },
  { id: 'fake_04', alias: 'Bright Linnet', avatar: '🌿', streakDays: 9, levelsCompleted: 4 },
  { id: 'fake_05', alias: 'Gentle Wave', avatar: '🌊', streakDays: 8, levelsCompleted: 5 },
  { id: 'fake_06', alias: 'Warm Lantern', avatar: '🏮', streakDays: 7, levelsCompleted: 3 },
  { id: 'fake_07', alias: 'Soft Cloud', avatar: '☁️', streakDays: 6, levelsCompleted: 4 },
  { id: 'fake_08', alias: 'Kind Sparrow', avatar: '🐤', streakDays: 5, levelsCompleted: 3 },
  { id: 'fake_09', alias: 'Patient Turtle', avatar: '🐢', streakDays: 4, levelsCompleted: 2 },
  { id: 'fake_10', alias: 'Merry Finch', avatar: '🎵', streakDays: 3, levelsCompleted: 2 },
  { id: 'fake_11', alias: 'Shy Deer', avatar: '🦌', streakDays: 2, levelsCompleted: 1 },
  { id: 'fake_12', alias: 'Tiny Bloom', avatar: '🌸', streakDays: 1, levelsCompleted: 0 },
  { id: 'fake_13', alias: 'New Starling', avatar: '⭐', streakDays: 0, levelsCompleted: 0 },
  { id: 'fake_14', alias: 'Fresh Dew', avatar: '💧', streakDays: 0, levelsCompleted: 0 },
  { id: 'fake_15', alias: 'First Step', avatar: '🌱', streakDays: 1, levelsCompleted: 0 },
  { id: 'fake_16', alias: 'Quiet Path', avatar: '🛤️', streakDays: 2, levelsCompleted: 1 },
  { id: 'fake_17', alias: 'Silver Mist', avatar: '🌫️', streakDays: 10, levelsCompleted: 4 },
  { id: 'fake_18', alias: 'Golden Leaf', avatar: '🍂', streakDays: 13, levelsCompleted: 6 },
  { id: 'fake_19', alias: 'Blue Kite', avatar: '🪁', streakDays: 15, levelsCompleted: 8 },
  { id: 'fake_20', alias: 'North Wind', avatar: '🌬️', streakDays: 6, levelsCompleted: 3 },
]

export const LOCAL_LEARNER_ID = 'local_player'

export function getFakeLearnerById(id: string): FakeCompeteLearner | undefined {
  return FAKE_COMPETE_LEARNERS.find((l) => l.id === id)
}
