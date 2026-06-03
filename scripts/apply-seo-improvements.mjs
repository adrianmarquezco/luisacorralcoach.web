import fs from 'fs'
import path from 'path'
import {
  BASE,
  BUSINESS_ID,
  POSTAL_ADDRESS,
  PAGE_META,
  directAnswerBlock,
  breadcrumbNav,
  LOCAL_LINE,
} from './seo-shared.mjs'

const ROOT = path.resolve(
  'C:/Users/USUARIO/Documents/Proyectos/Adrián Márquez/Web Adrián Márquez/luisacorralcoach-web'
)

const GENERIC_AI =
  /Luisa Corral es coach holística certificada con más de 8 años de experiencia\. Ofrece sesiones de Flores de Bach/

const ADDRESS_BLOCK = `"address": {
        "@type": "PostalAddress",
        "streetAddress": "Comarca de Ferrolterra",
        "addressLocality": "Narón",
        "addressRegion": "A Coruña",
        "postalCode": "15570",
        "addressCountry": "ES"
      }`

const PROVIDER_PERSON = /"provider":\s*\{\s*"@type":\s*"Person"[\s\S]*?\}/g
const PROVIDER_REPLACEMENT = `"provider": { "@id": "${BUSINESS_ID}" }`

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
  if (re.test(html)) return html.replace(re, `<meta name="${name}" content="${content.replace(/"/g, '&quot;')}">`)
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

function fixRelDuplicate(html) {
  return html.replace(
    /rel="noopener noreferrer" target="_blank" rel="noopener noreferrer"/g,
    'target="_blank" rel="noopener noreferrer"'
  )
}

function fixLocalBusinessAddress(html) {
  return html.replace(
    /"address":\s*\{\s*"@type":\s*"PostalAddress"[\s\S]*?"addressCountry":\s*"ES"\s*\}/,
    ADDRESS_BLOCK
  )
}

function fixProviders(html) {
  return html.replace(PROVIDER_PERSON, PROVIDER_REPLACEMENT)
}

function addLlmsLink(html) {
  if (html.includes('href="/llms.txt"')) return html
  return html.replace(
    /<link rel="canonical" href="[^"]*">/,
    (m) => `${m}\n<link rel="alternate" type="text/plain" href="/llms.txt" title="LLM site summary">`
  )
}

function insertDirectAnswer(html, text) {
  if (html.includes('seo-direct-answer')) return html
  const block = directAnswerBlock(text)
  if (html.includes('id="enfoques-home"')) {
    return html.replace(
      /(<section class="code-section py-20 bg-gradient-to-br from-\[#F0EAF7\] to-\[#FAF7FC\]" id="enfoques-home">[\s\S]*?<p class="text-lg text-\[#6B5B7A\] max-w-3xl mx-auto">[^<]*<\/p>)/,
      `$1\n    ${block}`
    )
  }
  const heroP = html.match(
    /<p class="text-lg text-\[#6B5B7A\][^"]*"[^>]*>[\s\S]*?<\/p>/
  )
  if (heroP) {
    return html.replace(heroP[0], `${heroP[0]}\n${block}`)
  }
  return html
}

function insertBlogBreadcrumb(html, items) {
  if (html.includes('site-breadcrumb') || html.includes('aria-label="Breadcrumb"')) return html
  const nav = breadcrumbNav(items)
  return html.replace(
    /(<\/header>\s*<section[^>]*>\s*<div class="max-w-[^"]+ mx-auto[^"]*">)/,
    `$1\n    ${nav}`
  )
}

function fixContactSchema(html) {
  const contactSchema = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "name": "Contacto - Luisa Corral Coach Holística",
      "description": "Reserva sesión con Luisa Corral: WhatsApp, email y formulario. Coach holística en Narón (Ferrolterra, A Coruña) y online.",
      "url": "${BASE}/contacto",
      "about": { "@id": "${BUSINESS_ID}" },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+34616054001",
        "email": "luisacorralcoach@gmail.com",
        "contactType": "customer service",
        "availableLanguage": ["es"],
        "areaServed": ["ES", "MX", "AR", "CO"]
      }
    },
    {
      "@type": "LocalBusiness",
      "@id": "${BUSINESS_ID}",
      "name": "Luisa Corral - Coach Holística",
      "url": "${BASE}/",
      "telephone": "+34616054001",
      "email": "luisacorralcoach@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Comarca de Ferrolterra",
        "addressLocality": "Narón",
        "addressRegion": "A Coruña",
        "postalCode": "15570",
        "addressCountry": "ES"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 43.5483,
        "longitude": -8.1900
      },
      "areaServed": [
        { "@type": "City", "name": "Narón" },
        { "@type": "AdministrativeArea", "name": "A Coruña" },
        { "@type": "Country", "name": "España" }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "${BASE}/" },
        { "@type": "ListItem", "position": 2, "name": "Contacto", "item": "${BASE}/contacto" }
      ]
    }
  ]
}
</script>`
  return html.replace(
    /<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema.org",\s*"@type": "ContactPage"[\s\S]*?<\/script>/,
    contactSchema
  )
}

function patchContactBody(html) {
  let h = html
  h = h.replace(
    /<h1 class="text-4xl md:text-5xl font-bold text-\[#2D1B3D\] mb-6">\s*Hablemos\s*<\/h1>/,
    '<h1 class="text-4xl md:text-5xl font-bold text-[#2D1B3D] mb-6">Contacto coach holística</h1>'
  )
  if (!h.includes('Ferrolterra')) {
    h = h.replace(
      /<p class="text-lg text-\[#6B5B7A\] max-w-3xl mx-auto">\s*¿Estás listo\/a[\s\S]*?<\/p>/,
      `<p class="text-lg text-[#6B5B7A] max-w-3xl mx-auto">Reserva tu sesión por WhatsApp, email o formulario. ${LOCAL_LINE}</p>`
    )
  }
  return h
}

function patchIndexEnfoquesCards(html) {
  const cards = [
    ['gestion-estres-emociones', 'Ansiedad y estrés online', 'Coaching y Flores de Bach para nervios, burnout y emociones.'],
    ['encontrar-proposito', 'Encontrar propósito vital', 'Claridad de valores y decisiones con sentido.'],
    ['equilibrio-vital', 'Equilibrio vital y burnout', 'Hábitos, descanso y energía sin culpa.'],
    ['autoconocimiento-mindfulness', 'Mindfulness y calma mental', 'Respiración, presencia y autoconocimiento.'],
    ['desbloqueo-energetico-emocional', 'Desbloqueo emocional online', 'Reiki Delfín y liberación energética.'],
  ]
  let h = html
  for (const [slug, title, desc] of cards) {
    h = h.replace(
      new RegExp(
        `<a href="/enfoques/${slug}" class="p-6 bg-white[\\s\\S]*?<p class="font-bold text-\\[#2D1B3D\\] mb-2">[^<]*</p>\\s*<p class="text-sm text-\\[#6B5B7A\\]">[^<]*</p>`
      ),
      `<a href="/enfoques/${slug}" aria-label="${title}" class="p-6 bg-white rounded-2xl border border-[#E5D9F2] hover:shadow-lg transition-all hover:border-[#9B7EBD]">
        <p class="font-bold text-[#2D1B3D] mb-2">${title}</p>
        <p class="text-sm text-[#6B5B7A]">${desc}</p>`
    )
  }
  if (h.includes('Ver todos los enfoques')) {
    h = h.replace(
      /<a href="\/enfoques" class="p-6 bg-\[#9B7EBD\][^>]*>[\s\S]*?<\/a>/,
      `<a href="/enfoques" aria-label="Ver todos los enfoques de coaching" class="p-6 bg-[#9B7EBD] rounded-2xl flex flex-col justify-center items-center text-center hover:bg-[#7A5FA0] transition-colors">
        <p class="font-bold text-white mb-1">Todos los enfoques</p>
        <p class="text-sm text-white/90 mb-2">Ansiedad, propósito, mindfulness…</p>
        <i class="fa-solid fa-arrow-right text-white"></i>
      </a>`
    )
  }
  if (!h.includes('Ferrolterra')) {
    h = h.replace(
      /Narón \(Galicia\) y online para España y Latinoamérica\./,
      'Narón (Ferrolterra, A Coruña) y online para España y Latinoamérica.'
    )
  }
  return h
}

let changed = 0
for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/')
  let html = fs.readFileSync(file, 'utf8')
  const orig = html
  const meta = PAGE_META[rel]

  html = fixRelDuplicate(html)
  html = fixProviders(html)
  html = addLlmsLink(html)

  if (rel === 'index.html') {
    html = fixLocalBusinessAddress(html)
    html = patchIndexEnfoquesCards(html)
  }

  if (rel === 'contacto/index.html') {
    html = fixContactSchema(html)
    html = patchContactBody(html)
  }

  if (meta) {
    if (meta.title) html = setTitle(html, meta.title)
    if (meta.description) html = setDescription(html, meta.description)
    if (meta.aiDescription) html = setMeta(html, 'ai-description', meta.aiDescription)
    else if (GENERIC_AI.test(html) && meta.aiDescription) {
      html = setMeta(html, 'ai-description', meta.aiDescription)
    }
    if (meta.breadcrumb) html = insertBlogBreadcrumb(html, meta.breadcrumb)
  }

  if (html !== orig) {
    fs.writeFileSync(file, html)
    changed++
    console.log('Updated', rel)
  }
}

console.log(`Done: ${changed} files`)
