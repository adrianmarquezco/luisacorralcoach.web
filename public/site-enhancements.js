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

function initFaqAccessibility() {
  document.querySelectorAll('[data-landingsite-faq-item]').forEach((item, index) => {
    const btn = item.querySelector('[data-landingsite-faq-question]')
    const panel = item.querySelector('[data-landingsite-faq-answer]')
    if (!btn || !panel) return

    const qId = `faq-q-${index}`
    const aId = `faq-a-${index}`
    btn.setAttribute('id', qId)
    btn.setAttribute('aria-controls', aId)
    btn.setAttribute('aria-expanded', panel.classList.contains('hidden') ? 'false' : 'true')
    panel.setAttribute('id', aId)
    panel.setAttribute('role', 'region')
    panel.setAttribute('aria-labelledby', qId)

    if (!btn.dataset.faqBound) {
      btn.dataset.faqBound = '1'
      btn.addEventListener('click', () => {
        const open = !panel.classList.contains('hidden')
        btn.setAttribute('aria-expanded', open ? 'false' : 'true')
      })
    }
  })
}

function initDeveloperCredit() {
  const footer = document.getElementById('global-footer')
  if (!footer || footer.querySelector('[data-developer-credit]')) return

  const wrap = document.createElement('div')
  wrap.setAttribute('data-developer-credit', '')
  wrap.className = 'border-t border-[#9B7EBD]/20 mt-6 pt-4 text-center'
  wrap.innerHTML =
    '<p class="text-[#B8A4C9]/70 text-xs">' +
    'Desarrollado por ' +
    '<a href="https://adrianmarquez.es" class="text-[#B8A4C9] hover:text-[#D4AF37] transition-colors underline-offset-2 hover:underline" rel="noopener noreferrer">Adrián Márquez</a>' +
    '</p>'
  footer.querySelector('.max-w-7xl')?.appendChild(wrap)
}

function initSocialAriaLabels() {
  const labels = [
    ['instagram.com', 'Instagram de Luisa Corral'],
    ['tiktok.com', 'TikTok de Luisa Corral'],
    ['wa.me', 'Contactar por WhatsApp'],
  ]
  document.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href') || ''
    for (const [host, label] of labels) {
      if (href.includes(host) && !a.getAttribute('aria-label')) {
        a.setAttribute('aria-label', label)
        break
      }
    }
  })
}

function run() {
  initContactPreferenceRadios()
  initExternalLinksNewTab()
  initFormSuccessBanner()
  initCookieBannerOnce()
  initFaqAccessibility()
  initSocialAriaLabels()
  initDeveloperCredit()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', run)
} else {
  run()
}
