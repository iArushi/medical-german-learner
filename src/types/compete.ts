export type ConnectRequestStatus = 'pending' | 'accepted' | 'declined' | 'expired'

export type ConnectRequest = {
  id: string
  fromLearnerId: string
  toLearnerId: string
  createdAt: string
  expiresAt: string
  status: ConnectRequestStatus
}

export type HeadToHeadMatch = {
  id: string
  opponentId: string
  levelId: string
  opponentCombinedPercent: number
  playerCombinedPercent: number | null
  acceptedAt: string
}

export type LocalCompeteProfile = {
  alias: string
  avatar: string
}

export type CompetePersistedState = {
  profile: LocalCompeteProfile
  outgoingRequests: ConnectRequest[]
  incomingRequests: ConnectRequest[]
  headToHeads: HeadToHeadMatch[]
  seededIncoming: boolean
  blockedLearnerIds: string[]
  reportedLearnerIds: string[]
}
