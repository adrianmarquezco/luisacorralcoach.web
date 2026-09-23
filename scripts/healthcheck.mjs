#!/usr/bin/env node
// Vigilante de la web: recorre el sitemap y comprueba estado, velocidad, contenido,
// enlaces, imágenes, schema, compresión y que los archivos internos NO sean públicos.
// Uso: node scripts/healthcheck.mjs [https://www.luisacorralcoach.com]
// Sin dependencias (Node 18+). Sale con código 1 si hay fallos.

const BASE = (process.argv[2] || 'https://www.luisacorralcoach.com').replace(/\/$/, '')
const SLOW_MS = 1500 // aviso
const VERY_SLOW_MS = 4000 // fallo
const CONC = 8

const failures = []
const warnings = []
const fail = (where, msg) => failures.push(`${where} — ${msg}`)
const warn = (where, msg) => warnings.push(`${where} — ${msg}`)

async function get(url, opts = {}) {
  const t0 = Date.now()
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), opts.timeout || 20000)
  try {
    const res = await fetch(url, { redirect: opts.redirect || 'follow', headers: opts.headers || {}, method: opts.method || 'GET', signal: ctrl.signal })
    const body = opts.method === 'HEAD' ? '' : await res.text()
    return { res, body, ms: Date.now() - t0 }
  } catch (e) {
    return { res: null, body: '', ms: Date.now() - t0, error: e.name === 'AbortError' ? 'timeout' : e.message }
  } finally {
    clearTimeout(timer)
  }
}

async function pool(items, fn, n = CONC) {
  let i = 0
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const it = items[i++]; await fn(it) } }))
}

const strip = h => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, ' ')

// ---------- 1) sitemap ----------
const sm = await get(BASE + '/sitemap.xml')
if (!sm.res || sm.res.status !== 200) { fail('/sitemap.xml', `no responde 200 (${sm.res ? sm.res.status : sm.error})`); report() }
const urls = [...sm.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim())
if (urls.length < 100) fail('/sitemap.xml', `solo ${urls.length} URLs (se esperaban ~136)`)

// ---------- 2) cada página ----------
const linkSet = new Set()
const times = []
await pool(urls, async (u) => {
  const path = u.replace('https://www.luisacorralcoach.com', '') || '/'
  const target = BASE + path
  const { res, body, ms, error } = await get(target)
  times.push(ms)
  if (!res) return fail(path, `sin respuesta (${error})`)
  if (res.status !== 200) return fail(path, `HTTP ${res.status}`)
  if (ms > VERY_SLOW_MS) fail(path, `muy lenta: ${ms} ms`)
  else if (ms > SLOW_MS) warn(path, `lenta: ${ms} ms`)
  if (!/text\/html/.test(res.headers.get('content-type') || '')) fail(path, `content-type ${res.headers.get('content-type')}`)
  if (body.length < 5000) fail(path, `HTML sospechosamente corto (${body.length} bytes)`)
  if (!/<\/html>\s*$/i.test(body.trim())) fail(path, 'HTML cortado (no termina en </html>)')
  const title = (body.match(/<title>([^<]*)<\/title>/) || [])[1]
  if (!title) fail(path, 'sin <title>')
  else if (/404|no encontrada|not found/i.test(title)) fail(path, `título de error: ${title}`)
  const vis = strip(body)
  const h1s = (vis.match(/<h1\b/g) || []).length
  if (h1s !== 1) fail(path, `${h1s} H1 (debe haber 1)`)
  const canon = (body.match(/rel="canonical" href="([^"]*)"/) || [])[1]
  if (canon && canon !== u && canon !== u + '/') fail(path, `canonical distinto de la URL: ${canon}`)
  if (!/name="description" content="[^"]{40,}/.test(body)) warn(path, 'meta description ausente o muy corta')
  if (/\bundefined\b|\[object Object\]|\{\{|NaN\b/.test(vis.replace(/<[^>]+>/g, ' '))) fail(path, 'texto roto en pantalla (undefined / [object Object] / {{ )')
  for (const m of body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]) } catch { fail(path, 'JSON-LD inválido') }
  }
  // FAQ visible = FAQ schema
  const qs = (body.match(/data-landingsite-faq-question|faq-trigger/g) || []).length
  const sq = (body.match(/"@type":\s*"Question"/g) || []).length
  if (qs && sq && qs !== sq) fail(path, `FAQ visibles (${qs}) ≠ FAQ en schema (${sq})`)
  // enlaces y recursos internos
  for (const m of body.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) if (m[1] !== '/' && !m[1].startsWith('//')) linkSet.add(m[1])
})

// ---------- 3) enlaces internos y recursos (una sola vez cada uno) ----------
const links = [...linkSet]
await pool(links, async (l) => {
  const { res, error } = await get(BASE + l, { method: 'HEAD', timeout: 15000 })
  if (!res) return fail(l, `recurso sin respuesta (${error})`)
  if (res.status >= 400) fail(l, `enlace/recurso roto: HTTP ${res.status}`)
})

// ---------- 4) compresión y cabeceras ----------
{
  const r = await fetch(BASE + '/', { headers: { 'Accept-Encoding': 'gzip' } })
  if (!/gzip|br/.test(r.headers.get('content-encoding') || '')) warn('/', 'el HTML no llega comprimido (gzip)')
  if (!r.headers.get('x-content-type-options')) warn('/', 'faltan cabeceras de seguridad')
}

// ---------- 5) lo que DEBE existir ----------
for (const p of ['/robots.txt', '/llms.txt', '/favicon.ico', '/sitemap.xml']) {
  const { res } = await get(BASE + p, { method: 'HEAD' })
  if (!res || res.status !== 200) fail(p, `debería dar 200 y da ${res ? res.status : 'error'}`)
}
{
  const { res } = await get(BASE + '/esta-pagina-no-existe-' + Date.now())
  if (!res || res.status !== 404) fail('/404', `una URL inexistente debería dar 404 y da ${res ? res.status : 'error'}`)
}

// ---------- 6) lo que NO debe ser público ----------
for (const p of ['/.git/HEAD', '/.git/config', '/.env', '/.dockerignore', '/.gitignore', '/README.md', '/DEPLOY-COOLIFY.md', '/FORMSPREE.md', '/Dockerfile', '/nginx.conf', '/package.json', '/package-lock.json', '/scripts/migrate.mjs', '/scripts/healthcheck.mjs', '/.github/workflows/monitor.yml', '/assets/image-manifest.json', '/node_modules/']) {
  const { res } = await get(BASE + p, { method: 'HEAD' })
  if (res && res.status === 200) fail(p, 'ARCHIVO INTERNO PÚBLICO (debería dar 404)')
}

// ---------- 7) redirecciones ----------
for (const [from, to] of [['/que-es-coach-holistico', '/blog/que-es-coach-holistico'], ['/retiros-espirituales-galicia', '/retiros-espirituales']]) {
  const { res } = await get(BASE + from, { redirect: 'manual', method: 'HEAD' })
  const loc = res && res.headers.get('location')
  if (!res || res.status !== 301 || !loc || !loc.endsWith(to)) warn(from, `debería redirigir 301 a ${to} (da ${res ? res.status : 'error'} ${loc || ''})`)
}
{
  const { res } = await get('http://' + BASE.replace(/^https?:\/\//, '') + '/', { redirect: 'manual', method: 'HEAD' })
  if (res && res.status !== 301 && res.status !== 308) warn('http→https', `redirección ${res.status} (debería ser 301)`)
}

report()

function report() {
  const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0
  const max = times.length ? Math.max(...times) : 0
  const lines = []
  lines.push(`# Vigilante luisacorralcoach.com — ${failures.length ? 'FALLO' : 'todo correcto'}`)
  lines.push(`${new Date().toISOString()} · ${urls.length} páginas · ${links.length} enlaces/recursos · respuesta media ${avg} ms · máxima ${max} ms`)
  if (failures.length) { lines.push(`\n## Fallos (${failures.length})`); failures.slice(0, 60).forEach(f => lines.push('- ' + f)); if (failures.length > 60) lines.push(`- … y ${failures.length - 60} más`) }
  if (warnings.length) { lines.push(`\n## Avisos (${warnings.length})`); warnings.slice(0, 30).forEach(f => lines.push('- ' + f)) }
  const out = lines.join('\n')
  console.log(out)
  if (process.env.GITHUB_STEP_SUMMARY) { import('node:fs').then(fs => fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, out + '\n')) }
  process.exitCode = failures.length ? 1 : 0
  if (!urls.length) process.exit(1)
}
