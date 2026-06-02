/**
 * Migración Landingsite → estático (Coolify/nginx)
 * Uso: npm install && npm run migrate
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://www.luisacorralcoach.com';
const FORMSPREE_ACTION = 'https://formspree.io/f/mvzyroqk';

const SKIP_PATHS = new Set(['/404', '/que-es-coach-holistico']);

const PATHS = [
  '/',
  '/sobre-mi',
  '/testimonios',
  '/blog',
  '/contacto',
  '/coaching-holistico',
  '/flores-de-bach',
  '/meditaciones-personalizadas',
  '/coaching-angelical',
  '/reiki-delfin',
  '/llms',
  '/aviso-legal',
  '/politica-de-privacidad',
  '/politica-de-cookies',
  '/blog/en-que-me-puede-ayudar-un-coach-holistico',
  '/blog/tecnicas-mindfulness-reducir-estres',
  '/blog/que-es-coaching-angelical',
  '/blog/reiki-delfin-sanacion-energia-delfines',
  '/blog/encontrar-proposito-vida-40',
  '/blog/que-son-las-flores-de-bach',
  '/blog/coaching-holistico-beneficios-enfoque-integral',
  '/blog/flores-de-bach-para-la-ansiedad',
  '/blog/que-es-coach-holistico',
];

const CONTENT_FIXES = [
  ['tepat untuk ti', 'adecuadas para ti'],
  ['чувство долга', 'sentimiento de deber'],
  ['tusemociones', 'tus emociones'],
  ['trabalhamos', 'trabajamos'],
  ['dreams y hopes', 'sueños y esperanzas'],
  ['especializá en', 'especializada en'],
  ['joyful y liberadora', 'alegre y liberadora'],
];

const urlToLocalPath = new Map();
const downloaded = new Set();

function hashUrl(url) {
  return crypto.createHash('md5').update(url).digest('hex').slice(0, 12);
}

function sanitizePathSegment(s) {
  return s.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function resolveAssetLocalUrl(absoluteUrl) {
  if (urlToLocalPath.has(absoluteUrl)) return urlToLocalPath.get(absoluteUrl);

  let local;
  try {
    const u = new URL(absoluteUrl);
    if (u.hostname === 'imagedelivery.net') {
      const parts = u.pathname.split('/').filter(Boolean);
      const id = parts.slice(0, 2).join('-') || hashUrl(absoluteUrl);
      const ext = path.extname(u.pathname) || '.webp';
      local = `/assets/images/cf/${sanitizePathSegment(id)}${ext.includes('.') ? ext : '.webp'}`;
    } else if (u.hostname.includes('luisacorralcoach.com')) {
      const p = u.pathname.replace(/^\//, '');
      if (p.startsWith('assets/')) local = `/${p}`;
      else if (p.startsWith('public/')) local = `/${p}`;
      else local = `/assets/mirror/${sanitizePathSegment(p || 'root')}${path.extname(p) || '.bin'}`;
    } else if (u.hostname === 'kit.fontawesome.com') {
      local = '/public/fontawesome-kit.js';
    } else {
      return absoluteUrl;
    }
  } catch {
    return absoluteUrl;
  }

  urlToLocalPath.set(absoluteUrl, local);
  return local;
}

async function downloadFile(absoluteUrl, localRel) {
  const key = absoluteUrl + ' -> ' + localRel;
  if (downloaded.has(key)) return;
  downloaded.add(key);

  const dest = path.join(ROOT, localRel.replace(/^\//, ''));
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  try {
    const res = await fetch(absoluteUrl, {
      headers: { 'User-Agent': 'luisacorralcoach-migration/1.0' },
      redirect: 'follow',
    });
    if (!res.ok) {
      console.warn(`  ⚠ ${res.status} ${absoluteUrl}`);
      return;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`  ✓ ${localRel}`);
  } catch (e) {
    console.warn(`  ⚠ ${absoluteUrl}: ${e.message}`);
  }
}

async function downloadAsset(absoluteUrl) {
  if (!absoluteUrl || absoluteUrl.startsWith('data:')) return absoluteUrl;
  if (absoluteUrl.startsWith('//')) absoluteUrl = 'https:' + absoluteUrl;

  if (
    !absoluteUrl.includes('luisacorralcoach.com') &&
    !absoluteUrl.includes('imagedelivery.net') &&
    !absoluteUrl.includes('kit.fontawesome.com')
  ) {
    return absoluteUrl;
  }

  const local = resolveAssetLocalUrl(absoluteUrl);
  if (local === absoluteUrl) return absoluteUrl;
  await downloadFile(absoluteUrl, local);
  return local;
}

function applyContentFixes(html) {
  let out = html;
  for (const [from, to] of CONTENT_FIXES) {
    out = out.split(from).join(to);
  }
  return out;
}

function processHtml(html, pagePath) {
  let out = applyContentFixes(html);

  out = out.replace(/<script>window\.LANDING_SITE_ID[^<]*<\/script>\s*/gi, '');
  out = out.replace(/<script>window\.LANDING_SITE_CONTACT_US_URL[^<]*<\/script>\s*/gi, '');
  out = out.replace(/<script>window\.LANDING_SITE_PREVIEW[^<]*<\/script>\s*/gi, '');
  out = out.replace(/<script[^>]*cloudflare-static\/email-decode[^<]*<\/script>\s*/gi, '');

  const $ = cheerio.load(out, { decodeEntities: false });

  $('script[src], link[href], img[src], source[srcset], a[href]').each((_, el) => {
    const tag = el.tagName;
    const attr = tag === 'link' ? 'href' : tag === 'a' ? 'href' : 'src';
    if (tag === 'source' && el.attribs.srcset) {
      /* skip */
    }
  });

  const attrs = [
    ['img', 'src'],
    ['link[rel="icon"]', 'href'],
    ['link[rel="apple-touch-icon"]', 'href'],
    ['link[rel="preload"]', 'href'],
    ['script[src]', 'src'],
    ['a[href]', 'href'],
  ];

  $('img').each((_, el) => {
    const src = $(el).attr('src');
    if (src && !src.startsWith('data:')) {
      let abs = src.startsWith('http') ? src : BASE + (src.startsWith('/') ? src : '/' + src);
      resolveAssetLocalUrl(abs);
    }
  });

  $('script[src]').each((_, el) => {
    const src = $(el).attr('src');
    if (!src) return;
    if (src.includes('kit.fontawesome.com')) {
      $(el).attr('src', '/public/fontawesome-kit.js');
      return;
    }
    if (src.startsWith('/')) {
      $(el).attr('src', src);
    }
  });

  $('link[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    if (href.includes('fonts.googleapis.com') || href.includes('fonts.gstatic.com')) return;
    if (href.startsWith('https://www.luisacorralcoach.com') || href.startsWith('https://luisacorralcoach.com')) {
      $(el).attr('href', href.replace(/https:\/\/(www\.)?luisacorralcoach\.com/, '') || '/');
    }
  });

  $('a[href]').each((_, el) => {
    let href = $(el).attr('href');
    if (!href) return;
    if (href.includes('luisacorralcoach.com')) {
      href = href.replace(/https:\/\/(www\.)?luisacorralcoach\.com/, '') || '/';
      $(el).attr('href', href);
    }
  });

  $('[data-landingsite-contact-form]').each((_, form) => {
    const $f = $(form);
    $f.removeAttr('data-landingsite-contact-form');
    $f.removeAttr('data-landingsite-success-redirect');
    $f.attr('action', FORMSPREE_ACTION);
    $f.attr('method', 'POST');
    if (!$f.find('input[name="_subject"]').length) {
      $f.prepend('<input type="hidden" name="_subject" value="Nueva solicitud — Luisa Corral Coach">');
    }
    if (!$f.find('input[name="_next"]').length) {
      const thanks = pagePath === '/' ? '/contacto?enviado=1' : pagePath + '?enviado=1';
      $f.append(`<input type="hidden" name="_next" value="${thanks}">`);
    }
  });

  $('form').each((_, form) => {
    const $f = $(form);
    if ($f.attr('action')?.includes('formspree') || $f.find('input[type="email"][placeholder*="correo"]').length) {
      if (!$f.attr('action') || $f.attr('action') === '#') {
        $f.attr('action', FORMSPREE_ACTION);
        $f.attr('method', 'POST');
      }
    }
  });

  let result = $.html();
  result = result.replace(/https:\/\/www\.luisacorralcoach\.com/g, '');
  result = result.replace(/https:\/\/luisacorralcoach\.com/g, '');

  return result;
}

function outPathForRoute(route) {
  if (route === '/') return path.join(ROOT, 'index.html');
  const clean = route.replace(/^\//, '').replace(/\/$/, '');
  return path.join(ROOT, clean, 'index.html');
}

async function fetchPage(route) {
  const url = BASE + (route === '/' ? '/' : route);
  const res = await fetch(url, {
    headers: { 'User-Agent': 'luisacorralcoach-migration/1.0' },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function collectAndDownloadAssetsFromHtml(html) {
  const $ = cheerio.load(html);
  const urls = new Set();

  $('img[src]').each((_, el) => {
    let s = $(el).attr('src');
    if (!s || s.startsWith('data:')) return;
    if (!s.startsWith('http')) s = BASE + (s.startsWith('/') ? s : '/' + s);
    urls.add(s);
  });

  $('link[href][rel="icon"], link[href][rel="apple-touch-icon"], link[href][rel="preload"][as="image"]').each((_, el) => {
    let h = $(el).attr('href');
    if (!h?.startsWith('http')) h = BASE + (h.startsWith('/') ? h : '/' + h);
    if (h) urls.add(h);
  });

  for (const u of urls) {
    const local = resolveAssetLocalUrl(u);
    if (local !== u) await downloadFile(u, local);
  }
}

async function migrateStaticAssets() {
  const staticFiles = [
    ['/public/main.umd.js', '/public/main.umd.js'],
    ['/js/modules/cookie-consent.js', '/js/modules/cookie-consent.js'],
  ];

  for (const [remote, local] of staticFiles) {
    await downloadFile(BASE + remote, local);
  }

  try {
    await downloadFile('https://kit.fontawesome.com/8e98006f77.js', '/public/fontawesome-kit.js');
  } catch {
    console.warn('Font Awesome kit no descargado — revisar iconos');
  }
}

async function buildSitemap() {
  const urls = PATHS.filter((p) => !SKIP_PATHS.has(p)).map((p) => {
    const loc = p === '/' ? BASE + '/' : BASE + p;
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n  </url>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
}

async function buildRobots() {
  const txt = `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`;
  fs.writeFileSync(path.join(ROOT, 'robots.txt'), txt);
}

async function buildLlmsTxt() {
  const txt = `# Luisa Corral — Coach Holística\n\n> Coach holística y terapéutica en Narón, Galicia. Sesiones online en España y Latinoamérica.\n\n## Páginas principales\n\n- ${BASE}/\n- ${BASE}/sobre-mi\n- ${BASE}/flores-de-bach\n- ${BASE}/coaching-holistico\n- ${BASE}/contacto\n- ${BASE}/blog\n- ${BASE}/llms\n`;
  fs.writeFileSync(path.join(ROOT, 'llms.txt'), txt);
}

async function main() {
  console.log('Migración luisacorralcoach.com →', ROOT);
  fs.mkdirSync(ROOT, { recursive: true });

  await migrateStaticAssets();

  for (const route of PATHS) {
    if (SKIP_PATHS.has(route)) {
      console.log(`⏭ Omitida (redirect): ${route}`);
      continue;
    }
    console.log(`\n📄 ${route}`);
    const html = await fetchPage(route);
    await collectAndDownloadAssetsFromHtml(html);
    const processed = processHtml(html, route);
    const out = outPathForRoute(route);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, processed);

    const $ = cheerio.load(processed);
    $('img[src]').each((_, el) => {
      const src = $(el).attr('src');
      if (src?.startsWith('/assets/')) return;
      if (src && !src.startsWith('http') && !src.startsWith('data:')) return;
      if (src?.startsWith('http')) {
        const local = urlToLocalPath.get(src);
        if (local) $(el).attr('src', local);
      }
    });
    fs.writeFileSync(out, $.html());
  }

  console.log('\n📄 /404 → 404.html');
  const html404 = applyContentFixes(await fetchPage('/404'));
  fs.writeFileSync(path.join(ROOT, '404.html'), html404.replace(/https:\/\/www\.luisacorralcoach\.com/g, ''));

  await buildSitemap();
  await buildRobots();
  await buildLlmsTxt();

  fs.writeFileSync(
    path.join(ROOT, 'FORMSPREE.md'),
    `# Configurar Formspree\n\n1. Crea un formulario en https://formspree.io\n2. ID actual: mvzyroqk\n3. Si cambias el formulario más adelante, reemplaza mvzyroqk en los HTML por el nuevo ID\n\nURL actual: ${FORMSPREE_ACTION}\n`
  );

  console.log('\n✅ Migración terminada. Revisa FORMSPREE.md y ejecuta npm run migrate de nuevo si añades páginas.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
