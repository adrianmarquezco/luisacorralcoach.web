export const BASE = 'https://www.luisacorralcoach.com'
export const BUSINESS_ID = `${BASE}/#business`
export const LOGO_URL = `${BASE}/assets/uploads/b3f76780-ddae-46b6-b492-f8eaf4baab97/7cec306b-129e-4df9-bd7e-4bd3b2f7e77d.webp`

export const ORG_PUBLISHER = {
  '@type': 'Organization',
  name: 'Luisa Corral - Coach Holística',
  url: `${BASE}/`,
  logo: { '@type': 'ImageObject', url: LOGO_URL },
}

export const POSTAL_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: 'Comarca de Ferrolterra',
  addressLocality: 'Narón',
  addressRegion: 'A Coruña',
  postalCode: '15570',
  addressCountry: 'ES',
}

export const BUSINESS_PROVIDER = { '@id': BUSINESS_ID }

export const LOCAL_LINE =
  'Sesiones presenciales en Narón (comarca de Ferrolterra, A Coruña) y online para España y Latinoamérica.'

export function directAnswerBlock(text) {
  return `<div class="seo-direct-answer mb-8 p-6 bg-[#F0EAF7] rounded-2xl border border-[#E5D9F2]" role="note">
  <p class="text-[#2D1B3D] font-semibold mb-2">En resumen</p>
  <p class="text-[#6B5B7A] leading-relaxed">${text}</p>
</div>`
}

export function breadcrumbNav(items, light = false) {
  const li = items
    .map((item, i) => {
      const isLast = i === items.length - 1
      if (isLast) {
        return `<li class="${light ? 'text-white/90' : 'text-[#9B7EBD]'} font-medium">${item.name}</li>`
      }
      return `<li><a href="${item.href}" class="hover:text-[#9B7EBD]">${item.name}</a></li><li><span>/</span></li>`
    })
    .join('')
  const cls = light ? 'site-breadcrumb site-breadcrumb--light mb-6' : 'site-breadcrumb mb-8'
  return `<nav class="${cls}" aria-label="Breadcrumb">
  <ol class="flex items-center gap-2 text-sm text-[#6B5B7A] flex-wrap">${li}</ol>
</nav>`
}

export const PAGE_META = {
  'index.html': {
    title: 'Coach Holística Online | Flores de Bach y Reiki · Luisa Corral',
    description:
      'Luisa Corral, coach holística en Narón (Ferrolterra, A Coruña). Coaching, Flores de Bach, meditaciones y Reiki online para España.',
    aiDescription:
      'Luisa Corral es coach holística en Narón (Ferrolterra, A Coruña): coaching holístico, Flores de Bach, meditaciones personalizadas y Reiki Delfín. Sesiones online en España y Latinoamérica y presenciales en Galicia. Más de 8 años acompañando a mujeres en transformación emocional.',
    directAnswer:
      'Luisa Corral es coach holística en Narón (Ferrolterra, A Coruña) con sesiones online en España y presenciales en Galicia. Ofrece coaching holístico, Flores de Bach, meditaciones a medida y Reiki Delfín desde 50€/sesión.',
  },
  'sobre-mi/index.html': {
    title: 'Luisa Corral | Coach Holística Certificada · Narón',
    description:
      'Coach holística con +8 años en Narón y Ferrolterra (A Coruña). Flores de Bach, coaching angelical, mindfulness y Reiki. Sesiones online.',
    aiDescription:
      'Biografía de Luisa Corral: coach holística certificada en Narón (A Coruña), +8 años de experiencia en Flores de Bach (Dr. Bach), coaching holístico, angelical, meditaciones y Reiki Delfín. Atiende en Ferrolterra y online.',
    directAnswer:
      'Luisa Corral es coach holística certificada con más de 8 años de experiencia en Narón (comarca de Ferrolterra, A Coruña). Combina coaching integral, Flores de Bach y técnicas de bienestar emocional en sesiones presenciales y online.',
  },
  'contacto/index.html': {
    title: 'Contacto Coach Holística | Narón y Online · Luisa',
    description:
      'Reserva sesión con Luisa Corral: WhatsApp +34 616 054 001. Coach holística en Narón, Ferrolterra y online para España.',
    aiDescription:
      'Contacto con Luisa Corral (coach holística en Narón, A Coruña): WhatsApp +34 616 054 001, email luisacorralcoach@gmail.com y formulario web. Reserva coaching, Flores de Bach o Reiki online o presencial en Ferrolterra.',
    directAnswer:
      'Puedes reservar con Luisa Corral por WhatsApp (+34 616 054 001), email o formulario en esta página. Atiende en Narón (Ferrolterra, A Coruña) y por videollamada para toda España y Latinoamérica.',
  },
  'coaching-holistico/index.html': {
    title: 'Coaching Holístico Online España | Luisa Corral',
    description:
      'Coaching holístico online desde 50€ con Luisa Corral. Ansiedad, bloqueos y objetivos. Narón, Ferrolterra y toda España.',
    aiDescription:
      'Coaching holístico online y presencial con Luisa Corral en Narón (A Coruña): acompañamiento integral para ansiedad, bloqueos y decisiones vitales. Sesión desde 50€; packs de 4 y 8 sesiones.',
    directAnswer:
      'El coaching holístico con Luisa Corral trabaja cuerpo, mente, emociones y espíritu en sesiones de 60–90 min (desde 50€). Disponible online en España y presencial en Narón (Ferrolterra, A Coruña).',
  },
  'flores-de-bach/index.html': {
    title: 'Flores de Bach Online | Terapia Floral · Luisa Corral',
    description:
      'Terapia floral Bach personalizada online. Ansiedad, miedos y estrés. Luisa Corral en Narón y España.',
    aiDescription:
      'Terapia con Flores de Bach (38 esencias del Dr. Edward Bach) con Luisa Corral en Narón y online: fórmula personalizada para ansiedad, miedos y desequilibrio emocional. Consulta desde 50€.',
    directAnswer:
      'Las Flores de Bach son remedios florales del Dr. Bach que equilibran estados emocionales. Luisa Corral prepara tu mezcla personalizada en sesión online o en Narón (Ferrolterra, A Coruña), desde 50€.',
  },
  'meditaciones-personalizadas/index.html': {
    title: 'Meditaciones Personalizadas Online | Luisa Corral',
    description:
      'Meditaciones guiadas a medida para dormir, ansiedad o energía. Luisa Corral, Narón y online España.',
    aiDescription:
      'Meditaciones personalizadas grabadas para ti por Luisa Corral: calma, sueño, ansiedad o enfoque según tu proceso. Sesión de diseño online o presencial en Narón (Galicia).',
    directAnswer:
      'Recibes una meditación guiada creada para tu situación (insomnio, ansiedad, inicio del día, etc.). Luisa Corral las diseña tras una sesión en Narón (Ferrolterra, A Coruña) o por videollamada para España y Latinoamérica.',
  },
  'coaching-angelical/index.html': {
    title: 'Coaching Angelical Online | Luisa Corral',
    description:
      'Coaching angelical con conexión a guía interior y arcángeles. Luisa Corral, Narón y online España.',
    aiDescription:
      'Coaching angelical con Luisa Corral: sesiones de conexión con guía espiritual y arcángeles para claridad y sanación emocional. Online y presencial en Narón (A Coruña).',
    directAnswer:
      'El coaching angelical ayuda a recibir orientación espiritual y tomar decisiones con calma. Luisa Corral facilita el proceso en sesiones online o en Narón (Ferrolterra, A Coruña).',
  },
  'reiki-delfin/index.html': {
    title: 'Reiki Delfín Online | Sanación Energética · Luisa',
    description:
      'Reiki Delfín para liberar bloqueos emocionales. Luisa Corral en Narón, Ferrolterra y online.',
    aiDescription:
      'Reiki Delfín con Luisa Corral: sanación energética inspirada en la energía del delfín para liberar emociones atrapadas. Sesiones en Narón (Galicia) y online.',
    directAnswer:
      'El Reiki Delfín es una sanación energética para soltar cargas emocionales y recuperar vitalidad. Luisa Corral ofrece sesiones presenciales en Narón y online para España.',
  },
  'blog/index.html': {
    aiDescription:
      'Blog de bienestar holístico de Luisa Corral: artículos sobre coaching, Flores de Bach, mindfulness, propósito vital y Reiki. Coach en Narón (A Coruña).',
    directAnswer:
      'Artículos educativos de Luisa Corral, coach holística en Narón, sobre coaching integral, terapia floral Bach, ansiedad, propósito y técnicas de calma mental.',
  },
  'blog/que-es-coach-holistico/index.html': {
    title: '¿Qué es un Coach Holístico? | Guía · Luisa Corral',
    aiDescription:
      'Artículo: qué es un coach holístico, cómo trabaja cuerpo-mente-emoción-espíritu y cuándo pedir sesión. Por Luisa Corral, coach en Narón y online.',
    directAnswer:
      'Un coach holístico acompaña tu cambio desde todas las dimensiones del ser (no solo metas laborales). Luisa Corral explica el método y ofrece sesiones online y en Narón (A Coruña).',
    breadcrumb: [
      { href: '/', name: 'Inicio' },
      { href: '/blog', name: 'Blog' },
      { name: '¿Qué es un coach holístico?' },
    ],
  },
  'blog/en-que-me-puede-ayudar-un-coach-holistico/index.html': {
    title: '¿En qué ayuda un coach holístico? | Luisa Corral',
    aiDescription:
      'Qué trabaja un coach holístico en sesión: estrés, autoestima, transiciones y propósito. Luisa Corral, Narón y online.',
    directAnswer:
      'Un coach holístico ayuda con gestión emocional, decisiones, bloqueos y equilibrio vital mediante conversación y herramientas prácticas. Luisa Corral atiende en España y Latinoamérica online.',
    breadcrumb: [
      { href: '/', name: 'Inicio' },
      { href: '/blog', name: 'Blog' },
      { name: '¿En qué me puede ayudar?' },
    ],
  },
  'blog/coaching-holistico-beneficios-enfoque-integral/index.html': {
    title: 'Beneficios del Coaching Holístico | Guía 2026',
    aiDescription:
      'Beneficios del coaching holístico: menos estrés, más claridad y cambios sostenibles. Guía de Luisa Corral, coach en Galicia y online.',
    directAnswer:
      'El coaching holístico reduce estrés, mejora autoconocimiento y alinea decisiones con tus valores. Luisa Corral detalla beneficios y cómo reservar sesión en Narón o online.',
    breadcrumb: [
      { href: '/', name: 'Inicio' },
      { href: '/blog', name: 'Blog' },
      { name: 'Beneficios coaching holístico' },
    ],
  },
  'blog/que-son-las-flores-de-bach/index.html': {
    title: 'Qué son las Flores de Bach | Luisa Corral',
    aiDescription:
      'Qué son las Flores de Bach del Dr. Edward Bach, cómo se usan y para qué estados emocionales. Por Luisa Corral, terapeuta floral en A Coruña.',
    directAnswer:
      'Las Flores de Bach son 38 esencias naturales que equilibran emociones (miedo, ansiedad, agotamiento). Luisa Corral personaliza tu tratamiento en consulta online o en Narón.',
    breadcrumb: [
      { href: '/', name: 'Inicio' },
      { href: '/blog', name: 'Blog' },
      { name: 'Qué son las Flores de Bach' },
    ],
  },
  'blog/flores-de-bach-para-la-ansiedad/index.html': {
    title: 'Flores de Bach para la Ansiedad | Guía 2026',
    aiDescription:
      'Flores de Bach recomendadas para ansiedad (Mimulus, Aspen, Rock Rose…). Guía de Luisa Corral, coach y terapeuta floral en España.',
    directAnswer:
      'Varias esencias Bach apoyan la ansiedad según el tipo de miedo o tensión. Luisa Corral indica cuáles valorar y ofrece fórmulas personalizadas en sesión.',
    breadcrumb: [
      { href: '/', name: 'Inicio' },
      { href: '/blog', name: 'Blog' },
      { name: 'Flores de Bach ansiedad' },
    ],
  },
  'blog/que-es-coaching-angelical/index.html': {
    title: 'Coaching angelical: qué es | Luisa Corral',
    aiDescription:
      'Qué es el coaching angelical, cómo funciona la conexión con guía angelical y para quién es. Luisa Corral, Narón y online.',
    directAnswer:
      'El coaching angelical combina conversación terapéutica y conexión con energía angelical para claridad y paz. Luisa Corral explica el proceso y cómo reservar.',
    breadcrumb: [
      { href: '/', name: 'Inicio' },
      { href: '/blog', name: 'Blog' },
      { name: 'Coaching angelical' },
    ],
  },
  'blog/reiki-delfin-sanacion-energia-delfines/index.html': {
    title: 'Reiki Delfín: qué es | Luisa Corral',
    aiDescription:
      'Reiki Delfín: sanación con energía del delfín, beneficios y qué esperar en sesión. Por Luisa Corral en Galicia y online.',
    directAnswer:
      'El Reiki Delfín libera bloqueos emocionales usando la vibración simbólica del delfín. Luisa Corral describe la experiencia y ofrece sesiones en Narón y videollamada.',
    breadcrumb: [
      { href: '/', name: 'Inicio' },
      { href: '/blog', name: 'Blog' },
      { name: 'Reiki Delfín' },
    ],
  },
  'blog/tecnicas-mindfulness-reducir-estres/index.html': {
    title: '5 técnicas mindfulness antiestrés | Luisa Corral',
    aiDescription:
      'Cinco técnicas de mindfulness para bajar el estrés en casa. Artículo de Luisa Corral, coach holística en A Coruña.',
    directAnswer:
      'Mindfulness reduce estrés con respiración, body scan y pausas conscientes. Luisa Corral comparte 5 técnicas y ofrece meditaciones personalizadas si necesitas guía.',
    breadcrumb: [
      { href: '/', name: 'Inicio' },
      { href: '/blog', name: 'Blog' },
      { name: 'Mindfulness y estrés' },
    ],
  },
  'aviso-legal/index.html': {
    aiDescription:
      'Aviso legal del sitio luisacorralcoach.com de Luisa Corral, coach holística en Narón (A Coruña, España).',
  },
  'politica-de-privacidad/index.html': {
    aiDescription:
      'Política de privacidad y tratamiento de datos de luisacorralcoach.com (Luisa Corral, coach holística en Narón).',
  },
  'politica-de-cookies/index.html': {
    aiDescription:
      'Política de cookies del sitio web de Luisa Corral Coach Holística (luisacorralcoach.com).',
  },
  '404.html': {
    aiDescription:
      'Página 404 de luisacorralcoach.com. Vuelve al inicio o contacta con Luisa Corral, coach holística en Narón (A Coruña).',
  },
  'llms/index.html': {
    aiDescription:
      'Perfil estructurado de Luisa Corral para asistentes de IA: coach holística en Narón, servicios, precios y enlaces. No indexada en buscadores.',
  },
  'testimonios/index.html': {
    title: 'Testimonios Clientas | Luisa Corral Coach',
    description:
      'Opiniones reales de clientas de Luisa Corral en Narón y online: coaching, Flores de Bach, Reiki y meditaciones.',
    aiDescription:
      'Testimonios y valoraciones de clientas de Luisa Corral (coach holística en Narón, Ferrolterra): coaching holístico, Flores de Bach, meditaciones, coaching angelical y Reiki Delfín.',
    directAnswer:
      'Clientas de Luisa Corral comparten experiencias con coaching holístico, Flores de Bach, meditaciones, coaching angelical y Reiki Delfín. Sesiones en Narón (A Coruña) y online.',
    breadcrumb: [
      { href: '/', name: 'Inicio' },
      { name: 'Testimonios' },
    ],
  },
  'blog/index.html': {
    title: 'Blog Bienestar Holístico | Luisa Corral',
    description:
      'Artículos de coaching, Flores de Bach y mindfulness por Luisa Corral, coach en Narón (A Coruña) y online.',
    breadcrumb: [
      { href: '/', name: 'Inicio' },
      { name: 'Blog' },
    ],
  },
  'blog/encontrar-proposito-vida-40/index.html': {
    title: 'Propósito de vida a los 40 | Luisa Corral',
    aiDescription:
      'Cómo encontrar propósito de vida a los 40: valores, transiciones y coaching. Luisa Corral, Narón y online España.',
    directAnswer:
      'A los 40 es habitual replantearse el rumbo; el coaching holístico ayuda a clarificar valores y próximos pasos. Luisa Corral comparte claves y sesiones desde Narón.',
    breadcrumb: [
      { href: '/', name: 'Inicio' },
      { href: '/blog', name: 'Blog' },
      { name: 'Propósito a los 40' },
    ],
  },
}
