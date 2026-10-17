import { getFakeLearnerById } from '../../fake/competeLearners'
import { connectRequestChip } from '../../lib/connectRequestDisplay'
import { isLearnerBlocked } from '../../storage/competeStorage'
import type { ConnectRequest } from '../../types/compete'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { AliasSafetyActions } from './AliasSafetyActions'
import { ConnectStatusChip } from './ConnectStatusChip'
import { LearnerAvatar } from './LearnerAvatar'

type ConnectOutgoingListProps = {
  requests: ConnectRequest[]
  onSimulateExpire?: (requestId: string) => void
  onBlock: (learnerId: string, alias: string) => void
  onReport: (learnerId: string, alias: string) => void
}

export function ConnectOutgoingList({
  requests,
  onSimulateExpire,
  onBlock,
  onReport,
}: ConnectOutgoingListProps) {
  const visible = requests.filter((r) => !isLearnerBlocked(r.toLearnerId))

  if (visible.length === 0) {
    return null
  }

  return (
    <ul className="flex flex-col gap-2">
      {visible.map((request) => {
        const learner = getFakeLearnerById(request.toLearnerId)
        if (!learner) return null
        const chip = connectRequestChip(request)
        return (
          <li key={request.id}>
            <Card padding="sm" variant="flat">
              <div className="flex items-start gap-3">
                <LearnerAvatar avatar={learner.avatar} alias={learner.alias} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-text">{learner.alias}</p>
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
              {request.status === 'pending' && onSimulateExpire ? (
                <Button
                  variant="ghost"
                  className="mt-2 px-0 py-1 text-[11px] text-text-muted underline"
                  onClick={() => onSimulateExpire(request.id)}
                >
                  Expire now (demo)
                </Button>
              ) : null}
            </Card>
          </li>
        )
      })}
    </ul>
  )
}
