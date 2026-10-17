import type { LearningMode } from '../types/mode'
import { STORAGE_KEYS } from './keys'

export function getLearningMode(): LearningMode | null {
  const raw = localStorage.getItem(STORAGE_KEYS.learningMode)
  if (raw === 'individual' || raw === 'compete') {
    return raw
  }
  return null
}

export function setLearningMode(mode: LearningMode): void {
  localStorage.setItem(STORAGE_KEYS.learningMode, mode)
}
