import type { Difficulty } from '../lib/loadGermanData'
import { Badge } from './ui/Badge'

const MAP: Record<Difficulty, 'easy' | 'medium' | 'hard'> = {
  Easy: 'easy',
  Medium: 'medium',
  Hard: 'hard',
}

export function DifficultyLabel({ difficulty }: { difficulty: Difficulty }) {
  return <Badge variant={MAP[difficulty]}>{difficulty}</Badge>
}
