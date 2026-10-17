import { REVIEW_LEVEL_ID } from '../constants/reviewLevel'
import type { GermanLevel, GermanWord } from './loadGermanData'
import { getLevelById, getWordsByIds, getWordsByLevel } from './loadGermanData'
import { getReviewWordIds } from '../storage/userProgress'

export function buildReviewLevel(): GermanLevel {
  const wordIds = getReviewWordIds()
  return {
    id: REVIEW_LEVEL_ID,
    order: 0,
    title: 'Review',
    difficulty: 'Medium',
    questionStyle: 'Mixed',
    wordIds,
  }
}

export function resolveLevel(levelId: string): GermanLevel | undefined {
  if (levelId === REVIEW_LEVEL_ID) {
    const level = buildReviewLevel()
    return level.wordIds.length > 0 ? level : undefined
  }
  return getLevelById(levelId)
}

export function resolveWordsForLevel(levelId: string): GermanWord[] {
  if (levelId === REVIEW_LEVEL_ID) {
    return getWordsByIds(getReviewWordIds())
  }
  return getWordsByLevel(levelId)
}

export function isReviewLevel(levelId: string): boolean {
  return levelId === REVIEW_LEVEL_ID
}
