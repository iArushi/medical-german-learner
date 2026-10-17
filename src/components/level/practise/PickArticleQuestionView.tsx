import { ArticleTag } from '../../ui/ArticleTag'
import { articleChoiceLabel, isGermanArticle } from '../../../lib/articleLabels'
import type { PickArticleQuestion } from '../../../types/practise'
import { AnswerOption } from './AnswerOption'

const ARTICLES = ['der', 'die', 'das'] as const

type Props = {
  question: PickArticleQuestion
  selectedAnswer: string | null
  showFeedback: boolean
  onSelect: (article: string) => void
}

export function PickArticleQuestionView({
  question,
  selectedAnswer,
  showFeedback,
  onSelect,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-text-muted">Pick the correct article.</p>
      <p className="text-2xl font-bold text-text">{question.german}</p>
      <div className="flex flex-col gap-2" role="group" aria-label="Article choices">
        {ARTICLES.map((article) => {
          let variant: 'default' | 'correct' | 'incorrect' | 'muted-correct' = 'default'
          if (showFeedback) {
            if (article === question.correctArticle) {
              variant = 'correct'
            } else if (article === selectedAnswer) {
              variant = 'incorrect'
            }
          }
          const label = isGermanArticle(article) ? articleChoiceLabel(article) : article
          return (
            <AnswerOption
              key={article}
              label={label}
              disabled={showFeedback}
              variant={variant}
              onSelect={() => onSelect(article)}
            />
          )
        })}
      </div>
      {showFeedback && selectedAnswer !== question.correctArticle ? (
        <p className="flex flex-wrap items-center gap-2 text-sm text-text-muted">
          <span className="font-semibold">Correct:</span>
          <ArticleTag article={question.correctArticle} />
          <span>{question.german}</span>
        </p>
      ) : null}
    </div>
  )
}
