import fs from 'fs'
import path from 'path'

const ROOT =
  'C:/Users/USUARIO/Documents/Proyectos/Adrián Márquez/Web Adrián Márquez/luisacorralcoach-web'

function walk(d, out = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (['node_modules', '.git', 'scripts'].includes(e.name)) continue
    const p = path.join(d, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (p.endsWith('.html')) out.push(p)
  }
  return out
}

const externalHosts = [
  'https://wa.me/',
  'https://www.instagram.com/',
  'https://www.tiktok.com/',
]

function ensureExternalAttrs(tag) {
  // add target if missing
  if (!/\starget=/.test(tag)) tag = tag.replace('<a ', '<a target="_blank" ')

  // ensure rel contains noopener noreferrer
  const relMatch = tag.match(/\srel="([^"]*)"/)
  if (!relMatch) {
    tag = tag.replace('<a ', '<a rel="noopener noreferrer" ')
  } else {
    const rel = relMatch[1]
    const parts = new Set(rel.split(/\s+/).filter(Boolean))
    parts.add('noopener')
    parts.add('noreferrer')
    const next = Array.from(parts).join(' ')
    tag = tag.replace(relMatch[0], ` rel="${next}"`)
  }
  return tag
}

const files = walk(ROOT)
let changedCount = 0

for (const f of files) {
  const html = fs.readFileSync(f, 'utf8')
  let out = html

  out = out.replace(/<a\b[^>]*href="([^"]+)"[^>]*>/g, (tag, href) => {
    if (!externalHosts.some((p) => href.startsWith(p))) return tag
    return ensureExternalAttrs(tag)
  })

  if (out !== html) {
    fs.writeFileSync(f, out)
    changedCount++
  }
}

console.log(`Updated ${changedCount} HTML files`)

