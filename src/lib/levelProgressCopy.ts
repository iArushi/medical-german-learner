import type { LevelAttemptSession } from '../storage/levelAttemptSession'

export function countWordsToFix(attempt: LevelAttemptSession): number {
  if (attempt.improveTotal > 0) {
    return attempt.practiseMissedWordIds.filter(
      (id) => !attempt.improveCorrectWordIds.includes(id),
    ).length
  }
  return attempt.practiseMissedWordIds.length
}

export function wordsToFixMessage(count: number): string {
  if (count === 0) {
    return 'No words need a fix right now — nice work.'
  }
  if (count === 1) {
    return '1 word to gently fix when you are ready.'
  }
  return `${count} words to gently fix when you are ready.`
}
