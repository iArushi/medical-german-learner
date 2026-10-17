import type { ReactNode } from 'react'

export function PageSection({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <section className="mt-6">
      <h2 className="text-xs font-bold uppercase tracking-wide text-text-muted">{title}</h2>
      {subtitle ? <p className="mt-1 text-xs text-text-muted">{subtitle}</p> : null}
      <div className="mt-2">{children}</div>
    </section>
  )
}
