import fs from 'fs';
import path from 'path';

const root = 'C:/Users/USUARIO/Documents/Proyectos/Adrián Márquez/Web Adrián Márquez/luisacorralcoach-web';

function walk(d, out = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (['node_modules', '.git'].includes(e.name)) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (p.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = walk(root);
const re = /(?:src|href)="(\/[^"#?]+\.(?:webp|jpg|jpeg|png|gif|js|css))(?:\?[^"]*)?"/g;
const missing = new Set();

for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = re.exec(c))) {
    const p = m[1];
    const full = path.join(root, p.replace(/^\//, '').replace(/\//g, path.sep));
    if (!fs.existsSync(full)) missing.add(path.relative(root, f) + ' -> ' + p);
  }
}

const list = [...missing];
console.log(list.slice(0, 50).join('\n'));
console.log('---');
console.log('Missing count:', list.length);

