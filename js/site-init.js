import { initCookieBanner } from '/js/modules/cookie-consent.js'

initCookieBanner()

function initContactPreferenceRadios() {
  const radios = Array.from(
    document.querySelectorAll('input[type="radio"][name="contact_preference"]')
  )
  if (!radios.length) return

  const selectedClasses = ['border-[#9B7EBD]', 'bg-[#E8D7F1]']

  const sync = () => {
    for (const r of radios) {
      const label = r.closest('label')
      if (!label) continue
      if (r.checked) label.classList.add(...selectedClasses)
      else label.classList.remove(...selectedClasses)
    }
  }

  for (const r of radios) r.addEventListener('change', sync)
  sync()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactPreferenceRadios, {
    once: true,
  })
} else {
  initContactPreferenceRadios()
}
