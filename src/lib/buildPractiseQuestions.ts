import type { GermanLevel, GermanWord, QuestionStyle } from './loadGermanData'
import { shuffle } from './shuffle'
import type { PractiseQuestion } from '../types/practise'

function hasArticle(word: GermanWord): word is GermanWord & { article: 'der' | 'die' | 'das' } {
  return word.article === 'der' || word.article === 'die' || word.article === 'das'
}

function questionKindForWord(
  questionStyle: QuestionStyle,
  word: GermanWord,
  index: number,
): 'match' | 'pickArticle' {
  switch (questionStyle) {
    case 'MatchMeaning':
      return 'match'
    case 'PickArticle':
      return hasArticle(word) ? 'pickArticle' : 'match'
    case 'Mixed':
      if (!hasArticle(word)) return 'match'
      return index % 2 === 0 ? 'match' : 'pickArticle'
    case 'FillGap':
    case 'PatientSituation':
      // Other styles not built yet — match meaning until those rounds exist.
      return 'match'
    default:
      return 'match'
  }
}

function buildMatchQuestion(word: GermanWord, pool: GermanWord[]): PractiseQuestion {
  const others = pool.filter((w) => w.id !== word.id)
  const distractors = shuffle(others)
    .slice(0, 3)
    .map((w) => w.english)
  const options = shuffle([word.english, ...distractors])
  const promptGerman = word.article ? `${word.article} ${word.german}` : word.german

  return {
    type: 'match',
    wordId: word.id,
    promptGerman,
    options,
    correctOption: word.english,
  }
}

function buildPickArticleQuestion(word: GermanWord): PractiseQuestion {
  return {
    type: 'pickArticle',
    wordId: word.id,
    german: word.german,
    correctArticle: word.article as 'der' | 'die' | 'das',
  }
}

function buildQuestionForWordAtIndex(
  level: GermanLevel,
  words: GermanWord[],
  word: GermanWord,
  index: number,
  isRevisit = false,
): PractiseQuestion {
  const kind = questionKindForWord(level.questionStyle, word, index)
  const base =
    kind === 'pickArticle' ? buildPickArticleQuestion(word) : buildMatchQuestion(word, words)
  return isRevisit ? { ...base, isRevisit: true } : base
}

export function buildPractiseQuestions(level: GermanLevel, words: GermanWord[]): PractiseQuestion[] {
  return words.map((word, index) => buildQuestionForWordAtIndex(level, words, word, index))
}

export function buildPractiseQuestionForWord(
  level: GermanLevel,
  words: GermanWord[],
  wordId: string,
  isRevisit = false,
): PractiseQuestion | undefined {
  const index = words.findIndex((w) => w.id === wordId)
  if (index < 0) return undefined
  const word = words[index]
  return buildQuestionForWordAtIndex(level, words, word, index, isRevisit)
}
