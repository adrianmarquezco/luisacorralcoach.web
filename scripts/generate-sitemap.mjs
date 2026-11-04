#!/usr/bin/env node
// Regenera el `<lastmod>` de cada URL en sitemap.xml a partir de la fecha real
// del último commit de git que tocó el archivo HTML correspondiente.
//
// Google solo confía en lastmod si es "verificablemente preciso" comparado con
// el cambio real de la página (developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
// Antes, todas las URLs tenían una fecha fija sin relación con los cambios reales.
//
// Uso: node scripts/generate-sitemap.mjs [--check]
//   --check   no escribe el archivo, solo sale con código 1 si hay diferencias
//             (útil para comprobar antes de desplegar que el sitemap está al día)

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SITEMAP_PATH = join(ROOT, 'sitemap.xml')
const SITE = 'https://www.luisacorralcoach.com'
const CHECK = process.argv.includes('--check')

function pathForLoc(loc) {
  const path = loc.replace(SITE, '').replace(/^\//, '')
  return path === '' ? 'index.html' : `${path}/index.html`
}

function lastCommitDate(relPath) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', relPath], { cwd: ROOT, encoding: 'utf8' }).trim()
    return out ? out.slice(0, 10) : null
  } catch {
    return null
  }
}

const xml = readFileSync(SITEMAP_PATH, 'utf8')
const urlBlockRe = /<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>\s*<changefreq>([^<]+)<\/changefreq>\s*<priority>([^<]+)<\/priority>\s*<\/url>/g

let changedCount = 0
let missing = []

const newXml = xml.replace(urlBlockRe, (full, loc, oldLastmod, changefreq, priority) => {
  const relPath = pathForLoc(loc.trim())
  const commitDate = lastCommitDate(relPath)
  if (!commitDate) {
    missing.push(relPath)
    return full
  }
  if (commitDate !== oldLastmod) changedCount++
  return `<url>\n    <loc>${loc.trim()}</loc>\n    <lastmod>${commitDate}</lastmod>\n    <changefreq>${changefreq.trim()}</changefreq>\n    <priority>${priority.trim()}</priority>\n  </url>`
})

if (missing.length) {
  console.log(`Aviso: ${missing.length} URL(s) sin historial de git (se deja su lastmod actual):`)
  missing.forEach(m => console.log(`  - ${m}`))
}

if (CHECK) {
  if (changedCount > 0) {
    console.log(`sitemap.xml desactualizado: ${changedCount} URL(s) con lastmod distinto al último commit real.`)
    process.exit(1)
  }
  console.log('sitemap.xml al día.')
  process.exit(0)
}

writeFileSync(SITEMAP_PATH, newXml)
console.log(`sitemap.xml actualizado: ${changedCount} URL(s) con lastmod corregido.`)
