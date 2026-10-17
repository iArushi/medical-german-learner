import { Card } from './Card'

export function FeedbackToast({ message }: { message: string | null }) {
  if (!message) return null

  return (
    <Card
      className="fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-lg border-text bg-text px-4 py-3 text-center text-sm text-white shadow-soft"
      padding="sm"
      variant="flat"
    >
      {message}
    </Card>
  )
}
