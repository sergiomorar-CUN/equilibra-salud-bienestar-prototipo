# Equilibra · Plataforma de Recomendaciones Saludables

Prototipo navegable e interactivo desarrollado para la Actividad de Construcción Aplicada (ACA) de la asignatura **Ingeniería Web**, Programa de Ingeniería de Sistemas, Corporación Unificada Nacional de Educación Superior (CUN).

## Información Institucional del Proyecto

* **Institución:** Corporación Unificada Nacional de Educación Superior – CUN
* **Programa Académico:** Ingeniería de Sistemas
* **Asignatura:** Ingeniería Web
* **Ficha:** 55564
* **Docente:** Sergio Alexander Mora Novoa
* **Fecha:** 8 de noviembre de 2026
* **Repositorio oficial:** [https://github.com/sergiomorar-CUN/equilibra-salud-bienestar-prototipo](https://github.com/sergiomorar-CUN/equilibra-salud-bienestar-prototipo)

### Equipo de Desarrollo

* **Christian Andrés Torres Ortega** (Ficha No. 55564)
* **Sergio Mora Rodríguez** (Ficha No. 55564)
* **Javier Sandoval** (Ficha No. 55566)

## Descripción General

**Equilibra** es una solución web enfocada en la promoción de hábitos de vida saludable mediante recomendaciones personalizadas basadas en evidencia técnica y epidemiológica (directrices de ICBF, OPS e INS). La plataforma permite explorar un catálogo estructurado en cuatro áreas clave del bienestar, realizar búsquedas multicriterio en tiempo real, calcular la afinidad algorítmica de cada consejo con el perfil de salud del usuario, gestionar favoritos sincronizados y registrar el progreso cuantitativo de hábitos diarios.

El prototipo se diseñó bajo el paradigma de **Diseño Centrado en el Usuario (DCU)** y se construyó siguiendo una arquitectura frontend desacoplada en estándares web nativos (**HTML5 semántico, CSS3 modular y JavaScript ES6+**), garantizando total independencia de librerías externas, gestores de paquetes o servidores dedicados.

## Instrucciones de Ejecución

El proyecto está diseñado para funcionar de manera inmediata y autónoma sin necesidad de compilar código, instalar paquetes ni configurar entornos de servidor.

### Ejecución Local Inmediata (Sin Dependencias)

1. Clone o descargue este repositorio en su equipo local.
2. Haga doble clic sobre el archivo `index.html` o ábralo en cualquier navegador web moderno (Google Chrome, Microsoft Edge, Mozilla Firefox o Apple Safari).
3. La aplicación se ejecutará de inmediato con el 100 % de sus funcionalidades operativas fuera de línea.

### Despliegue en GitHub Pages (Opcional)

Dado que la arquitectura se basa en estándares web nativos, rutas relativas y enrutamiento por hash (`#/`), el proyecto es 100 % compatible con **GitHub Pages** de forma directa, sin requerir pipelines de build ni configuraciones complejas de servidor:

1. En el repositorio de GitHub, diríjase a **Settings** > **Pages**.
2. En la sección **Build and deployment** > **Branch**, seleccione la rama `main` y la carpeta `/ (root)`.
3. Haga clic en **Save**. En unos instantes, la aplicación estará disponible públicamente en la URL asignada por GitHub:
   `https://sergiomorar-cun.github.io/equilibra-salud-bienestar-prototipo/`

## Credenciales y Modos de Demostración

La aplicación cuenta con datos preconfigurados para facilitar la evaluación integral de flujos autenticados y no autenticados:

### Usuario de Prueba Preconfigurado

* **Correo electrónico:** `daniela@correo.com`
* **Contraseña:** `Demo2026*`
* **Perfil:** Daniela Pérez (Objetivo: Manejo del estrés y descanso; Nivel de actividad: Moderado; Tiempo disponible: 15-30 min; Restricciones: Sin lácteos).

### Parámetros de Inspección en URL

Para acelerar la evaluación docente, el router reconoce parámetros especiales en la URL:

* `index.html?as=demo` : Inicia la navegación inmediatamente autenticado como Daniela Pérez.
* `index.html?as=guest` : Restablece la sesión e inicia como visitante limpio.
* `index.html?wf=1` : Activa el modo **Wireframe monocromático**, renderizando la interfaz en escala de grises y tipografía de sistema para auditar la estructura y jerarquía de la información.
* `index.html?as=demo&wf=1` : Combina la sesión activa de prueba con la vista estructural de wireframe.

## Estructura y Árbol del Proyecto

El código fuente se organizó de forma modular en archivos independientes con responsabilidades de diseño claramente delimitadas:

```
equilibra-salud-bienestar-prototipo/
├── index.html              # Shell semántico, landmarks (header, main, footer, nav) y enlaces skip
├── README.md               # Documentación técnica, manual de ejecución y trazabilidad
├── css/
│   └── estilos.css         # Tokens de diseño, tipografía, layout responsivo y accesibilidad WCAG
└── js/
    ├── datos.js            # Catálogo de 18 recomendaciones clínicas, 4 categorías y perfiles demo
    ├── iconos.js           # Catálogo de iconos SVG optimizados inline sin dependencias externas
    ├── ilustraciones.js   # Ilustraciones vectoriales temáticas para categorías y estados vacíos
    ├── nucleo.js           # Estado global (EQ.state), enrutador hash, persistencia y criptografía SHA-256
    ├── componentes.js      # Componentes UI reutilizables (tarjetas, badges, modales, alertas, toasts)
    ├── vistas-publicas.js  # Vistas públicas: Portada/Inicio, Catálogo Explorar con filtros
    ├── vistas-auth.js      # Vistas de autenticación: Inicio de sesión y Registro con validación
    ├── vistas-privadas.js  # Vistas privadas: Detalle de recomendación, Dashboard "Para ti", Favoritos
    ├── vistas-cuenta.js    # Vistas de usuario: Perfil de salud y Registro de seguimiento de hábitos
    ├── vistas-info.js      # Vistas institucionales: Acerca de, Términos y Condiciones, Ayuda
    ├── eventos.js          # Delegación centralizada de eventos DOM, formularios y accesibilidad de teclado
    └── app.js              # Punto de entrada principal y ciclo de arranque de la aplicación
```

## Trazabilidad de Requerimientos

### Requerimientos Funcionales (RF)

* **RF1: Gestión de Usuarios y Autenticación**
  * Registro de cuenta con validación en tiempo real (mínimo 8 caracteres, mayúscula, número y carácter especial).
  * Inicio de sesión con derivación criptográfica mediante Web Crypto API (SHA-256 con salt de aplicación).
  * Persistencia segura de sesión en `localStorage` y formulario de edición del perfil de salud (objetivos, disponibilidad, restricciones).
* **RF2: Catálogo Estructurado de Recomendaciones**
  * 18 recomendaciones sustentadas en guías clínicas organizadas en 4 categorías: Alimentación Consciente, Actividad Física, Bienestar Mental y Sueño y Descanso.
  * Metadatos completos por ficha: tiempo estimado, nivel de dificultad, evidencia científica, instrucciones paso a paso y contraindicaciones.
* **RF3: Búsqueda y Filtrado Multicriterio**
  * Campo de búsqueda reactiva por palabras clave sobre títulos, resúmenes y etiquetas.
  * Filtros combinables en simultáneo por categoría, tiempo disponible, nivel de esfuerzo y restricciones dietarias.
  * Contador dinámico que refleja el número de coincidencias y estados vacíos informativos con botón para restablecer filtros.
* **RF4: Personalización Algorítmica**
  * Algoritmo de ponderación multicriterio (Objetivo 40%, Nivel de actividad 25%, Tiempo 20%, Restricciones 15%) que calcula un índice de afinidad (0-100%).
  * Vista especializada "Para ti" con ordenamiento decreciente de pertinencia y distintivos visuales del porcentaje de afinidad.
* **RF5: Favoritos y Seguimiento de Hábitos**
  * Guardado instantáneo en la lista de favoritos persistida por usuario.
  * Registro de hábitos con selección de frecuencia (diaria, semanal) y contador acumulativo con retroalimentación visual accesible.

### Requerimientos No Funcionales (RNF)

* **RNF1: Usabilidad y Diseño Centrado en el Usuario**
  * Jerarquía visual estricta mediante escalas tipográficas proporcionales.
  * Cumplimiento de la Ley de Fitts: áreas táctiles e interactivas con dimensiones mínimas de 44 × 44 píxeles.
  * Microcopia en lenguaje positivo, claro y empático; retroalimentación inmediata en todas las acciones mediante toasts y regiones `aria-live`.
* **RNF2: Responsividad y Adaptabilidad Multi-dispositivo**
  * Enfoque *Mobile-First* con adaptación fluida a tabletas y pantallas de escritorio mediante CSS Grid y Flexbox.
  * Navegación optimizada para dispositivos móviles mediante barra inferior accesible (*Bottom Tab Bar*) ergonómicamente ubicada en la zona natural del pulgar.
* **RNF3: Rendimiento y Eficiencia de Carga**
  * Cero peticiones de red a librerías de terceros; código optimizado con un peso total inferior a 250 KB.
  * Tiempo de primer renderizado significativo (First Contentful Paint) menor a 0.5 segundos en navegadores estándar.
* **RNF4: Seguridad en el Cliente**
  * Hashing irreversible de contraseñas previo a la persistencia local.
  * Sanitización de entradas para prevenir inyecciones HTML y validaciones cruzadas antes de mutar el estado.
* **RNF5: Accesibilidad Web (WCAG 2.1 Nivel AA)**
  * Marcado semántico riguroso con landmarks HTML5 (`<header>`, `<main>`, `<footer>`, `<nav>`) y atributo `lang="es"`.
  * Enlace accesible de salto al contenido principal (`.skip`).
  * Ratios de contraste superiores a 4.5:1 en texto regular y 3:1 en componentes gráficos e interfaz.
  * Foco de navegación visible mediante `:focus-visible` con anillo de contraste de 3 px y soporte integral de uso por teclado (Tab, Enter, Escape).

## Tecnologías Utilizadas

* **HTML5:** Semántica estructural, formularios nativos, landmarks ARIA y microdatos.
* **CSS3:** Variables nativas (Custom Properties), CSS Grid, Flexbox, media queries responsivas y diseño accesible.
* **JavaScript ES6+:** Módulos lógicos desacoplados, enrutamiento basado en Hash, Web Storage API y Web Crypto API.
* **SVG:** Iconografía e ilustraciones vectoriales escalables integradas en el código fuente.

## Licencia y Uso Académico

Este proyecto fue desarrollado exclusivamente con fines evaluativos y pedagógicos para la Corporación Unificada Nacional de Educación Superior (CUN). Se autoriza su reproducción y consulta académica citando la fuente y los autores correspondientes.
