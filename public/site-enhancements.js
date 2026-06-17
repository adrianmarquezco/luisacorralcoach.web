;(function loadLayoutFixes() {
  if (document.querySelector('link[data-layout-fixes]')) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = '/public/layout-fixes.css'
  link.setAttribute('data-layout-fixes', '1')
  ;(document.head || document.documentElement).appendChild(link)
})()

const SERVICE_BREADCRUMBS = {
  'flores-de-bach': 'Flores de Bach',
  'coaching-holistico': 'Coaching holístico',
  'meditaciones-personalizadas': 'Meditaciones personalizadas',
  'coaching-angelical': 'Coaching angelical',
  'reiki-delfin': 'Reiki Delfín',
}

function createBreadcrumbEl(items, light) {
  const nav = document.createElement('nav')
  nav.className = light ? 'site-breadcrumb site-breadcrumb--light mb-6' : 'site-breadcrumb mb-8'
  nav.setAttribute('aria-label', 'Breadcrumb')

  const ol = document.createElement('ol')
  items.forEach((item, i) => {
    if (i > 0) {
      const sep = document.createElement('li')
      sep.setAttribute('aria-hidden', 'true')
      sep.textContent = '/'
      ol.appendChild(sep)
    }
    const li = document.createElement('li')
    if (item.href) {
      const a = document.createElement('a')
      a.href = item.href
      a.textContent = item.label
      li.appendChild(a)
    } else {
      li.setAttribute('aria-current', 'page')
      li.textContent = item.label
    }
    ol.appendChild(li)
  })
  nav.appendChild(ol)
  return nav
}

function initBreadcrumbs() {
  if (document.querySelector('[aria-label="Breadcrumb"]')) return

  const path = window.location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '') || ''
  if (!path || path === '/') return

  const segments = path.split('/').filter(Boolean)
  let items = null
  let light = false

  if (segments[0] === 'blog' && segments.length === 2) {
    const title =
      document.querySelector('section h1')?.textContent?.trim() ||
      document.title.split('|')[0]?.trim() ||
      'Artículo'
    items = [
      { href: '/', label: 'Inicio' },
      { href: '/blog', label: 'Blog' },
      { label: title },
    ]
    const first = document.getElementById('global-header')?.nextElementSibling
    light = Boolean(
      first &&
        (first.className.includes('from-[#9B7EBD]') ||
          first.className.includes('to-[#7A5FA0]'))
    )
  } else if (path === '/blog') {
    items = [{ href: '/', label: 'Inicio' }, { label: 'Blog' }]
  } else if (path === '/testimonios') {
    items = [{ href: '/', label: 'Inicio' }, { label: 'Testimonios' }]
  } else if (path === '/enfoques') {
    return
  } else if (segments[0] === 'enfoques' && segments.length === 2) {
    return
  } else if (segments.length === 1 && SERVICE_BREADCRUMBS[segments[0]]) {
    items = [
      { href: '/', label: 'Inicio' },
      { label: SERVICE_BREADCRUMBS[segments[0]] },
    ]
  }

  if (!items) return

  const header = document.getElementById('global-header')
  const firstSection = header?.nextElementSibling
  if (!firstSection) return

  const nav = createBreadcrumbEl(items, light)
  const container =
    firstSection.querySelector(
      ':scope > .max-w-7xl, :scope > .max-w-4xl, :scope > .max-w-3xl, :scope > .max-w-2xl'
    ) || firstSection
  container.insertBefore(nav, container.firstChild)
}

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

    if (!btn.getAttribute('type')) btn.setAttribute('type', 'button')

    const qId = `faq-q-${index}`
    const aId = `faq-a-${index}`
    btn.setAttribute('id', qId)
    btn.setAttribute('aria-controls', aId)
    btn.setAttribute('aria-expanded', panel.classList.contains('hidden') ? 'false' : 'true')
    panel.setAttribute('id', aId)
    panel.setAttribute('role', 'region')
    panel.setAttribute('aria-labelledby', qId)

    if (item.closest('[data-landingsite-faq]') || btn.dataset.faqBound) return

    btn.dataset.faqBound = '1'
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      const opening = panel.classList.contains('hidden')
      panel.classList.toggle('hidden', !opening)
      panel.style.display = opening ? 'block' : 'none'
      btn.setAttribute('aria-expanded', opening ? 'true' : 'false')
      item.classList.toggle('is-open', opening)
      btn.querySelector('i.fa-chevron-down')?.classList.toggle('rotate-180', opening)
    })
  })
}

const ENFOQUES_MENU_LINKS = [
  { href: '/enfoques', label: 'Todos los enfoques', icon: 'fa-compass' },
  { href: '/enfoques/gestion-estres-emociones', label: 'Estrés y emociones', icon: 'fa-heart' },
  { href: '/enfoques/encontrar-proposito', label: 'Propósito vital', icon: 'fa-compass' },
  { href: '/enfoques/equilibrio-vital', label: 'Equilibrio vital', icon: 'fa-spa' },
  { href: '/enfoques/autoconocimiento-mindfulness', label: 'Mindfulness', icon: 'fa-leaf' },
  {
    href: '/enfoques/desbloqueo-energetico-emocional',
    label: 'Desbloqueo energético',
    icon: 'fa-water',
  },
]

function initEnfoquesNav() {
  const header = document.getElementById('global-header')
  if (!header || header.querySelector('[data-enfoques-nav]')) return

  const desktopNav = header.querySelector('nav.hidden.lg\\:flex')
  const testimoniosDesktop = desktopNav?.querySelector('a[href="/testimonios"]')
  if (desktopNav && testimoniosDesktop) {
    desktopNav.querySelectorAll(':scope > a[href="/enfoques"]').forEach((el) => el.remove())

    const dropdown = document.createElement('div')
    dropdown.className = 'relative group'
    dropdown.setAttribute('data-enfoques-nav', '')
    const links = ENFOQUES_MENU_LINKS.map((item, i) => {
      const round =
        i === 0
          ? ' rounded-t-xl'
          : i === ENFOQUES_MENU_LINKS.length - 1
            ? ' rounded-b-xl'
            : ''
      return (
        `<a href="${item.href}" class="flex items-center gap-3 px-4 py-3 text-[#2D1B3D] hover:bg-[#FAF7FC] hover:text-[#9B7EBD] transition-colors${round}">` +
        `<i class="fa-solid ${item.icon} text-[#9B7EBD]"></i> ${item.label}</a>`
      )
    }).join('')
    dropdown.innerHTML =
      '<button type="button" aria-haspopup="true" aria-expanded="false" class="text-[#2D1B3D] hover:text-[#9B7EBD] font-semibold transition-colors duration-300 flex items-center gap-1 py-2">' +
      'Enfoques <i class="fa-solid fa-chevron-down text-xs"></i></button>' +
      '<div class="enfoques-nav-dropdown absolute left-0 mt-0 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 -translate-y-2 z-50 border border-[#E5D9F2]">' +
      links +
      '</div>'
    desktopNav.insertBefore(dropdown, testimoniosDesktop)
  }

  const mobileMenu = header.querySelector('[data-landingsite-mobile-menu]')
  const testimoniosMobile = mobileMenu?.querySelector('a[href="/testimonios"]')
  if (mobileMenu && testimoniosMobile && !mobileMenu.querySelector('[data-enfoques-mobile]')) {
    mobileMenu.querySelectorAll(':scope > a[href="/enfoques"]').forEach((el) => el.remove())

    const block = document.createElement('div')
    block.setAttribute('data-enfoques-mobile', '')
    block.className = 'space-y-2'
    const sublinks = ENFOQUES_MENU_LINKS.map(
      (item) =>
        `<a href="${item.href}" class="flex items-center gap-2 text-[#6B5B7A] hover:text-[#9B7EBD] py-1">` +
        `<i class="fa-solid ${item.icon} text-sm"></i> ${item.label}</a>`
    ).join('')
    block.innerHTML =
      '<span class="block text-[#2D1B3D] font-semibold py-2">' +
      '<i class="fa-solid fa-compass mr-2 text-[#9B7EBD]"></i>Enfoques</span>' +
      `<div class="pl-4 border-l-2 border-[#E5D9F2] ml-2 space-y-2">${sublinks}</div>`
    mobileMenu.insertBefore(block, testimoniosMobile)
  }
}

function initEnfoquesFooter() {
  const footer = document.getElementById('global-footer')
  if (!footer) return

  const navUl = Array.from(footer.querySelectorAll('ul')).find((ul) =>
    ul.querySelector('a[href="/sobre-mi"]')
  )
  if (navUl && !navUl.querySelector('a[href="/enfoques"]')) {
    const li = document.createElement('li')
    li.innerHTML =
      '<a href="/enfoques" class="text-[#B8A4C9] hover:text-white transition-colors">Enfoques</a>'
    const sobreMiLi = navUl.querySelector('a[href="/sobre-mi"]')?.closest('li')
    if (sobreMiLi?.nextElementSibling) navUl.insertBefore(li, sobreMiLi.nextElementSibling)
    else navUl.appendChild(li)
  }

  if (footer.querySelector('[data-enfoques-footer]')) return

  const columns = Array.from(
    footer.querySelectorAll('.max-w-7xl > .grid > div, .max-w-7xl > div > .grid > div')
  )
  const servicesCol = columns.find((d) => {
    const title = d.querySelector('p.text-lg, p.font-semibold')
    return title && title.textContent.trim() === 'Servicios'
  })
  const contactCol = columns.find((d) => {
    const title = d.querySelector('p.text-lg, p.font-semibold')
    return title && title.textContent.trim() === 'Contacto'
  })
  if (!servicesCol?.parentElement) return

  const col = document.createElement('div')
  col.setAttribute('data-enfoques-footer', '')
  col.innerHTML =
    '<p class="text-lg font-semibold mb-4 text-[#D4AF37]">Enfoques</p>' +
    '<ul class="space-y-3">' +
    '<li><a href="/enfoques" class="text-[#B8A4C9] hover:text-white transition-colors">Todos los enfoques</a></li>' +
    '<li><a href="/enfoques/gestion-estres-emociones" class="text-[#B8A4C9] hover:text-white transition-colors">Estrés y emociones</a></li>' +
    '<li><a href="/enfoques/encontrar-proposito" class="text-[#B8A4C9] hover:text-white transition-colors">Propósito vital</a></li>' +
    '<li><a href="/enfoques/equilibrio-vital" class="text-[#B8A4C9] hover:text-white transition-colors">Equilibrio vital</a></li>' +
    '<li><a href="/enfoques/autoconocimiento-mindfulness" class="text-[#B8A4C9] hover:text-white transition-colors">Mindfulness</a></li>' +
    '<li><a href="/enfoques/desbloqueo-energetico-emocional" class="text-[#B8A4C9] hover:text-white transition-colors">Desbloqueo energético</a></li>' +
    '</ul>'

  const grid = servicesCol.parentElement
  if (contactCol) grid.insertBefore(col, contactCol)
  else grid.appendChild(col)

  grid.classList.add('footer-with-enfoques')
}

function initHeaderLogo() {
  const header = document.getElementById('global-header')
  if (!header) return

  const mq = window.matchMedia('(min-width: 768px)')
  const apply = () => {
    const desktop = mq.matches
    const logoHeight = desktop ? '5.5rem' : '3.5rem'
    const container = header.querySelector(':scope > .max-w-7xl')
    const row = container?.querySelector(':scope > .flex.justify-between.items-center')

    if (container) {
      container.style.paddingTop = desktop ? '1rem' : '0.75rem'
      container.style.paddingBottom = desktop ? '0.5rem' : '0.25rem'
    }
    if (row) {
      row.style.minHeight = desktop ? '7.5rem' : '5rem'
      row.style.alignItems = 'center'
    }

    header.querySelectorAll('img[data-logo]').forEach((img) => {
      img.style.height = logoHeight
      img.style.width = 'auto'
      img.style.maxWidth = 'none'
      img.style.objectFit = 'contain'
    })
  }

  apply()
  mq.addEventListener('change', apply)
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

function fixWhatsAppZIndex() {
  // The WA button lives inside <header z-50> which creates a stacking context,
  // capping its effective z-index below the cookie banner (z-99999).
  // Moving it to <body> makes it a root-level stacking context participant.
  const btn = document.querySelector('#global-header a[href*="wa.me"][style*="2147483647"]')
  if (btn) document.body.appendChild(btn)
}

function run() {
  initBreadcrumbs()
  initHeaderLogo()
  initEnfoquesNav()
  initEnfoquesFooter()
  initContactPreferenceRadios()
  initExternalLinksNewTab()
  initFormSuccessBanner()
  initCookieBannerOnce()
  initFaqAccessibility()
  initSocialAriaLabels()
  initDeveloperCredit()
  fixWhatsAppZIndex()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', run)
} else {
  run()
}
