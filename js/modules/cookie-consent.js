// Cookie Consent Banner - Shared Module
export function initCookieBanner() {
  // IMPORTANT: Check consent BEFORE anything else
  var existingConsent = localStorage.getItem('cookieConsent')
  if (existingConsent) {
    // User already accepted or rejected - don't show banner at all
    return
  }

  // Create banner HTML
  function createBanner() {
    // Remove existing banner if any
    var existing = document.getElementById('cookie-banner')
    if (existing) {
      existing.remove()
    }

    var banner = document.createElement('div')
    banner.id = 'cookie-banner'
    banner.className =
      'fixed bottom-0 left-0 right-0 bg-[#2D1B3D] text-white p-4 shadow-lg z-40'
    banner.innerHTML =
      '<div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">' +
      '<div class="text-sm">' +
      '<p>Esta web utiliza cookies para mejorar tu experiencia. <a href="/politica-de-cookies" class="underline hover:text-[#D4AF37]">Más información</a></p>' +
      '</div>' +
      '<div class="flex gap-3">' +
      '<button id="cookie-reject" class="px-4 py-2 border border-white rounded-full text-sm hover:bg-white hover:text-[#2D1B3D] transition-colors cursor-pointer">Rechazar</button>' +
      '<button id="cookie-accept" class="px-4 py-2 bg-[#9B7EBD] rounded-full text-sm hover:bg-[#7A5FA0] transition-colors cursor-pointer">Aceptar</button>' +
      '</div>' +
      '</div>'
    document.body.appendChild(banner)
    return banner
  }

  // Save consent
  function setConsent(accepted) {
    localStorage.setItem('cookieConsent', accepted ? 'accepted' : 'rejected')
    var banner = document.getElementById('cookie-banner')
    if (banner) {
      banner.remove()
    }
  }

  // Initialize - banner is created only if no consent exists (checked above)
  function init() {
    var banner = createBanner()

    // Set up event handlers immediately
    var acceptBtn = document.getElementById('cookie-accept')
    var rejectBtn = document.getElementById('cookie-reject')

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        setConsent(true)
      })
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', function () {
        setConsent(false)
      })
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
}
