import { Card } from './Card'

type EmptyStateProps = {
  title: string
  description: string
  icon?: string
}

export function EmptyState({ title, description, icon = '✨' }: EmptyStateProps) {
  return (
    <Card variant="dashed" padding="md" className="text-center" role="status">
      <p className="text-2xl" aria-hidden>
        {icon}
      </p>
      <p className="mt-2 text-sm font-semibold text-text">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-text-muted">{description}</p>
    </Card>
  )
}
