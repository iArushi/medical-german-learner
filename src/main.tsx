import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LearningModeProvider } from './context/LearningModeContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LearningModeProvider>
      <App />
    </LearningModeProvider>
  </StrictMode>,
)
