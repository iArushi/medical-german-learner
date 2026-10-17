import { COMPETE_CONFIG } from '../config/competeConfig'
import { FAKE_COMPETE_LEARNERS, LOCAL_LEARNER_ID } from '../fake/competeLearners'
import { getAllLevels } from '../lib/loadGermanData'
import { shuffle } from '../lib/shuffle'
import type {
  CompetePersistedState,
  ConnectRequest,
  HeadToHeadMatch,
  LocalCompeteProfile,
} from '../types/compete'
import { getLatestLevelScore, getUserProgress } from './userProgress'
import { STORAGE_KEYS } from './keys'

const ALIAS_PARTS = ['Quiet', 'Calm', 'Bright', 'Gentle', 'Kind', 'Patient', 'Soft', 'Warm']
const ALIAS_NOUNS = ['Fox', 'Heron', 'Oak', 'Wave', 'Lantern', 'Sparrow', 'Bloom', 'Kite']
const AVATARS = ['🦊', '🐦', '🌳', '🌊', '🏮', '🐤', '🌸', '🪁', '🌿', '⭐']

function defaultProfile(): LocalCompeteProfile {
  const alias = `${ALIAS_PARTS[Math.floor(Math.random() * ALIAS_PARTS.length)]} ${ALIAS_NOUNS[Math.floor(Math.random() * ALIAS_NOUNS.length)]}`
  const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)]
  return { alias, avatar }
}

function emptyState(): CompetePersistedState {
  return {
    profile: defaultProfile(),
    outgoingRequests: [],
    incomingRequests: [],
    headToHeads: [],
    seededIncoming: false,
    blockedLearnerIds: [],
    reportedLearnerIds: [],
  }
}

function loadState(): CompetePersistedState {
  const raw = localStorage.getItem(STORAGE_KEYS.compete)
  if (!raw) return emptyState()
  try {
    const parsed = JSON.parse(raw) as CompetePersistedState
    return {
      ...emptyState(),
      ...parsed,
      profile: parsed.profile ?? defaultProfile(),
      outgoingRequests: parsed.outgoingRequests ?? [],
      incomingRequests: parsed.incomingRequests ?? [],
      headToHeads: parsed.headToHeads ?? [],
      blockedLearnerIds: parsed.blockedLearnerIds ?? [],
      reportedLearnerIds: parsed.reportedLearnerIds ?? [],
    }
  } catch {
    return emptyState()
  }
}

function saveState(state: CompetePersistedState): void {
  localStorage.setItem(STORAGE_KEYS.compete, JSON.stringify(state))
}

function expireRequests(requests: ConnectRequest[]): ConnectRequest[] {
  const now = Date.now()
  return requests.map((r) => {
    if (r.status !== 'pending') return r
    if (new Date(r.expiresAt).getTime() <= now) {
      return { ...r, status: 'expired' }
    }
    return r
  })
}

function addDaysIso(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

function pickHeadToHeadLevel(): string {
  const progress = getUserProgress()
  if (progress.completedLevelIds.length > 0) {
    return progress.completedLevelIds[progress.completedLevelIds.length - 1]
  }
  return getAllLevels()[0]?.id ?? 'level_01'
}

function fakeOpponentScore(): number {
  return 55 + Math.floor(Math.random() * 41)
}

function seedIncomingIfNeeded(state: CompetePersistedState): CompetePersistedState {
  if (state.seededIncoming) return state
  const candidates = shuffle(FAKE_COMPETE_LEARNERS).slice(0, 2)
  const incoming: ConnectRequest[] = candidates.map((learner, index) => ({
    id: `inc_seed_${index}_${Date.now()}`,
    fromLearnerId: learner.id,
    toLearnerId: LOCAL_LEARNER_ID,
    createdAt: new Date().toISOString(),
    expiresAt: addDaysIso(COMPETE_CONFIG.connectExpireDays),
    status: 'pending',
  }))
  return {
    ...state,
    incomingRequests: [...state.incomingRequests, ...incoming],
    seededIncoming: true,
  }
}

export function getCompeteState(): CompetePersistedState {
  let state = loadState()
  state = seedIncomingIfNeeded(state)
  state = {
    ...state,
    outgoingRequests: expireRequests(state.outgoingRequests),
    incomingRequests: expireRequests(state.incomingRequests),
  }
  saveState(state)
  return state
}

export function getLocalCompeteProfile(): LocalCompeteProfile {
  return getCompeteState().profile
}

export function isLearnerBlocked(learnerId: string): boolean {
  return getCompeteState().blockedLearnerIds.includes(learnerId)
}

export function blockLearner(learnerId: string): void {
  if (learnerId === LOCAL_LEARNER_ID) return
  const state = getCompeteState()
  if (state.blockedLearnerIds.includes(learnerId)) return

  saveState({
    ...state,
    blockedLearnerIds: [...state.blockedLearnerIds, learnerId],
    outgoingRequests: state.outgoingRequests.map((r) =>
      r.toLearnerId === learnerId && r.status === 'pending'
        ? { ...r, status: 'declined' }
        : r,
    ),
    incomingRequests: state.incomingRequests.map((r) =>
      r.fromLearnerId === learnerId && r.status === 'pending'
        ? { ...r, status: 'declined' }
        : r,
    ),
  })
}

export function reportLearner(learnerId: string): void {
  if (learnerId === LOCAL_LEARNER_ID) return
  const state = getCompeteState()
  if (state.reportedLearnerIds.includes(learnerId)) return
  saveState({
    ...state,
    reportedLearnerIds: [...state.reportedLearnerIds, learnerId],
  })
}

export function countActiveOutgoing(state: CompetePersistedState): number {
  return state.outgoingRequests.filter((r) => r.status === 'pending').length
}

export function sendConnectRequest(targetLearnerId: string): ConnectRequest | null {
  const state = getCompeteState()
  if (targetLearnerId === LOCAL_LEARNER_ID) return null
  if (countActiveOutgoing(state) >= COMPETE_CONFIG.maxOutgoingConnectRequests) return null

  const duplicate = state.outgoingRequests.some(
    (r) => r.toLearnerId === targetLearnerId && r.status === 'pending',
  )
  if (duplicate) return null

  const request: ConnectRequest = {
    id: `out_${Date.now()}`,
    fromLearnerId: LOCAL_LEARNER_ID,
    toLearnerId: targetLearnerId,
    createdAt: new Date().toISOString(),
    expiresAt: addDaysIso(COMPETE_CONFIG.connectExpireDays),
    status: 'pending',
  }

  saveState({
    ...state,
    outgoingRequests: [...state.outgoingRequests, request],
  })
  return request
}

export function acceptConnectRequest(requestId: string): HeadToHeadMatch | null {
  const state = getCompeteState()
  const index = state.incomingRequests.findIndex((r) => r.id === requestId)
  if (index < 0) return null
  const request = state.incomingRequests[index]
  if (request.status !== 'pending') return null

  const levelId = pickHeadToHeadLevel()
  const latest = getLatestLevelScore(levelId)
  const match: HeadToHeadMatch = {
    id: `h2h_${Date.now()}`,
    opponentId: request.fromLearnerId,
    levelId,
    opponentCombinedPercent: fakeOpponentScore(),
    playerCombinedPercent: latest?.combinedPercent ?? null,
    acceptedAt: new Date().toISOString(),
  }

  const incomingRequests = [...state.incomingRequests]
  incomingRequests[index] = { ...request, status: 'accepted' }

  saveState({
    ...state,
    incomingRequests,
    headToHeads: [...state.headToHeads, match],
  })
  return match
}

export function declineConnectRequest(requestId: string): void {
  const state = getCompeteState()
  saveState({
    ...state,
    incomingRequests: state.incomingRequests.map((r) =>
      r.id === requestId && r.status === 'pending' ? { ...r, status: 'declined' } : r,
    ),
  })
}

/** Demo helper: mark an outgoing request expired immediately */
export function expireOutgoingRequestForDemo(requestId: string): void {
  const state = getCompeteState()
  saveState({
    ...state,
    outgoingRequests: state.outgoingRequests.map((r) =>
      r.id === requestId && r.status === 'pending'
        ? { ...r, status: 'expired', expiresAt: new Date().toISOString() }
        : r,
    ),
  })
}

export function refreshPlayerHeadToHeadScores(): void {
  const state = getCompeteState()
  const headToHeads = state.headToHeads.map((match) => {
    const latest = getLatestLevelScore(match.levelId)
    return {
      ...match,
      playerCombinedPercent: latest?.combinedPercent ?? match.playerCombinedPercent,
    }
  })
  saveState({ ...state, headToHeads })
}
