import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(
  'C:/Users/USUARIO/Documents/Proyectos/Adrián Márquez/Web Adrián Márquez/luisacorralcoach-web'
)

const COACHING_ENFOQUES_SECTION = `<section class="code-section py-16 bg-[#FAF7FC]">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl font-bold text-[#2D1B3D] mb-4 text-center">Enfoques que trabajamos en <span class="text-[#9B7EBD]">sesión</span></h2>
    <p class="text-center text-[#6B5B7A] mb-10 max-w-2xl mx-auto">El coaching holístico se adapta a lo que buscas hoy. Explora cada enfoque o reserva directamente tu sesión.</p>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 coaching-enfoques-grid">
      <a href="/enfoques/gestion-estres-emociones" class="p-6 bg-white rounded-2xl border border-[#E5D9F2] hover:shadow-lg transition-all hover:border-[#9B7EBD]">
        <p class="font-bold text-[#2D1B3D] mb-2">Estrés y emociones</p>
        <p class="text-sm text-[#6B5B7A]">Gestión de ansiedad, burnout y miedos.</p>
      </a>
      <a href="/enfoques/encontrar-proposito" class="p-6 bg-white rounded-2xl border border-[#E5D9F2] hover:shadow-lg transition-all hover:border-[#9B7EBD]">
        <p class="font-bold text-[#2D1B3D] mb-2">Propósito vital</p>
        <p class="text-sm text-[#6B5B7A]">Valores, dirección y autenticidad.</p>
      </a>
      <a href="/enfoques/equilibrio-vital" class="p-6 bg-white rounded-2xl border border-[#E5D9F2] hover:shadow-lg transition-all hover:border-[#9B7EBD]">
        <p class="font-bold text-[#2D1B3D] mb-2">Equilibrio vital</p>
        <p class="text-sm text-[#6B5B7A]">Hábitos, descanso y energía.</p>
      </a>
      <a href="/enfoques/autoconocimiento-mindfulness" class="p-6 bg-white rounded-2xl border border-[#E5D9F2] hover:shadow-lg transition-all hover:border-[#9B7EBD]">
        <p class="font-bold text-[#2D1B3D] mb-2">Mindfulness</p>
        <p class="text-sm text-[#6B5B7A]">Presencia, respiración y calma mental.</p>
      </a>
      <a href="/enfoques/desbloqueo-energetico-emocional" class="p-6 bg-white rounded-2xl border border-[#E5D9F2] hover:shadow-lg transition-all hover:border-[#9B7EBD]">
        <p class="font-bold text-[#2D1B3D] mb-2">Desbloqueo energético</p>
        <p class="text-sm text-[#6B5B7A]">Liberación emocional y energética.</p>
      </a>
      <a href="/enfoques" class="p-6 bg-[#9B7EBD] rounded-2xl flex flex-col justify-center items-center text-center hover:bg-[#7A5FA0] transition-colors min-h-[7.5rem]">
        <p class="font-bold text-white mb-1">Todos los enfoques</p>
        <p class="text-sm text-white/90 mb-2">Ansiedad, propósito, mindfulness…</p>
        <i class="fa-solid fa-arrow-right text-white"></i>
      </a>
    </div>
  </div>
</section>`

function walk(d, o = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (['node_modules', '.git'].includes(e.name)) continue
    const p = path.join(d, e.name)
    if (e.isDirectory()) walk(p, o)
    else if (p.endsWith('.html')) o.push(p)
  }
  return o
}

function faqItemHtml(question, answerHtml) {
  const answer = answerHtml.trim()
  const inner = answer.startsWith('<')
    ? answer
    : `<p class="text-[#6B5B7A]">${answer}</p>`
  return `<div class="border border-[#E5D9F2] rounded-2xl overflow-hidden" data-landingsite-faq-item="">
        <button type="button" class="w-full flex items-center justify-between gap-4 p-6 text-left bg-[#FAF7FC] hover:bg-[#F0EAF7] transition-colors" data-landingsite-faq-question="">
          <span class="font-semibold text-[#2D1B3D] text-left flex-1 pr-2">${question.trim()}</span>
          <i class="fa-solid fa-chevron-down text-[#9B7EBD] flex-shrink-0 transition-transform"></i>
        </button>
        <div class="p-6 bg-white hidden" data-landingsite-faq-answer="">
          ${inner}
        </div>
      </div>`
}

function fixH3Faqs(html) {
  let h = html
  h = h.replace(
    /<div class="bg-white rounded-2xl p-6 shadow-(?:md|sm)" data-landingsite-faq-item="">\s*<h3[^>]*data-landingsite-faq-question[^>]*>\s*<i[^>]*><\/i>\s*([\s\S]*?)\s*<\/h3>\s*<p class="text-\[#6B5B7A\][^"]*hidden" data-landingsite-faq-answer="">\s*([\s\S]*?)\s*<\/p>\s*<\/div>/g,
    (_, q, a) => faqItemHtml(q, a)
  )
  h = h.replace(
    /<div class="bg-\[#FAF7FC\] rounded-2xl p-6(?: shadow-sm)?" data-landingsite-faq-item="">\s*<h3[^>]*data-landingsite-faq-question[^>]*>\s*<i[^>]*><\/i>\s*([\s\S]*?)\s*<\/h3>\s*<div class="text-\[#6B5B7A\][^"]*hidden" data-landingsite-faq-answer="">\s*([\s\S]*?)\s*<\/div>\s*<\/div>/g,
    (_, q, a) => faqItemHtml(q, a)
  )
  h = h.replace(
    /<div class="bg-white rounded-2xl p-6 shadow-(?:md|sm)" data-landingsite-faq-item="">\s*<h3[^>]*data-landingsite-faq-question[^>]*>\s*<i[^>]*><\/i>\s*([\s\S]*?)\s*<\/h3>\s*<div class="text-\[#6B5B7A\][^"]*hidden" data-landingsite-faq-answer="">\s*([\s\S]*?)\s*<\/div>\s*<\/div>/g,
    (_, q, a) => faqItemHtml(q, a)
  )
  h = h.replace(/data-landingsite-faq="">\s*<div class="space-y-6"/g, 'data-landingsite-faq="">\n    <div class="space-y-4"')
  return h
}

function fixBlogCta(html) {
  return html.replace(
    /<div class="flex flex-wrap gap-3 justify-center items-center">/g,
    '<div class="blog-cta-actions">'
  )
}

const faqSectionRe =
  /<section[^>]*id="faq-[^"]*"[^>]*>[\s\S]*?<\/section>/g
const otrosSectionRe =
  /<section class="py-16 bg-white code-section"[^>]*>[\s\S]*?Otros servicios que te pueden[\s\S]*?<\/section>/g

function dedupeFaqSections(html) {
  const matches = [...html.matchAll(faqSectionRe)]
  if (matches.length <= 1) return html
  let h = html
  const keep = matches[matches.length - 1][0]
  for (const m of matches) {
    if (m[0] !== keep) h = h.replace(m[0], '')
  }
  return h
}

function dedupeOtrosServicios(html) {
  const matches = [...html.matchAll(otrosSectionRe)]
  if (matches.length <= 1) return html
  let h = html
  for (let i = 1; i < matches.length; i++) {
    h = h.replace(matches[i][0], '')
  }
  return h
}

function reorderFaqBeforeOtherServices(html) {
  let h = dedupeFaqSections(dedupeOtrosServicios(html))

  const faqMatches = [...h.matchAll(faqSectionRe)]
  const otrosMatches = [...h.matchAll(otrosSectionRe)]
  if (faqMatches.length !== 1 || otrosMatches.length !== 1) return h

  const faqMatch = faqMatches[0][0]
  const otrosMatch = otrosMatches[0][0]
  const otrosIdx = h.indexOf(otrosMatch)
  const faqIdx = h.indexOf(faqMatch)
  if (faqIdx < otrosIdx) return h

  return (
    h.slice(0, otrosIdx) +
    faqMatch +
    otrosMatch +
    h.slice(otrosIdx + otrosMatch.length, faqIdx) +
    h.slice(faqIdx + faqMatch.length)
  )
}

function fixCoachingEnfoques(html, rel) {
  if (rel !== 'coaching-holistico/index.html') return html
  return html.replace(
    /<section class="code-section py-16 bg-\[#FAF7FC\]">\s*<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">\s*<h2 class="text-3xl font-bold text-\[#2D1B3D\] mb-4 text-center">Enfoques que trabajamos en[\s\S]*?<\/section>/,
    COACHING_ENFOQUES_SECTION
  )
}

let changed = 0
for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/')
  let html = fs.readFileSync(file, 'utf8')
  const orig = html

  html = fixH3Faqs(html)
  if (rel.startsWith('blog/')) html = fixBlogCta(html)
  if (
    rel === 'coaching-angelical/index.html' ||
    rel === 'reiki-delfin/index.html'
  ) {
    html = reorderFaqBeforeOtherServices(html)
  }
  html = fixCoachingEnfoques(html, rel)

  if (html !== orig) {
    fs.writeFileSync(file, html)
    changed++
    console.log('Fixed', rel)
  }
}

console.log(`Done: ${changed} files`)
