import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname, relative } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// Find every page in the repo (all are standalone HTML files, no templating)
function findHtmlFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.git')) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      findHtmlFiles(full, out)
    } else if (entry.name === 'index.html' || entry.name === '404.html') {
      out.push(full)
    }
  }
  return out
}

const files = findHtmlFiles(root)

const OLD_DESKTOP = `            <a href="/coaching-angelical" class="flex items-center gap-3 px-4 py-3 text-[#2D1B3D] hover:bg-[#FAF7FC] hover:text-[#9B7EBD] transition-colors">
              <i class="fa-solid fa-feather text-[#9B7EBD]"></i>
              Coaching Angelical
            </a>`

const NEW_DESKTOP = `${OLD_DESKTOP}
            <a href="/coaching-espiritual" class="flex items-center gap-3 px-4 py-3 text-[#2D1B3D] hover:bg-[#FAF7FC] hover:text-[#9B7EBD] transition-colors">
              <i class="fa-solid fa-om text-[#9B7EBD]"></i>
              Coaching Espiritual
            </a>`

const OLD_MOBILE = `          <a href="/coaching-angelical" class="flex items-center gap-2 text-[#6B5B7A] hover:text-[#9B7EBD] py-1">
            <i class="fa-solid fa-feather text-sm"></i> Coaching Angelical
          </a>`

const NEW_MOBILE = `${OLD_MOBILE}
          <a href="/coaching-espiritual" class="flex items-center gap-2 text-[#6B5B7A] hover:text-[#9B7EBD] py-1">
            <i class="fa-solid fa-om text-sm"></i> Coaching Espiritual
          </a>`

const OLD_FOOTER = `          <li>
            <a href="/coaching-angelical" class="text-[#B8A4C9] hover:text-white transition-colors">Coaching Angelical</a>
          </li>`

const NEW_FOOTER = `${OLD_FOOTER}
          <li>
            <a href="/coaching-espiritual" class="text-[#B8A4C9] hover:text-white transition-colors">Coaching Espiritual</a>
          </li>`

let updated = 0
let skipped = 0
let already = 0

for (const path of files) {
  const rel = relative(root, path)
  if (rel.replace(/\\/g, '/') === 'coaching-espiritual/index.html') continue

  let html
  try {
    html = readFileSync(path, 'utf8')
  } catch {
    continue
  }

  if (html.includes('/coaching-espiritual')) {
    already++
    continue
  }

  let changed = html
  changed = changed.split(OLD_DESKTOP).join(NEW_DESKTOP)
  changed = changed.split(OLD_MOBILE).join(NEW_MOBILE)
  changed = changed.split(OLD_FOOTER).join(NEW_FOOTER)

  if (changed === html) {
    console.log(`  NO MATCH: ${rel}`)
    skipped++
  } else {
    writeFileSync(path, changed, 'utf8')
    updated++
  }
}

console.log(`\nDone: ${updated} updated, ${already} already had it, ${skipped} no match (out of ${files.length} scanned)`)
