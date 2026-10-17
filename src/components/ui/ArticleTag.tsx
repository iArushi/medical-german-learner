import { ARTICLE_GENDER_LABEL, type GermanArticle } from '../../lib/articleLabels'
import { cn } from '../../lib/cn'

const ARTICLE_CLASS: Record<GermanArticle, string> = {
  der: 'bg-article-der-muted text-article-der border-article-der',
  die: 'bg-article-die-muted text-article-die border-article-die',
  das: 'bg-article-das-muted text-article-das border-article-das',
}

const ARTICLE_MARKER: Record<GermanArticle, string> = {
  der: 'M',
  die: 'F',
  das: 'N',
}

type ArticleTagProps = {
  article: string
  size?: 'default' | 'lg'
}

export function ArticleTag({ article, size = 'default' }: ArticleTagProps) {
  if (article !== 'der' && article !== 'die' && article !== 'das') {
    return null
  }

  const gender = ARTICLE_GENDER_LABEL[article]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border-l-4 font-bold uppercase tracking-wide',
        size === 'lg' ? 'px-3 py-1 text-lg' : 'px-2 py-0.5 text-sm',
        ARTICLE_CLASS[article],
      )}
      aria-label={`Article ${article}, ${gender}`}
    >
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px]"
        aria-hidden
      >
        {ARTICLE_MARKER[article]}
      </span>
      <span>
        {article}
        <span className="sr-only">, {gender}</span>
        {size === 'lg' ? (
          <span className="ml-1.5 text-xs font-semibold normal-case tracking-normal opacity-90">
            ({gender})
          </span>
        ) : null}
      </span>
    </span>
  )
}
