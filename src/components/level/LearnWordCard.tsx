import type { ReactNode } from 'react'
import type { GermanWord } from '../../lib/loadGermanData'
import { ArticleTag } from '../ui/ArticleTag'

function highlightGermanInExample(sentence: string, term: string): ReactNode {
  if (!term.trim()) return sentence

  const lower = sentence.toLowerCase()
  const termLower = term.toLowerCase()
  const idx = lower.indexOf(termLower)
  if (idx === -1) return sentence

  const matchLen = termLower.length
  const before = sentence.slice(0, idx)
  const match = sentence.slice(idx, idx + matchLen)
  const after = sentence.slice(idx + matchLen)

  return (
    <>
      {before}
      <mark className="rounded-sm bg-accent-muted px-0.5 font-bold text-text not-italic">
        {match}
      </mark>
      {after}
    </>
  )
}

export function LearnWordCard({ word }: { word: GermanWord }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {word.article ? <ArticleTag article={word.article} size="lg" /> : null}
        <p className="max-w-full break-words text-[clamp(1.75rem,9vw,2.25rem)] font-extrabold leading-none tracking-tight text-text">
          {word.german}
        </p>
      </div>

      <p className="mt-4 text-lg font-semibold leading-snug text-text-muted">{word.english}</p>

      <div className="mt-8 w-full border-t border-border pt-6">
        <p className="text-base font-medium leading-snug text-text">
          {highlightGermanInExample(word.exampleGerman, word.german)}
        </p>
        <p className="mt-2 text-sm leading-snug text-text-muted">{word.exampleEnglish}</p>
      </div>
    </div>
  )
}
