import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './components/ui/ThemeProvider'
import { AppRouter } from './router/AppRouter'

function MixziApp() {

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default MixziApp
