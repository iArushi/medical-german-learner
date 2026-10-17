import { getWordById } from '../../../lib/loadGermanData'
import { cn } from '../../../lib/cn'

type WordOutcomeRowProps = {
  wordId: string
  variant: 'improved' | 'still-wrong'
}

function formatWord(wordId: string): string {
  const word = getWordById(wordId)
  if (!word) return wordId
  const article = word.article ? `${word.article} ` : ''
  return `${article}${word.german} — ${word.english}`
}

export function WordOutcomeRow({ wordId, variant }: WordOutcomeRowProps) {
  const improved = variant === 'improved'

  return (
    <li
      className={cn(
        'flex items-start gap-2 rounded-card border px-3 py-2 text-sm',
        improved ? 'border-success/40 bg-success-muted/80' : 'border-mistake/40 bg-mistake-muted/80',
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold',
          improved ? 'bg-success text-white' : 'bg-mistake text-white',
        )}
        aria-hidden
      >
        {improved ? '✓' : '!'}
      </span>
      <span className={cn('leading-snug', improved ? 'text-success' : 'text-accent-strong')}>
        {formatWord(wordId)}
      </span>
    </li>
  )
}
