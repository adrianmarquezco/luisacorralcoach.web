#!/usr/bin/env node
// Comprobación en navegador real (Playwright): errores de JS, recursos que fallan,
// imágenes rotas, desbordes horizontales, lentitud (LCP/CLS) y que FAQ y menú móvil funcionan.
// Uso: node scripts/render-check.mjs [https://www.luisacorralcoach.com]
import { chromium } from 'playwright'

const BASE = (process.argv[2] || 'https://www.luisacorralcoach.com').replace(/\/$/, '')
const PAGES = ['/', '/sobre-mi', '/flores-de-bach', '/flores-de-bach/en-galicia', '/coaching-holistico', '/reiki-delfin', '/sakh-majat', '/meditaciones-personalizadas', '/retiros-espirituales', '/contacto', '/testimonios', '/blog', '/blog/que-son-las-flores-de-bach']
const VIEWPORTS = [{ name: 'móvil', width: 375, height: 812, mobile: true }, { name: 'escritorio', width: 1366, height: 768, mobile: false }]
const LOAD_FAIL_MS = 9000
const LCP_WARN = 4000
const LCP_FAIL = 8000
const OWN = new URL(BASE).host

const failures = []
const warnings = []
const rows = []

const browser = await chromium.launch(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {})
try {
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.mobile, hasTouch: vp.mobile, locale: 'es-ES' })
    for (const path of PAGES) {
      const where = `${path} (${vp.name})`
      const page = await ctx.newPage()
      const jsErrors = []
      const failedOwn = []
      const failedThird = []
      page.on('pageerror', e => jsErrors.push(e.message))
      page.on('requestfailed', r => { const u = new URL(r.url()); (u.host === OWN ? failedOwn : failedThird).push(`${r.failure()?.errorText || 'fallo'} ${u.host}${u.pathname}`) })
      page.on('response', r => { const u = new URL(r.url()); if (r.status() >= 400) (u.host === OWN ? failedOwn : failedThird).push(`HTTP ${r.status()} ${u.host}${u.pathname}`) })
      const t0 = Date.now()
      let resp
      try {
        resp = await page.goto(BASE + path, { waitUntil: 'load', timeout: 30000 })
      } catch (e) {
        failures.push(`${where} — no carga: ${e.message.split('\n')[0]}`)
        await page.close(); continue
      }
      const loadMs = Date.now() - t0
      if (!resp || resp.status() !== 200) failures.push(`${where} — HTTP ${resp ? resp.status() : 'sin respuesta'}`)
      await page.waitForTimeout(1200)
      // recorrer la página para activar la carga diferida
      await page.evaluate(async () => { const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)) } window.scrollTo(0, 0) })
      await page.waitForTimeout(800)

      const info = await page.evaluate(async () => {
        const out = {}
        out.h1 = (() => { const e = document.querySelector('h1'); if (!e) return null; const r = e.getBoundingClientRect(); return { text: e.textContent.trim().slice(0, 60), visible: r.width > 0 && r.height > 0 } })()
        const vis = s => { const e = document.querySelector(s); if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 }
        out.header = vis('#global-header, header'); out.footer = vis('#global-footer, footer'); out.main = vis('main')
        out.overflow = document.documentElement.scrollWidth - window.innerWidth
        out.brokenImgs = [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.src && !i.src.startsWith('data:')).map(i => i.getAttribute('src')).slice(0, 5)
        out.pendingImgs = [...document.images].filter(i => !i.complete).length
        out.whatsapp = !!document.querySelector('a[href*="wa.me"]')
        const ic = document.querySelector('.fa-solid, .fa-brands, .fa-regular')
        out.iconFont = ic ? /Font Awesome/i.test(getComputedStyle(ic).fontFamily) && getComputedStyle(ic, '::before').content !== 'none' : null
        out.fontBody = document.fonts.check('16px "Nunito Sans"')
        out.faqCount = document.querySelectorAll('[data-landingsite-faq-item], .faq-item').length
        out.lcp = await new Promise(res => { let v = 0; try { new PerformanceObserver(l => { for (const e of l.getEntries()) v = e.startTime }).observe({ type: 'largest-contentful-paint', buffered: true }) } catch { } setTimeout(() => res(Math.round(v)), 300) })
        out.cls = await new Promise(res => { let v = 0; try { new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) v += e.value }).observe({ type: 'layout-shift', buffered: true }) } catch { } setTimeout(() => res(Math.round(v * 1000) / 1000), 300) })
        return out
      })

      if (!info.h1) failures.push(`${where} — no hay H1`)
      else if (!info.h1.visible) failures.push(`${where} — el H1 no se ve`)
      if (!info.header) failures.push(`${where} — la cabecera no se renderiza`)
      if (!info.main) failures.push(`${where} — el contenido principal no se renderiza`)
      if (!info.footer) failures.push(`${where} — el pie no se renderiza`)
      if (info.overflow > 1) failures.push(`${where} — desborde horizontal de ${info.overflow}px`)
      if (info.brokenImgs.length) failures.push(`${where} — imágenes rotas: ${info.brokenImgs.join(', ')}`)
      if (info.iconFont === false) warnings.push(`${where} — los iconos (FontAwesome) no se ven cargados`)
      if (!info.whatsapp) warnings.push(`${where} — falta el botón de WhatsApp`)
      if (jsErrors.length) failures.push(`${where} — error de JavaScript: ${jsErrors[0].slice(0, 140)}`)
      if (failedOwn.length) failures.push(`${where} — recurso propio que falla: ${[...new Set(failedOwn)].slice(0, 3).join(' | ')}`)
      const thirdReal = failedThird.filter(x => !/googletagmanager|google-analytics|doubleclick|gstatic.*favicon|net::ERR_ABORTED/i.test(x))
      if (thirdReal.length) warnings.push(`${where} — recurso externo que falla: ${[...new Set(thirdReal)].slice(0, 2).join(' | ')}`)
      if (loadMs > LOAD_FAIL_MS) failures.push(`${where} — tarda ${loadMs} ms en cargar`)
      if (info.lcp > LCP_FAIL) failures.push(`${where} — LCP ${info.lcp} ms (muy lento)`)
      else if (info.lcp > LCP_WARN) warnings.push(`${where} — LCP ${info.lcp} ms (lento; objetivo < 2500)`)
      if (info.cls > 0.25) warnings.push(`${where} — CLS ${info.cls} (la página "salta" al cargar)`)

      // interacción: FAQ
      if (info.faqCount) {
        const q = page.locator('[data-landingsite-faq-question], .faq-trigger').first()
        try {
          await q.scrollIntoViewIfNeeded(); await q.click({ timeout: 4000 }); await page.waitForTimeout(400)
          const open = await page.evaluate(() => { const a = document.querySelector('[data-landingsite-faq-answer], .faq-body'); if (!a) return null; const r = a.getBoundingClientRect(); return !a.classList.contains('hidden') && r.height > 0 })
          if (open === false) failures.push(`${where} — las preguntas frecuentes no se despliegan al pulsar`)
        } catch (e) { warnings.push(`${where} — no se pudo probar el desplegable de FAQ: ${e.message.split('\n')[0].slice(0, 80)}`) }
      }
      // interacción: menú móvil
      if (vp.mobile) {
        try {
          const t = page.locator('[data-landingsite-mobile-menu-toggle]').first()
          await page.evaluate(() => window.scrollTo(0, 0))
          await t.click({ timeout: 4000 }); await page.waitForTimeout(400)
          const shown = await page.evaluate(() => { const m = document.querySelector('[data-landingsite-mobile-menu]'); if (!m) return null; const r = m.getBoundingClientRect(); return !m.classList.contains('hidden') && r.height > 0 })
          if (shown === false) failures.push(`${where} — el menú móvil no se abre`)
        } catch (e) { warnings.push(`${where} — no se pudo probar el menú móvil: ${e.message.split('\n')[0].slice(0, 80)}`) }
      }
      rows.push({ where, loadMs, lcp: info.lcp, cls: info.cls })
      await page.close()
    }
    await ctx.close()
  }
} finally {
  await browser.close()
}

const lines = []
lines.push(`# Renderizado luisacorralcoach.com — ${failures.length ? 'FALLO' : 'todo correcto'}`)
lines.push(`${new Date().toISOString()} · ${rows.length} comprobaciones (${PAGES.length} páginas × ${VIEWPORTS.length} pantallas)`)
const lc = rows.map(r => r.lcp).filter(Boolean).sort((a, b) => a - b)
if (lc.length) lines.push(`LCP mediana ${lc[Math.floor(lc.length / 2)]} ms · peor ${lc[lc.length - 1]} ms · carga mediana ${rows.map(r => r.loadMs).sort((a, b) => a - b)[Math.floor(rows.length / 2)]} ms`)
if (failures.length) { lines.push(`\n## Fallos (${failures.length})`); failures.slice(0, 60).forEach(f => lines.push('- ' + f)) }
if (warnings.length) { lines.push(`\n## Avisos (${warnings.length})`); warnings.slice(0, 40).forEach(f => lines.push('- ' + f)) }
const out = lines.join('\n')
console.log(out)
if (process.env.GITHUB_STEP_SUMMARY) { const fs = await import('node:fs'); fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, out + '\n') }
process.exit(failures.length ? 1 : 0)
