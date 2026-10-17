export type GermanArticle = 'der' | 'die' | 'das'

export const ARTICLE_GENDER_LABEL: Record<GermanArticle, string> = {
  der: 'masculine',
  die: 'feminine',
  das: 'neuter',
}

export function articleChoiceLabel(article: GermanArticle): string {
  return `${article} (${ARTICLE_GENDER_LABEL[article]})`
}

export function isGermanArticle(value: string): value is GermanArticle {
  return value === 'der' || value === 'die' || value === 'das'
}
