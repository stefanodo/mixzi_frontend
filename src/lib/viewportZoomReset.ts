/**
 * Restablece automáticamente el zoom del viewport en dispositivos móviles
 * cuando el usuario termina, cierra o cancela la interacción con inputs de texto.
 * 
 * Permite que el sistema operativo haga zoom accesible mientras el usuario escribe,
 * pero garantiza que al perder el foco (blur/cancelar/escapar) la vista vuelva al 100%
 * sin dejar la pantalla desplazada ni ampliada permanentemente.
 */

export function setupMobileViewportZoomReset(): () => void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }

  const resetViewport = () => {
    // Solo actuar si estamos en un contexto táctil o pantalla móvil/tablet
    const isTouchOrMobile =
      window.innerWidth <= 1024 ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;

    if (!isTouchOrMobile) return;

    const viewportMeta = document.querySelector<HTMLMetaElement>("meta[name="viewport"]");
    if (!viewportMeta) return;

    const standardContent = "width=device-width, initial-scale=1.0";
    const lockedContent = "width=device-width, initial-scale=1.0, maximum-scale=1.0";

    // Restablece el desplazamiento horizontal si el zoom desalineó la página
    if (window.scrollX !== 0) {
      window.scrollTo({ left: 0, top: window.scrollY, behavior: "instant" as ScrollBehavior });
    }

    // Forzar temporalmente maximum-scale=1.0 para que WebKit/Blink reseteen la escala visual a 1.0
    viewportMeta.setAttribute("content", lockedContent);

    // Restaurar inmediatamente después para preservar la accesibilidad y el pellizco manual
    window.setTimeout(() => {
      viewportMeta.setAttribute("content", standardContent);
    }, 150);
  };

  const handleFocusOut = (event: FocusEvent) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const isInput =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      target.isContentEditable;

    if (!isInput) return;

    // Pequeña espera para verificar si el foco saltó a otro input
    window.setTimeout(() => {
      const active = document.activeElement;
      const isStillEditing =
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        active instanceof HTMLSelectElement ||
        (active && (active as HTMLElement).isContentEditable);

      if (!isStillEditing) {
        resetViewport();
      }
    }, 80);
  };

  // Al presionar Escape o cancelar con teclado en un input, forzar desenfoque y reseteo
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      const active = document.activeElement as HTMLElement | null;
      if (
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        active instanceof HTMLSelectElement
      ) {
        active.blur();
      }
    }
  };

  document.addEventListener("focusout", handleFocusOut, true);
  document.addEventListener("keydown", handleKeyDown, true);

  return () => {
    document.removeEventListener("focusout", handleFocusOut, true);
    document.removeEventListener("keydown", handleKeyDown, true);
  };
}
