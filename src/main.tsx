import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MixziApp from './MixziApp.tsx'
import '@fontsource-variable/geist'
import '@fontsource-variable/quicksand'
import './index.css'
import './App.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MixziApp />
  </StrictMode>,
)
