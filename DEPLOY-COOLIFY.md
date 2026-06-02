# Despliegue Coolify — paso a paso

## 1. GitHub

```bash
cd "C:\Users\USUARIO\Documents\Proyectos\Adrián Márquez\Web Adrián Márquez\luisacorralcoach-web"
git init
git add .
git commit -m "Migración desde Landingsite: web estática para Coolify"
git remote add origin https://github.com/TU_USUARIO/luisacorralcoach-web.git
git push -u origin main
```

## 2. Coolify

- **New Resource** → Application → GitHub → repo `luisacorralcoach-web`
- Build pack: **Dockerfile** (raíz del repo)
- Puerto contenedor: **80**
- Dominios: `luisacorralcoach.com`, `www.luisacorralcoach.com`
- HTTPS: activar Let's Encrypt

## 3. DNS (panel Landingsite del dominio)

Antes: **Disconnect** dominio de la web Landingsite.

| Tipo | Host | Valor |
|------|------|--------|
| A | `@` | IP del VPS (la que muestra Coolify) |
| CNAME | `www` | según Coolify o A a la misma IP |

No borrar el CNAME de verificación de Google (`yibtpuknfv7b...`).

## 4. Comprobar

- https://www.luisacorralcoach.com/
- https://www.luisacorralcoach.com/flores-de-bach
- https://www.luisacorralcoach.com/blog/que-es-coach-holistico
- Formulario (tras configurar Formspree)
- https://www.luisacorralcoach.com/que-es-coach-holistico → debe ir al blog (301)

## 5. Cancelar Landingsite

Solo cuando la web en Coolify funcione con SSL.
