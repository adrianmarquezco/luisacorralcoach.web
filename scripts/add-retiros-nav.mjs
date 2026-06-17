import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const files = [
  'index.html', 'sobre-mi/index.html', 'flores-de-bach/index.html',
  'coaching-holistico/index.html', 'meditaciones-personalizadas/index.html',
  'coaching-angelical/index.html', 'reiki-delfin/index.html',
  'enfoques/index.html', 'enfoques/gestion-estres-emociones/index.html',
  'enfoques/encontrar-proposito/index.html', 'enfoques/equilibrio-vital/index.html',
  'enfoques/autoconocimiento-mindfulness/index.html', 'enfoques/desbloqueo-energetico-emocional/index.html',
  'testimonios/index.html', 'blog/index.html',
  'blog/coach-holistico-o-psicologo/index.html',
  'blog/coaching-holistico-beneficios-enfoque-integral/index.html',
  'blog/en-que-me-puede-ayudar-un-coach-holistico/index.html',
  'blog/encontrar-proposito-vida-40/index.html',
  'blog/flores-de-bach-para-la-ansiedad/index.html',
  'blog/flores-de-bach-precio/index.html',
  'blog/que-es-coach-holistico/index.html',
  'blog/que-es-coaching-angelical/index.html',
  'blog/que-son-las-flores-de-bach/index.html',
  'blog/reiki-delfin-sanacion-energia-delfines/index.html',
  'blog/tecnicas-mindfulness-reducir-estres/index.html',
  'contacto/index.html', 'aviso-legal/index.html',
  'politica-de-privacidad/index.html', 'politica-de-cookies/index.html',
  'testimonios/index.html', 'llms/index.html', '404.html'
]

// Desktop nav: Reiki Delfín currently has rounded-b-xl — remove it, then add Retiros after
const OLD_DESKTOP_REIKI = '            <a href="/reiki-delfin" class="flex items-center gap-3 px-4 py-3 text-[#2D1B3D] hover:bg-[#FAF7FC] hover:text-[#9B7EBD] transition-colors rounded-b-xl">\r\n              <i class="fa-solid fa-water text-[#9B7EBD]"></i>\r\n              Reiki Delfín\r\n            </a>'

const NEW_DESKTOP_REIKI = '            <a href="/reiki-delfin" class="flex items-center gap-3 px-4 py-3 text-[#2D1B3D] hover:bg-[#FAF7FC] hover:text-[#9B7EBD] transition-colors">\r\n              <i class="fa-solid fa-water text-[#9B7EBD]"></i>\r\n              Reiki Delfín\r\n            </a>\r\n            <a href="/retiros-espirituales-galicia" class="flex items-center gap-3 px-4 py-3 text-[#2D1B3D] hover:bg-[#FAF7FC] hover:text-[#9B7EBD] transition-colors rounded-b-xl">\r\n              <i class="fa-solid fa-tent text-[#9B7EBD]"></i>\r\n              Retiros\r\n            </a>'

// Mobile nav: add after Reiki Delfín link
const OLD_MOBILE_REIKI = '          <a href="/reiki-delfin" class="flex items-center gap-2 text-[#6B5B7A] hover:text-[#9B7EBD] py-1">\r\n            <i class="fa-solid fa-water text-sm"></i> Reiki Delfín\r\n          </a>'

const NEW_MOBILE_REIKI = '          <a href="/reiki-delfin" class="flex items-center gap-2 text-[#6B5B7A] hover:text-[#9B7EBD] py-1">\r\n            <i class="fa-solid fa-water text-sm"></i> Reiki Delfín\r\n          </a>\r\n          <a href="/retiros-espirituales-galicia" class="flex items-center gap-2 text-[#6B5B7A] hover:text-[#9B7EBD] py-1">\r\n            <i class="fa-solid fa-tent text-sm"></i> Retiros\r\n          </a>'

// Footer: add after Reiki Delfín list item, before closing </ul>
const OLD_FOOTER_REIKI = '          <li>\r\n            <a href="/reiki-delfin" class="text-[#B8A4C9] hover:text-white transition-colors">Reiki Delfín</a>\r\n          </li>\r\n        </ul>'

const NEW_FOOTER_REIKI = '          <li>\r\n            <a href="/reiki-delfin" class="text-[#B8A4C9] hover:text-white transition-colors">Reiki Delfín</a>\r\n          </li>\r\n          <li>\r\n            <a href="/retiros-espirituales-galicia" class="text-[#B8A4C9] hover:text-white transition-colors">Retiros</a>\r\n          </li>\r\n        </ul>'

let updated = 0
let skipped = 0

for (const rel of files) {
  const path = join(root, rel)
  let html
  try {
    html = readFileSync(path, 'utf8')
  } catch {
    console.log(`  SKIP (not found): ${rel}`)
    skipped++
    continue
  }

  if (html.includes('/retiros-espirituales-galicia')) {
    console.log(`  ALREADY DONE: ${rel}`)
    continue
  }

  let changed = html
  changed = changed.replace(OLD_DESKTOP_REIKI, NEW_DESKTOP_REIKI)
  changed = changed.replace(OLD_MOBILE_REIKI, NEW_MOBILE_REIKI)
  changed = changed.replace(OLD_FOOTER_REIKI, NEW_FOOTER_REIKI)

  if (changed === html) {
    console.log(`  NO MATCH: ${rel}`)
    skipped++
  } else {
    writeFileSync(path, changed, 'utf8')
    console.log(`  ✓ ${rel}`)
    updated++
  }
}

console.log(`\r\nDone: ${updated} updated, ${skipped} skipped`)
