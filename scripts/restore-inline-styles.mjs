import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const BASE = '79860e0'
const STYLE_RE = /<style>\*,::after,::before[\s\S]*?<\/style>\s*/m

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'scripts', '.git'].includes(e.name)) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, files)
    else if (e.name.endsWith('.html')) files.push(p)
  }
  return files
}

for (const filePath of walk(ROOT)) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/')
  let oldHtml
  try {
    oldHtml = execSync(`git show ${BASE}:${rel}`, { encoding: 'utf8', cwd: ROOT })
  } catch {
    console.log('⊘', rel, '(sin versión anterior)')
    continue
  }

  const style = oldHtml.match(STYLE_RE)?.[0]
  if (!style) {
    console.log('⊘', rel, '(sin bloque Tailwind)')
    continue
  }

  let html = fs.readFileSync(filePath, 'utf8')
  if (!html.includes('/public/site.css') && !html.match(STYLE_RE)) {
    console.log('⊘', rel, '(ya tiene estilos inline)')
    continue
  }

  html = html.replace(/<link rel="stylesheet" href="\/public\/site\.css">\s*/g, '')
  html = html.replace(STYLE_RE, '')

  const rootStyle = html.match(/<style>:root\s*\{[\s\S]*?<\/style>/)
  if (rootStyle) {
    html = html.replace(rootStyle[0], style + rootStyle[0])
  } else {
    html = html.replace('</head>', style + '</head>')
  }

  fs.writeFileSync(filePath, html)
  console.log('✓', rel)
}

console.log('\nEstilos inline restaurados por página')
