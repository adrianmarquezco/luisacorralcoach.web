# luisacorralcoach-web

Web estática de [luisacorralcoach.com](https://www.luisacorralcoach.com) — migrada desde Landingsite.ai para despliegue en Coolify (VPS).

## Estructura

- Páginas en carpetas con `index.html` (URLs limpias: `/flores-de-bach`, `/blog/...`)
- `nginx.conf` + `Dockerfile` para Coolify
- Assets en `/assets/` (imágenes descargadas del sitio en vivo)
- Formularios: **Formspree** (configurar ID)

## Formspree

1. Crear formulario en [formspree.io](https://formspree.io) → email `luisacorralcoach@gmail.com`
2. Buscar y reemplazar en todo el proyecto: `mvzyroqk` por tu nuevo ID (cuando lo cambies)
3. URL actual: `https://formspree.io/f/mvzyroqk`

## Desarrollo local

```bash
npx serve .
# o: docker build -t luisa-web . && docker run -p 8080:80 luisa-web
```

## Coolify

1. Nuevo recurso → **Dockerfile** (repo GitHub)
2. Puerto **80**
3. Dominio: `luisacorralcoach.com` + `www.luisacorralcoach.com`
4. Activar HTTPS (Let's Encrypt)

## DNS (salir de Landingsite)

En el panel del dominio (Landingsite → DNS), **después** de desconectar la web:

| Tipo | Nombre | Valor |
|------|--------|--------|
| A | `@` | IP pública de tu VPS Coolify |
| CNAME | `www` | dominio que asigne Coolify o misma IP vía A |

**Mantener** el CNAME de Google Search Console (`yibtpuknfv7b...` → `gv-...googlehosted.com`).

Pasos Landingsite:

1. Dominio → **Disconnect** de la web
2. Cambiar registros A y www (ya no `proxy-ssl.getlandingsite.com`)
3. Cuando Coolify sirva la web con SSL, cancelar plan Landingsite

## Regenerar desde Landingsite (solo si aún está online)

```bash
npm install
npm run build
```

## URLs

- `/que-es-coach-holistico` → 301 a `/blog/que-es-coach-holistico` (nginx)
- `404.html` para errores
- `sitemap.xml`, `robots.txt`, `llms.txt`
