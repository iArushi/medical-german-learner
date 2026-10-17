import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useLearningMode } from '../context/LearningModeContext'

export function RequireModeChoice() {
  const { hasChosenMode } = useLearningMode()
  const location = useLocation()

  if (!hasChosenMode) {
    return <Navigate to="/mode" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
