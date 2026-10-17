import type { ConnectRequest } from '../types/compete'

export type ConnectChip = {
  label: string
  tone: 'pending' | 'accepted' | 'expired' | 'declined'
}

export function connectRequestChip(request: ConnectRequest): ConnectChip {
  if (request.status === 'accepted') {
    return { label: 'Accepted', tone: 'accepted' }
  }
  if (request.status === 'declined') {
    return { label: 'Declined', tone: 'declined' }
  }
  if (request.status === 'expired') {
    return { label: 'Expired', tone: 'expired' }
  }

  const ms = new Date(request.expiresAt).getTime() - Date.now()
  if (ms <= 0) {
    return { label: 'Expired', tone: 'expired' }
  }

  const hours = Math.ceil(ms / (1000 * 60 * 60))
  if (hours >= 48) {
    return { label: 'Pending · expires in 2 days', tone: 'pending' }
  }
  if (hours >= 24) {
    return { label: 'Pending · expires in 1 day', tone: 'pending' }
  }
  return { label: `Pending · ${hours}h left`, tone: 'pending' }
}
