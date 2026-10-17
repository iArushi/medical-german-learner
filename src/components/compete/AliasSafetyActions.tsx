import { useState } from 'react'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { Button } from '../ui/Button'
import { cn } from '../../lib/cn'

type PendingAction = 'block' | 'report' | null

type AliasSafetyActionsProps = {
  alias: string
  onBlock: () => void
  onReport: () => void
}

export function AliasSafetyActions({ alias, onBlock, onReport }: AliasSafetyActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [pending, setPending] = useState<PendingAction>(null)

  const openAction = (action: PendingAction) => {
    setMenuOpen(false)
    setPending(action)
  }

  return (
    <>
      <div className="relative shrink-0">
        <Button
          variant="ghost"
          className="h-8 w-8 px-0 py-0 text-lg leading-none"
          aria-label={`Menu for ${alias}`}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          ⋯
        </Button>
        {menuOpen ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-10 cursor-default bg-transparent"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            />
            <div
              className={cn(
                'absolute right-0 top-full z-20 mt-1 min-w-[9rem] overflow-hidden rounded-card border border-border bg-surface py-1 shadow-soft',
              )}
            >
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-xs font-semibold text-text hover:bg-bg"
                onClick={() => openAction('block')}
              >
                Block alias
              </button>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-xs font-semibold text-text hover:bg-bg"
                onClick={() => openAction('report')}
              >
                Report alias
              </button>
            </div>
          </>
        ) : null}
      </div>

      <ConfirmDialog
        open={pending === 'block'}
        title={`Block ${alias}?`}
        message={`${alias} will be removed from your group and hidden from Connect lists.`}
        confirmLabel="Block"
        onCancel={() => setPending(null)}
        onConfirm={() => {
          onBlock()
          setPending(null)
        }}
      />

      <ConfirmDialog
        open={pending === 'report'}
        title={`Report ${alias}?`}
        message="Thank you. This report is saved locally in the demo. Consider blocking if you do not want to see this alias."
        confirmLabel="Report"
        onCancel={() => setPending(null)}
        onConfirm={() => {
          onReport()
          setPending(null)
        }}
      />
    </>
  )
}
