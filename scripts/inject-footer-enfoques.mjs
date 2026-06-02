import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(
  'C:/Users/USUARIO/Documents/Proyectos/Adrián Márquez/Web Adrián Márquez/luisacorralcoach-web'
)

const ENFOQUES_COL = `      <!-- Enfoques -->
      <div data-enfoques-footer>
        <p class="text-lg font-semibold mb-4 text-[#D4AF37]">Enfoques</p>
        <ul class="space-y-3">
          <li>
            <a href="/enfoques" class="text-[#B8A4C9] hover:text-white transition-colors">Todos los enfoques</a>
          </li>
          <li>
            <a href="/enfoques/gestion-estres-emociones" class="text-[#B8A4C9] hover:text-white transition-colors">Estrés y emociones</a>
          </li>
          <li>
            <a href="/enfoques/encontrar-proposito" class="text-[#B8A4C9] hover:text-white transition-colors">Propósito vital</a>
          </li>
          <li>
            <a href="/enfoques/equilibrio-vital" class="text-[#B8A4C9] hover:text-white transition-colors">Equilibrio vital</a>
          </li>
          <li>
            <a href="/enfoques/autoconocimiento-mindfulness" class="text-[#B8A4C9] hover:text-white transition-colors">Mindfulness</a>
          </li>
          <li>
            <a href="/enfoques/desbloqueo-energetico-emocional" class="text-[#B8A4C9] hover:text-white transition-colors">Desbloqueo energético</a>
          </li>
        </ul>
      </div>

`

const NAV_ENFOQUES = `          <li>
            <a href="/enfoques" class="text-[#B8A4C9] hover:text-white transition-colors">Enfoques</a>
          </li>`

const ENFOQUES_BLOCK_RE =
  /\s*<!-- Enfoques -->\s*<div data-enfoques-footer>[\s\S]*?<\/div>\s*/g

function walk(d, out = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (['node_modules', '.git'].includes(e.name)) continue
    const p = path.join(d, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (p.endsWith('.html')) out.push(p)
  }
  return out
}

function processHtml(html) {
  const footerStart = html.indexOf('<footer id="global-footer"')
  if (footerStart === -1) return html

  const footerEnd = html.indexOf('</footer>', footerStart)
  if (footerEnd === -1) return html

  let beforeFooter = html.slice(0, footerStart).replace(ENFOQUES_BLOCK_RE, '\n')
  let footer = html.slice(footerStart, footerEnd + 9)
  const afterFooter = html.slice(footerEnd + 9)

  if (!footer.includes('data-enfoques-footer')) {
    footer = footer.replace(
      /(\s*)<!-- Contact Info -->/,
      `\n${ENFOQUES_COL}$1<!-- Contact Info -->`
    )
    footer = footer.replace(
      /(<div class="grid md:grid-cols-2 )lg:grid-cols-4/,
      '$1lg:grid-cols-5 footer-with-enfoques'
    )
  }

  if (!footer.includes('href="/enfoques"')) {
    footer = footer.replace(
      /(<a href="\/sobre-mi" class="text-\[#B8A4C9\][^"]*">Sobre Mí<\/a>\s*<\/li>\s*)<li><\/li>/,
      `$1${NAV_ENFOQUES}\n`
    )
  }

  return beforeFooter + footer + afterFooter
}

let changed = 0
for (const file of walk(ROOT)) {
  const html = fs.readFileSync(file, 'utf8')
  if (!html.includes('id="global-footer"')) continue

  const updated = processHtml(html)
  if (updated !== html) {
    fs.writeFileSync(file, updated)
    changed++
    console.log('Updated', path.relative(ROOT, file))
  }
}

console.log(`Done: ${changed} files`)
