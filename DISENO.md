# Diseño del catálogo

La interfaz usa una paleta de papel marfil y rojo cereza, tipografía Outfit con fuentes del sistema como alternativa, iconos SVG propios y productos reales de Supabase. No se añadieron bibliotecas de animación, mapas embebidos ni imágenes decorativas pesadas.

## Comportamientos

- Portada con navegación manual entre hasta seis productos disponibles. No cambia de producto automáticamente.
- Categorías en botones desplazables; filtros desplegables en pantallas de hasta 600 px. Búsqueda siempre visible y filtros activos que se pueden quitar individualmente.
- Tarjetas completas pulsables mediante un botón dentro del título, para conservar la estructura de encabezados y la navegación por teclado.
- Ficha de producto compacta con información centrada, sin botones de compartir ni llamadas repetidas a visitar la bodega. Usa diálogo nativo, cierre con Escape y retorno al control que la abrió, con alternativa para navegadores sin `showModal`.
- Navegación inferior móvil, espacio para las áreas seguras de iPhone, campos de búsqueda de 16 px para evitar el zoom de enfoque en iOS y botones principales de al menos 44 px.
- Fondos opacos antes de aplicar desenfoque opcional; altura `vh` antes de `dvh`; tamaños reservados para imágenes y alternativa visible ante errores de carga.
- Animaciones breves, efectos de hover solo para dispositivos con puntero apropiado, respeto de `prefers-reduced-motion`, soporte para colores forzados e impresión.
- La dirección abre una búsqueda en Google Maps solo al pulsar el enlace. El teléfono permite iniciar una llamada. No hay WhatsApp ni información de delivery.

## Compatibilidad y validación

Vite compila JavaScript para Chrome/Edge 111+, Firefox 114+, Safari/iOS 16.4+. La minificación CSS utiliza objetivos más conservadores. Los comportamientos alternativos no suponen soporte garantizado de toda la aplicación en navegadores anteriores.

Se comprobaron compilación de producción, ESLint, pruebas de filtros y contraste de los principales pares de texto/fondo. Estas comprobaciones no sustituyen una revisión visual e interactiva en navegadores: no hay navegador conectado en esta sesión. Sigue pendiente comprobar Chrome, Edge, Firefox y Safari en escritorio y móvil, incluidos zoom 200 %, teclado y apertura/cierre del detalle.

Archivos principales: `src/index.css`, `src/pages/Catalogo.jsx` y los componentes `Navbar`, `HeroSpotlight`, `ProductoCard`, `ProductoDetalle` e `Icon`.
