import { Modal } from './Modal'

type ConfirmDialogProps = {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      primaryAction={{ label: confirmLabel, onClick: onConfirm }}
      secondaryAction={{ label: 'Cancel', onClick: onCancel }}
    >
      {message}
    </Modal>
  )
}
