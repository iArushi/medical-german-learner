/**
 * Tune pass points, streak rules, and streak restore cost here.
 */
export const STREAK_AND_POINTS_CONFIG = {
  passPoints: {
    /** First time passing a level with no Practise first-pass mistakes */
    firstPassClean: 100,
    /** First time passing after at least one Practise first-pass mistake */
    firstPassWithMistakes: 60,
    /** Passing again after the level was already completed — clean */
    replayClean: 40,
    /** Replay pass with Practise first-pass mistakes */
    replayWithMistakes: 25,
  },
  /** Points spent to restore a broken skill streak to its pre-break length */
  streakRestoreCost: 50,
  /** Max minutes from opening Learn to starting Practise for the short streak route */
  learnToPractiseMaxMinutes: 30,
  /** Practise questions answered (first pass) needed with the short route */
  minPractiseAnswersForStreakDay: 3,
} as const
