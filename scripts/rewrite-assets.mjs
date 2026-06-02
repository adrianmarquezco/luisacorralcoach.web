import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://www.luisacorralcoach.com';

const urlMap = new Map();

function localPathFor(url) {
  if (urlMap.has(url)) return urlMap.get(url);
  try {
    const u = new URL(url);
    if (u.hostname === 'imagedelivery.net') {
      const parts = u.pathname.split('/').filter(Boolean);
      const variant = parts[parts.length - 1] || 'public';
      const id = parts.slice(0, -1).join('-') || crypto.createHash('md5').update(url).digest('hex').slice(0, 12);
      const local = `/assets/images/cf/${id}-${variant}.webp`;
      urlMap.set(url, local);
      return local;
    }
    if (u.hostname.includes('luisacorralcoach.com')) {
      const p = u.pathname.replace(/^\//, '');
      if (p.startsWith('assets/')) {
        const local = '/' + p.split('?')[0];
        urlMap.set(url, local);
        return local;
      }
    }
  } catch { /* */ }
  return null;
}

async function download(url, localRel) {
  const dest = path.join(ROOT, localRel.replace(/^\//, ''));
  if (fs.existsSync(dest) && fs.statSync(dest).size > 100) return;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const tryUrls = [url];
  if (url.includes('publicContain')) tryUrls.push(url.replace('publicContain', 'public'));
  for (const u of tryUrls) {
    try {
      const res = await fetch(u, { headers: { 'User-Agent': 'migration/1.0' } });
      if (res.ok) {
        fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
        console.log('  ✓', localRel);
        return;
      }
    } catch { /* */ }
  }
  console.warn('  ⚠', url);
}

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.name === 'node_modules' || e.name === 'scripts') continue;
    if (e.isDirectory()) walk(p, files);
    else if (e.name.endsWith('.html')) files.push(p);
  }
  return files;
}

async function main() {
  const files = walk(ROOT);
  const allUrls = new Set();

  for (const f of files) {
    const html = fs.readFileSync(f, 'utf8');
    const re = /https:\/\/(?:imagedelivery\.net\/[^\s"'<>]+|(?:www\.)?luisacorralcoach\.com\/assets\/[^\s"'<>]+)/g;
    let m;
    while ((m = re.exec(html))) allUrls.add(m[0].replace(/&amp;/g, '&'));
  }

  console.log(`Descargando ${allUrls.size} assets...`);
  for (const url of allUrls) {
    const local = localPathFor(url);
    if (local) await download(url, local);
  }

  for (const f of files) {
    let html = fs.readFileSync(f, 'utf8');
    let changed = false;
    for (const [remote, local] of urlMap) {
      if (html.includes(remote)) {
        html = html.split(remote).join(local);
        changed = true;
      }
    }
  html = html.replace(/https:\/\/imagedelivery\.net\/[^\s"'<>]+/g, (match) => {
      const local = localPathFor(match);
      if (local) {
        changed = true;
        return local;
      }
      return match;
    });
    html = html.replace(/https:\/\/(?:www\.)?luisacorralcoach\.com\/assets\/[^\s"'<>]+/g, (match) => {
      const local = localPathFor(match.split('?')[0]);
      if (local) {
        changed = true;
        return local;
      }
      return match;
    });
    if (changed) {
      fs.writeFileSync(f, html);
      console.log('Updated', path.relative(ROOT, f));
    }
  }
}

main();
