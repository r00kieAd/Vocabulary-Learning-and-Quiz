import './main.scss'
import { App } from './app.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GlobalProvider } from './utils/global_context.tsx'
import ErrorBoundary from './components/error_boundary.tsx'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <ErrorBoundary>
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </ErrorBoundary>
  </StrictMode>,
)
