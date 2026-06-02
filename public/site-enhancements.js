function initContactPreferenceRadios() {
  const radios = Array.from(
    document.querySelectorAll('input[type="radio"][name="contact_preference"]')
  )
  if (!radios.length) return

  const selected = ['border-[#9B7EBD]', 'bg-[#E8D7F1]']

  const sync = () => {
    for (const r of radios) {
      const label = r.closest('label')
      if (!label) continue
      if (r.checked) label.classList.add(...selected)
      else label.classList.remove(...selected)
    }
  }

  for (const r of radios) r.addEventListener('change', sync)
  sync()
}

function initExternalLinksNewTab() {
  const hosts = ['https://wa.me/', 'https://www.instagram.com/', 'https://www.tiktok.com/']

  document.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href') || ''
    if (!hosts.some((h) => href.startsWith(h))) return

    if (!a.getAttribute('target')) a.setAttribute('target', '_blank')

    const rel = (a.getAttribute('rel') || '').split(/\s+/).filter(Boolean)
    const set = new Set(rel)
    set.add('noopener')
    set.add('noreferrer')
    a.setAttribute('rel', Array.from(set).join(' '))
  })
}

function initFormSuccessBanner() {
  const params = new URLSearchParams(window.location.search)
  const enviado = params.get('enviado')
  if (!enviado) return

  const messages = {
    '1': '¡Gracias! He recibido tu mensaje y te responderé lo antes posible.',
    newsletter:
      '¡Gracias por suscribirte! Pronto recibirás contenido en tu correo.',
  }
  const text = messages[enviado] || messages['1']
  if (!text) return

  const banner = document.createElement('div')
  banner.setAttribute('role', 'status')
  banner.className =
    'fixed top-24 left-1/2 -translate-x-1/2 z-[9999] max-w-lg w-[calc(100%-2rem)] bg-[#2D1B3D] text-white px-6 py-4 rounded-2xl shadow-xl text-center text-sm md:text-base'
  banner.innerHTML =
    '<p>' +
    text +
    '</p><button type="button" class="mt-3 text-[#D4AF37] underline text-sm" aria-label="Cerrar aviso">Cerrar</button>'
  banner.querySelector('button').addEventListener('click', () => banner.remove())
  document.body.appendChild(banner)

  if (window.history.replaceState) {
    const url = new URL(window.location.href)
    url.searchParams.delete('enviado')
    window.history.replaceState({}, '', url.pathname + url.search + url.hash)
  }
}

async function initCookieBannerOnce() {
  if (window.__cookieBannerLoaded) return
  window.__cookieBannerLoaded = true
  try {
    const { initCookieBanner } = await import('/js/modules/cookie-consent.js')
    initCookieBanner()
  } catch (_) {}
}

function run() {
  initContactPreferenceRadios()
  initExternalLinksNewTab()
  initFormSuccessBanner()
  initCookieBannerOnce()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', run)
} else {
  run()
}
