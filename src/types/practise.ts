export type MatchMeaningQuestion = {
  type: 'match'
  wordId: string
  promptGerman: string
  options: string[]
  correctOption: string
  isRevisit?: boolean
}

export type PickArticleQuestion = {
  type: 'pickArticle'
  wordId: string
  german: string
  correctArticle: 'der' | 'die' | 'das'
  isRevisit?: boolean
}

export type PractiseQuestion = MatchMeaningQuestion | PickArticleQuestion

export type PractiseSessionState = {
  questions: PractiseQuestion[]
  currentIndex: number
  initialQuestionCount: number
  correctCount: number
  missedWordIds: string[]
  revisitQueue: string[]
  enableRevisit: boolean
  phase: 'question' | 'feedback' | 'complete'
  selectedAnswer: string | null
  lastAnswerCorrect: boolean
}

export function createInitialPractiseState(
  questions: PractiseQuestion[],
  enableRevisit: boolean,
): PractiseSessionState {
  return {
    questions,
    currentIndex: 0,
    initialQuestionCount: questions.length,
    correctCount: 0,
    missedWordIds: [],
    revisitQueue: [],
    enableRevisit,
    phase: 'question',
    selectedAnswer: null,
    lastAnswerCorrect: false,
  }
}

export type MarkedRoundOutcome = {
  correctCount: number
  totalCount: number
  missedWordIds: string[]
  correctWordIds: string[]
}
