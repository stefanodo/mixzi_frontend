import { StrictMode } from react
import { createRoot } from react-dom/client
import MixziApp from ./MixziApp.tsx
import @fontsource-variable/geist
import @fontsource-variable/quicksand
import ./index.css
import ./App.css
import { setupMobileViewportZoomReset } from ./lib/viewportZoomReset

// Activa el reseteo automático de zoom móvil al salir o cancelar inputs
setupMobileViewportZoomReset()

createRoot(document.getElementById(root)!).render(
  <StrictMode>
    <MixziApp />
  </StrictMode>,
)
