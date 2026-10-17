import type { ReactNode } from 'react'
import { Button } from './Button'
import { Card } from './Card'

type ModalProps = {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
  primaryAction?: { label: string; onClick: () => void }
  secondaryAction?: { label: string; onClick: () => void }
}

export function Modal({
  open,
  title,
  children,
  onClose,
  primaryAction,
  secondaryAction,
}: ModalProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-text/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <Card className="w-full max-w-sm" padding="md" variant="elevated">
        <h2 id="modal-title" className="text-base font-bold text-text">
          {title}
        </h2>
        <div className="mt-2 text-sm leading-relaxed text-text-muted">{children}</div>
        {(primaryAction || secondaryAction) && (
          <div className="mt-5 flex flex-col gap-2 sm:flex-row-reverse">
            {primaryAction ? (
              <Button variant="primary" fullWidth onClick={primaryAction.onClick}>
                {primaryAction.label}
              </Button>
            ) : null}
            {secondaryAction ? (
              <Button variant="secondary" fullWidth onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            ) : (
              <Button variant="secondary" fullWidth onClick={onClose}>
                Cancel
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
