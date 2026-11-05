(function () {
  'use strict';

  // No se muestra en /contacto (ya es la página de conversión).
  var path = location.pathname.replace(/\/$/, '');
  if (path === '/contacto') return;

  var STORAGE_KEY = 'exitPopupShownAt';
  var COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

  function cooldownActive() {
    try {
      var shownAt = localStorage.getItem(STORAGE_KEY);
      return shownAt && (Date.now() - Number(shownAt)) < COOLDOWN_MS;
    } catch (e) {
      return false; // navegación privada u otro fallo: no bloquea el popup
    }
  }

  if (cooldownActive()) return;

  var startTime = Date.now();
  var armed = false;
  var shown = false;
  var lastFocusedEl = null;
  var lastScrollY = window.scrollY;

  function scrolledFraction() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? window.scrollY / max : 0;
  }

  function checkArmed() {
    if (armed) return;
    var elapsed = Date.now() - startTime;
    if (elapsed > 30000 || (elapsed > 15000 && scrolledFraction() > 0.25)) {
      armed = true;
    }
  }

  function buildPopup() {
    var overlay = document.createElement('div');
    overlay.className = 'exit-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'exit-popup-title');
    overlay.innerHTML =
      '<div class="exit-card">' +
        '<button type="button" class="exit-close" aria-label="Cerrar"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>' +
        '<div class="exit-icon"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i></div>' +
        '<span class="exit-badge">Antes de irte</span>' +
        '<h2 class="exit-title" id="exit-popup-title">Antes de irte, cuéntame qué te trae por aquí</h2>' +
        '<p class="exit-subtitle">Puedes escribirme ahora mismo y te respondo yo misma, Luisa. No hace falta que lo tengas todo decidido.</p>' +
        '<a href="https://wa.me/34616054001" target="_blank" rel="noopener noreferrer nofollow" class="exit-cta" id="exit-popup-cta">' +
          '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Escribir por WhatsApp' +
        '</a>' +
        '<button type="button" class="exit-secondary">No, gracias, seguir navegando</button>' +
        '<div class="exit-trust"><i class="fa-solid fa-star" aria-hidden="true"></i><span>Primera consulta gratuita · Sin compromiso</span></div>' +
      '</div>';
    document.body.appendChild(overlay);
    return overlay;
  }

  var overlay;

  function trapFocus(e) {
    if (e.key !== 'Tab' || !overlay) return;
    var focusable = overlay.querySelectorAll('button, a[href]');
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function closePopup() {
    if (!overlay) return;
    try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch (e) {}
    overlay.remove();
    document.removeEventListener('keydown', onKeydown);
    overlay = null;
    if (lastFocusedEl && lastFocusedEl.focus) lastFocusedEl.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') closePopup();
    else trapFocus(e);
  }

  function showPopup() {
    if (shown || overlay) return;
    shown = true;
    lastFocusedEl = document.activeElement;
    overlay = buildPopup();
    overlay.classList.add('is-visible');

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closePopup();
    });
    overlay.querySelector('.exit-close').addEventListener('click', closePopup);
    overlay.querySelector('.exit-secondary').addEventListener('click', closePopup);
    overlay.querySelector('#exit-popup-cta').addEventListener('click', function () {
      if (typeof gtag_report_conversion_wa === 'function') gtag_report_conversion_wa();
      closePopup();
    });
    document.addEventListener('keydown', onKeydown);
    // El overlay ya es display:flex (is-visible) en este punto, así que el foco sí se aplica.
    overlay.querySelector('.exit-close').focus();
  }

  // --- Disparador desktop: el ratón sale por arriba del viewport ---
  document.addEventListener('mouseout', function (e) {
    checkArmed();
    if (armed && !shown && e.clientY <= 0 && !e.relatedTarget) showPopup();
  });

  // --- Disparadores móvil: scroll rápido hacia arriba cerca del principio, o inactividad ---
  var idleTimer = null;

  function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      checkArmed();
      if (armed && !shown) showPopup();
    }, 45000);
  }

  window.addEventListener('scroll', function () {
    checkArmed();
    var current = window.scrollY;
    var delta = lastScrollY - current;
    if (armed && !shown && delta > 50 && current < 600) showPopup();
    lastScrollY = current;
    resetIdleTimer();
  }, { passive: true });

  window.addEventListener('touchstart', resetIdleTimer, { passive: true });
  resetIdleTimer();
})();
