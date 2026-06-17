import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const root = join(__dir, '..')

// Extract the big Tailwind <style> block from coaching-holistico
const sourceHtml = readFileSync(join(root, 'coaching-holistico/index.html'), 'utf8')
const styleMatch = sourceHtml.match(/<style>[\s\S]*?<\/style>/)
const tailwindCss = styleMatch ? styleMatch[0] : ''

// Extra utilities not present in coaching-holistico CSS
const extraCss = `<style>.font-medium{font-weight:500}.mt-6{margin-top:1.5rem}.mb-16{margin-bottom:4rem}.py-6{padding-top:1.5rem;padding-bottom:1.5rem}.py-8{padding-top:2rem;padding-bottom:2rem}.space-y-5>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1.25rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1.25rem * var(--tw-space-y-reverse))}.space-y-6>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1.5rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1.5rem * var(--tw-space-y-reverse))}.space-y-8>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(2rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(2rem * var(--tw-space-y-reverse))}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.min-h-screen{min-height:100vh}.max-w-lg{max-width:32rem}.max-w-xl{max-width:36rem}.border-b{border-bottom-width:1px}.border-b-2{border-bottom-width:2px}.leading-relaxed{line-height:1.625}.mt-2{margin-top:.5rem}.mt-3{margin-top:.75rem}.mb-10{margin-bottom:2.5rem}.mb-1{margin-bottom:.25rem}.mr-1{margin-right:.25rem}.ml-auto{margin-left:auto}.ml-3{margin-left:.75rem}.w-5{width:1.25rem}.h-5{height:1.25rem}.w-6{width:1.5rem}.h-6{height:1.5rem}.shrink-0{flex-shrink:0}.accordion-item-open .accordion-icon{transform:rotate(180deg)}</style>`

// :root variables block (same as all pages)
const rootVars = `<style>:root { --accent-color: #D4AF37; --accent2-color: #E8D7F1; --accent3-color: #B8A4C9; --accent4-color: #F2E6D9; --primary-color: #9B7EBD; --dark-text-color: #2D1B3D; --gray-text-color: #6B5B7A; --button-padding-x: 32px; --button-padding-y: 14px; --font-family-body: Nunito Sans; --light-text-color: #FFFFFF; --dark-border-color: #7A5FA0; --light-border-color: #E5D9F2; --font-family-heading: Outfit; --button-rounded-radius: 28px; --dark-background-color: #3D2A52; --light-background-color: #FAF7FC; --medium-background-color: #F0EAF7; --primary-button-text-color: #FFFFFF; --secondary-button-bg-color: #F5F0FA; --secondary-button-text-color: #9B7EBD; --primary-button-hover-bg-color: #7A5FA0; --primary-button-hover-text-color: #FFFFFF; --secondary-button-hover-bg-color: #D4B5E8; --secondary-button-hover-text-color: #5A3D7A; }</style>`

const html = `<!DOCTYPE html><html lang="es"><head>
    <script src="/public/main.umd.js" defer=""></script>
    <meta charset="utf-8">
    <link rel="preconnect" href="https://ka-p.fontawesome.com" crossorigin>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&amp;family=Nunito+Sans:wght@300;400;500;600;700&amp;display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Nunito+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
    </noscript>
    <link rel="icon" type="image/png" href="/assets/uploads/b3f76780-ddae-46b6-b492-f8eaf4baab97/7cec306b-129e-4df9-bd7e-4bd3b2f7e77d.webp">
    <link rel="apple-touch-icon" type="image/png" href="/assets/uploads/b3f76780-ddae-46b6-b492-f8eaf4baab97/7cec306b-129e-4df9-bd7e-4bd3b2f7e77d.webp">

<!-- Información estructurada para crawlers de IA -->
<meta name="ai-description" content="Retiros espirituales de fin de semana en plena naturaleza gallega con Luisa Corral, coach holística en Narón. Combina Reiki Delfín, Flores de Bach, meditación guiada y coaching personal. Grupos reducidos (máx. 8 personas). Próximas fechas por confirmar — únete a la lista de espera.">
<meta name="author" content="Luisa Corral">
<meta name="geo.region" content="ES-GA">
<meta name="geo.placename" content="Galicia, España">
${tailwindCss}
${extraCss}
    ${rootVars}
    <title>Retiros Espirituales en Galicia — Reiki, Meditación y Bienestar | Luisa Corral</title>
<meta name="description" content="Retiros de bienestar en plena naturaleza gallega. Reiki Delfín, Flores de Bach y meditación guiada. Grupos reducidos, experiencia transformadora. ¡Únete a la lista de espera!">
<meta name="keywords" content="retiro espiritual Galicia, retiro espiritual, retiro meditación, retiro Galicia, retiro reiki, retiro para mujeres, retiro bienestar fin de semana, retiro sanación emocional, retiro mindfulness Galicia, retiro naturaleza Galicia">
<meta name="language" content="es">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://luisacorralcoach.com/retiros-espirituales-galicia">
<link rel="alternate" type="text/plain" href="/llms.txt" title="LLM site summary">
<meta property="og:title" content="Retiros Espirituales en Galicia — Reiki, Meditación y Bienestar | Luisa Corral">
<meta property="og:description" content="Retiros de bienestar en plena naturaleza gallega. Reiki Delfín, Flores de Bach y meditación guiada. Grupos reducidos, experiencia transformadora.">
<meta property="og:image" content="https://luisacorralcoach.com/assets/images/cf/xaKlCos5cTg_1RWzIu_h-A-f9775a9c-9e0c-4f03-95ec-7351e41d3000-public.webp">
<meta property="og:type" content="website">
<meta property="og:url" content="https://luisacorralcoach.com/retiros-espirituales-galicia">
<meta property="og:locale" content="es_ES">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Retiros Espirituales en Galicia | Luisa Corral Coach Holística">
<meta name="twitter:description" content="Retiros de bienestar en plena naturaleza gallega. Reiki, Flores de Bach y meditación. Grupos reducidos. Lista de espera abierta.">
<meta name="twitter:image" content="https://luisacorralcoach.com/assets/images/cf/xaKlCos5cTg_1RWzIu_h-A-f9775a9c-9e0c-4f03-95ec-7351e41d3000-public.webp">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué es un retiro espiritual?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Un retiro espiritual es una experiencia inmersiva de 2 o 3 días en la que te desconectas de la rutina para reconectar contigo misma. Se combina silencio, meditación, trabajo energético (como Reiki o Flores de Bach) y coaching personal en un entorno natural. El objetivo no es aprender técnicas, sino vivir un proceso de transformación interior real."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta un retiro espiritual en España?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El precio de un retiro espiritual en España varía según la duración, el alojamiento y las actividades incluidas. Los retiros de fin de semana con todo incluido suelen oscilar entre 200€ y 600€. En nuestro caso, el precio exacto se comunicará a las personas de la lista de espera antes de la apertura de plazas. Únete para ser la primera en saberlo."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué se hace en un retiro de Reiki?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "En un retiro de Reiki se realizan sesiones de canalización de energía para liberar bloqueos físicos, emocionales y energéticos. En nuestros retiros trabajamos con Reiki Delfín, una modalidad que conecta con la energía de sanación de los delfines y trabaja especialmente el equilibrio emocional y la claridad mental."
      }
    },
    {
      "@type": "Question",
      "name": "¿Para qué sirve un retiro de meditación?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Un retiro de meditación sirve para reducir el estrés y la ansiedad, desarrollar la atención plena, reconectar con uno mismo y cultivar la paz interior. A diferencia de la práctica en casa, el retiro proporciona un entorno libre de distracciones y una guía experta que facilita llegar a estados más profundos de calma."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué incluye un retiro de bienestar con Luisa Corral?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Los retiros de bienestar con Luisa Corral incluyen: sesiones de meditación guiada mañana y noche, sesión de Reiki Delfín individual o grupal, terapia con Flores de Bach personalizada, sesión de coaching personal, espacios de silencio y conexión con la naturaleza, y materiales de trabajo. El alojamiento y las comidas se especificarán en cada convocatoria."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cómo prepararse para un retiro espiritual?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Para prepararte para un retiro espiritual: reduce el consumo de alcohol y cafeína la semana anterior, descansa bien, lleva ropa cómoda y capas para diferentes temperaturas, un cuaderno para escribir, y sobre todo, llega con la mente abierta. No necesitas experiencia previa en meditación ni en ninguna técnica."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuántas personas van a un retiro?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Los retiros con Luisa Corral son grupos muy reducidos, con un máximo de 8 personas. Esto garantiza una atención personalizada, un ambiente íntimo y de confianza, y sesiones individuales dentro del grupo. No somos un retiro masivo: somos una experiencia de transformación personal profunda."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué ropa llevar a un retiro espiritual?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Para un retiro espiritual en Galicia se recomienda: ropa cómoda y holgada para las sesiones de meditación y Reiki (que puedas ponerte y quitarte fácilmente), capas para el frío (el clima gallego es cambiante), calzado para caminar por la naturaleza, y algo de abrigo para las horas de silencio al aire libre."
      }
    },
    {
      "@type": "Question",
      "name": "¿Dónde se celebra el retiro espiritual en Galicia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Los retiros se celebran en Galicia, en entornos naturales de la zona de Ferrolterra o Rías Altas. La ubicación exacta se comunica a las personas inscritas una vez confirmada la plaza. El objetivo es un lugar tranquilo, rodeado de naturaleza, accesible desde A Coruña, Ferrol, Santiago y Vigo."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto dura un retiro de meditación?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nuestros retiros tienen formato de fin de semana: de viernes por la tarde a domingo al mediodía (aproximadamente 44 horas). Esto permite una inmersión real sin que suponga una semana entera fuera de casa. Es el formato ideal para quienes quieren transformación profunda sin un largo período de ausencia."
      }
    },
    {
      "@type": "Question",
      "name": "¿Es necesario tener experiencia previa para ir a un retiro?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Los retiros con Luisa Corral están diseñados para personas en cualquier punto de su camino espiritual o de bienestar. Tanto si es tu primera experiencia con la meditación como si llevas años practicando, el retiro se adapta a tu nivel. Solo necesitas querer parar, escucharte y abrirte al proceso."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué diferencia hay entre un retiro de yoga y uno de Reiki?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Un retiro de yoga se centra en la práctica física de asanas (posturas) combinada con meditación y respiración. Un retiro de Reiki trabaja principalmente a nivel energético y emocional mediante la canalización de energía de sanación. Nuestros retiros integran ambas dimensiones: cuerpo, mente, emociones y espíritu, sin que sea un retiro exclusivamente de yoga ni solo de Reiki."
      }
    }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Retiros Espirituales en Galicia",
  "description": "Retiros de bienestar de fin de semana en plena naturaleza gallega. Sesiones de Reiki Delfín, Flores de Bach, meditación guiada y coaching personal. Grupos reducidos de máximo 8 personas.",
  "url": "https://luisacorralcoach.com/retiros-espirituales-galicia",
  "provider": { "@id": "https://luisacorralcoach.com/#business" },
  "areaServed": "Galicia, España",
  "audience": {
    "@type": "Audience",
    "audienceType": "Mujeres que buscan transformación personal y bienestar emocional"
  }
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://luisacorralcoach.com/" },
    { "@type": "ListItem", "position": 2, "name": "Retiros Espirituales en Galicia" }
  ]
}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebPage","speakable":{"@type":"SpeakableSpecification","cssSelector":[".speakable-intro",".speakable-faq"]},"url":"https://luisacorralcoach.com/retiros-espirituales-galicia"}
</script>
    <link rel="modulepreload" href="/js/retiros/index.js">
    <script src="/js/cookie-consent.js" defer></script>
</head>
<body style="font-family:var(--font-family-body);">

<header id="global-header" class="code-section bg-[#FAF7FC] shadow-sm sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-20 md:h-28">
      <a href="/" class="flex-shrink-0 flex items-center justify-center h-full py-2">
        <img src="/assets/images/cf/xaKlCos5cTg_1RWzIu_h-A-b366db84-bd47-474a-5c88-9bc6624d9b00.webp" alt="Luisa Corral - Coach Holística y Terapéutica en Narón, Galicia" class="h-14 md:h-24 w-auto max-w-none" width="640" height="391" decoding="async">
      </a>
      <nav class="hidden lg:flex items-center space-x-8">
        <a href="/sobre-mi" class="text-[#2D1B3D] hover:text-[#9B7EBD] font-semibold transition-colors duration-300">Sobre Mí</a>
        <div class="relative group">
          <button type="button" aria-haspopup="true" aria-expanded="false" class="text-[#2D1B3D] hover:text-[#9B7EBD] font-semibold transition-colors duration-300 flex items-center gap-1 py-2">
            Servicios
            <i class="fa-solid fa-chevron-down text-xs"></i>
          </button>
          <div class="absolute left-0 mt-0 w-56 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 -translate-y-2 z-50 border border-[#E5D9F2]">
            <a href="/flores-de-bach" class="flex items-center gap-3 px-4 py-3 text-[#2D1B3D] hover:bg-[#FAF7FC] hover:text-[#9B7EBD] transition-colors rounded-t-xl">
              <i class="fa-solid fa-flower text-[#9B7EBD]"></i> Flores de Bach
            </a>
            <a href="/coaching-holistico" class="flex items-center gap-3 px-4 py-3 text-[#2D1B3D] hover:bg-[#FAF7FC] hover:text-[#9B7EBD] transition-colors">
              <i class="fa-solid fa-heart text-[#9B7EBD]"></i> Coaching Holístico
            </a>
            <a href="/meditaciones-personalizadas" class="flex items-center gap-3 px-4 py-3 text-[#2D1B3D] hover:bg-[#FAF7FC] hover:text-[#9B7EBD] transition-colors">
              <i class="fa-solid fa-spa text-[#9B7EBD]"></i> Meditaciones Personalizadas
            </a>
            <a href="/coaching-angelical" class="flex items-center gap-3 px-4 py-3 text-[#2D1B3D] hover:bg-[#FAF7FC] hover:text-[#9B7EBD] transition-colors">
              <i class="fa-solid fa-feather text-[#9B7EBD]"></i> Coaching Angelical
            </a>
            <a href="/reiki-delfin" class="flex items-center gap-3 px-4 py-3 text-[#2D1B3D] hover:bg-[#FAF7FC] hover:text-[#9B7EBD] transition-colors">
              <i class="fa-solid fa-water text-[#9B7EBD]"></i> Reiki Delfín
            </a>
            <a href="/retiros-espirituales-galicia" class="flex items-center gap-3 px-4 py-3 text-[#2D1B3D] hover:bg-[#FAF7FC] hover:text-[#9B7EBD] transition-colors rounded-b-xl font-semibold bg-[#FAF7FC]">
              <i class="fa-solid fa-tent text-[#9B7EBD]"></i> Retiros
            </a>
          </div>
        </div>
        <a href="/testimonios" class="text-[#2D1B3D] hover:text-[#9B7EBD] font-semibold transition-colors duration-300">Testimonios</a>
        <a href="/blog" class="text-[#2D1B3D] hover:text-[#9B7EBD] font-semibold transition-colors duration-300">Blog</a>
        <a href="/contacto" class="bg-[#9B7EBD] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#7A5FA0] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">Agenda tu Sesión</a>
      </nav>
      <button type="button" class="lg:hidden p-2 text-[#2D1B3D]" data-landingsite-mobile-menu-toggle="" aria-label="Abrir menú de navegación" aria-expanded="false">
        <i class="fa-solid fa-bars text-2xl"></i>
      </button>
    </div>
  </div>

  <a href="https://wa.me/34616054001" target="_blank" rel="noopener noreferrer nofollow" class="fixed bottom-20 md:bottom-6 right-6 w-14 h-14 md:w-16 md:h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-[#20BD5A] transition-all duration-300 z-[2147483647] group" style="z-index: 2147483647 !important; position: fixed !important;">
    <i class="fa-brands fa-whatsapp text-white text-2xl md:text-3xl"></i>
    <span class="absolute right-full mr-3 bg-[#2D1B3D] text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">Escribir por WhatsApp</span>
  </a>

  <div class="lg:hidden hidden bg-[#FAF7FC] border-t border-[#E5D9F2]" data-landingsite-mobile-menu="">
    <div class="px-4 py-4 space-y-3">
      <a href="/sobre-mi" class="block text-[#2D1B3D] hover:text-[#9B7EBD] font-semibold py-2">Sobre Mí</a>
      <div class="space-y-2">
        <span class="block text-[#2D1B3D] font-semibold py-2">
          <i class="fa-solid fa-spa mr-2 text-[#9B7EBD]"></i>Servicios
        </span>
        <div class="pl-4 border-l-2 border-[#E5D9F2] ml-2 space-y-2">
          <a href="/flores-de-bach" class="flex items-center gap-2 text-[#6B5B7A] hover:text-[#9B7EBD] py-1"><i class="fa-solid fa-flower text-sm"></i> Flores de Bach</a>
          <a href="/coaching-holistico" class="flex items-center gap-2 text-[#6B5B7A] hover:text-[#9B7EBD] py-1"><i class="fa-solid fa-heart text-sm"></i> Coaching Holístico</a>
          <a href="/meditaciones-personalizadas" class="flex items-center gap-2 text-[#6B5B7A] hover:text-[#9B7EBD] py-1"><i class="fa-solid fa-spa text-sm"></i> Meditaciones</a>
          <a href="/coaching-angelical" class="flex items-center gap-2 text-[#6B5B7A] hover:text-[#9B7EBD] py-1"><i class="fa-solid fa-feather text-sm"></i> Coaching Angelical</a>
          <a href="/reiki-delfin" class="flex items-center gap-2 text-[#6B5B7A] hover:text-[#9B7EBD] py-1"><i class="fa-solid fa-water text-sm"></i> Reiki Delfín</a>
          <a href="/retiros-espirituales-galicia" class="flex items-center gap-2 text-[#6B5B7A] hover:text-[#9B7EBD] py-1 font-semibold"><i class="fa-solid fa-tent text-sm"></i> Retiros</a>
        </div>
      </div>
      <a href="/testimonios" class="block text-[#2D1B3D] hover:text-[#9B7EBD] font-semibold py-2">Testimonios</a>
      <a href="/blog" class="block text-[#2D1B3D] hover:text-[#9B7EBD] font-semibold py-2">Blog</a>
      <a href="/contacto" class="block bg-[#9B7EBD] text-white px-6 py-3 rounded-full font-semibold text-center mt-4">Agenda tu Sesión</a>
    </div>
  </div>
</header>

<!-- HERO -->
<section class="code-section py-20 bg-gradient-to-br from-[#FAF7FC] to-[#F0EAF7] overflow-hidden relative" id="retiros-hero">
  <div class="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] rounded-full opacity-5 blur-3xl"></div>
  <div class="absolute bottom-0 left-0 w-48 h-48 bg-[#9B7EBD] rounded-full opacity-5 blur-3xl"></div>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <span class="inline-block px-4 py-2 bg-[#E8D7F1] text-[#7A5FA0] rounded-full text-sm font-semibold mb-4">
          ✨ Retiros Espirituales · Galicia
        </span>
        <h1 class="text-4xl md:text-5xl font-bold text-[#2D1B3D] mb-6 leading-tight">
          Retiros Espirituales en <span class="text-[#9B7EBD]">Galicia</span>
          <br>Reiki, Meditación y Bienestar
        </h1>
        <p class="speakable-intro text-lg text-[#6B5B7A] mb-6 leading-relaxed">
          Un fin de semana de desconexión total en plena naturaleza gallega. Reiki Delfín, Flores de Bach, meditación guiada y coaching personal en grupo reducido. Una experiencia de transformación que no se parece a ningún curso.
        </p>
        <p class="text-[#6B5B7A] mb-8">
          Estoy preparando los primeros retiros. Las plazas serán muy limitadas — <strong class="text-[#2D1B3D]">máximo 8 personas</strong> — y se comunicarán primero a las personas de la lista de espera.
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <a href="#lista-de-espera" class="inline-flex items-center justify-center bg-[#9B7EBD] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#7A5FA0] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <i class="fa-solid fa-bell mr-3"></i>
            Apúntate a la lista de espera
          </a>
          <a href="#que-incluyen" class="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-lg border-2 border-[#9B7EBD] text-[#9B7EBD] hover:bg-[#9B7EBD] hover:text-white transition-all duration-300">
            ¿Qué incluye?
          </a>
        </div>
        <div class="mt-8 flex flex-col sm:flex-row gap-4 text-sm text-[#6B5B7A]">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-users text-[#9B7EBD]"></i>
            <span>Máximo 8 personas</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-leaf text-[#9B7EBD]"></i>
            <span>Plena naturaleza gallega</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-calendar-weekend text-[#9B7EBD]"></i>
            <span>Formato fin de semana</span>
          </div>
        </div>
      </div>
      <div class="relative hidden lg:block">
        <div class="relative rounded-3xl overflow-hidden shadow-2xl">
          <img src="/assets/images/cf/xaKlCos5cTg_1RWzIu_h-A-f9775a9c-9e0c-4f03-95ec-7351e41d3000.webp" alt="Sesión de meditación y sanación en retiro espiritual en Galicia con cuencos tibetanos" class="w-full h-[500px] object-cover" width="1620" height="1080" loading="eager" fetchpriority="high" decoding="async">
          <div class="absolute inset-0 bg-gradient-to-t from-[#2D1B3D] to-transparent opacity-20"></div>
        </div>
        <div class="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-[#E8D7F1] rounded-full flex items-center justify-center">
              <i class="fa-solid fa-tent text-[#9B7EBD] text-xl"></i>
            </div>
            <div>
              <p class="font-bold text-[#2D1B3D]">Retiro de</p>
              <p class="text-sm text-[#6B5B7A]">fin de semana</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- QUÉ ES UN RETIRO CON LUISA -->
<section class="code-section py-16 bg-white" id="que-es-retiro-espiritual">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <span class="inline-block px-4 py-2 bg-[#E8D7F1] text-[#7A5FA0] rounded-full text-sm font-semibold mb-4">Descubre</span>
      <h2 class="text-3xl md:text-4xl font-bold text-[#2D1B3D] mb-6">
        ¿Qué es un <span class="text-[#9B7EBD]">retiro espiritual</span> con Luisa Corral?
      </h2>
      <p class="text-lg text-[#6B5B7A] mb-6 leading-relaxed">
        Un retiro espiritual no es un curso, ni un taller, ni una escapada de fin de semana normal. Es un espacio de tiempo detenido en el que sales de tu vida habitual para poder verla con claridad. Sin agenda, sin notificaciones, sin el peso de lo cotidiano.
      </p>
      <p class="text-lg text-[#6B5B7A] mb-8 leading-relaxed">
        En mis retiros combinamos <a href="/reiki-delfin" class="text-[#9B7EBD] underline hover:text-[#7A5FA0]">Reiki Delfín</a>, <a href="/flores-de-bach" class="text-[#9B7EBD] underline hover:text-[#7A5FA0]">Flores de Bach</a>, <a href="/meditaciones-personalizadas" class="text-[#9B7EBD] underline hover:text-[#7A5FA0]">meditación guiada</a> y <a href="/coaching-holistico" class="text-[#9B7EBD] underline hover:text-[#7A5FA0]">coaching personal</a> en un entorno natural de Galicia. La naturaleza gallega — el verde, el mar, el silencio — no es un decorado: es parte del proceso.
      </p>
      <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-[#FAF7FC] rounded-2xl p-6 border border-[#E5D9F2]">
          <div class="w-12 h-12 bg-[#E8D7F1] rounded-full flex items-center justify-center mb-4">
            <i class="fa-solid fa-person-praying text-[#9B7EBD] text-xl"></i>
          </div>
          <h3 class="font-bold text-[#2D1B3D] mb-2">Transformación real</h3>
          <p class="text-[#6B5B7A] text-sm">No técnicas que aprender en casa. Una experiencia que te cambia mientras la vives.</p>
        </div>
        <div class="bg-[#FAF7FC] rounded-2xl p-6 border border-[#E5D9F2]">
          <div class="w-12 h-12 bg-[#E8D7F1] rounded-full flex items-center justify-center mb-4">
            <i class="fa-solid fa-users text-[#9B7EBD] text-xl"></i>
          </div>
          <h3 class="font-bold text-[#2D1B3D] mb-2">Grupos de 8 personas</h3>
          <p class="text-[#6B5B7A] text-sm">La intimidad y confianza que no existe en un retiro masivo. Cada persona recibe atención individual.</p>
        </div>
        <div class="bg-[#FAF7FC] rounded-2xl p-6 border border-[#E5D9F2]">
          <div class="w-12 h-12 bg-[#E8D7F1] rounded-full flex items-center justify-center mb-4">
            <i class="fa-solid fa-leaf text-[#9B7EBD] text-xl"></i>
          </div>
          <h3 class="font-bold text-[#2D1B3D] mb-2">Naturaleza gallega</h3>
          <p class="text-[#6B5B7A] text-sm">El entorno natural de Galicia como parte activa del proceso de sanación y reconexión.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- TÉCNICAS QUE TRABAJAMOS -->
<section class="code-section py-16 bg-[#FAF7FC]" id="tecnicas-retiro">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <span class="inline-block px-4 py-2 bg-white text-[#7A5FA0] rounded-full text-sm font-semibold mb-4">Herramientas</span>
      <h2 class="text-3xl md:text-4xl font-bold text-[#2D1B3D] mb-4">
        Técnicas que trabajamos en el <span class="text-[#9B7EBD]">retiro</span>
      </h2>
      <p class="text-lg text-[#6B5B7A] max-w-3xl mx-auto">
        Cada retiro integra cuatro disciplinas que actúan de forma sinérgica. No son módulos independientes: se entrelazan para crear una experiencia holística completa.
      </p>
    </div>
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

      <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="w-14 h-14 bg-gradient-to-br from-[#9B7EBD] to-[#7A5FA0] rounded-2xl flex items-center justify-center mb-4">
          <i class="fa-solid fa-water text-white text-2xl"></i>
        </div>
        <h3 class="text-xl font-bold text-[#2D1B3D] mb-3">Reiki Delfín</h3>
        <p class="text-[#6B5B7A] text-sm leading-relaxed">
          Sesiones de canalización de energía de sanación para liberar bloqueos emocionales y recuperar el equilibrio energético. El Reiki Delfín trabaja especialmente la claridad mental y la paz interior.
        </p>
        <a href="/reiki-delfin" class="inline-flex items-center mt-4 text-[#9B7EBD] text-sm font-semibold hover:text-[#7A5FA0] transition-colors">
          Saber más <i class="fa-solid fa-arrow-right ml-1 text-xs"></i>
        </a>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="w-14 h-14 bg-gradient-to-br from-[#9B7EBD] to-[#7A5FA0] rounded-2xl flex items-center justify-center mb-4">
          <i class="fa-solid fa-flower text-white text-2xl"></i>
        </div>
        <h3 class="text-xl font-bold text-[#2D1B3D] mb-3">Flores de Bach</h3>
        <p class="text-[#6B5B7A] text-sm leading-relaxed">
          Diagnóstico y preparación de la fórmula floral personalizada para cada participante. Las esencias actúan durante todo el retiro y continúan su efecto en las semanas siguientes.
        </p>
        <a href="/flores-de-bach" class="inline-flex items-center mt-4 text-[#9B7EBD] text-sm font-semibold hover:text-[#7A5FA0] transition-colors">
          Saber más <i class="fa-solid fa-arrow-right ml-1 text-xs"></i>
        </a>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="w-14 h-14 bg-gradient-to-br from-[#9B7EBD] to-[#7A5FA0] rounded-2xl flex items-center justify-center mb-4">
          <i class="fa-solid fa-spa text-white text-2xl"></i>
        </div>
        <h3 class="text-xl font-bold text-[#2D1B3D] mb-3">Meditación guiada</h3>
        <p class="text-[#6B5B7A] text-sm leading-relaxed">
          Sesiones de meditación guiada mañana y noche adaptadas al nivel del grupo. Mindfulness, visualización, meditación con sonidos y espacios de silencio en la naturaleza.
        </p>
        <a href="/meditaciones-personalizadas" class="inline-flex items-center mt-4 text-[#9B7EBD] text-sm font-semibold hover:text-[#7A5FA0] transition-colors">
          Saber más <i class="fa-solid fa-arrow-right ml-1 text-xs"></i>
        </a>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="w-14 h-14 bg-gradient-to-br from-[#9B7EBD] to-[#7A5FA0] rounded-2xl flex items-center justify-center mb-4">
          <i class="fa-solid fa-heart text-white text-2xl"></i>
        </div>
        <h3 class="text-xl font-bold text-[#2D1B3D] mb-3">Coaching personal</h3>
        <p class="text-[#6B5B7A] text-sm leading-relaxed">
          Sesión individual de coaching holístico integrada en el retiro. Un espacio para clarificar lo que estás viviendo, integrar lo que surge y definir los pasos después del retiro.
        </p>
        <a href="/coaching-holistico" class="inline-flex items-center mt-4 text-[#9B7EBD] text-sm font-semibold hover:text-[#7A5FA0] transition-colors">
          Saber más <i class="fa-solid fa-arrow-right ml-1 text-xs"></i>
        </a>
      </div>

    </div>
  </div>
</section>

<!-- RETIRO FIN DE SEMANA - ESTRUCTURA -->
<section class="code-section py-16 bg-white" id="retiro-fin-de-semana">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <span class="inline-block px-4 py-2 bg-[#E8D7F1] text-[#7A5FA0] rounded-full text-sm font-semibold mb-4">Formato</span>
        <h2 class="text-3xl md:text-4xl font-bold text-[#2D1B3D] mb-6">
          Retiro de <span class="text-[#9B7EBD]">fin de semana</span> en plena naturaleza
        </h2>
        <p class="text-lg text-[#6B5B7A] mb-6 leading-relaxed">
          De viernes por la tarde a domingo al mediodía. Un formato que permite una inmersión real sin que suponga una semana entera fuera de casa. El tiempo suficiente para que algo en ti cambie.
        </p>
        <div class="space-y-4">
          <div class="flex items-start gap-4 p-4 bg-[#FAF7FC] rounded-2xl border border-[#E5D9F2]">
            <div class="w-10 h-10 bg-[#E8D7F1] rounded-full flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-sun text-[#D4AF37]"></i>
            </div>
            <div>
              <p class="font-bold text-[#2D1B3D] mb-1">Viernes — Llegada y bienvenida</p>
              <p class="text-[#6B5B7A] text-sm">Instalación, presentación del grupo, meditación de apertura, cena compartida y primera sesión de Flores de Bach.</p>
            </div>
          </div>
          <div class="flex items-start gap-4 p-4 bg-[#FAF7FC] rounded-2xl border border-[#E5D9F2]">
            <div class="w-10 h-10 bg-[#E8D7F1] rounded-full flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-moon text-[#9B7EBD]"></i>
            </div>
            <div>
              <p class="font-bold text-[#2D1B3D] mb-1">Sábado — Día completo de trabajo</p>
              <p class="text-[#6B5B7A] text-sm">Meditación al amanecer, sesiones de Reiki Delfín, coaching individual, espacios de silencio en la naturaleza, meditación nocturna.</p>
            </div>
          </div>
          <div class="flex items-start gap-4 p-4 bg-[#FAF7FC] rounded-2xl border border-[#E5D9F2]">
            <div class="w-10 h-10 bg-[#E8D7F1] rounded-full flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-star text-[#D4AF37]"></i>
            </div>
            <div>
              <p class="font-bold text-[#2D1B3D] mb-1">Domingo — Integración y cierre</p>
              <p class="text-[#6B5B7A] text-sm">Meditación matinal, círculo de integración, cierre ceremonial, plan personal de continuidad y despedida.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="relative">
        <div class="relative rounded-3xl overflow-hidden shadow-2xl">
          <img src="/assets/images/cf/xaKlCos5cTg_1RWzIu_h-A-6fde892a-5b92-429a-33c0-0d0183399a00.webp" alt="Sesión de Reiki Delfín en retiro de bienestar en Galicia" class="w-full h-[450px] object-cover" width="1600" height="1067" loading="lazy" decoding="async">
        </div>
        <div class="absolute -top-4 -left-4 w-full h-full border-2 border-[#D4AF37] rounded-3xl -z-10"></div>
        <div class="absolute -bottom-4 -right-4 bg-[#9B7EBD] text-white rounded-2xl p-4 shadow-xl text-center">
          <p class="text-4xl font-bold">44h</p>
          <p class="text-sm">de inmersión<br>transformadora</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- PARA QUIÉNES + QUÉ INCLUYE -->
<section class="code-section py-16 bg-[#FAF7FC]" id="que-incluyen">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-12">

      <!-- Para quiénes -->
      <div>
        <span class="inline-block px-4 py-2 bg-white text-[#7A5FA0] rounded-full text-sm font-semibold mb-4">¿Para quiénes?</span>
        <h2 class="text-3xl font-bold text-[#2D1B3D] mb-6">
          ¿Para quiénes son los <span class="text-[#9B7EBD]">retiros</span>?
        </h2>
        <p class="text-[#6B5B7A] mb-6">Los retiros son para mujeres (y hombres) que sienten que necesitan parar. Que llevan tiempo sintiéndose desbordadas, desconectadas o simplemente con ganas de algo más profundo que unas vacaciones normales.</p>
        <ul class="space-y-3">
          <li class="flex items-start gap-3">
            <div class="w-8 h-8 bg-[#E8D7F1] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <i class="fa-solid fa-check text-[#9B7EBD] text-xs"></i>
            </div>
            <p class="text-[#6B5B7A]">Mujeres que se sienten estresadas, vacías o sin propósito claro</p>
          </li>
          <li class="flex items-start gap-3">
            <div class="w-8 h-8 bg-[#E8D7F1] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <i class="fa-solid fa-check text-[#9B7EBD] text-xs"></i>
            </div>
            <p class="text-[#6B5B7A]">Personas que quieren un primer contacto con el mundo espiritual en un entorno seguro</p>
          </li>
          <li class="flex items-start gap-3">
            <div class="w-8 h-8 bg-[#E8D7F1] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <i class="fa-solid fa-check text-[#9B7EBD] text-xs"></i>
            </div>
            <p class="text-[#6B5B7A]">Quienes ya trabajan conmigo en sesiones individuales y quieren profundizar</p>
          </li>
          <li class="flex items-start gap-3">
            <div class="w-8 h-8 bg-[#E8D7F1] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <i class="fa-solid fa-check text-[#9B7EBD] text-xs"></i>
            </div>
            <p class="text-[#6B5B7A]">Personas en momentos de transición vital: cambio de trabajo, duelo, separación, nueva etapa</p>
          </li>
          <li class="flex items-start gap-3">
            <div class="w-8 h-8 bg-[#E8D7F1] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <i class="fa-solid fa-check text-[#9B7EBD] text-xs"></i>
            </div>
            <p class="text-[#6B5B7A]">Cualquiera que sienta la llamada y no sepa exactamente por qué</p>
          </li>
        </ul>
      </div>

      <!-- Qué incluyen -->
      <div>
        <span class="inline-block px-4 py-2 bg-white text-[#7A5FA0] rounded-full text-sm font-semibold mb-4">Contenido</span>
        <h2 class="text-3xl font-bold text-[#2D1B3D] mb-6">
          ¿Qué <span class="text-[#9B7EBD]">incluyen</span> los retiros?
        </h2>
        <div class="space-y-3">
          <div class="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E5D9F2]">
            <i class="fa-solid fa-spa text-[#9B7EBD] text-lg flex-shrink-0"></i>
            <span class="text-[#2D1B3D]">Sesiones de meditación guiada (mañana y noche)</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E5D9F2]">
            <i class="fa-solid fa-water text-[#9B7EBD] text-lg flex-shrink-0"></i>
            <span class="text-[#2D1B3D]">Sesión de Reiki Delfín individual</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E5D9F2]">
            <i class="fa-solid fa-flower text-[#9B7EBD] text-lg flex-shrink-0"></i>
            <span class="text-[#2D1B3D]">Fórmula de Flores de Bach personalizada</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E5D9F2]">
            <i class="fa-solid fa-heart text-[#9B7EBD] text-lg flex-shrink-0"></i>
            <span class="text-[#2D1B3D]">Sesión de coaching personal individual</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E5D9F2]">
            <i class="fa-solid fa-book text-[#9B7EBD] text-lg flex-shrink-0"></i>
            <span class="text-[#2D1B3D]">Materiales de trabajo y cuaderno de retiro</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E5D9F2]">
            <i class="fa-solid fa-leaf text-[#9B7EBD] text-lg flex-shrink-0"></i>
            <span class="text-[#2D1B3D]">Espacios de silencio en la naturaleza</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E5D9F2]">
            <i class="fa-solid fa-people-group text-[#9B7EBD] text-lg flex-shrink-0"></i>
            <span class="text-[#2D1B3D]">Círculos de grupo e integración</span>
          </div>
          <p class="text-sm text-[#6B5B7A] mt-4 pl-2 italic">* El alojamiento y las comidas se especificarán en cada convocatoria según el formato elegido.</p>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- LISTA DE ESPERA - MAIN CTA -->
<section class="code-section py-20 bg-gradient-to-br from-[#FAF7FC] to-[#E8D7F1]" id="lista-de-espera">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-12 items-start">

      <!-- Texto -->
      <div>
        <span class="inline-block px-4 py-2 bg-[#9B7EBD] text-white rounded-full text-sm font-semibold mb-4">
          Plazas limitadas
        </span>
        <h2 class="text-3xl md:text-4xl font-bold text-[#2D1B3D] mb-6">
          Apúntate a la <span class="text-[#9B7EBD]">lista de espera</span>
        </h2>
        <p class="text-lg text-[#6B5B7A] mb-6 leading-relaxed">
          Estoy preparando los primeros retiros para 2026. Las fechas, ubicación y precio se comunicarán <strong class="text-[#2D1B3D]">primero a las personas de esta lista</strong>, con tiempo de sobra para organizarte.
        </p>
        <div class="space-y-4 mb-8">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-[#E8D7F1] rounded-full flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-bell text-[#9B7EBD]"></i>
            </div>
            <p class="text-[#6B5B7A]">Recibes la información antes que nadie</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-[#E8D7F1] rounded-full flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-lock text-[#9B7EBD]"></i>
            </div>
            <p class="text-[#6B5B7A]">Sin compromiso de reserva al apuntarte</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-[#E8D7F1] rounded-full flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-users text-[#9B7EBD]"></i>
            </div>
            <p class="text-[#6B5B7A]">Solo 8 plazas por retiro</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-[#E8D7F1] rounded-full flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-gift text-[#9B7EBD]"></i>
            </div>
            <p class="text-[#6B5B7A]">Las personas de la lista tienen acceso a un precio especial de early bird</p>
          </div>
        </div>
        <blockquote class="border-l-4 border-[#9B7EBD] pl-4 italic text-[#6B5B7A]">
          "El retiro no te da respuestas. Te da el silencio necesario para que las tuyas propias emerjan."
          <cite class="block mt-2 text-sm font-semibold text-[#9B7EBD] not-italic">— Luisa Corral</cite>
        </blockquote>
      </div>

      <!-- Formulario -->
      <div class="bg-white rounded-3xl p-8 md:p-10 shadow-xl">
        <h3 class="text-2xl font-bold text-[#2D1B3D] mb-2">Quiero unirme a la lista</h3>
        <p class="text-[#6B5B7A] text-sm mb-6">Te contactaré en cuanto tenga fechas confirmadas. Sin spam, solo lo relevante.</p>
        <form class="space-y-5" action="https://formspree.io/f/mvzyroqk" method="POST">
          <input type="hidden" name="_subject" value="Lista de espera retiro — Luisa Corral Coach">
          <input type="hidden" name="_next" value="https://luisacorralcoach.com/retiros-espirituales-galicia/?apuntada=1">

          <div>
            <label class="block text-[#2D1B3D] font-semibold mb-2" for="nombre-retiro">Nombre</label>
            <input type="text" id="nombre-retiro" name="nombre" required class="w-full px-4 py-3 rounded-xl border border-[#E5D9F2] focus:border-[#9B7EBD] focus:ring-2 focus:ring-[#9B7EBD] outline-none transition-all" placeholder="Tu nombre">
          </div>

          <div>
            <label class="block text-[#2D1B3D] font-semibold mb-2" for="email-retiro">Email</label>
            <input type="email" id="email-retiro" name="email" required class="w-full px-4 py-3 rounded-xl border border-[#E5D9F2] focus:border-[#9B7EBD] focus:ring-2 focus:ring-[#9B7EBD] outline-none transition-all" placeholder="tu@email.com">
          </div>

          <div>
            <label class="block text-[#2D1B3D] font-semibold mb-2" for="telefono-retiro">Teléfono (opcional)</label>
            <input type="tel" id="telefono-retiro" name="telefono" class="w-full px-4 py-3 rounded-xl border border-[#E5D9F2] focus:border-[#9B7EBD] focus:ring-2 focus:ring-[#9B7EBD] outline-none transition-all" placeholder="+34 000 000 000">
          </div>

          <div>
            <label class="block text-[#2D1B3D] font-semibold mb-2" for="motivacion-retiro">¿Qué te gustaría trabajar o vivir en el retiro? (opcional)</label>
            <textarea id="motivacion-retiro" name="motivacion" rows="3" class="w-full px-4 py-3 rounded-xl border border-[#E5D9F2] focus:border-[#9B7EBD] focus:ring-2 focus:ring-[#9B7EBD] outline-none transition-all resize-none" placeholder="Cuéntame brevemente qué te lleva a interesarte por el retiro..."></textarea>
          </div>

          <label class="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" name="politica_proteccion_datos" value="aceptado" required class="mt-1 w-5 h-5 rounded border-[#E5D9F2] text-[#9B7EBD] focus:ring-[#9B7EBD]">
            <span class="text-sm text-[#6B5B7A]">He leído y acepto la <a href="/politica-de-privacidad" class="text-[#9B7EBD] underline hover:text-[#7A5FA0]">Política de Protección de Datos</a></span>
          </label>

          <button type="submit" class="w-full bg-[#9B7EBD] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#7A5FA0] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <i class="fa-solid fa-bell mr-2"></i> Apuntarme a la lista de espera
          </button>

          <p class="text-center text-sm text-[#6B5B7A]">
            <i class="fa-solid fa-lock mr-1"></i>
            Tus datos están protegidos. Te responderé en cuanto haya fechas.
          </p>
        </form>
      </div>

    </div>
  </div>
</section>

<!-- FAQ -->
<section class="code-section py-16 bg-white" id="faq-retiro">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <span class="inline-block px-4 py-2 bg-[#E8D7F1] text-[#7A5FA0] rounded-full text-sm font-semibold mb-4">Preguntas frecuentes</span>
      <h2 class="text-3xl md:text-4xl font-bold text-[#2D1B3D] mb-4 speakable-faq">
        Todo lo que necesitas saber sobre los <span class="text-[#9B7EBD]">retiros</span>
      </h2>
    </div>

    <div class="space-y-4" id="faq-accordion">

      <div class="bg-[#FAF7FC] rounded-2xl border border-[#E5D9F2] overflow-hidden faq-item">
        <button class="w-full flex items-center justify-between p-6 text-left font-semibold text-[#2D1B3D] hover:text-[#9B7EBD] transition-colors faq-trigger">
          <span>¿Qué es un retiro espiritual?</span>
          <i class="fa-solid fa-chevron-down text-[#9B7EBD] transition-transform duration-300 accordion-icon flex-shrink-0 ml-4"></i>
        </button>
        <div class="faq-body hidden px-6 pb-6">
          <p class="text-[#6B5B7A] leading-relaxed">Un retiro espiritual es una experiencia inmersiva de 2-3 días en la que te desconectas de la rutina para reconectar contigo misma. Se combina silencio, meditación, trabajo energético (Reiki, Flores de Bach) y coaching personal en un entorno natural. El objetivo no es aprender técnicas, sino vivir un proceso de transformación interior real que difícilmente consigues en el día a día.</p>
        </div>
      </div>

      <div class="bg-[#FAF7FC] rounded-2xl border border-[#E5D9F2] overflow-hidden faq-item">
        <button class="w-full flex items-center justify-between p-6 text-left font-semibold text-[#2D1B3D] hover:text-[#9B7EBD] transition-colors faq-trigger">
          <span>¿Cuánto cuesta un retiro espiritual?</span>
          <i class="fa-solid fa-chevron-down text-[#9B7EBD] transition-transform duration-300 accordion-icon flex-shrink-0 ml-4"></i>
        </button>
        <div class="faq-body hidden px-6 pb-6">
          <p class="text-[#6B5B7A] leading-relaxed">El precio exacto se comunicará a las personas de la lista de espera antes de la apertura oficial de plazas. Las personas inscritas en la lista tendrán acceso a un precio early bird. Para referencia, los retiros de fin de semana con todo incluido en España suelen oscilar entre 200€ y 500€ según el alojamiento y las actividades.</p>
        </div>
      </div>

      <div class="bg-[#FAF7FC] rounded-2xl border border-[#E5D9F2] overflow-hidden faq-item">
        <button class="w-full flex items-center justify-between p-6 text-left font-semibold text-[#2D1B3D] hover:text-[#9B7EBD] transition-colors faq-trigger">
          <span>¿Necesito experiencia previa para ir a un retiro?</span>
          <i class="fa-solid fa-chevron-down text-[#9B7EBD] transition-transform duration-300 accordion-icon flex-shrink-0 ml-4"></i>
        </button>
        <div class="faq-body hidden px-6 pb-6">
          <p class="text-[#6B5B7A] leading-relaxed">No. Los retiros están diseñados para personas en cualquier punto de su camino. Tanto si es tu primera experiencia con la meditación como si llevas años practicando, el retiro se adapta al nivel del grupo y de cada persona. Solo necesitas querer parar, escucharte y abrirte al proceso.</p>
        </div>
      </div>

      <div class="bg-[#FAF7FC] rounded-2xl border border-[#E5D9F2] overflow-hidden faq-item">
        <button class="w-full flex items-center justify-between p-6 text-left font-semibold text-[#2D1B3D] hover:text-[#9B7EBD] transition-colors faq-trigger">
          <span>¿Dónde se celebra el retiro espiritual en Galicia?</span>
          <i class="fa-solid fa-chevron-down text-[#9B7EBD] transition-transform duration-300 accordion-icon flex-shrink-0 ml-4"></i>
        </button>
        <div class="faq-body hidden px-6 pb-6">
          <p class="text-[#6B5B7A] leading-relaxed">Los retiros se celebran en Galicia, en entornos naturales de la zona de Ferrolterra o Rías Altas. La ubicación exacta se comunica a las personas inscritas una vez confirmada la plaza. El objetivo es un lugar tranquilo, rodeado de naturaleza, accesible desde A Coruña, Ferrol, Santiago de Compostela y Vigo.</p>
        </div>
      </div>

      <div class="bg-[#FAF7FC] rounded-2xl border border-[#E5D9F2] overflow-hidden faq-item">
        <button class="w-full flex items-center justify-between p-6 text-left font-semibold text-[#2D1B3D] hover:text-[#9B7EBD] transition-colors faq-trigger">
          <span>¿Cuántas plazas hay?</span>
          <i class="fa-solid fa-chevron-down text-[#9B7EBD] transition-transform duration-300 accordion-icon flex-shrink-0 ml-4"></i>
        </button>
        <div class="faq-body hidden px-6 pb-6">
          <p class="text-[#6B5B7A] leading-relaxed">Máximo 8 personas por retiro. Esta limitación es deliberada y no cambiará. La intimidad del grupo es parte esencial de la experiencia: permite sesiones individuales dentro del grupo, un nivel de confianza que no existe en grupos grandes, y una atención personalizada real.</p>
        </div>
      </div>

      <div class="bg-[#FAF7FC] rounded-2xl border border-[#E5D9F2] overflow-hidden faq-item">
        <button class="w-full flex items-center justify-between p-6 text-left font-semibold text-[#2D1B3D] hover:text-[#9B7EBD] transition-colors faq-trigger">
          <span>¿Cuánto dura el retiro?</span>
          <i class="fa-solid fa-chevron-down text-[#9B7EBD] transition-transform duration-300 accordion-icon flex-shrink-0 ml-4"></i>
        </button>
        <div class="faq-body hidden px-6 pb-6">
          <p class="text-[#6B5B7A] leading-relaxed">El formato es de fin de semana: de viernes por la tarde (llegada aproximada 17h) a domingo al mediodía (despedida aproximada 14h). Aproximadamente 44 horas de inmersión. Es el tiempo suficiente para que algo cambie de verdad, sin que suponga una semana entera fuera de casa.</p>
        </div>
      </div>

      <div class="bg-[#FAF7FC] rounded-2xl border border-[#E5D9F2] overflow-hidden faq-item">
        <button class="w-full flex items-center justify-between p-6 text-left font-semibold text-[#2D1B3D] hover:text-[#9B7EBD] transition-colors faq-trigger">
          <span>¿Qué ropa llevar a un retiro espiritual?</span>
          <i class="fa-solid fa-chevron-down text-[#9B7EBD] transition-transform duration-300 accordion-icon flex-shrink-0 ml-4"></i>
        </button>
        <div class="faq-body hidden px-6 pb-6">
          <p class="text-[#6B5B7A] leading-relaxed">Ropa cómoda y holgada para las sesiones de meditación y Reiki. Capas para el frío gallego (el clima es cambiante incluso en verano). Calzado para caminar por la naturaleza. Algo de abrigo para las horas al aire libre. Nada formal, nada rígido: lo que te haga sentir libre y cómoda.</p>
        </div>
      </div>

      <div class="bg-[#FAF7FC] rounded-2xl border border-[#E5D9F2] overflow-hidden faq-item">
        <button class="w-full flex items-center justify-between p-6 text-left font-semibold text-[#2D1B3D] hover:text-[#9B7EBD] transition-colors faq-trigger">
          <span>¿Qué diferencia hay entre un retiro de yoga y uno de Reiki?</span>
          <i class="fa-solid fa-chevron-down text-[#9B7EBD] transition-transform duration-300 accordion-icon flex-shrink-0 ml-4"></i>
        </button>
        <div class="faq-body hidden px-6 pb-6">
          <p class="text-[#6B5B7A] leading-relaxed">Un retiro de yoga se centra en la práctica física de posturas, respiración y meditación. Un retiro de Reiki trabaja principalmente a nivel energético y emocional. Nuestros retiros integran ambas dimensiones y van más allá: añaden Flores de Bach, coaching personal y trabajo grupal, creando una experiencia holística que no es exclusivamente de yoga ni solo de Reiki.</p>
        </div>
      </div>

      <div class="bg-[#FAF7FC] rounded-2xl border border-[#E5D9F2] overflow-hidden faq-item">
        <button class="w-full flex items-center justify-between p-6 text-left font-semibold text-[#2D1B3D] hover:text-[#9B7EBD] transition-colors faq-trigger">
          <span>¿Para qué sirve un retiro de meditación?</span>
          <i class="fa-solid fa-chevron-down text-[#9B7EBD] transition-transform duration-300 accordion-icon flex-shrink-0 ml-4"></i>
        </button>
        <div class="faq-body hidden px-6 pb-6">
          <p class="text-[#6B5B7A] leading-relaxed">Un retiro de meditación sirve para reducir el estrés y la ansiedad, desarrollar la atención plena (mindfulness), reconectar con uno mismo y cultivar la paz interior. A diferencia de la práctica en casa, el retiro proporciona un entorno libre de distracciones y una guía experta que facilita alcanzar estados más profundos de calma y claridad.</p>
        </div>
      </div>

      <div class="bg-[#FAF7FC] rounded-2xl border border-[#E5D9F2] overflow-hidden faq-item">
        <button class="w-full flex items-center justify-between p-6 text-left font-semibold text-[#2D1B3D] hover:text-[#9B7EBD] transition-colors faq-trigger">
          <span>¿Cómo prepararse para un retiro espiritual?</span>
          <i class="fa-solid fa-chevron-down text-[#9B7EBD] transition-transform duration-300 accordion-icon flex-shrink-0 ml-4"></i>
        </button>
        <div class="faq-body hidden px-6 pb-6">
          <p class="text-[#6B5B7A] leading-relaxed">La semana antes del retiro: reduce el consumo de alcohol y cafeína, descansa bien, empieza a reducir el tiempo en redes sociales. El día de la llegada: llega descansada y sin prisa. Lo más importante: no hay que prepararse demasiado. El retiro no es un examen. Llega como estás. Eso es suficiente.</p>
        </div>
      </div>

      <div class="bg-[#FAF7FC] rounded-2xl border border-[#E5D9F2] overflow-hidden faq-item">
        <button class="w-full flex items-center justify-between p-6 text-left font-semibold text-[#2D1B3D] hover:text-[#9B7EBD] transition-colors faq-trigger">
          <span>¿Hay retiros para mujeres solas o de grupo?</span>
          <i class="fa-solid fa-chevron-down text-[#9B7EBD] transition-transform duration-300 accordion-icon flex-shrink-0 ml-4"></i>
        </button>
        <div class="faq-body hidden px-6 pb-6">
          <p class="text-[#6B5B7A] leading-relaxed">Los retiros son grupales (máximo 8 personas) y la mayoría de personas asisten solas. De hecho, asistir sola suele ser la experiencia más transformadora: sin la dinámica de pareja o amigas de siempre, conectas de forma diferente contigo misma y con el grupo. Puedes venir sola con total tranquilidad.</p>
        </div>
      </div>

      <div class="bg-[#FAF7FC] rounded-2xl border border-[#E5D9F2] overflow-hidden faq-item">
        <button class="w-full flex items-center justify-between p-6 text-left font-semibold text-[#2D1B3D] hover:text-[#9B7EBD] transition-colors faq-trigger">
          <span>¿Qué se hace en un retiro de Reiki?</span>
          <i class="fa-solid fa-chevron-down text-[#9B7EBD] transition-transform duration-300 accordion-icon flex-shrink-0 ml-4"></i>
        </button>
        <div class="faq-body hidden px-6 pb-6">
          <p class="text-[#6B5B7A] leading-relaxed">En un retiro de Reiki se realizan sesiones de canalización de energía para liberar bloqueos físicos, emocionales y energéticos. En nuestros retiros trabajamos con <a href="/reiki-delfin" class="text-[#9B7EBD] underline hover:text-[#7A5FA0]">Reiki Delfín</a>, una modalidad que conecta con la energía de sanación de los delfines y trabaja especialmente el equilibrio emocional, la claridad mental y la reconexión con la alegría y la fluidez.</p>
        </div>
      </div>

    </div>

    <div class="text-center mt-12">
      <p class="text-[#6B5B7A] mb-4">¿Tienes otra pregunta que no está aquí?</p>
      <a href="https://wa.me/34616054001" target="_blank" rel="noopener noreferrer nofollow" class="inline-flex items-center justify-center bg-[#25D366] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#20BD5A] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
        <i class="fa-brands fa-whatsapp mr-3 text-xl"></i>
        Pregúntame por WhatsApp
      </a>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer id="global-footer" class="code-section bg-[#2D1B3D] text-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid md:grid-cols-2 lg:grid-cols-5 footer-with-enfoques gap-8 lg:gap-12">
      <div class="lg:col-span-1">
        <a href="/" class="inline-block mb-4 flex items-center justify-center">
          <img src="/assets/images/cf/xaKlCos5cTg_1RWzIu_h-A-b366db84-bd47-474a-5c88-9bc6624d9b00.webp" alt="Luisa Corral - Coach Holística y Terapéutica en Narón, Galicia" class="h-32 w-auto max-w-none" width="640" height="391" loading="lazy" decoding="async">
        </a>
        <p class="text-[#B8A4C9] text-sm mb-6">Coach Holístico y Terapéutico en Narón, Galicia. Te acompaño en tu proceso de transformación personal para encontrar el equilibrio entre cuerpo, mente, emociones y espíritu.</p>
        <div class="flex gap-4">
          <a target="_blank" href="https://wa.me/34616054001" rel="noopener noreferrer nofollow" class="w-10 h-10 bg-[#9B7EBD] rounded-full flex items-center justify-center hover:bg-[#7A5FA0] transition-colors"><i class="fa-brands fa-whatsapp"></i></a>
          <a href="mailto:luisacorralcoach@gmail.com" rel="noopener noreferrer nofollow" class="w-10 h-10 bg-[#9B7EBD] rounded-full flex items-center justify-center hover:bg-[#7A5FA0] transition-colors"><i class="fa-solid fa-envelope"></i></a>
          <a href="https://www.instagram.com/luisacorralcoach/" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Luisa Corral" class="w-10 h-10 bg-[#9B7EBD] rounded-full flex items-center justify-center hover:bg-[#7A5FA0] transition-colors"><i class="fa-brands fa-instagram" aria-hidden="true"></i></a>
          <a href="https://www.tiktok.com/@luisacorral_coach" target="_blank" rel="noopener noreferrer" aria-label="TikTok de Luisa Corral" class="w-10 h-10 bg-[#9B7EBD] rounded-full flex items-center justify-center hover:bg-[#7A5FA0] transition-colors"><i class="fa-brands fa-tiktok" aria-hidden="true"></i></a>
        </div>
      </div>
      <div>
        <p class="text-lg font-semibold mb-4 text-[#D4AF37]">Navegación</p>
        <ul class="space-y-3">
          <li><a href="/" class="text-[#B8A4C9] hover:text-white transition-colors">Inicio</a></li>
          <li><a href="/sobre-mi" class="text-[#B8A4C9] hover:text-white transition-colors">Sobre Mí</a></li>
          <li><a href="/enfoques" class="text-[#B8A4C9] hover:text-white transition-colors">Enfoques</a></li>
          <li><a href="/testimonios" class="text-[#B8A4C9] hover:text-white transition-colors">Testimonios</a></li>
          <li><a href="/blog" class="text-[#B8A4C9] hover:text-white transition-colors">Blog</a></li>
        </ul>
      </div>
      <div>
        <p class="text-lg font-semibold mb-4 text-[#D4AF37]">Servicios</p>
        <ul class="space-y-3">
          <li><a href="/coaching-holistico" class="text-[#B8A4C9] hover:text-white transition-colors">Coaching Holístico</a></li>
          <li><a href="/flores-de-bach" class="text-[#B8A4C9] hover:text-white transition-colors">Flores de Bach</a></li>
          <li><a href="/meditaciones-personalizadas" class="text-[#B8A4C9] hover:text-white transition-colors">Meditaciones Personalizadas</a></li>
          <li><a href="/coaching-angelical" class="text-[#B8A4C9] hover:text-white transition-colors">Coaching Angelical</a></li>
          <li><a href="/reiki-delfin" class="text-[#B8A4C9] hover:text-white transition-colors">Reiki Delfín</a></li>
          <li><a href="/retiros-espirituales-galicia" class="text-white font-semibold hover:text-[#D4AF37] transition-colors">Retiros</a></li>
        </ul>
      </div>
      <div data-enfoques-footer>
        <p class="text-lg font-semibold mb-4 text-[#D4AF37]">Enfoques</p>
        <ul class="space-y-3">
          <li><a href="/enfoques" class="text-[#B8A4C9] hover:text-white transition-colors">Todos los enfoques</a></li>
          <li><a href="/enfoques/gestion-estres-emociones" class="text-[#B8A4C9] hover:text-white transition-colors">Estrés y emociones</a></li>
          <li><a href="/enfoques/encontrar-proposito" class="text-[#B8A4C9] hover:text-white transition-colors">Propósito vital</a></li>
          <li><a href="/enfoques/equilibrio-vital" class="text-[#B8A4C9] hover:text-white transition-colors">Equilibrio vital</a></li>
          <li><a href="/enfoques/autoconocimiento-mindfulness" class="text-[#B8A4C9] hover:text-white transition-colors">Mindfulness</a></li>
          <li><a href="/enfoques/desbloqueo-energetico-emocional" class="text-[#B8A4C9] hover:text-white transition-colors">Desbloqueo energético</a></li>
        </ul>
      </div>
      <div>
        <p class="text-lg font-semibold mb-4 text-[#D4AF37]">Contacto</p>
        <ul class="space-y-3">
          <li class="flex items-center gap-2 text-[#B8A4C9]"><i class="fa-brands fa-whatsapp text-[#25D366]"></i><span>+34 616 054 001</span></li>
          <li class="flex items-center gap-2 text-[#B8A4C9]"><i class="fa-solid fa-phone text-[#9B7EBD]"></i><span>+34 616 054 001</span></li>
          <li class="flex items-center gap-2 text-[#B8A4C9]"><i class="fa-solid fa-envelope text-[#D4AF37]"></i><span><a href="mailto:luisacorralcoach@gmail.com" class="hover:text-[#D4AF37] transition-colors">luisacorralcoach@gmail.com</a></span></li>
          <li class="flex items-start gap-2 text-[#B8A4C9]"><i class="fa-solid fa-location-dot text-[#9B7EBD] mt-1"></i><span>Narón, Galicia, España</span></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-[#9B7EBD] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-[#B8A4C9] text-sm">© 2026 Luisa Corral - Coach Holística. Todos los derechos reservados.</p>
      <div class="flex gap-6 text-sm">
        <a href="/aviso-legal" class="text-[#B8A4C9] hover:text-white transition-colors">Aviso Legal</a>
        <a href="/politica-de-privacidad" class="text-[#B8A4C9] hover:text-white transition-colors">Política de Privacidad</a>
        <a href="/politica-de-cookies" class="text-[#B8A4C9] hover:text-white transition-colors">Política de Cookies</a>
      </div>
    </div>
  </div>
</footer>

<script type="module">
  const __landingsite_initPage = async () => {
    try {
      const module = await import('/js/retiros/index.js')
      if (module && typeof module.init === 'function') { module.init() }
    } catch (e) {}
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', __landingsite_initPage, { once: true })
  } else {
    __landingsite_initPage()
  }
</script>
<script defer src="/public/fontawesome-kit.js" crossorigin="anonymous"></script>
<script src="/public/site-enhancements.js" defer></script>
</body>
</html>`

writeFileSync(join(root, 'retiros-espirituales-galicia/index.html'), html, 'utf8')
console.log('✓ retiros-espirituales-galicia/index.html generado')
