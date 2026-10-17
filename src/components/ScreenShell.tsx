import type { ReactNode } from 'react'
import { Card } from './ui/Card'

type ScreenShellProps = {
  title: string
  children?: ReactNode
}

export function ScreenShell({ title, children }: ScreenShellProps) {
  return (
    <div className="flex min-h-full flex-col px-4 pb-4 pt-6">
      <h1 className="text-xl font-bold text-text">{title}</h1>
      {children ? (
        <div className="mt-4 flex-1 text-sm text-text-muted">{children}</div>
      ) : (
        <Card className="mt-4" padding="md" variant="dashed">
          <p className="text-sm text-text-muted">Coming soon.</p>
        </Card>
      )}
    </div>
  )
}
