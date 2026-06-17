export function init() {
  document.querySelectorAll('.faq-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const body = btn.nextElementSibling
      const icon = btn.querySelector('.accordion-icon')
      const isOpen = !body.classList.contains('hidden')

      document.querySelectorAll('.faq-body').forEach(b => b.classList.add('hidden'))
      document.querySelectorAll('.accordion-icon').forEach(i => i.style.transform = '')

      if (!isOpen) {
        body.classList.remove('hidden')
        if (icon) icon.style.transform = 'rotate(180deg)'
      }
    })
  })
}
