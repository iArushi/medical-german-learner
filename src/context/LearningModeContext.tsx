import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { LearningMode } from '../types/mode'
import { getLearningMode, setLearningMode as persistMode } from '../storage/learningMode'

type LearningModeContextValue = {
  mode: LearningMode | null
  hasChosenMode: boolean
  setMode: (mode: LearningMode) => void
}

const LearningModeContext = createContext<LearningModeContextValue | null>(null)

export function LearningModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<LearningMode | null>(() => getLearningMode())

  const setMode = useCallback((next: LearningMode) => {
    persistMode(next)
    setModeState(next)
  }, [])

  const value = useMemo(
    () => ({
      mode,
      hasChosenMode: mode !== null,
      setMode,
    }),
    [mode, setMode],
  )

  return (
    <LearningModeContext.Provider value={value}>{children}</LearningModeContext.Provider>
  )
}

export function useLearningMode(): LearningModeContextValue {
  const ctx = useContext(LearningModeContext)
  if (!ctx) {
    throw new Error('useLearningMode must be used within LearningModeProvider')
  }
  return ctx
}
