import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://www.luisacorralcoach.com';
const EMAIL = 'luisacorralcoach@gmail.com';
const SITE_INIT = '<script type="module" src="/js/site-init.js"></script>';

const INIT_SNIPPET = `<script type="module">
  const boot = async () => {
    try {
      const { initCookieBanner } = await import('/js/modules/cookie-consent.js')
      initCookieBanner()
    } catch (_) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true })
  else boot()
</script>`;

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'scripts'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (e.name.endsWith('.html')) files.push(p);
  }
  return files;
}

function fixEmails(html) {
  let h = html;
  h = h.replace(/<script[^>]*LANDING_SITE[^<]*<\/script>\s*/gi, '');
  h = h.replace(/<script[^>]*email-decode[^<]*<\/script>\s*/gi, '');
  h = h.replace(/<script[^>]*kit\.fontawesome\.com[^<]*<\/script>\s*/gi, '');
  h = h.replace(
    /<a[^>]*href="\/cdn-cgi\/l\/email-protection"[^>]*>[^<]*<\/a>/gi,
    `<a href="mailto:${EMAIL}" class="hover:text-[#D4AF37] transition-colors">${EMAIL}</a>`
  );
  h = h.replace(
    /<span class="__cf_email__"[^>]*>[^<]*<\/span>/gi,
    `<a href="mailto:${EMAIL}" class="hover:text-[#D4AF37] transition-colors">${EMAIL}</a>`
  );
  h = h.replace(/hola@luisacorralcoach\.com/gi, EMAIL);
  h = h.replace(/\[email\s*protected\]/gi, EMAIL);
  h = h.replace(/\[email&#160;protected\]/gi, EMAIL);
  return h;
}

function ensureSiteInit(html) {
  if (html.includes('/js/site-init.js') || html.includes('initCookieBanner')) return html;
  if (html.includes('fontawesome-kit.js')) {
    return html.replace(
      /<script defer="" src="\/public\/fontawesome-kit\.js"/,
      INIT_SNIPPET + '\n<script defer="" src="/public/fontawesome-kit.js"'
    );
  }
  return html.replace('</body>', INIT_SNIPPET + '\n</body>');
}

function stripImageQuery(html) {
  return html.replace(/(\/assets\/[^"'\s?]+)\?w=\d+/g, '$1');
}

function absoluteMediaUrls(html) {
  let h = html;
  h = h.replace(/content="\/assets\//g, `content="${BASE}/assets/`);
  h = h.replace(/href="\/assets\/[^"]+\.webp"/g, (m) => {
    const p = m.match(/href="([^"]+)"/)[1];
    return `href="${BASE}${p}"`;
  });
  h = h.replace(/"image": "\/assets\//g, `"image": "${BASE}/assets/`);
  return h;
}

async function downloadAsset(relPath) {
  const clean = relPath.split('?')[0];
  const dest = path.join(ROOT, clean.replace(/^\//, ''));
  if (fs.existsSync(dest) && fs.statSync(dest).size > 500) return;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const urls = [
    BASE + clean,
    BASE + relPath,
    'https://luisacorralcoach.com' + clean,
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'finalize/1.0' } });
      if (res.ok) {
        fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
        console.log('  ✓', clean);
        return;
      }
    } catch { /* */ }
  }
  console.warn('  ⚠', clean);
}

async function downloadAllAssets(html) {
  const re = /\/assets\/[a-zA-Z0-9_./-]+\.(?:jpg|jpeg|png|webp|gif)(?:\?w=\d+)?/g;
  const found = new Set();
  let m;
  while ((m = re.exec(html))) found.add(m[0]);
  for (const p of found) await downloadAsset(p);
}

async function refetch404() {
  const res = await fetch(BASE + '/404', { headers: { 'User-Agent': 'finalize/1.0' } });
  let html = await res.text();
  html = fixEmails(html);
  html = html.replace(/https:\/\/www\.luisacorralcoach\.com/g, '');
  html = html.replace(/https:\/\/luisacorralcoach\.com/g, '');
  html = stripImageQuery(html);
  html = ensureSiteInit(html);
  if (!html.includes('main.umd.js')) {
    html = html.replace('<head>', '<head>\n    <script src="/public/main.umd.js" defer></script>');
  }
  fs.writeFileSync(path.join(ROOT, '404.html'), html);
  await downloadAllAssets(html);
  console.log('✓ 404.html regenerado');
}

async function main() {
  const files = walk(ROOT);
  let allHtml = '';

  for (const f of files) {
    let html = fs.readFileSync(f, 'utf8');
    html = fixEmails(html);
    html = stripImageQuery(html);
    html = absoluteMediaUrls(html);
    html = ensureSiteInit(html);
    fs.writeFileSync(f, html);
    allHtml += html;
    console.log('✓', path.relative(ROOT, f));
  }

  console.log('\nDescargando assets /assets/...');
  await downloadAllAssets(allHtml);

  await refetch404();

  // Segunda pasada imagedelivery en HTML
  const { execSync } = await import('child_process');
  try {
    execSync('node scripts/rewrite-assets.mjs', { cwd: ROOT, stdio: 'inherit' });
  } catch (e) {
    console.warn('rewrite-assets:', e.message);
  }
}

main();
