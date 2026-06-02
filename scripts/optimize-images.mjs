import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const MANIFEST_PATH = path.join(ROOT, 'assets/image-manifest.json')

const EXT = new Set(['.webp', '.jpg', '.jpeg', '.png'])

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (EXT.has(path.extname(e.name).toLowerCase())) out.push(p)
  }
  return out
}

function category(filePath) {
  const n = path.basename(filePath)
  if (n.includes('b366db84')) return 'logo'
  if (n.includes('-public') || n.includes('publicContain')) return 'og'
  return 'content'
}

function maxWidthFor(cat, meta) {
  if (cat === 'logo') return 640
  if (cat === 'og') return 1200
  return Math.min(meta.width || 1600, 1600)
}

async function optimizeFile(absPath) {
  const rel = '/' + path.relative(ROOT, absPath).replace(/\\/g, '/')
  const before = fs.statSync(absPath).size
  const meta = await sharp(absPath).metadata()
  const cat = category(absPath)
  const maxW = maxWidthFor(cat, meta)

  let pipeline = sharp(absPath)
  if (meta.width && meta.width > maxW) {
    pipeline = pipeline.resize(maxW, null, { withoutEnlargement: true, fit: 'inside' })
  }

  const ext = path.extname(absPath).toLowerCase()
  if (ext === '.webp') pipeline = pipeline.webp({ quality: 80, effort: 4 })
  else if (ext === '.jpg' || ext === '.jpeg') pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true })
  else if (ext === '.png') pipeline = pipeline.png({ compressionLevel: 9, palette: true })

  const buf = await pipeline.toBuffer()
  let after = before
  if (buf.length < before) {
    try {
      await sharp(buf).toFile(absPath)
      after = fs.statSync(absPath).size
    } catch (err) {
      console.warn(`  ⚠ no se pudo guardar ${rel}: ${err.code || err.message}`)
    }
  }

  const metaOut = await sharp(absPath).metadata()
  return {
    rel,
    before,
    after: fs.statSync(absPath).size,
    w: metaOut.width,
    h: metaOut.height,
  }
}

const files = walk(path.join(ROOT, 'assets'))
const manifest = {}
let saved = 0

for (const f of files) {
  const r = await optimizeFile(f)
  manifest[r.rel] = { w: r.w, h: r.h }
  const delta = r.before - r.after
  if (delta > 0) saved += delta
  const pct = r.before ? Math.round((1 - r.after / r.before) * 100) : 0
  console.log(`${r.rel}  ${Math.round(r.before / 1024)}KB → ${Math.round(r.after / 1024)}KB (${pct >= 0 ? '-' : '+'}${Math.abs(pct)}%)`)
}

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n')
console.log(`\n${files.length} imágenes · ahorro ~${Math.round(saved / 1024)} KB · manifest → assets/image-manifest.json`)
