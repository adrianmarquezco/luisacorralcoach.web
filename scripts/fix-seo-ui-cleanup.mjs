import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(
  'C:/Users/USUARIO/Documents/Proyectos/Adrián Márquez/Web Adrián Márquez/luisacorralcoach-web'
)

const DIRECT_ANSWER_KEEP = new Set()

const LOCAL_LINE_RE =
  /\s*<p class="text-sm text-\[#6B5B7A\] max-w-3xl mx-auto mt-4">Sesiones presenciales en Narón \(comarca de Ferrolterra, A Coruña\) y online para España y Latinoamérica\.<\/p>/g

const MADRID_BLOCK_RE =
  /\s*<p class="text-lg text-\[#6B5B7A\] max-w-3xl mx-auto">\s*Luisa Corral ofrece este servicio online para toda España[\s\S]*?Latinoamérica\.\s*<\/p>/g

function walk(d, o = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (['node_modules', '.git'].includes(e.name)) continue
    const p = path.join(d, e.name)
    if (e.isDirectory()) walk(p, o)
    else if (p.endsWith('.html')) o.push(p)
  }
  return o
}

function removeDirectAnswer(html, rel) {
  if (DIRECT_ANSWER_KEEP.has(rel)) return html
  let h = html
  h = h.replace(
    /<section class="py-6 bg-white code-section"><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"><div class="seo-direct-answer[\s\S]*?<\/div><\/div><\/section>\s*/g,
    ''
  )
  h = h.replace(/\s*<div class="seo-direct-answer[\s\S]*?<\/div>\s*/g, '\n')
  return h
}

function removeLocalLines(html) {
  return html.replace(LOCAL_LINE_RE, '')
}

function removeMadridBlock(html) {
  return html.replace(MADRID_BLOCK_RE, '')
}

function faqItemHtml(question, answerHtml) {
  const answer = answerHtml.trim().startsWith('<')
    ? answerHtml.trim()
    : `<p class="text-[#6B5B7A]">${answerHtml.trim()}</p>`
  return `<div class="border border-[#E5D9F2] rounded-2xl overflow-hidden" data-landingsite-faq-item="">
        <button type="button" class="w-full flex items-center justify-between p-6 text-left bg-[#FAF7FC] hover:bg-[#F0EAF7] transition-colors" data-landingsite-faq-question="">
          <span class="font-semibold text-[#2D1B3D]">${question.trim()}</span>
          <i class="fa-solid fa-chevron-down text-[#9B7EBD] transition-transform"></i>
        </button>
        <div class="p-6 bg-white hidden" data-landingsite-faq-answer="">
          ${answer}
        </div>
      </div>`
}

function fixBlogPurpleBreadcrumbs(html, rel) {
  if (!rel.startsWith('blog/') || rel === 'blog/index.html') return html
  return html
    .replace(
      /(<section class="py-20 bg-gradient-to-br from-\[#9B7EBD\][\s\S]*?<nav class=")site-breadcrumb mb-8(" aria-label="Breadcrumb">\s*<ol class=")[^"]*(")/,
      '$1site-breadcrumb site-breadcrumb--light mb-8$2flex items-center gap-2 text-sm text-white/80 flex-wrap$3'
    )
    .replace(
      /<ol class="text-white\/80">/g,
      '<ol class="flex items-center gap-2 text-sm text-white/80 flex-wrap">'
    )
    .replace(
      /(<nav class="site-breadcrumb site-breadcrumb--light[\s\S]*?<\/nav>)/g,
      (nav) =>
        nav
          .replace(/hover:text-\[#9B7EBD\]/g, 'hover:text-white')
          .replace(/text-\[#9B7EBD\] font-medium/g, 'text-white font-medium')
    )
}

function fixBlogCta(html, rel) {
  if (!rel.startsWith('blog/') || !html.includes('id="next-level-cta"')) return html
  return html.replace(
    /<section id="next-level-cta" class="code-section py-16 bg-gradient-to-br from-\[#FAF7FC\] to-\[#F0EAF7\]">\s*<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">\s*<div class="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-\[#E5D9F2\]">([\s\S]*?)<div class="flex flex-col sm:flex-row gap-3">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/,
    `<section id="next-level-cta" class="code-section py-12 bg-gradient-to-br from-[#FAF7FC] to-[#F0EAF7]">
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div class="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-[#E5D9F2]">$1<div class="flex flex-wrap gap-3 justify-center items-center">$2</div>
    </div>
  </div>
</section>`
  )
}

function fixBrokenFaqs(html) {
  let h = html
  h = h.replace(
    /<div class="bg-white rounded-2xl p-6 shadow-(?:md|sm)" data-landingsite-faq-item="">\s*<h3[^>]*data-landingsite-faq-question[^>]*>\s*<i[^>]*><\/i>\s*([\s\S]*?)\s*<\/h3>\s*<p class="text-\[#6B5B7A\][^"]*hidden" data-landingsite-faq-answer="">\s*([\s\S]*?)\s*<\/p>\s*<\/div>/g,
    (_, q, a) => faqItemHtml(q, a)
  )
  h = h.replace(
    /<div class="bg-white rounded-2xl p-6 shadow-(?:md|sm)" data-landingsite-faq-item="">\s*<h3[^>]*data-landingsite-faq-question[^>]*>\s*<i[^>]*><\/i>\s*([\s\S]*?)\s*<\/h3>\s*<div class="text-\[#6B5B7A\][^"]*hidden" data-landingsite-faq-answer="">\s*([\s\S]*?)\s*<\/div>\s*<\/div>/g,
    (_, q, a) => faqItemHtml(q, a)
  )
  return h
}

let changed = 0
for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/')
  let html = fs.readFileSync(file, 'utf8')
  const orig = html

  html = removeDirectAnswer(html, rel)
  html = removeLocalLines(html)
  html = removeMadridBlock(html)
  html = fixBlogPurpleBreadcrumbs(html, rel)
  html = fixBlogCta(html, rel)
  html = fixBrokenFaqs(html)

  if (html !== orig) {
    fs.writeFileSync(file, html)
    changed++
    console.log('Fixed', rel)
  }
}

console.log(`Done: ${changed} files`)
