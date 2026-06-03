import fs from 'fs'
import path from 'path'
import {
  BASE,
  BUSINESS_ID,
  ORG_PUBLISHER,
  PAGE_META,
  LOCAL_LINE,
  directAnswerBlock,
  breadcrumbNav,
} from './seo-shared.mjs'

const ROOT = path.resolve(
  'C:/Users/USUARIO/Documents/Proyectos/Adrián Márquez/Web Adrián Márquez/luisacorralcoach-web'
)

const GENERIC_AI =
  /Luisa Corral es coach holística certificada con más de 8 años de experiencia\. Ofrece sesiones de Flores de Bach/

const SERVICE_PAGES = new Set([
  'coaching-holistico/index.html',
  'flores-de-bach/index.html',
  'meditaciones-personalizadas/index.html',
  'coaching-angelical/index.html',
  'reiki-delfin/index.html',
])

function walk(d, o = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (['node_modules', '.git'].includes(e.name)) continue
    const p = path.join(d, e.name)
    if (e.isDirectory()) walk(p, o)
    else if (p.endsWith('.html')) o.push(p)
  }
  return o
}

function setMeta(html, name, content) {
  const re = new RegExp(`<meta name="${name}" content="[^"]*">`)
  if (re.test(html)) {
    return html.replace(
      re,
      `<meta name="${name}" content="${content.replace(/"/g, '&quot;')}">`
    )
  }
  return html
}

function setTitle(html, title) {
  return html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
}

function setDescription(html, desc) {
  return html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${desc.replace(/"/g, '&quot;')}">`
  )
}

function insertBlogDirectAnswer(html, text) {
  if (html.includes('seo-direct-answer')) return html
  const block = directAnswerBlock(text)
  const section = `<section class="py-6 bg-white code-section"><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">${block}</div></section>\n`
  if (html.includes('text-xl text-white/90')) {
    return html.replace(
      /(<\/section>\s*<section class="py-\d+ bg-white code-section)/,
      `</section>\n${section}$1`
    )
  }
  return html
}

function insertListingBreadcrumb(html, items) {
  if (html.includes('site-breadcrumb')) return html
  const nav = breadcrumbNav(items)
  return html.replace(
    /(<div class="text-center mb-12">)/,
    `${nav}\n    $1`
  )
}

function insertDirectAnswerAfterHero(html, text) {
  if (html.includes('seo-direct-answer')) return html
  const block = directAnswerBlock(text)
  const heroP = html.match(/<p class="text-lg text-\[#6B5B7A\][^"]*"[^>]*>[\s\S]*?<\/p>/)
  if (heroP) return html.replace(heroP[0], `${heroP[0]}\n${block}`)
  return html
}

function addFerrolterraLine(html) {
  const heroMatch = html.match(
    /<p class="text-lg text-\[#6B5B7A\] max-w-3xl mx-auto">[\s\S]*?<\/p>/
  )
  if (!heroMatch || heroMatch[0].includes('Ferrolterra')) return html
  return html.replace(
    heroMatch[0],
    `${heroMatch[0]}\n      <p class="text-sm text-[#6B5B7A] max-w-3xl mx-auto mt-4">${LOCAL_LINE}</p>`
  )
}

function fixTwitterCard(html) {
  return html
    .replace(
      /<meta name="twitter:card" content="summary">/g,
      '<meta name="twitter:card" content="summary_large_image">'
    )
    .replace(
      /<meta name="twitter:card" content="summary_large_image_large_image">/g,
      '<meta name="twitter:card" content="summary_large_image">'
    )
}

function patchIndexHasMap(html) {
  return html.replace(
    /"hasMap": "https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=Narón,\+A\+Coruña,\+Galicia,\+España"/,
    '"hasMap": "https://www.google.com/maps/search/?api=1&query=Narón,+Ferrolterra,+A+Coruña,+España"'
  )
}

function patchBlogIndexSchema(html) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        name: 'Blog de Bienestar Holístico - Luisa Corral',
        description:
          'Artículos sobre coaching holístico, Flores de Bach y crecimiento personal por Luisa Corral en Narón (Ferrolterra) y online.',
        author: { '@type': 'Person', name: 'Luisa Corral', url: `${BASE}/sobre-mi` },
        publisher: ORG_PUBLISHER,
        url: `${BASE}/blog`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${BASE}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE}/blog` },
        ],
      },
    ],
  }
  return html.replace(
    /<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema.org",\s*"@type": "Blog"[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`
  )
}

function patchTestimoniosSchema(html) {
  const match = html.match(
    /<script type="application\/ld\+json">\s*(\{[\s\S]*?"@type": "ReviewPage"[\s\S]*?\})\s*<\/script>/
  )
  if (!match) return html
  let reviewPage
  try {
    reviewPage = JSON.parse(match[1])
  } catch {
    return html
  }
  const reviews = reviewPage.review || []
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ReviewPage',
        url: `${BASE}/testimonios`,
        name: 'Testimonios - Luisa Corral Coach Holística',
        about: { '@id': BUSINESS_ID },
        mainEntity: { '@id': BUSINESS_ID },
        review: reviews,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${BASE}/` },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Testimonios',
            item: `${BASE}/testimonios`,
          },
        ],
      },
    ],
  }
  return html.replace(match[0], `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`)
}

function patchBlogPostingPublisher(html) {
  if (!html.includes('"@type": "BlogPosting"')) return html
  return html.replace(
    /"publisher":\s*\{\s*"@type":\s*"Person"[\s\S]*?\}/,
    `"publisher": ${JSON.stringify(ORG_PUBLISHER)}`
  )
}

function updateDirectAnswerText(html, text) {
  return html.replace(
    /<div class="seo-direct-answer[\s\S]*?<p class="text-\[#6B5B7A\] leading-relaxed">[\s\S]*?<\/p>\s*<\/div>/,
    directAnswerBlock(text)
  )
}

let changed = 0
for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/')
  let html = fs.readFileSync(file, 'utf8')
  const orig = html
  const meta = PAGE_META[rel]

  if (rel.startsWith('enfoques/') && rel.endsWith('.html')) {
    html = fixTwitterCard(html)
  }

  if (meta?.title) html = setTitle(html, meta.title)
  if (meta?.description) html = setDescription(html, meta.description)
  if (meta?.aiDescription) html = setMeta(html, 'ai-description', meta.aiDescription)
  else if (GENERIC_AI.test(html) && (rel === '404.html' || rel === 'llms/index.html')) {
    const m = PAGE_META[rel]
    if (m?.aiDescription) html = setMeta(html, 'ai-description', m.aiDescription)
  }

  if (rel === 'index.html') html = patchIndexHasMap(html)

  if (rel === 'blog/index.html') {
    html = patchBlogIndexSchema(html)
    html = fixTwitterCard(html)
    if (meta?.breadcrumb) html = insertListingBreadcrumb(html, meta.breadcrumb)
  }

  if (rel === 'testimonios/index.html') {
    html = patchTestimoniosSchema(html)
    html = fixTwitterCard(html)
    if (meta?.breadcrumb) html = insertListingBreadcrumb(html, meta.breadcrumb)
  }

  if (meta?.breadcrumb && rel.startsWith('blog/') && rel !== 'blog/index.html') {
    if (!html.includes('site-breadcrumb')) {
      html = html.replace(
        /(<section class="py-20 bg-gradient-to-br from-\[#9B7EBD\][^>]*>[\s\S]*?<div class="max-w-4xl mx-auto[^"]*">)/,
        `$1\n    ${breadcrumbNav(meta.breadcrumb, true)}`
      )
    }
  }

  if (rel.startsWith('blog/') && rel.includes('/index.html') && rel !== 'blog/index.html') {
    html = patchBlogPostingPublisher(html)
    html = fixTwitterCard(html)
  }

  if (html !== orig) {
    fs.writeFileSync(file, html)
    changed++
    console.log('Updated', rel)
  }
}

console.log(`Done: ${changed} files`)
