#!/usr/bin/env node
// Notifica a IndexNow (protocolo adoptado por Bing, Yandex, Naver, Seznam.cz)
// que las URLs del sitemap han cambiado, para acelerar su rastreo.
//
// Este repo no tiene CI que despliegue automáticamente (Coolify se dispara a mano),
// así que este script se ejecuta a mano después de cada despliegue real:
//
//   node scripts/indexnow-submit.mjs
//
// Para notificar solo algunas URLs en vez de todo el sitemap:
//
//   node scripts/indexnow-submit.mjs /blog/un-articulo /coaching-holistico
//
// La clave vive en el archivo <clave>.txt de la raíz del sitio (IndexNow la lee
// de ahí para verificar que quien notifica es el propietario real del dominio).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const HOST = "www.luisacorralcoach.com";
const KEY = "c31b0d69bd09bb014bb00c1ddc263d88";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

function urlsFromSitemap() {
  const xml = fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf-8");
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (urls.length === 0) {
    throw new Error("sitemap.xml no contiene ninguna <loc>; revisa la ruta/el archivo.");
  }
  return urls;
}

const args = process.argv.slice(2);
const urlList = args.length
  ? args.map((p) => (p.startsWith("http") ? p : `https://${HOST}${p.startsWith("/") ? p : `/${p}`}`))
  : urlsFromSitemap();

console.log(`Enviando ${urlList.length} URL(s) a IndexNow...`);

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  }),
});

const body = await res.text();
console.log(`HTTP ${res.status}${body ? `: ${body}` : ""}`);

if (res.status !== 200 && res.status !== 202) {
  console.error(
    "IndexNow no aceptó el envío. Códigos esperados: 200/202 (recibido), " +
      "400 (petición mal formada), 403 (clave inválida o no publicada), " +
      "422 (las URLs no pertenecen al host o la clave no coincide), " +
      "429 (demasiadas peticiones)."
  );
  process.exit(1);
}
