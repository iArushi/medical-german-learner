import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { RequireModeChoice } from './components/RequireModeChoice'
import { useLearningMode } from './context/LearningModeContext'
import { CompetePage } from './pages/CompetePage'
import { HomePage } from './pages/HomePage'
import { LevelPage } from './pages/LevelPage'
import { ModeChoicePage } from './pages/ModeChoicePage'
import { ProfilePage } from './pages/ProfilePage'
import { ResultPage } from './pages/ResultPage'

function RootRedirect() {
  const { hasChosenMode } = useLearningMode()
  return <Navigate to={hasChosenMode ? '/home' : '/mode'} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/mode" element={<ModeChoicePage />} />
          <Route element={<RequireModeChoice />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/compete" element={<CompetePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/level/:levelId/*" element={<LevelPage />} />
            <Route path="/result" element={<ResultPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
