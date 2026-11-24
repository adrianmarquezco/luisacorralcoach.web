(function () {
  if (localStorage.getItem('lc-cookie-consent') || localStorage.getItem('cookieConsent')) return;

  var banner = document.createElement('div');
  banner.id = 'lc-cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Aviso de cookies');
  banner.innerHTML = [
    '<div style="position:fixed;bottom:0;left:0;right:0;background:#2D1B3D;color:#fff;',
    'padding:1rem 1.5rem;z-index:48;display:flex;flex-wrap:wrap;align-items:center;',
    'justify-content:space-between;gap:1rem;font-family:Nunito Sans,sans-serif;',
    'box-shadow:0 -4px 20px rgba(0,0,0,.4);">',
    '<p style="margin:0;font-size:.9rem;flex:1;min-width:200px;line-height:1.5">',
    'Usamos cookies propias y de terceros para mejorar tu experiencia de navegación. ',
    '<a href="/politica-de-cookies" style="color:#9B7EBD;text-decoration:underline">',
    'Política de cookies</a>',
    '</p>',
    '<div style="display:flex;gap:.75rem;flex-shrink:0">',
    '<button id="lc-cookie-reject" style="background:transparent;border:1px solid #9B7EBD;',
    'color:#9B7EBD;padding:.5rem 1.25rem;border-radius:9999px;cursor:pointer;',
    'font-size:.875rem;font-family:inherit;white-space:nowrap">Rechazar</button>',
    '<button id="lc-cookie-accept" style="background:#9B7EBD;border:none;color:#fff;',
    'padding:.5rem 1.25rem;border-radius:9999px;cursor:pointer;font-size:.875rem;',
    'font-family:inherit;white-space:nowrap">Aceptar</button>',
    '</div>',
    '</div>'
  ].join('');

  document.body.appendChild(banner);

  document.getElementById('lc-cookie-accept').addEventListener('click', function () {
    localStorage.setItem('lc-cookie-consent', 'accepted');
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        'ad_storage': 'granted',
        'analytics_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted'
      });
    }
    banner.remove();
  });

  document.getElementById('lc-cookie-reject').addEventListener('click', function () {
    localStorage.setItem('lc-cookie-consent', 'rejected');
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        'ad_storage': 'denied',
        'analytics_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
    }
    banner.remove();
  });
})();
(function () {
  var WA_PREFIX = 'https://wa.me/';

  function pageLabel() {
    var t = (document.title || '').split('|')[0].trim();
    return t || 'página de inicio';
  }

  function addWhatsAppText(a) {
    var href = a.getAttribute('href') || '';
    if (href.indexOf(WA_PREFIX) !== 0 || /[?&]text=/.test(href)) return;
    var msg = 'Hola Luisa, vengo de tu web (' + pageLabel() + ') y me gustaría información.';
    a.setAttribute('href', href + (href.indexOf('?') === -1 ? '?' : '&') + 'text=' + encodeURIComponent(msg));
  }

  function prefillAll() {
    var links = document.querySelectorAll('a[href^="' + WA_PREFIX + '"]');
    for (var i = 0; i < links.length; i++) addWhatsAppText(links[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', prefillAll);
  } else {
    prefillAll();
  }

  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var method = null;
    if (href.indexOf(WA_PREFIX) === 0) {
      addWhatsAppText(a);
      method = 'whatsapp';
    } else if (href.indexOf('tel:') === 0) {
      method = 'phone';
    } else if (href.indexOf('mailto:') === 0) {
      method = 'email';
    }
    if (method && typeof gtag === 'function') {
      gtag('event', 'generate_lead', { method: method, page_path: location.pathname });
    }
  }, true);
})();
