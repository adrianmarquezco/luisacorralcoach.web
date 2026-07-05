# luisacorralcoach.es

Web de Luisa Corral — coach holística, flores de Bach, reiki y coaching angelical.

## Stack

| | |
|---|---|
| **Tecnología** | HTML + CSS + JavaScript puro |
| **Estilos** | Tailwind CSS inlineado en cada `<head>` (CSS compilado, sin build en prod) |
| **Fuentes** | Outfit (headings) + Nunito Sans (body) vía Google Fonts |
| **Iconos** | FontAwesome vía kit JS |
| **Formularios** | Formspree (`mvzyroqk`) |
| **Despliegue** | Coolify (auto-deploy en push a `main`) |
| **Repo** | github.com/adrianmarquezco/luisacorralcoach.web |

## Servicios externos

| Servicio | Uso |
|---|---|
| Formspree | Recepción de emails del formulario de contacto |
| Coolify | Hosting en VPS |

## Paleta de colores

- Fondo: `#FAF7FC` / `#F0EAF7`
- Primario púrpura: `#9B7EBD`
- Acento dorado: `#D4AF37`
- Footer oscuro: `#2D1B3D`

## Estructura

Cada página = carpeta con `index.html` dentro (URLs limpias).

```
/                           home
/sobre-mi
/flores-de-bach
/coaching-holistico
/meditaciones-personalizadas
/coaching-angelical
/reiki-delfin
/enfoques/                  índice + 5 sub-páginas
/testimonios
/blog/                      10+ artículos
/contacto
```

## Despliegue

```
editar en local → git push → Coolify despliega automáticamente
```

Al crear una página nueva: copiar `<head>` de otra página, añadir el enlace en nav y footer de **todas** las páginas existentes, y actualizar `sitemap.xml`.
