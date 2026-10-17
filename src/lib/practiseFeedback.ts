import type { GermanWord } from './loadGermanData'
import type { PractiseQuestion } from '../types/practise'

export type PractiseFeedback = {
  isCorrect: boolean
  statusLabel: string
  correctAnswerLine: string
  reasonLine: string
}

function reasonFromWord(word: GermanWord): string {
  if (word.note) {
    return word.note
  }
  return word.exampleGerman
}

export function buildPractiseFeedback(
  question: PractiseQuestion,
  word: GermanWord,
  isCorrect: boolean,
): PractiseFeedback {
  const reasonLine = reasonFromWord(word)

  if (question.type === 'match') {
    return {
      isCorrect,
      statusLabel: isCorrect ? 'Correct' : 'Not quite',
      correctAnswerLine: `${question.promptGerman} — ${question.correctOption}`,
      reasonLine,
    }
  }

  return {
    isCorrect,
    statusLabel: isCorrect ? 'Correct' : 'Not quite',
    correctAnswerLine: `${question.correctArticle} ${question.german}`,
    reasonLine,
  }
}
