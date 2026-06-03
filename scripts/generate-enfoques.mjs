import fs from 'fs'
import path from 'path'
import {
  BASE,
  BUSINESS_ID,
  BUSINESS_PROVIDER,
  directAnswerBlock,
  LOCAL_LINE,
} from './seo-shared.mjs'

const ROOT = path.resolve(
  'C:/Users/USUARIO/Documents/Proyectos/Adrián Márquez/Web Adrián Márquez/luisacorralcoach-web'
)
const TEMPLATE = fs.readFileSync(path.join(ROOT, 'testimonios/index.html'), 'utf8')

const [, headPart, , footerPart] = TEMPLATE.split(/<\/header>|<footer id="global-header"/)
// fix split - use better approach
const headerEnd = TEMPLATE.indexOf('</header>') + '</header>'.length
const footerStart = TEMPLATE.indexOf('<footer id="global-footer"')
const headThroughHeader = TEMPLATE.slice(0, headerEnd)
const footerThroughEnd = TEMPLATE.slice(footerStart)

function patchHeader(html) {
  return html
}

function headHtml(meta) {
  let h = headThroughHeader
  h = h.replace(/<title>[\s\S]*?<\/title>/, `<title>${meta.title}</title>`)
  h = h.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${meta.description}">`
  )
  h = h.replace(
    /<meta name="keywords" content="[^"]*">/,
    meta.keywords
      ? `<meta name="keywords" content="${meta.keywords}">`
      : '<meta name="keywords" content="">'
  )
  h = h.replace(
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${meta.ogTitle}">`
  )
  h = h.replace(
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${meta.ogDescription}">`
  )
  h = h.replace(
    /<meta name="twitter:title" content="[^"]*">/,
    `<meta name="twitter:title" content="${meta.ogTitle}">`
  )
  h = h.replace(
    /<meta name="twitter:description" content="[^"]*">/,
    `<meta name="twitter:description" content="${meta.ogDescription}">`
  )
  h = h.replace(
    /<meta name="twitter:card" content="summary">/,
    '<meta name="twitter:card" content="summary_large_image">'
  )
  if (!h.includes('twitter:card')) {
    h = h.replace(
      /<meta name="twitter:title"/,
      '<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title"'
    )
  }
  h = h.replace(
    /<meta property="og:url" content="[^"]*">/,
    `<meta property="og:url" content="${meta.canonical}">`
  )
  h = h.replace(
    /<link rel="canonical" href="[^"]*">/,
    `<link rel="canonical" href="${meta.canonical}">`
  )
  h = h.replace(
    /<meta property="og:image" content="[^"]*">/,
    `<meta property="og:image" content="${meta.ogImage}">`
  )
  h = h.replace(
    /<meta name="twitter:image" content="[^"]*">/,
    `<meta name="twitter:image" content="${meta.ogImage}">`
  )
  const schemaBlock = `<script type="application/ld+json">\n${JSON.stringify(meta.schema, null, 2)}\n</script>`
  h = h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, schemaBlock)
  h = h.replace(
    /<link rel="modulepreload" href="[^"]*">/,
    '<link rel="modulepreload" href="/js/enfoques/index.js">'
  )
  if (meta.aiDescription) {
    h = h.replace(
      /<meta name="ai-description" content="[^"]*">/,
      `<meta name="ai-description" content="${meta.aiDescription.replace(/"/g, '&quot;')}">`
    )
  }
  return patchHeader(h)
}

function ctaBlock(e = {}) {
  const heading =
    e.ctaHeading || 'Da el primer paso <span class="text-[#9B7EBD]">hoy</span>'
  const text =
    e.ctaText ||
    'Sesiones online para toda España y Latinoamérica. Presencial en Narón (A Coruña). Primera conversación sin compromiso.'
  return `<section class="code-section py-20 bg-[#FAF7FC]">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 class="text-3xl md:text-4xl font-bold text-[#2D1B3D] mb-6">${heading}</h2>
    <p class="text-lg text-[#6B5B7A] mb-8 max-w-2xl mx-auto">${text}</p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="https://wa.me/34616054001" target="_blank" rel="noopener noreferrer nofollow" class="inline-flex items-center justify-center bg-[#25D366] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#20BD5A] transition-all duration-300 shadow-lg">
        <i class="fa-brands fa-whatsapp mr-3 text-xl"></i>WhatsApp
      </a>
      <a href="/contacto" class="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-lg border-2 border-[#9B7EBD] text-[#9B7EBD] hover:bg-[#9B7EBD] hover:text-white transition-all duration-300">
        <i class="fa-solid fa-calendar mr-3 text-xl"></i>Reservar sesión
      </a>
    </div>
  </div>
</section>`
}

function faqSection(e) {
  const items = e.faqs
    .map(
      (f) => `<div class="border border-[#E5D9F2] rounded-2xl overflow-hidden" data-landingsite-faq-item>
      <button type="button" class="w-full flex items-center justify-between p-6 text-left bg-[#FAF7FC] hover:bg-[#F0EAF7] transition-colors" data-landingsite-faq-question>
        ${f.q}
        <i class="fa-solid fa-chevron-down text-[#9B7EBD]"></i>
      </button>
      <div class="p-6 bg-white hidden" data-landingsite-faq-answer>
        <p>${f.a}</p>
      </div>
    </div>`
    )
    .join('\n')
  return `<section class="code-section py-16 bg-white">
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl font-bold text-[#2D1B3D] mb-4 text-center">${e.faqHeading}</h2>
    <p class="text-center text-[#6B5B7A] mb-8 max-w-2xl mx-auto">${e.faqIntro}</p>
    <div class="space-y-4" data-landingsite-faq="">${items}</div>
  </div>
</section>`
}

function enfoqueBody(e) {
  const forYou = e.forYou.map((t) => `<li class="flex items-start gap-3 text-[#6B5B7A]"><i class="fa-solid fa-check text-[#9B7EBD] mt-1"></i><span>${t}</span></li>`).join('')
  const bullets = e.sessionBullets.map((t) => `<li class="flex items-start gap-3 text-[#6B5B7A]"><i class="fa-solid fa-spa text-[#9B7EBD] mt-1"></i><span>${t}</span></li>`).join('')
  const services = e.services
    .map(
      (s) => `<a href="${s.url}" class="enfoque-service-card">
      <p class="font-bold text-[#2D1B3D] mb-2">${s.name}</p>
      <p class="text-sm text-[#6B5B7A] mb-3">${s.desc}</p>
      <span class="text-[#9B7EBD] font-semibold text-sm">Ver servicio <i class="fa-solid fa-arrow-right ml-1"></i></span>
    </a>`
    )
    .join('')

  const bach =
    e.bachNote &&
    `<div class="mt-8 p-6 bg-[#E8D7F1]/50 rounded-2xl border border-[#E5D9F2]">
      <p class="text-[#2D1B3D] font-semibold mb-2"><i class="fa-solid fa-flower text-[#9B7EBD] mr-2"></i>Flores de Bach</p>
      <p class="text-[#6B5B7A] text-sm">Los remedios florales del Dr. Bach (esencias en gotas) pueden complementar tu proceso emocional. <a href="/flores-de-bach" class="text-[#9B7EBD] font-semibold hover:underline">Conoce la terapia floral</a>.</p>
    </div>`

  return `<section class="code-section py-20 bg-gradient-to-br from-[#FAF7FC] to-[#F0EAF7]">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <nav class="mb-8" aria-label="Breadcrumb">
      <ol class="flex items-center gap-2 text-sm text-[#6B5B7A] flex-wrap">
        <li><a href="/" class="hover:text-[#9B7EBD]">Inicio</a></li>
        <li><span>/</span></li>
        <li><a href="/enfoques" class="hover:text-[#9B7EBD]">Enfoques</a></li>
        <li><span>/</span></li>
        <li class="text-[#9B7EBD] font-medium">${e.breadcrumb}</li>
      </ol>
    </nav>
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <span class="inline-block px-4 py-2 bg-[#E8D7F1] text-[#7A5FA0] rounded-full text-sm font-semibold mb-4">Enfoque transaccional</span>
        <h1 class="text-4xl md:text-5xl font-bold text-[#2D1B3D] mb-6 leading-tight">${e.h1} <span class="text-[#9B7EBD]">${e.h1Accent}</span></h1>
        <p class="text-lg text-[#6B5B7A] mb-6">${e.heroLead}</p>
        ${e.directAnswer ? directAnswerBlock(e.directAnswer) : ''}
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
          <a href="/contacto" class="inline-flex items-center justify-center bg-[#9B7EBD] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#7A5FA0] transition-all shadow-md">Agenda tu sesión</a>
          <a href="https://wa.me/34616054001" target="_blank" rel="noopener noreferrer nofollow" class="inline-flex items-center justify-center bg-[#25D366] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#20BD5A] transition-all">WhatsApp</a>
        </div>
        <p class="text-sm text-[#6B5B7A]">Narón (Ferrolterra, A Coruña) · Online España · Desde 50€/sesión</p>
      </div>
      <div class="relative">
        <img src="${e.image}" alt="${e.imageAlt}" class="w-full h-[400px] object-cover rounded-3xl shadow-xl" width="1200" height="800" loading="eager" fetchpriority="high" decoding="async">
      </div>
    </div>
  </div>
</section>
<section class="code-section py-16 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-12">
      <div>
        <h2 class="text-3xl font-bold text-[#2D1B3D] mb-6">Es para ti si…</h2>
        <ul class="space-y-3">${forYou}</ul>
      </div>
      <div>
        <h2 class="text-3xl font-bold text-[#2D1B3D] mb-6">Qué trabajamos en sesión</h2>
        <ul class="space-y-3">${bullets}</ul>
        ${bach || ''}
      </div>
    </div>
  </div>
</section>
<section class="code-section py-16 bg-[#FAF7FC]">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl font-bold text-[#2D1B3D] mb-4 text-center">${e.servicesHeading}</h2>
    <p class="text-center text-[#6B5B7A] mb-10 max-w-2xl mx-auto">${e.servicesIntro}</p>
    <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">${services}</div>
    <p class="text-center mt-8"><a href="/enfoques" class="text-[#9B7EBD] font-semibold hover:underline">Ver todos los enfoques</a> · <a href="/coaching-holistico" class="text-[#9B7EBD] font-semibold hover:underline">Coaching holístico</a></p>
  </div>
</section>
${faqSection(e)}
${ctaBlock(e)}`
}

const ENFOQUES = [
  {
    slug: 'gestion-estres-emociones',
    breadcrumb: 'Gestión del estrés y emociones',
    title: 'Ansiedad y Estrés Online | Coach Galicia · 50€',
    directAnswer:
      'Luisa Corral acompaña ansiedad, agobio y burnout con coaching holístico y Flores de Bach en Narón (A Coruña) y online. Primera sesión desde 50€; reserva por web o WhatsApp.',
    description:
      '¿Ansiedad, agobio o burnout? Coach holística Luisa Corral en Narón (Galicia) y online en España. Flores de Bach y coaching emocional. Reserva tu sesión desde 50€.',
    keywords:
      'ansiedad online, gestión del estrés, gestión emocional, burnout mujeres, coach holística ansiedad, flores de bach ansiedad, coaching emocional España, coach holística Galicia, coach holística Narón, terapia ansiedad online, reservar sesión coaching',
    ogTitle: 'Ansiedad y Estrés | Coach Holística · Reserva Online',
    aiDescription:
      'Luisa Corral, coach holística en Narón (A Coruña, Galicia), acompaña la gestión de ansiedad, estrés y burnout con coaching integral y Flores de Bach (sistema Dr. Bach). Sesiones online para España y Latinoamérica y presenciales en Narón. Desde 50€/sesión. Reserva en luisacorralcoach.com/contacto.',
    servicesHeading: 'Cómo trabajamos la <span class="text-[#9B7EBD]">ansiedad y el estrés</span>',
    servicesIntro:
      'Para nerviosismo, agobio o burnout combino coaching holístico y, si encaja, Flores de Bach. En la primera sesión vemos qué necesitas tú.',
    faqHeading: 'Dudas sobre <span class="text-[#9B7EBD]">ansiedad y estrés</span>',
    faqIntro: 'Respuestas directas antes de reservar tu sesión.',
    ctaHeading: 'Recupera la calma <span class="text-[#9B7EBD]">con acompañamiento</span>',
    ctaText:
      'Sesiones online (España y Latinoamérica) o presencial en Narón. Primera conversación sin compromiso.',
    ogDescription:
      'Gestiona ansiedad y burnout con coaching holístico y Flores de Bach. Online y presencial en Narón, Galicia. Reserva desde 50€.',
    ogImage: `${BASE}/assets/images/cf/xaKlCos5cTg_1RWzIu_h-A-deb7eaa8-16d2-4e89-e023-fecfec881600.webp`,
    h1: 'Gestión del estrés',
    h1Accent: 'y las emociones',
    heroLead:
      'Si la ansiedad, el agobio o el burnout te están limitando, un acompañamiento holístico te ayuda a entender qué sientes, regular tu sistema nervioso y recuperar calma con herramientas prácticas.',
    image: '/assets/images/cf/xaKlCos5cTg_1RWzIu_h-A-deb7eaa8-16d2-4e89-e023-fecfec881600.webp',
    imageAlt: 'Gestión del estrés y emociones con coaching holístico',
    icon: 'fa-heart',
    cardDesc: 'Ansiedad, burnout, miedos y regulación emocional.',
    forYou: [
      'Sientes ansiedad, nerviosismo o tensión casi a diario',
      'Estás en burnout o agotamiento emocional por trabajo o cuidados',
      'Te cuesta gestionar rabia, tristeza o miedo sin sentirte desbordada',
      'Buscas herramientas más allá de “aguantar” o apagar síntomas',
    ],
    sessionBullets: [
      'Identificar disparadores emocionales y patrones de estrés',
      'Técnicas de respiración, mindfulness y anclaje en el presente',
      'Plan de autocuidado realista según tu ritmo de vida',
      'Seguimiento entre sesiones para sostener el cambio',
    ],
    bachNote: true,
    services: [
      {
        url: '/coaching-holistico',
        name: 'Coaching holístico',
        desc: 'Marco principal: conversación profunda, objetivos y herramientas integradas.',
      },
      {
        url: '/flores-de-bach',
        name: 'Flores de Bach',
        desc: 'Remedios florales personalizados para estados emocionales concretos.',
      },
    ],
    faqs: [
      {
        q: '¿Puedo trabajar la ansiedad sin medicación?',
        a: 'El coaching holístico y las Flores de Bach son complementos al cuidado médico, no sustitutos. Muchas personas combinan ambos con su médico o psicólogo.',
      },
      {
        q: '¿Cuántas sesiones se necesitan?',
        a: 'Algunas notan alivio desde la primera sesión. Para cambios sostenibles suelen recomendarse 4 a 8 sesiones según tu situación.',
      },
      {
        q: '¿Las sesiones son online?',
        a: 'Sí, por videollamada para España y Latinoamérica. También presencial en Narón, Galicia.',
      },
    ],
  },
  {
    slug: 'encontrar-proposito',
    breadcrumb: 'Encontrar propósito',
    title: 'Propósito de Vida | Coaching Online · Reserva',
    directAnswer:
      'Si sientes vacío o falta de rumbo, el coaching holístico con Luisa Corral clarifica valores y próximos pasos. Sesiones en Narón (Ferrolterra) y videollamada para España.',
    description:
      '¿Vacío o falta de rumbo? Coaching holístico para clarificar valores y propósito vital con Luisa Corral. Online y Narón (Galicia). Sesión desde 50€. Reserva hoy.',
    keywords:
      'encontrar propósito de vida, coaching propósito vital, coach holística mujeres, reinvención personal, valores personales coaching, coach holística online España, coaching sentido de vida, coach Narón Galicia, reservar coaching propósito',
    ogTitle: 'Encontrar Propósito de Vida | Coaching Holístico',
    aiDescription:
      'Coaching holístico con Luisa Corral para encontrar propósito de vida, alinear decisiones con valores y atravesar cambios vitales. Sesiones online (España y Latinoamérica) y presenciales en Narón, Galicia. Desde 50€. Ideal si sientes vacío, estancamiento o necesitas redefinir tu camino.',
    servicesHeading: 'Servicios para <span class="text-[#9B7EBD]">claridad y propósito</span>',
    servicesIntro:
      'Si estás en un cambio vital o sientes vacío, el coaching holístico es el eje; el coaching angelical puede acompañar si buscas conectar con tu intuición.',
    faqHeading: 'Preguntas sobre <span class="text-[#9B7EBD]">propósito vital</span>',
    faqIntro: 'Lo que suelen preguntarme antes de empezar.',
    ctaHeading: 'Diseña una vida con <span class="text-[#9B7EBD]">sentido</span>',
    ctaText: 'Online o en Narón (A Coruña). Cuéntame tu situación y vemos si encajamos.',
    ogDescription:
      'Clarifica tu propósito y toma decisiones con sentido. Coaching holístico online y en Narón. Reserva sesión.',
    ogImage: `${BASE}/assets/provider/istock/2234453222.webp`,
    h1: 'Encontrar tu',
    h1Accent: 'propósito y valores',
    heroLead:
      'Cuando sientes que vas en piloto automático o que algo falta, el coaching holístico te ayuda a conectar con lo que importa, tomar decisiones coherentes y diseñar una vida con sentido.',
    image: '/assets/provider/istock/2234453222.webp',
    imageAlt: 'Encontrar propósito de vida con coaching holístico',
    icon: 'fa-compass',
    cardDesc: 'Propósito vital, valores y decisiones con sentido.',
    forYou: [
      'Sientes vacío o falta de dirección aunque “tengas todo”',
      'Estás en un cambio vital y quieres redefinir tu camino',
      'Te cuesta tomar decisiones alineadas contigo misma',
      'Quieres pasar de sobrevivir a vivir con intención',
    ],
    sessionBullets: [
      'Clarificar valores, talentos y lo que te energiza',
      'Explorar bloqueos y creencias que te frenan',
      'Definir objetivos vitales concretos y alcanzables',
      'Plan de acción con seguimiento compasivo',
    ],
    bachNote: false,
    services: [
      {
        url: '/coaching-holistico',
        name: 'Coaching holístico',
        desc: 'El enfoque principal para propósito, transiciones y autenticidad.',
      },
      {
        url: '/coaching-angelical',
        name: 'Coaching angelical',
        desc: 'Si buscas conectar con intuición y guía interior en tu proceso.',
      },
    ],
    faqs: [
      {
        q: '¿Es lo mismo que terapia?',
        a: 'El coaching trabaja desde el presente hacia el futuro con objetivos. Puede complementar terapia si estás sanando el pasado con un profesional de salud mental.',
      },
      {
        q: '¿Sirve si tengo más de 40 años?',
        a: 'Sí. Muchas clientas llegan en segunda mitad de vida buscando reinvención con madurez y claridad.',
      },
      {
        q: '¿Hay sesión de valoración?',
        a: 'Puedes escribir por WhatsApp o usar el formulario de contacto para una primera conversación sobre tu caso.',
      },
    ],
  },
  {
    slug: 'equilibrio-vital',
    breadcrumb: 'Equilibrio vital',
    title: 'Equilibrio Vital Online | Coach Galicia · Reserva',
    directAnswer:
      'Recupera hábitos, descanso y energía con coaching holístico y meditaciones personalizadas. Luisa Corral en Narón (Ferrolterra, A Coruña) y online para mujeres en España.',
    description:
      'Recupera equilibrio vital: hábitos, descanso y energía sin culpa. Coaching y meditaciones personalizadas con Luisa Corral. Online y Narón. Reserva desde 50€.',
    keywords:
      'equilibrio vital, equilibrio vida trabajo, burnout mujeres, hábitos saludables, agotamiento emocional, coach bienestar online, meditación personalizada estrés, coach holística Galicia, coach Narón, reservar sesión bienestar',
    ogTitle: 'Equilibrio Vital y Burnout | Coach Holística',
    aiDescription:
      'Acompañamiento holístico para equilibrio vital: hábitos sostenibles, límites sanos y gestión de energía. Luisa Corral combina coaching holístico y meditaciones personalizadas. Online en España y presencial en Narón (Galicia). Desde 50€/sesión.',
    servicesHeading: 'Herramientas para tu <span class="text-[#9B7EBD]">equilibrio diario</span>',
    servicesIntro:
      'Hábitos sostenibles con coaching; meditaciones personalizadas si necesitas desconectar en casa entre sesiones.',
    faqHeading: 'Dudas sobre <span class="text-[#9B7EBD]">equilibrio y hábitos</span>',
    faqIntro: 'Sin promesas irreales: cambios pequeños que encajan en tu vida.',
    ctaHeading: 'Vuelve a tener espacio <span class="text-[#9B7EBD]">para ti</span>',
    ctaText: 'Sesiones desde 50€. Online para toda España o presencial en Narón.',
    ogDescription:
      'Hábitos realistas, descanso y tiempo para ti. Coaching y meditaciones en Narón y online. Reserva sesión.',
    ogImage: `${BASE}/assets/provider/istock/2245001493.webp`,
    h1: 'Equilibrio vital',
    h1Accent: 'y bienestar integral',
    heroLead:
      'Si vives al límite del agotamiento, sin espacio para ti, trabajamos hábitos sostenibles, límites sanos y rutinas que integren cuerpo, mente y descanso real.',
    image: '/assets/provider/istock/2245001493.webp',
    imageAlt: 'Equilibrio vital y hábitos saludables',
    icon: 'fa-spa',
    cardDesc: 'Hábitos, descanso, tiempo para ti y sostenibilidad.',
    forYou: [
      'No encuentras tiempo para ti entre trabajo y familia',
      'Tu energía está al mínimo y todo te cuesta el doble',
      'Quieres hábitos que duren, no retos de una semana',
      'Necesitas reorganizar prioridades sin culpa',
    ],
    sessionBullets: [
      'Auditoría amable de tu ritmo de vida actual',
      'Micro-hábitos y rituales de autocuidado viables',
      'Gestión de energía (no solo gestión del tiempo)',
      'Meditaciones o audios personalizados si encaja',
    ],
    bachNote: true,
    services: [
      {
        url: '/coaching-holistico',
        name: 'Coaching holístico',
        desc: 'Estructura el cambio de hábitos y prioridades con seguimiento.',
      },
      {
        url: '/meditaciones-personalizadas',
        name: 'Meditaciones personalizadas',
        desc: 'Audios guiados para desconectar y recuperar calma en casa.',
      },
    ],
    faqs: [
      {
        q: '¿Necesito muchas horas libres?',
        a: 'No. El enfoque es realista: pequeños cambios que encajan en tu vida actual.',
      },
      {
        q: '¿Incluye plan de alimentación o deporte?',
        a: 'No soy nutricionista ni entrenadora. Trabajamos el eje emocional y de hábitos; puedo recomendar otros profesionales si hace falta.',
      },
      {
        q: '¿Puedo combinar coaching y meditación?',
        a: 'Sí, es una combinación muy efectiva para el equilibrio vital.',
      },
    ],
  },
  {
    slug: 'autoconocimiento-mindfulness',
    breadcrumb: 'Autoconocimiento y mindfulness',
    title: 'Mindfulness Online | Calma Mental · Reserva',
    directAnswer:
      'Mindfulness práctico y autoconocimiento para calmar la mente, con meditaciones a medida si lo necesitas. Sesiones con Luisa Corral en Narón y por videollamada.',
    description:
      'Mindfulness práctico y autoconocimiento para calmar la mente. Meditaciones personalizadas y coaching con Luisa Corral. Online y Narón. Sesión desde 50€.',
    keywords:
      'mindfulness online, autoconocimiento, atención plena, calmar la mente, meditación personalizada, técnicas respiración ansiedad, coach mindfulness España, coach holística Galicia, meditación guiada online, reservar mindfulness',
    ogTitle: 'Mindfulness y Autoconocimiento | Sesiones Online',
    aiDescription:
      'Sesiones de mindfulness y autoconocimiento con Luisa Corral: técnicas de respiración, atención plena y meditaciones personalizadas adaptadas a tu vida. Online para España y Latinoamérica y presencial en Narón, Galicia. Sin experiencia previa necesaria.',
    servicesHeading: 'Qué encaja si buscas <span class="text-[#9B7EBD]">calma mental</span>',
    servicesIntro:
      'Meditaciones a medida para practicar en casa; coaching holístico si quieres integrar mindfulness con trabajo emocional.',
    faqHeading: 'Preguntas sobre <span class="text-[#9B7EBD]">mindfulness</span>',
    faqIntro: 'Empiezas desde cero, sin posturas raras ni jerga vacía.',
    ctaHeading: 'Para la mente que <span class="text-[#9B7EBD]">no para</span>',
    ctaText: 'Primera sesión online o en Narón. Te explico cómo sería tu proceso.',
    ogDescription:
      'Mindfulness realista y meditaciones a medida. Online y Narón. Reserva tu sesión desde 50€.',
    ogImage: `${BASE}/assets/provider/istock/2271081070.webp`,
    h1: 'Autoconocimiento',
    h1Accent: 'y mindfulness',
    heroLead:
      'Si tu mente no para, la atención plena y el autoconocimiento te devuelven presencia, claridad y una relación más amable contigo misma, con prácticas adaptadas a tu día a día.',
    image: '/assets/provider/istock/2271081070.webp',
    imageAlt: 'Mindfulness y autoconocimiento con meditación guiada',
    icon: 'fa-leaf',
    cardDesc: 'Mindfulness, respiración y presencia consciente.',
    forYou: [
      'Tu mente va mil por hora y te cuesta estar en el presente',
      'Quieres meditar pero no sabes por dónde empezar',
      'Buscas conocerte mejor sin juicio',
      'Necesitas herramientas rápidas para momentos de tensión',
    ],
    sessionBullets: [
      'Introducción práctica al mindfulness (sin misticismo vacío)',
      'Ejercicios de respiración y body scan personalizados',
      'Identificar tu diálogo interno y suavizarlo',
      'Meditación guiada grabada para practicar en casa',
    ],
    bachNote: false,
    services: [
      {
        url: '/meditaciones-personalizadas',
        name: 'Meditaciones personalizadas',
        desc: 'Ideal si quieres audios a medida para tu ritmo y objetivo.',
      },
      {
        url: '/coaching-holistico',
        name: 'Coaching holístico',
        desc: 'Integra mindfulness con trabajo emocional y objetivos vitales.',
      },
    ],
    faqs: [
      {
        q: '¿Tengo que tener experiencia meditando?',
        a: 'No. Empezamos desde cero con instrucciones claras y sin posturas complicadas.',
      },
      {
        q: '¿Cuánto tiempo debo practicar al día?',
        a: 'A veces bastan 5–10 minutos consistentes. Lo ajustamos a tu vida real.',
      },
      {
        q: '¿Hay artículos en el blog?',
        a: 'Sí, en el blog encontrarás técnicas de mindfulness; las sesiones van más allá con personalización.',
      },
    ],
  },
  {
    slug: 'desbloqueo-energetico-emocional',
    breadcrumb: 'Desbloqueo energético y emocional',
    title: 'Desbloqueo Emocional | Reiki Online · Reserva',
    directAnswer:
      'Libera bloqueos emocionales y energéticos con Reiki Delfín y coaching angelical. Luisa Corral en Narón (A Coruña) y sesiones online en España desde 50€.',
    description:
      'Libera bloqueos emocionales y energéticos con Reiki Delfín y coaching angelical. Luisa Corral en Narón (Galicia) y online. Reserva sesión desde 50€.',
    keywords:
      'desbloqueo emocional, desbloqueo energético, sanación energética, reiki delfín online, coaching angelical, liberar bloqueos emocionales, reiki Galicia, coach holística espiritual, sanación emocional mujeres, reservar reiki online',
    ogTitle: 'Desbloqueo Emocional y Reiki | Luisa Corral',
    aiDescription:
      'Proceso de desbloqueo emocional y energético con Luisa Corral: Reiki Delfín, coaching angelical y trabajo emocional consciente. Sesiones online y presenciales en Narón, Galicia. Para quien siente bloqueos internos, patrones repetitivos o deseo de reconexión espiritual suave.',
    servicesHeading: 'Vías de <span class="text-[#9B7EBD]">liberación y sanación</span>',
    servicesIntro:
      'Reiki Delfín para trabajo energético; coaching angelical si buscas guía interior. Lo combinamos según tu caso.',
    faqHeading: 'Dudas sobre <span class="text-[#9B7EBD]">bloqueos y energía</span>',
    faqIntro: 'No hace falta “creer” a ciegas: muchas empiezan con curiosidad.',
    ctaHeading: 'Libera lo que ya <span class="text-[#9B7EBD]">no te sirve</span>',
    ctaText: 'Espacio seguro en Narón o por videollamada. Escríbeme y lo vemos juntas.',
    ogDescription:
      'Reiki Delfín y coaching angelical para liberar bloqueos. Online y Narón. Reserva tu sesión.',
    ogImage: `${BASE}/assets/images/cf/xaKlCos5cTg_1RWzIu_h-A-516eeb50-9d67-4bb3-f3fc-c127dd0dc100-publicContain.webp`,
    h1: 'Desbloqueo emocional',
    h1Accent: 'y energético',
    heroLead:
      'Cuando sientes que algo te frena por dentro —emociones reprimidas, peso energético o falta de conexión— combinamos trabajo emocional consciente y técnicas de sanación energética respetuosas con tu ritmo.',
    image: '/assets/images/cf/xaKlCos5cTg_1RWzIu_h-A-516eeb50-9d67-4bb3-f3fc-c127dd0dc100-publicContain.webp',
    imageAlt: 'Desbloqueo emocional y Reiki Delfín',
    icon: 'fa-water',
    cardDesc: 'Bloqueos internos, sanación energética y liberación.',
    forYou: [
      'Sientes bloqueo emocional sin saber explicarlo con palabras',
      'Repites patrones y quieres liberar lo que ya no te sirve',
      'Te atrae la sanación energética o el trabajo espiritual suave',
      'Buscas un espacio seguro para soltar y reconectar',
    ],
    sessionBullets: [
      'Exploración compasiva de bloqueos y creencias',
      'Técnicas de liberación emocional guiada',
      'Sesiones de Reiki Delfín o coaching angelical si encaja',
      'Integración práctica después de la experiencia energética',
    ],
    bachNote: true,
    services: [
      {
        url: '/reiki-delfin',
        name: 'Reiki Delfín',
        desc: 'Sanación energética inspirada en la energía del océano y los delfines.',
      },
      {
        url: '/coaching-angelical',
        name: 'Coaching angelical',
        desc: 'Conexión con intuición y guía interior en tu proceso.',
      },
    ],
    faqs: [
      {
        q: '¿Tengo que creer en energía o ángeles?',
        a: 'No es obligatorio. Muchas clientas empiezan con curiosidad y valoran la experiencia por cómo se sienten después.',
      },
      {
        q: '¿Reiki Delfín es presencial?',
        a: 'Puede ser presencial en Narón u online según el tipo de sesión. Lo vemos en contacto.',
      },
      {
        q: '¿Se combina con coaching?',
        a: 'Sí, lo ideal es integrar insights emocionales con el trabajo energético para cambios duraderos.',
      },
    ],
  },
]

function hubBody() {
  const cards = ENFOQUES.map(
    (e) => `<a href="/enfoques/${e.slug}" class="group block bg-gradient-to-br from-[#FAF7FC] to-[#F0EAF7] rounded-3xl p-8 border border-[#E5D9F2] hover:shadow-xl transition-all hover:-translate-y-1">
      <div class="w-14 h-14 bg-[#9B7EBD] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <i class="fa-solid ${e.icon} text-white text-2xl"></i>
      </div>
      <h2 class="text-2xl font-bold text-[#2D1B3D] mb-3">${e.breadcrumb}</h2>
      <p class="text-[#6B5B7A] mb-4">${e.cardDesc}</p>
      <span class="text-[#9B7EBD] font-semibold">Reservar este enfoque <i class="fa-solid fa-arrow-right ml-1"></i></span>
    </a>`
  ).join('')

  return `<section class="code-section py-20 bg-gradient-to-br from-[#FAF7FC] to-[#F0EAF7]">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <nav class="mb-8" aria-label="Breadcrumb">
      <ol class="flex items-center gap-2 text-sm text-[#6B5B7A]">
        <li><a href="/" class="hover:text-[#9B7EBD]">Inicio</a></li>
        <li><span>/</span></li>
        <li class="text-[#9B7EBD] font-medium">Enfoques</li>
      </ol>
    </nav>
    <div class="text-center max-w-3xl mx-auto mb-16">
      <span class="inline-block px-4 py-2 bg-[#E8D7F1] text-[#7A5FA0] rounded-full text-sm font-semibold mb-4">Cómo puedo ayudarte</span>
      <h1 class="text-4xl md:text-5xl font-bold text-[#2D1B3D] mb-6">Enfoques de <span class="text-[#9B7EBD]">transformación</span></h1>
      <p class="text-lg text-[#6B5B7A]">No necesitas encajar en una etiqueta concreta. Elige el resultado que buscas; en sesión diseñamos el camino con el servicio que mejor te acompañe.</p>
      ${directAnswerBlock('Los enfoques de Luisa Corral son landings por resultado (ansiedad, propósito, equilibrio, mindfulness, desbloqueo). Atiende en Narón (Ferrolterra, A Coruña) y online en España desde 50€/sesión.')}
    </div>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${cards}</div>
    <div class="mt-16 text-center">
      <p class="text-[#6B5B7A] mb-6">¿Prefieres ver el catálogo completo de sesiones?</p>
      <a href="/coaching-holistico" class="inline-flex items-center text-[#9B7EBD] font-semibold hover:text-[#7A5FA0] mr-6">Coaching holístico <i class="fa-solid fa-arrow-right ml-2"></i></a>
      <a href="/contacto" class="inline-flex items-center justify-center bg-[#9B7EBD] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#7A5FA0]">Agenda tu sesión</a>
    </div>
  </div>
</section>
${faqSection({
  faqHeading: 'Preguntas sobre los <span class="text-[#9B7EBD]">enfoques</span>',
  faqIntro: 'Respuestas rápidas antes de elegir tu camino.',
  faqs: [
    {
      q: '¿Qué es un enfoque de coaching?',
      a: 'Es una página orientada a un resultado concreto (ansiedad, propósito, equilibrio, etc.). En sesión elegimos el servicio que mejor encaje: coaching holístico, Flores de Bach, meditaciones o Reiki Delfín.',
    },
    {
      q: '¿Puedo reservar online si no vivo en Galicia?',
      a: 'Sí. Ofrezco sesiones por videollamada para toda España y Latinoamérica, además de presencial en Narón (comarca de Ferrolterra, A Coruña).',
    },
  ],
})}
${ctaBlock()}`
}

function buildSchema(e, isHub) {
  if (isHub) {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          name: 'Enfoques de coaching holístico',
          url: `${BASE}/enfoques`,
          description:
            'Enfoques transaccionales de Luisa Corral: estrés, propósito, equilibrio, mindfulness y desbloqueo emocional.',
          about: { '@id': BUSINESS_ID },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${BASE}/` },
            { '@type': 'ListItem', position: 2, name: 'Enfoques', item: `${BASE}/enfoques` },
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: '¿Qué es un enfoque de coaching?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Es una landing orientada a un resultado concreto (ansiedad, propósito, equilibrio, etc.). En sesión elegimos el servicio que mejor encaje: coaching holístico, Flores de Bach, meditaciones o Reiki Delfín.',
              },
            },
            {
              '@type': 'Question',
              name: '¿Puedo reservar online si no vivo en Galicia?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Sí. Luisa Corral ofrece sesiones por videollamada para toda España y Latinoamérica, además de presencial en Narón (comarca de Ferrolterra, A Coruña).',
              },
            },
          ],
        },
      ],
    }
  }
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${BASE}/enfoques/${e.slug}#webpage`,
        name: e.title.split('|')[0].trim(),
        url: `${BASE}/enfoques/${e.slug}`,
        description: e.description,
        inLanguage: 'es-ES',
      },
      {
        '@type': 'Service',
        name: e.breadcrumb,
        description: e.description,
        url: `${BASE}/enfoques/${e.slug}`,
        provider: BUSINESS_PROVIDER,
        mentions: { '@id': BUSINESS_ID },
        areaServed: [
          { '@type': 'Country', name: 'España' },
          { '@type': 'AdministrativeArea', name: 'Galicia' },
          { '@type': 'City', name: 'Narón' },
        ],
        offers: {
          '@type': 'Offer',
          price: '50',
          priceCurrency: 'EUR',
          url: `${BASE}/contacto`,
          availability: 'https://schema.org/InStock',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${BASE}/` },
          { '@type': 'ListItem', position: 2, name: 'Enfoques', item: `${BASE}/enfoques` },
          {
            '@type': 'ListItem',
            position: 3,
            name: e.breadcrumb,
            item: `${BASE}/enfoques/${e.slug}`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: e.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}

function writePage(relPath, body, meta, isHub = false) {
  const canonical = isHub ? `${BASE}/enfoques` : `${BASE}/enfoques/${meta.slug}`
  const html =
    headHtml({
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords || '',
      ogTitle: meta.ogTitle || meta.title,
      ogDescription: meta.ogDescription || meta.description,
      aiDescription: meta.aiDescription || meta.description,
      canonical,
      ogImage: meta.ogImage,
      schema: buildSchema(meta, isHub),
    }) +
    body +
    footerThroughEnd.replace(
      "import('/js/testimonios/index.js')",
      "import('/js/enfoques/index.js')"
    )
  const out = path.join(ROOT, relPath)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, html)
  console.log('Wrote', relPath)
}

// Hub
writePage(
  'enfoques/index.html',
  hubBody(),
  {
    title: 'Enfoques Coaching Holístico | Ansiedad y más',
    description:
      'Elige tu enfoque: ansiedad, propósito vital, equilibrio, mindfulness o desbloqueo emocional. Coach holística Luisa Corral en Narón y online. Reserva desde 50€.',
    keywords:
      'enfoques coaching holístico, coach holística online, gestión estrés ansiedad, propósito vida coaching, mindfulness online España, desbloqueo emocional reiki, coach holística Galicia, coach Narón, reservar sesión coaching',
    ogTitle: 'Enfoques de Coaching Holístico | Luisa Corral',
    ogDescription:
      'Landings por resultado: estrés, propósito, equilibrio, mindfulness y desbloqueo. Online y Narón. Reserva sesión.',
    aiDescription:
      'Hub de enfoques transaccionales de Luisa Corral (coach holística en Narón, Galicia): gestión de ansiedad y estrés, encontrar propósito, equilibrio vital, mindfulness y desbloqueo emocional/energético. Cada enfoque enlaza al servicio adecuado (coaching, Flores de Bach, meditaciones, Reiki Delfín). Sesiones online y presenciales desde 50€.',
    ogImage: `${BASE}/assets/images/cf/xaKlCos5cTg_1RWzIu_h-A-f9775a9c-9e0c-4f03-95ec-7351e41d3000-public.webp`,
  },
  true
)

for (const e of ENFOQUES) {
  writePage(`enfoques/${e.slug}/index.html`, enfoqueBody(e), e, false)
}

// empty js module
const jsDir = path.join(ROOT, 'js/enfoques')
fs.mkdirSync(jsDir, { recursive: true })
fs.writeFileSync(
  path.join(jsDir, 'index.js'),
  'export function init() {}\nexport function teardown() {}\n'
)

console.log('Done:', ENFOQUES.length + 1, 'pages')
