import { Link } from 'react-router-dom'
import { getFakeLearnerById } from '../../fake/competeLearners'
import { getLevelById } from '../../lib/loadGermanData'
import type { HeadToHeadMatch } from '../../types/compete'
import { getLocalCompeteProfile, isLearnerBlocked } from '../../storage/competeStorage'
import { AliasSafetyActions } from './AliasSafetyActions'
import { LearnerAvatar } from './LearnerAvatar'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { cn } from '../../lib/cn'

type HeadToHeadCardProps = {
  match: HeadToHeadMatch
  onBlock: (learnerId: string, alias: string) => void
  onReport: (learnerId: string, alias: string) => void
}

export function HeadToHeadCard({ match, onBlock, onReport }: HeadToHeadCardProps) {
  const opponent = getFakeLearnerById(match.opponentId)
  const level = getLevelById(match.levelId)
  const local = getLocalCompeteProfile()

  if (!opponent || isLearnerBlocked(match.opponentId)) {
    return null
  }

  const playerScore = match.playerCombinedPercent
  const opponentScore = match.opponentCombinedPercent
  const playerWins = playerScore !== null && playerScore > opponentScore
  const opponentWins = playerScore !== null && playerScore < opponentScore
  const tie = playerScore !== null && playerScore === opponentScore

  return (
    <Card padding="md" variant="elevated">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-text-muted">Head to head</p>
          <p className="mt-0.5 text-sm font-bold text-text">{level?.title ?? match.levelId}</p>
        </div>
        <AliasSafetyActions
          alias={opponent.alias}
          onBlock={() => onBlock(opponent.id, opponent.alias)}
          onReport={() => onReport(opponent.id, opponent.alias)}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div
          className={cn(
            'flex flex-col items-center rounded-card border border-border bg-surface px-2 py-4',
            playerWins && 'border-success bg-success-muted/50',
          )}
        >
          <LearnerAvatar avatar={local.avatar} alias={local.alias} />
          <p className="mt-2 truncate text-xs font-bold text-text">You</p>
          <p className="mt-2 text-2xl font-extrabold text-text">
            {playerScore !== null ? `${playerScore}%` : '—'}
          </p>
        </div>
        <div
          className={cn(
            'flex flex-col items-center rounded-card border border-border bg-surface px-2 py-4',
            opponentWins && 'border-success bg-success-muted/50',
          )}
        >
          <LearnerAvatar avatar={opponent.avatar} alias={opponent.alias} />
          <p className="mt-2 truncate text-xs font-bold text-text">{opponent.alias}</p>
          <p className="mt-2 text-2xl font-extrabold text-text">{opponentScore}%</p>
        </div>
      </div>

      <p className="mt-3 text-center text-xs font-semibold text-text-muted">
        {playerScore === null
          ? 'Play the level to record your score.'
          : tie
            ? 'Tie on combined score'
            : playerWins
              ? 'You lead'
              : 'They lead'}
      </p>

      {playerScore === null ? (
        <Link to={`/level/${match.levelId}`} className="mt-3 block">
          <Button variant="primary" fullWidth className="py-2 text-xs">
            Play level
          </Button>
        </Link>
      ) : null}
    </Card>
  )
}
