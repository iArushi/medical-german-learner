import { useNavigate } from 'react-router-dom'
import { useLearningMode } from '../context/LearningModeContext'
import type { LearningMode } from '../types/mode'
import { MedIcon } from '../components/ui/MedIcon'
import { cn } from '../lib/cn'

function ModeButton({
  label,
  description,
  icon,
  onClick,
}: {
  label: string
  description: string
  icon: 'book' | 'users'
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="path-card group w-full text-left active:scale-[0.995] motion-reduce:active:scale-100"
    >
      <div className="flex items-start gap-3 p-4">
        <span
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
            icon === 'book' ? 'bg-primary-muted text-primary' : 'bg-accent-muted text-accent-strong',
          )}
        >
          <MedIcon name={icon} size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <span className="font-display block text-base font-bold text-text">{label}</span>
          <span className="mt-1 block text-sm leading-relaxed text-text-muted">{description}</span>
        </div>
        <MedIcon
          name="chevron"
          size={20}
          className="mt-1 shrink-0 text-text-muted/50 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
        />
      </div>
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
    <div className="page-enter flex min-h-full flex-col px-4 py-8">
      <div className="mb-6 flex items-center gap-2.5">
        <span className="brand-mark" aria-hidden>
          <MedIcon name="sparkles" size={20} />
        </span>
        <p className="section-kicker">Welcome</p>
      </div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-text">
        How do you want to learn?
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">
        You can switch anytime in Profile. Your streak and points stay with you.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <ModeButton
          label="Learn individually"
          description="Practice levels at your own pace."
          icon="book"
          onClick={() => choose('individual')}
        />
        <ModeButton
          label="Compete mode"
          description="See how you compare with learners at a similar streak."
          icon="users"
          onClick={() => choose('compete')}
        />
      </div>
    </div>
  )
}
