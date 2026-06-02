import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(
  'C:/Users/USUARIO/Documents/Proyectos/Adrián Márquez/Web Adrián Márquez/luisacorralcoach-web'
)

function walk(d, out = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (p.includes(`${path.sep}enfoques${path.sep}`) && p.endsWith('.html')) out.push(p)
  }
  return out
}

for (const f of walk(path.join(ROOT, 'enfoques'))) {
  let h = fs.readFileSync(f, 'utf8')
  h = h.replace(
    /\s*<a href="\/enfoques" class="text-\[#2D1B3D\][^"]*">Enfoques<\/a>\s*<a href="\/enfoques" class="block[^"]*">Enfoques<\/a>\s*/g,
    '\n        <a href="/enfoques" class="text-[#2D1B3D] hover:text-[#9B7EBD] font-semibold transition-colors duration-300">Enfoques</a>\n        '
  )
  if (!/data-landingsite-mobile-menu[\s\S]*href="\/enfoques"/.test(h)) {
    h = h.replace(
      /(<div class="lg:hidden hidden[^"]*" data-landingsite-mobile-menu="">[\s\S]*?)(<a href="\/testimonios" class="block)/,
      '$1<a href="/enfoques" class="block text-[#2D1B3D] hover:text-[#9B7EBD] font-semibold py-2">Enfoques</a>\n      $2'
    )
  }
  fs.writeFileSync(f, h)
  console.log('Fixed', path.relative(ROOT, f))
}
