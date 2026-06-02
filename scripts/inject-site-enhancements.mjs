import fs from 'fs'
import path from 'path'

const ROOT =
  'C:/Users/USUARIO/Documents/Proyectos/Adrián Márquez/Web Adrián Márquez/luisacorralcoach-web'
const TAG = '<script src="/public/site-enhancements.js" defer></script>'

function walk(d, out = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (['node_modules', '.git', 'scripts'].includes(e.name)) continue
    const p = path.join(d, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (p.endsWith('.html')) out.push(p)
  }
  return out
}

let changed = 0
for (const f of walk(ROOT)) {
  let html = fs.readFileSync(f, 'utf8')
  if (html.includes('site-enhancements.js')) continue

  if (html.includes('</body>')) {
    html = html.replace('</body>', `${TAG}\n</body>`)
    fs.writeFileSync(f, html)
    changed++
  }
}

console.log(`Injected site-enhancements.js in ${changed} files`)
