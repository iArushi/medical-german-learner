import { getFakeLearnerById } from '../../fake/competeLearners'
import { connectRequestChip } from '../../lib/connectRequestDisplay'
import type { ConnectRequest } from '../../types/compete'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { AliasSafetyActions } from './AliasSafetyActions'
import { ConnectStatusChip } from './ConnectStatusChip'
import { LearnerAvatar } from './LearnerAvatar'

type ConnectIncomingCardProps = {
  request: ConnectRequest
  onAccept: () => void
  onDecline: () => void
  onBlock: (learnerId: string, alias: string) => void
  onReport: (learnerId: string, alias: string) => void
}

export function ConnectIncomingCard({
  request,
  onAccept,
  onDecline,
  onBlock,
  onReport,
}: ConnectIncomingCardProps) {
  const learner = getFakeLearnerById(request.fromLearnerId)
  if (!learner) return null

  const pending = request.status === 'pending'
  const chip = connectRequestChip(request)

  return (
    <Card padding="sm" variant="elevated">
      <div className="flex items-start gap-3">
        <LearnerAvatar avatar={learner.avatar} alias={learner.alias} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-text">{learner.alias}</p>
          <p className="mt-0.5 text-xs font-semibold text-text-muted">
            {learner.streakDays} day streak
          </p>
          <div className="mt-1.5">
            <ConnectStatusChip chip={chip} />
          </div>
        </div>
        <AliasSafetyActions
          alias={learner.alias}
          onBlock={() => onBlock(learner.id, learner.alias)}
          onReport={() => onReport(learner.id, learner.alias)}
        />
      </div>
      {pending ? (
        <div className="mt-3 flex gap-2">
          <Button variant="primary" className="flex-1 py-2 text-xs" onClick={onAccept}>
            Accept
          </Button>
          <Button variant="secondary" className="flex-1 py-2 text-xs" onClick={onDecline}>
            Decline
          </Button>
        </div>
      ) : null}
    </Card>
  )
}
