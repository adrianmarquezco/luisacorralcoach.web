import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const BASE = 'https://www.luisacorralcoach.com'

const NO_CONTACT_SECTION = new Set([
  'reiki-delfin/index.html',
  'coaching-holistico/index.html',
])

const INLINE_BOOT_RE =
  /<script type="module">\s*const boot = async \(\) => \{[\s\S]*?initCookieBanner\(\)[\s\S]*?else boot\(\)\s*<\/script>\s*/g

const MANIFEST_PATH = path.join(ROOT, 'assets/image-manifest.json')
let imageManifest = null

function loadImageManifest() {
  if (imageManifest) return imageManifest
  imageManifest = fs.existsSync(MANIFEST_PATH)
    ? JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))
    : {}
  return imageManifest
}

function imageKey(src) {
  return src
    .replace(/-publicContain\.webp$/, '.webp')
    .replace(/-public\.webp$/, '.webp')
}

function fixImages(html) {
  const manifest = loadImageManifest()
  const preloadMatch = html.match(/<link rel="preload" as="image" href="([^"]+)"/)
  const preload = preloadMatch?.[1]
  const headerEnd = html.indexOf('</header>')

  return html.replace(/<img\s+([^>]*?)>/gi, (match, attrs) => {
    const srcMatch = attrs.match(/\bsrc="(\/assets\/[^"]+)"/)
    if (!srcMatch) return match
    const src = srcMatch[1]

    let a = attrs
      .replace(/\s(width|height|loading|decoding|fetchpriority)="[^"]*"/gi, '')
      .replace(/\s(width|height|loading|decoding|fetchpriority)='[^']*'/gi, '')

    const dims = manifest[src]
    if (dims?.w && dims?.h) a += ` width="${dims.w}" height="${dims.h}"`

    const idx = html.indexOf(match)
    const inHeader = headerEnd > 0 && idx > 0 && idx < headerEnd
    const isPreloadHero = preload && imageKey(src) === imageKey(preload)
    const isLarge =
      /h-\[(?:350|450|500|600)px\]/.test(a) || /h-64 md:h-96/.test(a) || /h-full object-cover/.test(a)
    const firstMainImg =
      headerEnd > 0 && idx > headerEnd && isLarge && !html.slice(headerEnd, idx).includes('<img ')

    if (inHeader) {
      a += ' decoding="async"'
      if (preload && imageKey(src) === imageKey(preload)) a += ' fetchpriority="high"'
    } else if (isPreloadHero || firstMainImg) {
      a += ' loading="eager" fetchpriority="high" decoding="async"'
    } else {
      a += ' loading="lazy" decoding="async"'
    }

    return `<img ${a.trim()}>`
  })
}

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'scripts', '.git'].includes(e.name)) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, files)
    else if (e.name.endsWith('.html')) files.push(p)
  }
  return files
}

function pageUrl(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/')
  if (rel === 'index.html') return `${BASE}/`
  if (rel === '404.html') return `${BASE}/404`
  return `${BASE}/${rel.replace(/\/index\.html$/, '')}`
}

function absPath(p) {
  if (!p || p.startsWith('http')) return p
  if (p.startsWith('/')) return BASE + p
  return p
}

function fixMetaAndSeo(html, url) {
  html = html.replace(/<link rel="alternate" hreflang="[^"]+" href="\/">\s*/g, '')

  html = html.replace(
    /<link rel="canonical" href="([^"]+)">/g,
    (_, href) => `<link rel="canonical" href="${absPath(href)}">`
  )
  if (!html.includes('rel="canonical"') && !html.includes("rel='canonical'")) {
    html = html.replace('</title>', `</title>\n<link rel="canonical" href="${url}">`)
  }

  html = html.replace(
    /<meta property="og:url" content="([^"]*)">/g,
    (_, c) => `<meta property="og:url" content="${absPath(c || url.replace(BASE, '') || '/')}">`
  )
  if (!html.includes('property="og:url"') && html.includes('property="og:title"')) {
    html = html.replace(
      /<meta property="og:type"[^>]*>/,
      (m) => `${m}\n<meta property="og:url" content="${url}">`
    )
  }

  html = html.replace(
    /<meta property="og:image" content="(\/[^"]+)">/g,
    (_, p) => `<meta property="og:image" content="${BASE}${p}">`
  )
  html = html.replace(
    /<meta name="twitter:image" content="(\/[^"]+)">/g,
    (_, p) => `<meta name="twitter:image" content="${BASE}${p}">`
  )

  return html
}

function fixJsonLd(html, url) {
  html = html.replace(/"url":\s*""/g, `"url": "${BASE}/sobre-mi"`)
  html = html.replace(/"image":\s*"(\/assets\/[^"]+)"/g, (_, p) => `"image": "${BASE}${p}"`)
  html = html.replace(/"@id":\s*"(\/[^"]+)"/g, (_, p) => `"@id": "${BASE}${p}"`)
  html = html.replace(/"item":\s*""/g, `"item": "${BASE}/"`)
  html = html.replace(/"item":\s*"(\/[^"]+)"/g, (_, p) => `"item": "${BASE}${p}"`)

  return html
}

function fixShareLinks(html, url) {
  const enc = encodeURIComponent(url)
  html = html.replace(
    /https:\/\/www\.facebook\.com\/sharer\/sharer\.php\?u=\/([^"'&]+)/g,
    `https://www.facebook.com/sharer/sharer.php?u=${enc}`
  )
  html = html.replace(
    /https:\/\/twitter\.com\/intent\/tweet\?url=\/([^"'&]+)/g,
    `https://twitter.com/intent/tweet?url=${enc}`
  )
  html = html.replace(
    /https:\/\/www\.linkedin\.com\/sharing\/share-offsite\/\?url=\/([^"'&]+)/g,
    `https://www.linkedin.com/sharing/share-offsite/?url=${enc}`
  )
  html = html.replace(
    /https:\/\/www\.linkedin\.com\/shareArticle\?mini=true&amp;url=\/([^"'&]+)/g,
    `https://www.linkedin.com/sharing/share-offsite/?url=${enc}`
  )
  html = html.replace(
    /https:\/\/wa\.me\/\?text=([^"'&]*?)(?:%20)?\/blog\/[a-z0-9-]+/gi,
    (_m, prefix) => `https://wa.me/?text=${prefix}%20${encodeURIComponent(url)}`
  )
  return html
}

function fixCssExternal(html) {
  return html
}

function fixCopySesionGratuita(html, rel) {
  const map = [
    [/primera sesión gratuita\\./gi, 'Sesión inicial de valoración.'],
    [/primera sesión gratuita/gi, 'sesión inicial de valoración'],
    [/Primera sesión gratuita/g, 'Sesión inicial de valoración'],
    [/Reserva tu sesión gratuita/g, 'Reserva tu sesión'],
    [/Solicitar sesión gratuita/g, 'Solicitar sesión'],
    [/Solicitar primera sesión gratuita/g, 'Solicitar sesión'],
  ]

  if (rel === 'coaching-holistico/index.html' || rel.startsWith('blog/')) {
    for (const [re, rep] of map) html = html.replace(re, rep)
    if (rel === 'coaching-holistico/index.html') {
      html = html.replace(/€\.\s*sesión inicial de valoración\./gi, '€. Sesión inicial de valoración.')
    }
  }
  return html
}

function fixSiteCssLiteralNewline(html) {
  return html.replace(
    /<link rel="stylesheet" href="\/public\/site\.css">\\n</g,
    '<link rel="stylesheet" href="/public/site.css">\n<'
  )
}

function fixBlogInternalLinks(html, rel, url) {
  if (!rel.startsWith('blog/') || rel === 'blog/index.html') return html
  if (html.includes('id="next-level-cta"')) return html

  const slug = rel.replace(/^blog\//, '').replace(/\/index\.html$/, '')
  const service =
    slug.includes('flores-de-bach')
      ? { href: '/flores-de-bach', label: 'Flores de Bach' }
      : slug.includes('reiki-delfin')
        ? { href: '/reiki-delfin', label: 'Reiki Delfín' }
        : slug.includes('coaching-angelical')
          ? { href: '/coaching-angelical', label: 'Coaching Angelical' }
          : { href: '/coaching-holistico', label: 'Coaching Holístico' }

  const relatedPool = [
    '/blog/que-es-coach-holistico',
    '/blog/en-que-me-puede-ayudar-un-coach-holistico',
    '/blog/coaching-holistico-beneficios-enfoque-integral',
    '/blog/que-son-las-flores-de-bach',
    '/blog/flores-de-bach-para-la-ansiedad',
    '/blog/tecnicas-mindfulness-reducir-estres',
    '/blog/encontrar-proposito-vida-40',
    '/blog/que-es-coaching-angelical',
    '/blog/reiki-delfin-sanacion-energia-delfines',
  ].filter((p) => !url.endsWith(p))

  const related = relatedPool[0]

  const block = `\n<section id="next-level-cta" class="code-section py-12 bg-gradient-to-br from-[#FAF7FC] to-[#F0EAF7]">\n  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">\n    <div class="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-[#E5D9F2]">\n      <h2 class="text-2xl md:text-3xl font-bold text-[#2D1B3D] mb-3">¿Quieres dar el siguiente paso?</h2>\n      <p class="text-[#6B5B7A] mb-6">Si este artículo te ha resonado, puedo ayudarte a aterrizarlo a tu caso y avanzar con un plan claro.</p>\n      <div class="blog-cta-actions flex flex-col items-center">\n        <div class="blog-cta-primary flex flex-wrap justify-center items-center gap-2">\n        <a href="${service.href}" class="blog-cta-btn inline-flex items-center justify-center bg-[#9B7EBD] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#7A5FA0] transition-colors">Ver ${service.label}</a>\n        <a href="/contacto" class="blog-cta-btn inline-flex items-center justify-center bg-[#D4AF37] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#B8962E] transition-colors">Contactar</a>\n        </div>\n        <a href="${related}" class="blog-cta-more mt-2 text-[#6B5B7A] font-semibold hover:text-[#9B7EBD] transition-colors">Leer otro artículo</a>\n      </div>\n    </div>\n  </div>\n</section>\n`

  return html.replace('<footer id="global-footer"', block + '<footer id="global-footer"')
}

function fixBrandMeta(html) {
  const services =
    'coaching holístico, Flores de Bach, meditaciones personalizadas, Reiki Delfín y coaching angelical'
  const replacements = [
    [/cartas astrales,?\s*/gi, ''],
    [/registros ak[aá]shicos,?\s*/gi, ''],
    [/astrolog[ií]a,?\s*/gi, ''],
    [/Limpieza Energética y\s*/gi, ''],
    [
      /Flores de Bach, Cartas Astrales, Limpieza Energética y Registros Akáshicos/gi,
      'Flores de Bach, coaching holístico, meditaciones y Reiki Delfín',
    ],
    [
      /coaching holístico, flores de Bach, cartas astrales y registros akáshicos/gi,
      `coaching holístico, Flores de Bach, meditaciones y Reiki Delfín`,
    ],
    [
      /Blog de bienestar holístico con artículos sobre coaching, Flores de Bach, registros akáshicos, astrología y crecimiento espiritual/gi,
      `Blog de bienestar holístico: artículos sobre ${services}`,
    ],
    [
      /artículos sobre coaching, Flores de Bach, registros akáshicos, astrología y crecimiento espiritual/gi,
      `artículos sobre ${services}`,
    ],
    [/registros ak[aá]shicos artículos,?\s*/gi, ''],
  ]
  for (const [re, rep] of replacements) html = html.replace(re, rep)
  return html
}

function fixBlogBody(html) {
  html = html.replace(/registros ak[aá]shicos/gi, 'herramientas holísticas complementarias')
  html = html.replace(/Registros Ak[aá]shicos/g, 'terapias energéticas complementarias')
  return html
}

function fixLegal(html, rel, url) {
  if (rel.startsWith('aviso-legal') || rel.startsWith('politica-de')) {
    html = html.replace(/<html lang="en">/, '<html lang="es">')
  }
  if (rel === 'politica-de-privacidad/index.html') {
    html = html.replace(
      /<meta name="robots" content="noindex, nofollow">/,
      '<meta name="robots" content="index, follow">'
    )
  }
  if (rel === 'politica-de-cookies/index.html' || rel === 'aviso-legal/index.html') {
    html = html.replace(
      /<meta name="robots" content="noindex, nofollow">/,
      '<meta name="robots" content="noindex, follow">'
    )
  }
  if (
    (rel.startsWith('aviso-legal') ||
      rel.startsWith('politica-de-privacidad') ||
      rel.startsWith('politica-de-cookies')) &&
    !html.includes('rel="canonical"')
  ) {
    html = html.replace(
      '</title>',
      `</title>\n<link rel="canonical" href="${url}">\n<meta property="og:url" content="${url}">`
    )
  }
  return html
}

function fixNewsletter(html) {
  if (!html.includes('Suscríbete al Newsletter')) return html
  const old = `<form class="max-w-md mx-auto flex flex-col sm:flex-row gap-4" action="https://formspree.io/f/mvzyroqk" method="POST"><input type="hidden" name="_subject" value="Nueva solicitud — Luisa Corral Coach">
      <input type="email" name="email" placeholder="Tu correo electrónico" class="flex-1 px-6 py-4 rounded-full text-[#2D1B3D] focus:outline-none focus:ring-4 focus:ring-white/30" required="">
      <input type="hidden" name="subject" value="Nueva suscripción al newsletter">
      <label class="flex items-center gap-2 cursor-pointer text-white text-sm">
        <input type="checkbox" name="politica_proteccion_datos" value="aceptado" required="" class="w-4 h-4 rounded">
        <span>Acepto la política de privacidad</span>
      </label>
      <button type="submit" class="bg-[#D4AF37] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#B8962E] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
        Suscribirse
      </button>
    <input type="hidden" name="_next" value="/blog?enviado=1"></form>`

  const neu = `<form class="max-w-md mx-auto flex flex-col gap-4 text-left" action="https://formspree.io/f/mvzyroqk" method="POST">
      <input type="hidden" name="_subject" value="Newsletter — Luisa Corral Coach">
      <input type="email" name="email" placeholder="Tu correo electrónico" class="w-full px-6 py-4 rounded-full text-[#2D1B3D] focus:outline-none focus:ring-4 focus:ring-white/30" required="">
      <label class="flex items-start gap-2 cursor-pointer text-white text-sm">
        <input type="checkbox" name="politica_proteccion_datos" value="aceptado" required="" class="mt-1 w-4 h-4 rounded">
        <span>Acepto la <a href="/politica-de-privacidad" class="underline hover:text-[#D4AF37]">política de privacidad</a></span>
      </label>
      <button type="submit" class="w-full sm:w-auto self-center bg-[#D4AF37] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#B8962E] transition-all duration-300 shadow-lg">
        Suscribirse
      </button>
      <input type="hidden" name="_next" value="/blog?enviado=newsletter">
    </form>`
  return html.includes(old) ? html.replace(old, neu) : html
}

function processFile(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/')
  const url = pageUrl(filePath)
  let html = fs.readFileSync(filePath, 'utf8')

  if (NO_CONTACT_SECTION.has(rel)) {
    html = html.replace(/href="#contacto"/g, 'href="/contacto"')
  }

  if (rel === 'flores-de-bach/index.html') {
    html = html.replace(
      /valoramos tu situación emocional y seleccionamos las esencias tepat\s+untuk ti\./,
      'valoramos tu situación emocional y seleccionamos las esencias más adecuadas para ti.'
    )
  }

  html = html.replace(INLINE_BOOT_RE, '')
  html = html.replace(/\s*oncontextmenu="return false;"/g, '')
  html = html.replace(
    /<button class="text-\[#2D1B3D\] hover:text-\[#9B7EBD\] font-semibold transition-colors duration-300 flex items-center gap-1 py-2">\s*\n\s*Servicios/g,
    '<button type="button" aria-haspopup="true" aria-expanded="false" class="text-[#2D1B3D] hover:text-[#9B7EBD] font-semibold transition-colors duration-300 flex items-center gap-1 py-2">\n            Servicios'
  )
  html = html.replace(
    /<button class="lg:hidden p-2 text-\[#2D1B3D\]" data-landingsite-mobile-menu-toggle="">/g,
    '<button type="button" class="lg:hidden p-2 text-[#2D1B3D]" data-landingsite-mobile-menu-toggle="" aria-label="Abrir menú de navegación" aria-expanded="false">'
  )
  let authorCount = 0
  html = html.replace(/\n<meta name="author" content="Luisa Corral">/g, (m) =>
    ++authorCount > 1 ? '' : m
  )

  html = fixSiteCssLiteralNewline(html)

  if (rel === 'index.html') {
    html = html.replace(
      '<input type="hidden" name="_next" value="/contacto?enviado=1">',
      '<input type="hidden" name="_next" value="/?enviado=1">'
    )
  }

  html = fixMetaAndSeo(html, url)
  html = fixJsonLd(html, url)
  html = fixShareLinks(html, url)
  html = fixBrandMeta(html)
  html = fixCssExternal(html)
  html = fixCopySesionGratuita(html, rel)
  if (rel.startsWith('blog/')) html = fixBlogBody(html)
  html = fixBlogInternalLinks(html, rel, url)
  html = fixLegal(html, rel, url)
  html = fixNewsletter(html)
  html = fixImages(html)

  html = html.replace(
    /target="_blank"(?![^>]*rel=)/g,
    'target="_blank" rel="noopener noreferrer"'
  )

  fs.writeFileSync(filePath, html)
  return rel
}

const files = walk(ROOT)
for (const f of files) {
  console.log('✓', processFile(f))
}
console.log(`\nProcesados ${files.length} HTML`)
