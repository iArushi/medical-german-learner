import { useNavigate } from 'react-router-dom'
import { useLearningMode } from '../context/LearningModeContext'
import type { LearningMode } from '../types/mode'
import { Card } from '../components/ui/Card'

function ModeButton({
  label,
  description,
  onClick,
}: {
  label: string
  description: string
  onClick: () => void
}) {
  return (
    <button type="button" onClick={onClick} className="w-full text-left">
      <Card padding="md" variant="elevated" className="active:bg-bg">
        <span className="block text-base font-bold text-text">{label}</span>
        <span className="mt-1 block text-sm text-text-muted">{description}</span>
      </Card>
    </button>
  )
}

export function ModeChoicePage() {
  const navigate = useNavigate()
  const { setMode } = useLearningMode()

  const choose = (mode: LearningMode) => {
    setMode(mode)
    navigate('/home', { replace: true })
  }

  return (
    <div className="flex min-h-full flex-col px-4 py-8">
      <h1 className="text-2xl font-bold text-text">How do you want to learn?</h1>
      <p className="mt-2 text-sm text-text-muted">
        You can switch anytime in Profile. Your streak and points stay with you.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <ModeButton
          label="Learn individually"
          description="Practice levels at your own pace."
          onClick={() => choose('individual')}
        />
        <ModeButton
          label="Compete mode"
          description="See how you compare with learners at a similar streak."
          onClick={() => choose('compete')}
        />
      </div>
    </div>
  )
}
