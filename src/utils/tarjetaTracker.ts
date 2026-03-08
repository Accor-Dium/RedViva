/**
 * Utilidad para trackear clicks en tarjetas informativas
 * e incrementar el contador de visitas en la base de datos
 */

/**
 * Incrementa el contador de una tarjeta cuando se hace click en su enlace
 * @param tarjetaId - ID de la tarjeta a trackear
 */
export function trackTarjetaClick(tarjetaId: string): void {
  const apiUrl = `/api/tarjetas-informativas/${tarjetaId}`;
  const data = JSON.stringify({});

  // sendBeacon es ideal para analytics ya que funciona incluso si la página se cierra
  if (navigator.sendBeacon) {
    const blob = new Blob([data], { type: 'application/json' });
    navigator.sendBeacon(apiUrl, blob);
  } else {
    // Fallback para navegadores antiguos
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data,
      keepalive: true, // Permite que el request se complete aunque se cierre la página
    }).catch(() => {
      // Silenciar errores para no afectar la UX
    });
  }
}

/**
 * Inicializa el tracking de tarjetas en el documento
 * Debe llamarse cuando el DOM esté listo
 */
export function initTarjetaTracking(): void {
  const tarjetaLinks = document.querySelectorAll<HTMLAnchorElement>(
    '.tarjeta-link[data-tarjeta-id]'
  );

  tarjetaLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const tarjetaId = link.getAttribute('data-tarjeta-id');

      if (tarjetaId) {
        trackTarjetaClick(tarjetaId);
      }
      // No prevenir el default, dejar que el enlace navegue normalmente
    });
  });
}
