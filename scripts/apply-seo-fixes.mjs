import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const BASE = 'https://www.luisacorralcoach.com'
const TODAY = '2026-06-02'
const PERSON_IMAGE =
  `${BASE}/assets/images/cf/xaKlCos5cTg_1RWzIu_h-A-f4f8a224-4fe2-42ab-f675-3d5928c92b00.webp`
const COACHING_OG =
  `${BASE}/assets/images/cf/xaKlCos5cTg_1RWzIu_h-A-deb7eaa8-16d2-4e89-e023-fecfec881600.webp`
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Narón,+A+Coruña,+Galicia,+España'

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'scripts', '.git'].includes(e.name)) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, files)
    else if (e.name.endsWith('.html')) files.push(p)
  }
  return files
}

function fixJsonLdBlock(json) {
  let o = json
  o = o.replace(/https?:\/\/luisacorral\.es/g, BASE)
  o = o.replace(/"url":\s*"\/([^"]*)"/g, (_, p) => {
    const pathPart = p ? `/${p}` : '/'
    return `"url": "${BASE}${pathPart}"`
  })
  o = o.replace(/"item":\s*"\/([^"]*)"/g, (_, p) => {
    const pathPart = p ? `/${p}` : '/'
    return `"item": "${BASE}${pathPart}"`
  })
  o = o.replace(
    /xaKlCos5cTg_1RWzIu_h-A-public\.webp/g,
    'xaKlCos5cTg_1RWzIu_h-A-f4f8a224-4fe2-42ab-f675-3d5928c92b00.webp'
  )
  o = o.replace(
    /,?\s*"potentialAction":\s*\{[\s\S]*?"@type":\s*"SearchAction"[\s\S]*?\}\s*/g,
    ''
  )
  o = o.replace(/"inLanguage":\s*"[^"]*",\s*",\s*"query-input"[\s\S]*?\}\s*/g, (m) =>
    m.replace(/,\s*",\s*"query-input"[\s\S]*?\}\s*$/, '')
  )
  o = o.replace(/,\s*,/g, ',').replace(/,\s*}/g, '}').replace(/{\s*,/g, '{')
  return o
}

function fixJsonLdInHtml(html) {
  return html.replace(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    (m, body) => `<script type="application/ld+json">${fixJsonLdBlock(body)}</script>`
  )
}

function fixLocalBusinessOnHome(html) {
  if (!html.includes('"@type": "LocalBusiness"')) return html
  if (html.includes('"geo":')) return html

  const insert = `"geo": {
        "@type": "GeoCoordinates",
        "latitude": 43.5483,
        "longitude": -8.1900
      },
      "hasMap": "${MAPS_URL}",
      "sameAs": [
        "https://www.instagram.com/luisacorralcoach/",
        "https://www.tiktok.com/@luisacorral_coach"
      ],`

  return html.replace(
    /"priceRange": "€€",\s*\n\s*"contactPoint":/,
    `"priceRange": "€€",
      ${insert}
      "contactPoint":`
  )
}

function fixCoachingHolisticoOg(html, rel) {
  if (rel !== 'coaching-holistico/index.html') return html
  if (html.includes('property="og:image"')) return html

  const block = `<meta property="og:url" content="${BASE}/coaching-holistico">
<meta property="og:image" content="${COACHING_OG}">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_ES">
<meta name="twitter:image" content="${COACHING_OG}">
`
  return html.replace(
    /<meta name="twitter:description"[^>]*>\s*/,
    (m) => m + block
  )
}

function fixPrivacyRobots(html, rel) {
  if (rel !== 'politica-de-privacidad/index.html') return html
  return html.replace(
    /<meta name="robots" content="[^"]*">/,
    '<meta name="robots" content="noindex, follow">'
  )
}

function fixLlmsPage(html, rel) {
  if (rel !== 'llms/index.html') return html
  html = html.replace(
    /Especializada en Flores de Bach, \. Sesiones/,
    'Especializada en Flores de Bach, coaching holístico y Reiki Delfín. Sesiones'
  )
  html = html.replace(/,\s*"medicalSpecialty":\s*"[^"]*"\s*/g, '\n')
  return html
}

function fixSobreMiSameAs(html, rel) {
  if (rel !== 'sobre-mi/index.html') return html
  return html.replace(
    /"sameAs":\s*\[\s*\]/,
    `"sameAs": [
    "https://www.instagram.com/luisacorralcoach/",
    "https://www.tiktok.com/@luisacorral_coach"
  ]`
  ).replace(
    `"image": "${BASE}/assets/images/cf/xaKlCos5cTg_1RWzIu_h-A-public.webp"`,
    `"image": "${PERSON_IMAGE}"`
  )
}

function fixHeaderLogoHeight(html) {
  return html
    .replace(/h-20 md:h-40/g, 'h-20 md:h-28')
    .replace(/class="h-16 md:h-32 w-auto/g, 'class="h-14 md:h-24 w-auto')
}

function fixIstockPaths(html) {
  return html.replace(/\/assets\/provider\/istock\/(\d+)\.jpg/g, '/assets/provider/istock/$1.webp')
}

async function convertIstockToWebp() {
  const dir = path.join(ROOT, 'assets/provider/istock')
  if (!fs.existsSync(dir)) return
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.jpg')) continue
    const src = path.join(dir, f)
    const dest = src.replace(/\.jpg$/, '.webp')
    if (fs.existsSync(dest) && fs.statSync(dest).mtimeMs >= fs.statSync(src).mtimeMs) continue
    try {
      const buf = await sharp(src).resize(1200, null, { withoutEnlargement: true }).webp({ quality: 82 }).toBuffer()
      fs.writeFileSync(dest, buf)
      console.log('webp', f)
    } catch (e) {
      console.warn('webp skip', f, e.message)
    }
  }
}

function processHtml(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/')
  let html = fs.readFileSync(filePath, 'utf8')

  html = fixJsonLdInHtml(html)
  html = fixLocalBusinessOnHome(html)
  html = fixCoachingHolisticoOg(html, rel)
  html = fixPrivacyRobots(html, rel)
  html = fixLlmsPage(html, rel)
  html = fixSobreMiSameAs(html, rel)
  html = fixHeaderLogoHeight(html)
  html = fixIstockPaths(html)

  fs.writeFileSync(filePath, html)
  return rel
}

await convertIstockToWebp()
for (const f of walk(ROOT)) {
  console.log('✓', processHtml(f))
}

console.log('\nHTML actualizado')
