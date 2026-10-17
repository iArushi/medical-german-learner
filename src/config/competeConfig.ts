export const COMPETE_CONFIG = {
  mainGroupSize: 10,
  /** Learners at or below this streak (days) appear in the New learners group */
  newLearnerMaxStreak: 2,
  maxOutgoingConnectRequests: 3,
  connectExpireDays: 2,
} as const
