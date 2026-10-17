import { buildPractiseQuestionForWord } from './buildPractiseQuestions'
import type { GermanLevel, GermanWord } from './loadGermanData'
import type { PractiseQuestion, PractiseSessionState } from '../types/practise'

export function isAnswerCorrect(question: PractiseQuestion, answer: string): boolean {
  if (question.type === 'match') {
    return answer === question.correctOption
  }
  return answer === question.correctArticle
}

function appendRevisitQuestions(
  state: PractiseSessionState,
  level: GermanLevel,
  words: GermanWord[],
): PractiseSessionState {
  if (state.revisitQueue.length === 0) {
    return state
  }

  const newQuestions = state.revisitQueue
    .map((wordId) => buildPractiseQuestionForWord(level, words, wordId, true))
    .filter((q): q is PractiseQuestion => q !== undefined)

  return {
    ...state,
    questions: [...state.questions, ...newQuestions],
    revisitQueue: [],
  }
}

export function recordMarkedAnswer(state: PractiseSessionState, answer: string): PractiseSessionState {
  const question = state.questions[state.currentIndex]
  const correct = isAnswerCorrect(question, answer)
  const isFirstPass = !question.isRevisit

  const missedWordIds =
    correct || !isFirstPass || state.missedWordIds.includes(question.wordId)
      ? state.missedWordIds
      : [...state.missedWordIds, question.wordId]

  const revisitQueue =
    correct || !state.enableRevisit
      ? state.revisitQueue
      : [...state.revisitQueue, question.wordId]

  return {
    ...state,
    correctCount: correct && isFirstPass ? state.correctCount + 1 : state.correctCount,
    missedWordIds,
    revisitQueue,
    phase: 'feedback',
    selectedAnswer: answer,
    lastAnswerCorrect: correct,
  }
}

export function advanceMarkedQuestion(
  state: PractiseSessionState,
  level: GermanLevel,
  words: GermanWord[],
): PractiseSessionState {
  const nextIndex = state.currentIndex + 1

  if (nextIndex >= state.questions.length) {
    if (state.enableRevisit) {
      const withRevisits = appendRevisitQuestions(state, level, words)
      if (withRevisits.questions.length > state.questions.length) {
        return {
          ...withRevisits,
          currentIndex: state.questions.length,
          phase: 'question',
          selectedAnswer: null,
          lastAnswerCorrect: false,
        }
      }
      return { ...withRevisits, phase: 'complete' }
    }
    return { ...state, phase: 'complete' }
  }

  return {
    ...state,
    currentIndex: nextIndex,
    phase: 'question',
    selectedAnswer: null,
    lastAnswerCorrect: false,
  }
}

export function isLastMarkedQuestion(state: PractiseSessionState): boolean {
  const atEnd = state.currentIndex + 1 >= state.questions.length
  if (state.enableRevisit) {
    return atEnd && state.revisitQueue.length === 0
  }
  return atEnd
}
