/**
 * Restablece automáticamente el zoom y encuadre del viewport en móviles
 * tan pronto como se cierra el teclado virtual.
 */

export function setupMobileViewportZoomReset(): () => void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }

  const resetViewportZoom = () => {
    const meta = document.querySelector<HTMLMetaElement>("meta[name=\"viewport\"]");
    if (!meta) return;

    // 1. Corregir cualquier paneo horizontal provocado por el zoom
    if (window.scrollX !== 0) {
      window.scrollTo({ left: 0, top: window.scrollY, behavior: "instant" as ScrollBehavior });
    }

    // 2. Forzar el repliegue de la escala visual a 1.0 (WebKit / Blink)
    // El uso temporal de user-scalable=no y maximum-scale=1.0 obliga a iOS a volver al 100%
    meta.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no");

    // 3. Restaurar después de que el navegador aplique el nuevo encuadre
    window.setTimeout(() => {
      meta.setAttribute("content", "width=device-width, initial-scale=1.0");
    }, 300);
  };

  const cleanups: (() => void)[] = [];

  // MÉTODO PRINCIPAL: Detección directa mediante visualViewport al cerrar el teclado
  if (window.visualViewport) {
    let lastHeight = window.visualViewport.height;

    const handleViewportResize = () => {
      if (!window.visualViewport) return;
      const currentHeight = window.visualViewport.height;

      // Si la altura del viewport visible aumenta significativamente (>= 140px),
      // significa que el teclado en pantalla se ha cerrado
      const keyboardClosed = currentHeight > lastHeight + 140;
      lastHeight = currentHeight;

      if (keyboardClosed) {
        // Desenfocar si aún quedaba algún elemento activo
        const active = document.activeElement;
        if (
          active instanceof HTMLInputElement ||
          active instanceof HTMLTextAreaElement ||
          active instanceof HTMLSelectElement
        ) {
          active.blur();
        }

        // Dar un breve margen para que termine la animación física del teclado
        window.setTimeout(() => {
          resetViewportZoom();
        }, 120);
      }
    };

    window.visualViewport.addEventListener("resize", handleViewportResize);
    cleanups.push(() => window.visualViewport?.removeEventListener("resize", handleViewportResize));
  }

  // MÉTODO SECUNDARIO DE RESPALDO: focusout cuando el usuario sale del input
  const handleFocusOut = (event: FocusEvent) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const isInput =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement;

    if (!isInput) return;

    // Si pasaron 200ms y no hay otro input con foco, asegurar que el zoom vuelva a 1.0
    window.setTimeout(() => {
      const active = document.activeElement;
      const isAnotherInput =
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        active instanceof HTMLSelectElement;

      if (!isAnotherInput) {
        resetViewportZoom();
      }
    }, 200);
  };

  document.addEventListener("focusout", handleFocusOut, true);
  cleanups.push(() => document.removeEventListener("focusout", handleFocusOut, true));

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}
