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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initContactPreferenceRadios()
    initExternalLinksNewTab()
  })
} else {
  initContactPreferenceRadios()
  initExternalLinksNewTab()
}
