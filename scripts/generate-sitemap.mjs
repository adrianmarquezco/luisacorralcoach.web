#!/usr/bin/env node
// Regenera el <lastmod> de cada URL de sitemap.xml con la fecha del último commit
// en que cambió de verdad el contenido principal de la página (su "huella"), no
// el último commit que tocó el archivo: así los cambios técnicos sitewide
// (analítica, schema, accesibilidad) no mueven las fechas y Google puede seguir
// fiándose de ellas.
//
// Huella = <title> + meta description + texto visible de <main>, sin scripts,
// estilos, header, footer, banner de cookies ni botón de WhatsApp, con los
// espacios normalizados.
//
// Uso: node scripts/generate-sitemap.mjs [--check]
//   --check   no escribe; sale con código 1 si alguna fecha está desactualizada

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SITEMAP_PATH = join(ROOT, 'sitemap.xml')
const SITE = 'https://www.luisacorralcoach.com'
const CHECK = process.argv.includes('--check')

const git = (args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })

function pathForLoc(loc) {
  const path = loc.replace(SITE, '').replace(/^\//, '')
  return path === '' ? 'index.html' : `${path}/index.html`
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }

function fingerprint(html) {
  const title = (html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || ''
  const desc = (html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || [])[1] || ''
  const mainMatch = html.match(/<main\b[\s\S]*?<\/main>/i)
  let body = mainMatch ? mainMatch[0] : html.replace(/<head\b[\s\S]*?<\/head>/i, '')
  body = body
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<header\b[\s\S]*?<\/header>/gi, ' ')
    .replace(/<footer\b[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<div\b[^>]*id="cookie-consent[\s\S]*?<\/div>/gi, ' ')
    .replace(/<a\b[^>]*href="https:\/\/wa\.me\/[^"]*"[^>]*class="[^"]*\bfixed\b[\s\S]*?<\/a>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (m, e) => {
      if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10))
      return ENTITIES[e.toLowerCase()] ?? m
    })
  const text = [title, desc, body].join(' | ').replace(/\s+/g, ' ').trim()
  return createHash('sha1').update(text).digest('hex')
}

function contentDate(relPath) {
  let log
  try {
    // --first-parent: solo la historia publicada; las ramas laterales de trabajo
    // (creadas desde bases viejas) intercalarían versiones antiguas del archivo.
    log = git(['log', '--first-parent', '--format=%H %cI', '--', relPath]).trim()
  } catch {
    return null
  }
  if (!log) return null
  const commits = log.split('\n').map(l => { const [hash, date] = l.split(' '); return { hash, date: date.slice(0, 10) } })

  const showFp = (hash) => {
    try { return fingerprint(git(['show', `${hash}:${relPath}`])) } catch { return null }
  }

  const headFp = showFp(commits[0].hash)
  const abs = join(ROOT, relPath)
  if (existsSync(abs) && fingerprint(readFileSync(abs, 'utf8')) !== headFp) {
    return new Date().toISOString().slice(0, 10)
  }

  // Recorre de más nuevo a más viejo: la fecha es la del commit más antiguo
  // de la racha inicial con la misma huella que el último commit.
  let date = commits[0].date
  for (let i = 1; i < commits.length; i++) {
    const fp = showFp(commits[i].hash)
    if (fp !== headFp) break
    date = commits[i].date
  }
  return date
}

const xml = readFileSync(SITEMAP_PATH, 'utf8')
const urlBlockRe = /<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>(?:\s*<changefreq>[^<]*<\/changefreq>)?(?:\s*<priority>[^<]*<\/priority>)?\s*<\/url>/g

let changedCount = 0
const missing = []

const newXml = xml.replace(urlBlockRe, (full, loc, oldLastmod) => {
  const relPath = pathForLoc(loc.trim())
  const date = contentDate(relPath)
  if (!date) {
    missing.push(relPath)
    return `<url>\n    <loc>${loc.trim()}</loc>\n    <lastmod>${oldLastmod.trim()}</lastmod>\n  </url>`
  }
  if (date !== oldLastmod.trim()) changedCount++
  return `<url>\n    <loc>${loc.trim()}</loc>\n    <lastmod>${date}</lastmod>\n  </url>`
})

if (missing.length) {
  console.log(`Aviso: ${missing.length} URL(s) sin historial de git (se deja su lastmod actual):`)
  missing.forEach(m => console.log(`  - ${m}`))
}

if (CHECK) {
  if (changedCount > 0 || newXml !== xml) {
    console.log(`sitemap.xml desactualizado: ${changedCount} URL(s) con lastmod distinto a su último cambio de contenido.`)
    process.exit(1)
  }
  console.log('sitemap.xml al día.')
  process.exit(0)
}

writeFileSync(SITEMAP_PATH, newXml)
console.log(`sitemap.xml actualizado: ${changedCount} URL(s) con lastmod corregido.`)
